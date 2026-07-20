import React from "react";
import { motion } from "motion/react";
import { GraduationCap, X } from "lucide-react";
import { POI } from "../../types";
import { LASU_KNOWLEDGE_BASE } from "../../lib/lasuKnowledgeBase";
import { findPOIForFaculty } from "../../lib/findPoiForFaculty";

interface FacultiesModalProps {
  pois: POI[];
  onSelectPoi: (poi: POI) => void;
  onStart: () => void;
  onClose: () => void;
}

export const FacultiesModal: React.FC<FacultiesModalProps> = ({
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[80vh] border border-zinc-250"
      >
        <div className="p-5 border-b border-zinc-250 flex items-center justify-between shrink-0 bg-zinc-50">
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-lasu-gold" />
            Select Faculty / School
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-2.5 custom-scrollbar flex-1 bg-white">
          {LASU_KNOWLEDGE_BASE.map((f, fIdx) => (
            <button
              key={fIdx}
              onClick={() => {
                const facultyPoi = findPOIForFaculty(pois, f);
                if (facultyPoi) {
                  onSelectPoi(facultyPoi);
                } else {
                  onStart();
                }
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50 hover:border-lasu-green/20 hover:text-lasu-green transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div className="min-w-0 pr-3">
                <p className="text-xs font-black text-zinc-800 group-hover:text-lasu-green truncate">
                  {f.faculty}
                </p>
                <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">
                  {f.departments.length} Departments
                </p>
              </div>
              <span className="text-[10px] font-black uppercase text-lasu-green border border-lasu-green/20 px-2 py-0.5 rounded-lg shrink-0">
                {f.abbreviation}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
