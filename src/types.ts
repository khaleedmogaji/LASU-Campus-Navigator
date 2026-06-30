export interface POI {
  id: string;
  name: string;
  description: string;
  category: 'Building' | 'Lecture Theatre' | 'Administrative' | 'Hostel' | 'Library' | 'Sports' | 'Other';
  latitude: number;
  longitude: number;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  tags?: string[];
  nearbyLandmarks?: string[];
  searchAliases?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  poiId?: string;
  time?: string;
  category?: 'Academic' | 'Social' | 'Sports' | 'Administrative' | 'Other';
  imageUrl?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'user';
  homeFaculty?: string;
  savedRoutes?: any[];
}
