import {
  Library,
  GraduationCap,
  Landmark,
  Trophy,
  Building2,
  BedDouble,
  MapPin,
} from "lucide-react";

export const CATEGORIES = [
  "Library",
  "Lecture Theatre",
  "Administrative",
  "Sports",
  "Building",
  "Hostel",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_ICONS: Record<
  Category,
  React.ComponentType<{ className?: string }>
> = {
  Library,
  "Lecture Theatre": GraduationCap,
  Administrative: Landmark,
  Sports: Trophy,
  Building: Building2,
  Hostel: BedDouble,
  Other: MapPin,
};
