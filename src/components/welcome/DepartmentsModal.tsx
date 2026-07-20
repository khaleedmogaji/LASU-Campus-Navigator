import React from "react";
import { motion } from "motion/react";
import { BookOpen, X } from "lucide-react";
import { POI } from "../../types";
import { LASU_KNOWLEDGE_BASE } from "../../lib/lasuKnowledgeBase";
import { findPOIForFaculty } from "../../lib/findPoiForFaculty";

interface DepartmentsModalProps {
  pois: POI[];
  onSelectPoi: (poi: POI) => void;
  onStart: () => void;
  onClose: () => void;
}

export const DepartmentsModal: React.FC<DepartmentsModalProps> = ({
  pois,
  onSelectPoi,
  onStart,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/45">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-zinc-250"
      >
        <div className="p-5 border-b border-zinc-250 flex items-center justify-between shrink-0 bg-zinc-50">
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-lasu-green" />
            Select Department (90 Available)
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1 bg-white">
          {LASU_KNOWLEDGE_BASE.map((f, fIdx) => (
            <div key={fIdx} className="space-y-2.5">
              <h4 className="text-xs font-black text-lasu-green uppercase tracking-wider border-b border-zinc-200 pb-1.5">
                {f.faculty} ({f.abbreviation})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {f.departments.map((d, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => {
                      const facultyPoi = findPOIForFaculty(pois, f);
                      if (facultyPoi) {
                        onSelectPoi(facultyPoi);
                      } else {
                        onStart();
                      }
                      onClose();
                    }}
                    className="text-left px-3 py-2 rounded-xl border border-zinc-250 hover:bg-zinc-50 hover:border-lasu-green/20 hover:text-lasu-green transition-all text-xs font-semibold text-zinc-800 truncate cursor-pointer"
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
