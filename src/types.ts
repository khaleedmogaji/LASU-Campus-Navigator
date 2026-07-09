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
