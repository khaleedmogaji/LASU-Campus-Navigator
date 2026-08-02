import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Loader2, Building2, Tag, AlignLeft, MapPin } from "lucide-react";
import L from "leaflet";

const CAMPUS_CENTER: [number, number] = [6.4687, 3.2];

export const CATEGORY_OPTIONS = [
  "Library",
  "Lecture Theatre",
  "Administrative",
  "Sports",
  "Building",
  "Hostel",
  "Other",
] as const;

export const CATEGORY_COLORS: Record<
  (typeof CATEGORY_OPTIONS)[number],
  string
> = {
  Library: "#3b82f6",
  "Lecture Theatre": "#f59e0b",
  Administrative: "#a855f7",
  Sports: "#10b981",
  Building: "var(--color-secondary)",
  Hostel: "#f43f5e",
  Other: "#a1a1aa",
};

export interface BuildingFormValues {
  name: string;
  category: (typeof CATEGORY_OPTIONS)[number];
  description: string;
  latitude: number;
  longitude: number;
}

interface BuildingFormProps {
  initialValues?: Partial<BuildingFormValues>;
  onSubmit: (values: BuildingFormValues) => Promise<void>;
  submitLabel?: string;
}

function makePinIcon(color: string) {
  return L.divIcon({
    html: `<svg width="34" height="34" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3))">
      <path d="M12 22s8-7.58 8-13a8 8 0 1 0-16 0c0 5.42 8 13 8 13z"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

function LocationPicker({
  position,
  icon,
  onPick,
}: {
  position: [number, number];
  icon: L.DivIcon;
  onPick: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} icon={icon} />;
}

export function BuildingForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Building",
}: BuildingFormProps) {
  const navigate = useNavigate();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [category, setCategory] = useState<BuildingFormValues["category"]>(
    initialValues?.category ?? "Building",
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [position, setPosition] = useState<[number, number]>([
    initialValues?.latitude ?? CAMPUS_CENTER[0],
    initialValues?.longitude ?? CAMPUS_CENTER[1],
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pinIcon = useMemo(
    () => makePinIcon(CATEGORY_COLORS[category]),
    [category],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Building name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        description: description.trim(),
        latitude: position[0],
        longitude: position[1],
      });
    } catch (err) {
      console.error("Failed to save building:", err);
      setError("Something went wrong saving this building. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-3">
      {error && (
        <div className="mb-5 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* ── Left: Details card ── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-primary" />
            </span>
            <div>
              <h3 className="text-sm font-black text-foreground">Details</h3>
              <p className="text-xs text-foreground-muted">
                Name, category, and description
              </p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-xs font-bold text-foreground uppercase tracking-wide"
              >
                Building name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Faculty of Science"
                  className="w-full rounded-xl border border-border bg-input pl-9 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input-focus"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="category"
                className="text-xs font-bold text-foreground uppercase tracking-wide"
              >
                Category
              </label>
              <div className="relative">
                <span
                  className="w-2.5 h-2.5 rounded-full absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ backgroundColor: CATEGORY_COLORS[category] }}
                />
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as BuildingFormValues["category"],
                    )
                  }
                  className="w-full rounded-xl border border-border bg-input pl-9 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input-focus appearance-none"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Tag className="w-3.5 h-3.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="text-xs font-bold text-foreground uppercase tracking-wide"
                >
                  Description
                </label>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {description.length}/200
                </span>
              </div>
              <div className="relative">
                <AlignLeft className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <textarea
                  id="description"
                  rows={5}
                  maxLength={200}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description shown when a student taps this building"
                  className="w-full rounded-xl border border-border bg-input pl-9 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input-focus resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Location card (sticky on desktop) ── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden lg:sticky lg:top-6">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${CATEGORY_COLORS[category]}20` }}
              >
                <MapPin
                  className="w-4 h-4"
                  style={{ color: CATEGORY_COLORS[category] }}
                />
              </span>
              <div>
                <h3 className="text-sm font-black text-foreground">Location</h3>
                <p className="text-xs text-foreground-muted">
                  Click the map to place the pin
                </p>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end text-[10px] font-mono text-muted-foreground leading-tight">
              <span>{position[0].toFixed(6)}</span>
              <span>{position[1].toFixed(6)}</span>
            </div>
          </div>

          <div className="h-80">
            <MapContainer
              center={position}
              zoom={17}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              />
              <LocationPicker
                position={position}
                icon={pinIcon}
                onPick={setPosition}
              />
            </MapContainer>
          </div>

          <div className="sm:hidden flex gap-4 px-5 py-3 text-xs text-foreground-muted font-mono border-t border-border">
            <span>Lat: {position[0].toFixed(6)}</span>
            <span>Lng: {position[1].toFixed(6)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-border">
        <button
          type="button"
          onClick={() => navigate("/admin/buildings")}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground-muted hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
