import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { POI } from "../types";
import { WelcomeHeader } from "./welcome/Header";
import { HeroSection } from "./welcome/HeroSection";
import { QuickActionsGrid } from "./welcome/QuickActionsGrid";
import { FeatureHighlights } from "./welcome/FeatureHighlights";
import { StatsBar } from "./welcome/StatsBar";
import { SiteFooter } from "./welcome/SiteFooter";
import { DepartmentsModal } from "./welcome/DepartmentsModal";
import { FacultiesModal } from "./welcome/FacultiesModal";
import { CategoriesModal } from "./welcome/CategoriesModal";

interface WelcomeScreenProps {
  pois: POI[];
  onStart: () => void;
  onExplore: (category?: string) => void;
  onAskAssistant: () => void;
  onSelectPoi: (poi: POI) => void;
  onOpenRoutePlanner: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  pois,
  onStart,
  onExplore,
  onAskAssistant,
  onSelectPoi,
  onOpenRoutePlanner,
}) => {
  const [activeModal, setActiveModal] = useState<
    "departments" | "faculties" | "categories" | null
  >(null);

  const categories = [
    {
      name: "Library",
      count: pois.filter((p) => p.category === "Library").length,
      icon: "📚",
    },
    {
      name: "Lecture Theatre",
      count: pois.filter((p) => p.category === "Lecture Theatre").length,
      icon: "🎓",
    },
    {
      name: "Administrative",
      count: pois.filter((p) => p.category === "Administrative").length,
      icon: "🏛️",
    },
    {
      name: "Sports",
      count: pois.filter((p) => p.category === "Sports").length,
      icon: "⚽",
    },
    {
      name: "Building",
      count: pois.filter((p) => p.category === "Building").length,
      icon: "🏫",
    },
    {
      name: "Hostel",
      count: pois.filter((p) => p.category === "Hostel").length,
      icon: "🏢",
    },
    {
      name: "Other",
      count: pois.filter((p) => p.category === "Other").length,
      icon: "📍",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-[rgb(49,30,2)] transition-colors duration-300 relative overflow-x-hidden flex flex-col justify-between">
      <WelcomeHeader />

      <main className="relative z-20 flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col justify-center gap-8 md:gap-12">
        <HeroSection
          pois={pois}
          onStart={onStart}
          onExplore={onExplore}
          onAskAssistant={onAskAssistant}
          onSelectPoi={onSelectPoi}
        />

        <QuickActionsGrid
          onOpenDepartments={() => setActiveModal("departments")}
          onOpenFaculties={() => setActiveModal("faculties")}
          onOpenCategories={() => setActiveModal("categories")}
          onOpenRoutePlanner={onOpenRoutePlanner}
        />

        <FeatureHighlights />

        <StatsBar landmarkCount={pois.length} />
      </main>

      <SiteFooter />

      <AnimatePresence>
        {activeModal === "departments" && (
          <DepartmentsModal
            pois={pois}
            onSelectPoi={onSelectPoi}
            onStart={onStart}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "faculties" && (
          <FacultiesModal
            pois={pois}
            onSelectPoi={onSelectPoi}
            onStart={onStart}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "categories" && (
          <CategoriesModal
            categories={categories}
            onExplore={onExplore}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
