import { useState, useEffect, useRef } from 'react';
import { KalmanFilter } from '../lib/kalmanFilter';
import { CAMPUS_POLYGON, isPointInPolygon } from '../utils/geo';
import { getDistance } from '../lib/pathNetwork';

interface UseLocationProps {
  userLocation: [number, number] | null;
  setUserLocation: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  userHeading: number | null;
  setUserHeading: React.Dispatch<React.SetStateAction<number | null>>;
  locationAccuracy: number | null;
  setLocationAccuracy: React.Dispatch<React.SetStateAction<number | null>>;
  isSimulated: boolean;
  setIsSimulated: React.Dispatch<React.SetStateAction<boolean>>;
  followMe: boolean;
  setFocusedCoordinate: (coord: [number, number] | null) => void;
  setSelectedPoi: (poi: any | null) => void;
}

export function useLocation({
  userLocation,
  setUserLocation,
  userHeading,
  setUserHeading,
  locationAccuracy,
  setLocationAccuracy,
  isSimulated,
  setIsSimulated,
  followMe,
  setFocusedCoordinate,
  setSelectedPoi
}: UseLocationProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isUserOffCampus, setIsUserOffCampus] = useState(false);

  const latFilter = useRef<KalmanFilter | null>(null);
  const lonFilter = useRef<KalmanFilter | null>(null);
  const userLocationRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    if (isSimulated) return;

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("Geolocation update:", position.coords.latitude, position.coords.longitude);
          
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          const isInside = isPointInPolygon([lat, lon], CAMPUS_POLYGON);
          setIsUserOffCampus(!isInside);

          if (userLocationRef.current) {
            const rawDist = getDistance(lat, lon, userLocationRef.current[0], userLocationRef.current[1]);
            if (rawDist > 20) {
              latFilter.current = null;
              lonFilter.current = null;
            }
          }

          const accuracyInDegrees = position.coords.accuracy / 111000;
          const R = Math.max(0.00001, Math.min(0.0005, accuracyInDegrees));
          const Q = 0.00002; 
          
          if (!latFilter.current) {
            latFilter.current = new KalmanFilter(Q, R, lat);
            lonFilter.current = new KalmanFilter(Q, R, lon);
          } else {
            latFilter.current.setNoise(Q, R);
            lonFilter.current.setNoise(Q, R);
          }
          
          const filteredLat = latFilter.current.filter(lat);
          const filteredLon = lonFilter.current.filter(lon);
          const loc: [number, number] = [filteredLat, filteredLon];
          
          setUserLocation(loc);
          setLocationAccuracy(position.coords.accuracy);
          setUserHeading(position.coords.heading);
          
          if (followMe) {
            setFocusedCoordinate(loc);
            setSelectedPoi({ 
              id: 'my-location', 
              name: 'My Location', 
              latitude: loc[0], 
              longitude: loc[1], 
              category: 'Other', 
              description: 'Automatically following your position.' 
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (!userLocationRef.current) {
            setIsSimulated(true);
            const gateLoc: [number, number] = [6.4642, 3.1972];
            setUserLocation(gateLoc);
            setLocationAccuracy(null);
            setSelectedPoi({ 
              id: 'simulated-location', 
              name: 'Simulated Location (Gate)', 
              latitude: gateLoc[0], 
              longitude: gateLoc[1], 
              category: 'Other', 
              description: 'Simulated position for testing navigation.' 
            });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isSimulated, followMe, setFocusedCoordinate, setSelectedPoi, setUserLocation, setLocationAccuracy, setUserHeading, setIsSimulated]);

  return {
    isLocating,
    setIsLocating,
    isUserOffCampus,
    setIsUserOffCampus,
  };
}
