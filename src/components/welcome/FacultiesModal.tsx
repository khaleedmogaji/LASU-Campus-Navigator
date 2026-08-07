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
        className="bg-card rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-5 border-b border-border-subtle flex items-center justify-between shrink-0 bg-card">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <GraduationCap className="w-4.5 h-4.5" />
            </span>
            Select Faculty / School
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 divide-y divide-border-subtle">
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
              className="w-full text-left px-5 py-3.5 border-l-4 border-transparent hover:border-secondary hover:bg-secondary/5 transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div className="min-w-0 pr-3">
                <p className="text-xs font-bold text-foreground group-hover:text-secondary truncate transition-colors">
                  {f.faculty}
                </p>
                <p className="text-[11px] text-foreground-muted font-semibold uppercase tracking-wider mt-0.5">
                  {f.departments.length} Departments
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold uppercase text-secondary bg-secondary/10 px-2 py-1 rounded-lg">
                  {f.abbreviation}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
