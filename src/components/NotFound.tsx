import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        <div className="relative w-full h-40 mb-2">
          <svg
            viewBox="0 0 320 160"
            fill="none"
            className="w-full h-full"
            aria-hidden="true"
          >
            <motion.path
              d="M 12 30 C 70 30, 60 90, 120 95 S 190 60, 230 100 S 270 140, 300 130"
              stroke="var(--border)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1 14"
              initial={prefersReducedMotion ? undefined : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </svg>

          <motion.div
            className="absolute"
            style={{
              left: "300px",
              top: "108px",
              transform: "translateX(-50%)",
            }}
            initial={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: -10, rotate: -8 }
            }
            animate={{ opacity: 1, y: 0, rotate: -8 }}
            transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
              transition={{
                delay: 1.7,
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="absolute -inset-3 rounded-full bg-primary/10" />
              <MapPin
                className="relative w-9 h-9 text-primary drop-shadow-sm"
                strokeWidth={2.5}
                fill="var(--card)"
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3"
        >
          Error 404
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="font-heading text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-3"
        >
          Off the marked path
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-sm text-foreground-muted leading-relaxed mb-8 max-w-xs"
        >
          There's no route on campus that matches this address. It may have
          moved, or the link isn't quite right.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-bold px-6 py-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to LASU Navigator
          </button>
          <button
            onClick={() => navigate("/map")}
            className="inline-flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted text-foreground text-sm font-bold px-6 py-3 transition-colors"
          >
            Open the map
          </button>
        </motion.div>
      </div>
    </div>
  );
}
