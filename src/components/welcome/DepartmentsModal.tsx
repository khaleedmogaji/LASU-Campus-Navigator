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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white">
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-lasu-green/10 text-lasu-green flex items-center justify-center shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </span>
            Select Department
            <span className="text-[10px] text-zinc-400 normal-case font-bold tracking-normal ml-0.5">
              (90 available)
            </span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4 bg-zinc-50/50">
          {LASU_KNOWLEDGE_BASE.map((f, fIdx) => (
            <div
              key={fIdx}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-2.5 px-4 py-3 bg-lasu-green/5">
                <span className="text-[10px] font-black uppercase text-lasu-green bg-lasu-green/10 px-2 py-1 rounded-lg shrink-0">
                  {f.abbreviation}
                </span>
                <h4 className="text-xs font-black text-zinc-800 uppercase tracking-wide truncate">
                  {f.faculty}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-3">
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
                    className="text-left px-3 py-2 rounded-xl bg-zinc-50 hover:bg-lasu-green/10 text-xs font-semibold text-zinc-700 hover:text-lasu-green truncate transition-all cursor-pointer"
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
