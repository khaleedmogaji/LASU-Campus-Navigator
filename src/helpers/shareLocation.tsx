import { POI } from "../types";

export type UserLocation = [number, number] | null;

interface CurrentLocationProps {
  userLocation: UserLocation;
}

interface SharePoiProps {
  poi: POI;
}

export const shareLocation = async ({ poi }: SharePoiProps) => {
  const shareUrl = `${window.location.origin}${window.location.pathname}?poiId=${poi.id}`;
  const shareData = {
    title: poi.name,
    text: `Check out this location at LASU: ${poi.name}`,
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${poi.name}: ${shareUrl}`);
      alert("Link copied to clipboard!");
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};

export const shareCurrentLocation = async ({
  userLocation,
}: CurrentLocationProps) => {
  if (!userLocation) {
    alert("Please enable your location to share it.");
    return;
  }

  const shareData = {
    title: "My Location at LASU",
    text: `Check out my current location at LASU: ${userLocation[0]}, ${userLocation[1]}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(
        `My Location at LASU: ${userLocation[0]}, ${userLocation[1]} - ${window.location.href}`,
      );
      alert("Location link copied to clipboard!");
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};
