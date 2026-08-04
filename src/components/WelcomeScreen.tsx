import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import {
  Library,
  GraduationCap,
  Landmark,
  Trophy,
  Building2,
  BedDouble,
  MapPin,
} from "lucide-react";
import { POI } from "../types";
import { useAppStore } from "@/store/useAppStore";
import { WelcomeHeader } from "./welcome/Header";
import { HeroSection } from "./welcome/HeroSection";
import { QuickActionsGrid } from "./welcome/QuickActionsGrid";
import { FeatureHighlights } from "./welcome/FeatureHighlights";
import { StatsBar } from "./welcome/StatsBar";
import { SiteFooter } from "./welcome/SiteFooter";
import { DepartmentsModal } from "./welcome/DepartmentsModal";
import { FacultiesModal } from "./welcome/FacultiesModal";
import { CategoriesModal } from "./welcome/CategoriesModal";

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const pois = useAppStore((s) => s.pois);
  const setSelectedPoi = useAppStore((s) => s.setSelectedPoi);
  const setFilterCategory = useAppStore((s) => s.setFilterCategory);
  const setIsAssistantOpen = useAppStore((s) => s.setIsAssistantOpen);
  const setIsRoutePlannerOpen = useAppStore((s) => s.setIsRoutePlannerOpen);

  const [activeModal, setActiveModal] = useState<
    "departments" | "faculties" | "categories" | null
  >(null);

  const handleStart = () => navigate("/map");

  const handleExplore = (category?: string) => {
    setFilterCategory(category ?? "All");
    navigate("/map");
  };

  const handleAskAssistant = () => {
    setIsAssistantOpen(true);
    navigate("/map");
  };

  const handleSelectPoi = (poi: POI) => {
    setSelectedPoi(poi);
    navigate("/map");
  };

  const handleOpenRoutePlanner = () => {
    setIsRoutePlannerOpen(true);
    navigate("/map");
  };

  const iconClass = "w-5 h-5";

  const categories = [
    {
      name: "Library",
      count: pois.filter((p) => p.category === "Library").length,
      icon: <Library className={iconClass} />,
    },
    {
      name: "Lecture Theatre",
      count: pois.filter((p) => p.category === "Lecture Theatre").length,
      icon: <GraduationCap className={iconClass} />,
    },
    {
      name: "Administrative",
      count: pois.filter((p) => p.category === "Administrative").length,
      icon: <Landmark className={iconClass} />,
    },
    {
      name: "Sports",
      count: pois.filter((p) => p.category === "Sports").length,
      icon: <Trophy className={iconClass} />,
    },
    {
      name: "Building",
      count: pois.filter((p) => p.category === "Building").length,
      icon: <Building2 className={iconClass} />,
    },
    {
      name: "Hostel",
      count: pois.filter((p) => p.category === "Hostel").length,
      icon: <BedDouble className={iconClass} />,
    },
    {
      name: "Other",
      count: pois.filter((p) => p.category === "Other").length,
      icon: <MapPin className={iconClass} />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-[rgb(49,30,2)] transition-colors duration-300 relative overflow-x-hidden flex flex-col justify-between">
      <WelcomeHeader onAskAssistant={handleAskAssistant} />

      <main className="relative z-20 flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col justify-center gap-8 md:gap-12">
        <HeroSection
          pois={pois}
          onStart={handleStart}
          onExplore={handleExplore}
          onAskAssistant={handleAskAssistant}
          onSelectPoi={handleSelectPoi}
        />

        <QuickActionsGrid
          onOpenDepartments={() => setActiveModal("departments")}
          onOpenFaculties={() => setActiveModal("faculties")}
          onOpenCategories={() => setActiveModal("categories")}
          onOpenRoutePlanner={handleOpenRoutePlanner}
        />

        <FeatureHighlights />

        <StatsBar landmarkCount={pois.length} />
      </main>

      <SiteFooter />

      <AnimatePresence>
        {activeModal === "departments" && (
          <DepartmentsModal
            pois={pois}
            onSelectPoi={handleSelectPoi}
            onStart={handleStart}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "faculties" && (
          <FacultiesModal
            pois={pois}
            onSelectPoi={handleSelectPoi}
            onStart={handleStart}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "categories" && (
          <CategoriesModal
            categories={categories}
            onExplore={handleExplore}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
