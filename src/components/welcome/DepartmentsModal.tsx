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
        className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-5 border-b border-border-subtle flex items-center justify-between shrink-0 bg-card">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </span>
            Select Department
            <span className="text-[10px] text-muted-foreground normal-case font-semibold tracking-normal ml-0.5">
              (90 available)
            </span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4 bg-muted/50">
          {LASU_KNOWLEDGE_BASE.map((f, fIdx) => (
            <div
              key={fIdx}
              className="bg-card rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-2.5 px-4 py-3 bg-success/5">
                <span className="text-[10px] font-bold uppercase text-success bg-success/10 px-2 py-1 rounded-lg shrink-0">
                  {f.abbreviation}
                </span>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide truncate">
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
                    className="text-left px-3 py-2 rounded-xl bg-background hover:bg-success/10 text-xs font-medium text-foreground-muted hover:text-success truncate transition-all cursor-pointer"
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
