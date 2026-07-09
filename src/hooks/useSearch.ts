import { useState, useEffect, useMemo } from 'react';
import { db, collection, onSnapshot, query } from '../firebase';
import { POI } from '../types';
import { INITIAL_POIS } from '../data/initialPois';
import { overridePoiData } from '../utils/poi';

interface UseSearchProps {
  pois: POI[];
  setPois: React.Dispatch<React.SetStateAction<POI[]>>;
  routingFrom: POI | null;
  routingTo: POI | null;
}

export function useSearch({ pois, setPois, routingFrom, routingTo }: UseSearchProps) {
  const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startSearchQuery, setStartSearchQuery] = useState("My Location");
  const [endSearchQuery, setEndSearchQuery] = useState("");
  const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'pois'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPois = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as POI));
      if (fetchedPois.length > 0) {
        const merged = [...fetchedPois];
        INITIAL_POIS.forEach(initial => {
          const idx = merged.findIndex(p => String(p.id).trim() === String(initial.id).trim());
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], ...initial };
          } else {
            merged.push(initial);
          }
        });
        const updated = overridePoiData(merged);
        setPois(updated);
        localStorage.setItem('poi_data_v10', JSON.stringify(updated));
      }
    }, (error) => {
      console.warn("Firestore onSnapshot error for POIs:", error);
      const cached = localStorage.getItem('poi_data_v10');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            const merged = [...parsed];
            INITIAL_POIS.forEach(initial => {
              const idx = merged.findIndex(p => String(p.id).trim() === String(initial.id).trim());
              if (idx !== -1) {
                merged[idx] = { ...merged[idx], ...initial };
              } else {
                merged.push(initial);
              }
            });
            setPois(overridePoiData(merged));
            return;
          }
        } catch (e) {
          console.warn("Failed to parse cached fallback POIs:", e);
        }
      }
      setPois(overridePoiData(INITIAL_POIS));
    });

    return () => unsubscribe();
  }, [setPois]);

  useEffect(() => {
    setStartSearchQuery(routingFrom ? routingFrom.name : "My Location");
  }, [routingFrom]);

  useEffect(() => {
    setEndSearchQuery(routingTo ? routingTo.name : "My Location");
  }, [routingTo]);

  const filteredStartPois = useMemo(() => {
    return startSearchQuery && startSearchQuery !== "My Location"
      ? pois.filter(p => {
          const q = startSearchQuery.toLowerCase().trim();
          return p.name.toLowerCase().includes(q) ||
                 p.category.toLowerCase().includes(q) ||
                 (p.description && p.description.toLowerCase().includes(q)) ||
                 p.tags?.some(tag => tag.toLowerCase().includes(q)) ||
                 p.searchAliases?.some(alias => alias.toLowerCase().includes(q));
        })
      : pois;
  }, [pois, startSearchQuery]);

  const filteredEndPois = useMemo(() => {
    return endSearchQuery && endSearchQuery !== "My Location"
      ? pois.filter(p => {
          const q = endSearchQuery.toLowerCase().trim();
          return p.name.toLowerCase().includes(q) ||
                 p.category.toLowerCase().includes(q) ||
                 (p.description && p.description.toLowerCase().includes(q)) ||
                 p.tags?.some(tag => tag.toLowerCase().includes(q)) ||
                 p.searchAliases?.some(alias => alias.toLowerCase().includes(q));
        })
      : pois;
  }, [pois, endSearchQuery]);

  return {
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    startSearchQuery,
    setStartSearchQuery,
    endSearchQuery,
    setEndSearchQuery,
    isStartDropdownOpen,
    setIsStartDropdownOpen,
    isEndDropdownOpen,
    setIsEndDropdownOpen,
    filteredStartPois,
    filteredEndPois,
  };
}
