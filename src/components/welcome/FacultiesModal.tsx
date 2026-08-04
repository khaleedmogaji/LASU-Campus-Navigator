import React from "react";
import { motion } from "motion/react";
import { GraduationCap, ChevronRight, X } from "lucide-react";
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white">
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-lasu-gold/10 text-lasu-gold flex items-center justify-center shrink-0">
              <GraduationCap className="w-4.5 h-4.5" />
            </span>
            Select Faculty / School
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 divide-y divide-zinc-100">
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
              className="w-full text-left px-5 py-3.5 border-l-4 border-transparent hover:border-lasu-gold hover:bg-lasu-gold/5 transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div className="min-w-0 pr-3">
                <p className="text-xs font-black text-zinc-800 group-hover:text-lasu-gold truncate transition-colors">
                  {f.faculty}
                </p>
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                  {f.departments.length} Departments
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-black uppercase text-lasu-gold bg-lasu-gold/10 px-2 py-1 rounded-lg">
                  {f.abbreviation}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-lasu-gold group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
