import React from "react";
import { motion } from "motion/react";
import { MapPin, X } from "lucide-react";

interface Category {
  name: string;
  count: number;
  icon: string;
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border border-zinc-250"
      >
        <div className="p-5 border-b border-zinc-250 flex items-center justify-between shrink-0 bg-zinc-50">
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500" />
            Explore Landmarks
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-5 space-y-2 bg-white">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                onExplore(cat.name);
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50 hover:border-lasu-green/20 hover:text-lasu-green transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs font-black text-zinc-800">
                  {cat.name}
                </span>
              </div>
              <span className="text-[11px] text-zinc-650 font-bold">
                {cat.count} landmarks
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
