import React, { useState } from 'react';
import { MapPin, Navigation, X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { POI } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const FACULTY_DEPARTMENTS: Record<string, string[]> = {
  'Faculty of Science': [
    'Biochemistry',
    'Botany',
    'Chemistry',
    'Computer Science',
    'Fisheries',
    'Mathematics',
    'Microbiology',
    'Physics',
    'Science Laboratory Technology',
    'Zoology and Environmental Biology'
  ],
  'Faculty of Arts': [
    'African Languages, Literatures and Communication Arts',
    'English',
    'Foreign Languages',
    'History and International Studies',
    'Linguistics',
    'Music',
    'Philosophy',
    'Religions and Peace Studies',
    'Theatre Arts'
  ],
  'Faculty of Social Sciences': [
    'Economics',
    'Geography and Planning',
    'Political Science',
    'Psychology',
    'Sociology'
  ],
  'Faculty of Education': [
    'Educational Management',
    'Educational Foundations and Counseling Psychology',
    'Human Kinetics, Sports and Health Education',
    'Language, Arts and Social Science Education',
    'Science and Technology Education'
  ],
  'Faculty of Management Sciences': [
    'Accounting',
    'Banking and Finance',
    'Business Administration',
    'Industrial Relations and Personnel Management',
    'Insurance',
    'Local Government Administration',
    'Management Technology',
    'Marketing',
    'Public Administration'
  ],
  'Faculty of Law': [
    'Business Law',
    'International and Islamic Law',
    'Public and Private Law'
  ],
  'School of Transport and Logistics': [
    'Transport Management',
    'Logistics and Supply Chain Management'
  ],
  'School of Communication and Media Studies': [
    'Broadcasting',
    'Journalism',
    'Public Relations and Advertising'
  ],
  'Engineering Laboratory Complex (Ojo)': [
    'Aeronautical and Astronautical Engineering',
    'Chemical and Polymer Engineering',
    'Civil Engineering',
    'Electronic and Computer Engineering',
    'Mechanical Engineering'
  ]
};

interface POIInfoProps {
  poi: POI | null;
  userLocation: [number, number] | null;
  onClose: () => void;
  onGetDirections: (poi: POI) => void;
  onRouteFromHere?: (poi: POI) => void;
  isRouteHighlighted: boolean;
  onHighlightRoute: () => void;
  isSidebar?: boolean;
  onShare: (poi: POI) => void;
}

const VideoPlayer: React.FC<{ url: string; alt: string }> = ({ url, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/45">
          <div className="w-5 h-5 border-2 border-lasu-primary/20 border-t-lasu-primary rounded-full animate-spin"></div>
        </div>
      )}
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadStart={() => setIsLoading(true)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
        title={alt}
      />
    </div>
  );
};

export const POIInfo: React.FC<POIInfoProps> = ({ poi, onClose, onGetDirections, onRouteFromHere, isSidebar = false, onShare }) => {
  if (!poi) return null;

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const mediaItems: { type: 'image' | 'video'; url: string }[] = [];
  
  if (poi.videoUrls && poi.videoUrls.length > 0) {
    poi.videoUrls.forEach(v => mediaItems.push({ type: 'video', url: v }));
  } else if (poi.videoUrl) {
    mediaItems.push({ type: 'video', url: poi.videoUrl });
  }

  const images = poi.imageUrls && poi.imageUrls.length > 0 ? poi.imageUrls : (poi.imageUrl ? [poi.imageUrl] : []);
  images.forEach(img => mediaItems.push({ type: 'image', url: img }));

  const departments = FACULTY_DEPARTMENTS[poi.name];

  const nextMedia = () => {
    setDirection(1);
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };
  const prevMedia = () => {
    setDirection(-1);
    setCurrentMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const content = (
    <div className="flex flex-col h-full bg-white text-zinc-800">
      {/* Slider Container */}
      <div className="mb-6 -mx-6 -mt-6 overflow-hidden h-40 lg:h-52 relative bg-zinc-950 shrink-0 rounded-b-3xl shadow-md">
        {mediaItems.length > 0 ? (
          <div className="relative w-full h-full">
            <AnimatePresence initial={false} custom={direction}>
              {mediaItems[currentMediaIndex].type === 'video' ? (
                <motion.div
                  key={currentMediaIndex}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? '100%' : '-100%',
                      opacity: 0
                    }),
                    center: {
                      x: 0,
                      opacity: 1
                    },
                    exit: (dir: number) => ({
                      x: dir < 0 ? '100%' : '-100%',
                      opacity: 0
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <VideoPlayer url={mediaItems[currentMediaIndex].url} alt={poi.name} />
                </motion.div>
              ) : (
                <motion.img 
                  key={currentMediaIndex}
                  src={mediaItems[currentMediaIndex].url} 
                  alt={poi.name} 
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? '100%' : '-100%',
                      opacity: 0
                    }),
                    center: {
                      x: 0,
                      opacity: 1
                    },
                    exit: (dir: number) => ({
                      x: dir < 0 ? '100%' : '-100%',
                      opacity: 0
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </AnimatePresence>
            
            {mediaItems.length > 1 && (
              <>
                <button 
                  onClick={prevMedia} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white hover:bg-zinc-100 text-zinc-800 rounded-xl z-10 transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 border border-zinc-200 shadow-md"
                  aria-label="Previous Media"
                >
                  <ChevronLeft className="w-4 h-4 text-zinc-700" />
                </button>
                <button 
                  onClick={nextMedia} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white hover:bg-zinc-100 text-zinc-800 rounded-xl z-10 transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 border border-zinc-200 shadow-md"
                  aria-label="Next Media"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-700" />
                </button>
                
                {/* Media Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-zinc-950/50 px-2.5 py-1 rounded-full border border-white/10">
                  {mediaItems.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentMediaIndex ? 'bg-lasu-secondary w-3' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-650">
            <MapPin className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Details Area with Staggered Animations */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="px-6 pb-6 flex-1 min-h-0 overflow-y-auto scrollbar-hide"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} className="flex items-start justify-between mb-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-lasu-primary/5 border border-lasu-primary/10 text-lasu-primary text-[9px] font-black uppercase tracking-widest rounded-lg mb-2">
              {poi.category}
            </span>
            <h2 className="text-xl font-black text-zinc-950 leading-tight tracking-tight">{poi.name}</h2>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onShare(poi)}
              className="p-2 rounded-full transition-colors hover:bg-zinc-100 text-zinc-700 cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 transition-colors cursor-pointer"
              title="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {poi.description && (
          <motion.p variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} className="text-zinc-900 text-xs mb-4 leading-relaxed font-semibold">
            {poi.description}
          </motion.p>
        )}

        <motion.div 
          variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} 
          className="flex items-center gap-1.5 text-[10px] font-black text-zinc-700 uppercase tracking-wider mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
          <span>Coordinates: {poi.latitude.toFixed(6)}, {poi.longitude.toFixed(6)}</span>
        </motion.div>

        {/* Faculty Departments List */}
        {departments && departments.length > 0 && (
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }} className="mb-5 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-zinc-200/30 pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-lasu-primary">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                <path d="M6 6h10M6 10h10M6 14h10"/>
              </svg>
              <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider">
                Departments ({departments.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
              {departments.map((dept, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 text-xs text-zinc-850 font-bold bg-white px-3.5 py-3 rounded-xl border border-zinc-200 shadow-sm hover:scale-[1.01] hover:border-lasu-primary/20 hover:text-lasu-primary transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lasu-primary shrink-0 ring-4 ring-lasu-primary/15" />
                  <span className="leading-snug">{dept}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}




      </motion.div>

      {/* Sticky Bottom Actions Footer */}
      <div className="px-6 pt-4 pb-6 lg:pb-4 bg-white border-t border-zinc-200 shrink-0 shadow-md z-10">
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onGetDirections(poi)}
          className="w-full flex items-center justify-center gap-2 bg-lasu-primary hover:bg-lasu-primary-dark text-white py-3.5 rounded-2xl font-black transition-all shadow-md shadow-lasu-primary/15 cursor-pointer text-xs uppercase tracking-wider"
        >
          <Navigation className="w-3.5 h-3.5 fill-current animate-pulse" />
          Navigate
        </motion.button>
      </div>
    </div>
  );

  if (isSidebar) {
    return <div className="h-full flex flex-col overflow-hidden">{content}</div>;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="absolute bottom-2 left-6 right-6 md:left-auto md:w-96 bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-[1000]"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
};
