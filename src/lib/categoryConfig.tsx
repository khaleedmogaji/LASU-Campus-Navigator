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
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Library,
  "Lecture Theatre": GraduationCap,
  Administrative: Landmark,
  Sports: Trophy,
  Building: Building2,
  Hostel: BedDouble,
  Other: MapPin,
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Library: "#3b82f6",
  "Lecture Theatre": "#f59e0b",
  Administrative: "#a855f7",
  Sports: "#10b981",
  Building: "var(--color-secondary)",
  Hostel: "#f43f5e",
  Other: "#a1a1aa",
};

export function resolveCategoryColor(color: string): string {
  return color.startsWith("var(") ? "#78716c" : color;
}

export function categoryTint(color: string): string {
  return color.startsWith("var(") ? "rgba(0,0,0,0.06)" : `${color}1A`;
}
