import React from "react";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  title: string;
  description: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  title,
  description,
  isDeleting = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/45">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl ring-1 ring-black/5 w-full max-w-sm p-6 flex flex-col gap-4"
      >
        <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-zinc-900">{title}</h3>
          <p className="text-xs text-zinc-500 font-semibold mt-1 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
