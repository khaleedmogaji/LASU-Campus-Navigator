import React from "react";
import { motion } from "motion/react";
import { MapPin, X } from "lucide-react";

interface Category {
  name: string;
  count: number;
  icon: React.ReactNode;
}

interface CategoriesModalProps {
  categories: Category[];
  onExplore: (category?: string) => void;
  onClose: () => void;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  categories,
  onExplore,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/45">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border border-border"
      >
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0 bg-muted">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500" />
            Explore Landmarks
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-5 space-y-2 bg-card">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                onExplore(cat.name);
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl border border-border hover:bg-muted hover:border-success/20 hover:text-success transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground group-hover:text-success transition-colors">
                  {cat.icon}
                </span>
                <span className="text-xs font-bold text-foreground">
                  {cat.name}
                </span>
              </div>
              <span className="text-[11px] text-foreground-muted font-semibold">
                {cat.count} landmarks
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
