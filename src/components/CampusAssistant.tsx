import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Navigation } from 'lucide-react';
import { POI } from '../types';
import { getDistance } from '../lib/pathNetwork';
import { cn } from '../lib/utils';
import { LASU_KNOWLEDGE_BASE, Faculty, Department } from '../lib/lasuKnowledgeBase';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  poi?: POI;
}

interface CampusAssistantProps {
  pois: POI[];
  onNavigate: (poi: POI) => void;
  isVoiceEnabled: boolean;
  speakInstruction: (text: string) => void;
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

export function CampusAssistant({
  pois,
  onNavigate,
  isVoiceEnabled,
  speakInstruction,
  externalOpen,
  onExternalOpenChange,
}: CampusAssistantProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : localOpen;
  const setIsOpen = (open: boolean) => {
    setLocalOpen(open);
    onExternalOpenChange?.(open);
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm your LASU Campus Assistant 👋 Ask me about any building, faculty, or department on campus.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const findPOIForFaculty = (faculty: Faculty): POI | undefined => {
    const abbr = faculty.abbreviation.toLowerCase();
    const mapping: { [key: string]: string } = {
      'fa': '9',    // Faculty of Arts
      'fs': '8',    // Faculty of Science
      'fl': '7',    // Faculty of Law
      'fe': '12',   // Faculty of Education
      'fms': '10',  // Faculty of Management Sciences
      'fss': '11',  // Faculty of Social Sciences
      'stl': '14',  // School of Transport & Logistics
      'sc': '13',   // School of Communication
      'fcs': '13',  // Faculty of Clinical Sciences
      'fcit': '8',  // Faculty of Computing and Information Technology -> Faculty of Science (fallback)
      'stfpc': '9', // School of Tourism, Film, Performing Arts -> Faculty of Arts (fallback)
      'slais': '4'  // School of Library -> Main Library (fallback)
    };

    const poiId = mapping[abbr];
    if (poiId) {
      const match = pois.find(p => String(p.id).trim() === poiId);
      if (match) return match;
    }

    const normalizedFaculty = faculty.faculty.toLowerCase().replace(/faculty of|school of/g, '').trim();
    return pois.find(p => 
      p.name.toLowerCase().includes(normalizedFaculty) ||
      normalizedFaculty.includes(p.name.toLowerCase())
    );
  };

  const getNearbyLandmarks = (poi: POI): string => {
    const list = pois
      .filter(p => p.id !== poi.id)
      .map(p => ({
        poi: p,
        distance: getDistance(Number(poi.latitude), Number(poi.longitude), Number(p.latitude), Number(p.longitude))
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    if (list.length === 0) return "";
    return list.map(item => `• ${item.poi.name}`).join('\n');
  };

  const getActualBuildingText = (deptName: string, facultyName: string, facultyPoi?: POI): string => {
    const matchedPoi = pois.find(p => p.name.toLowerCase().includes(deptName.toLowerCase()));
    if (matchedPoi && matchedPoi.name.toLowerCase() !== facultyName.toLowerCase()) {
      return `The ${deptName} Department is located in the **${matchedPoi.name}** building.`;
    }
    if (facultyPoi) {
      return `The ${deptName} Department is located within the **${facultyPoi.name}** area.`;
    }
    return `The ${deptName} Department is located in the ${facultyName}.`;
  };

  const isSpecificallyRequested = (query: string): boolean => {
    const normalized = query.toLowerCase();
    return normalized.includes('tell me about') || 
           normalized.includes('info') || 
           normalized.includes('details') || 
           normalized.includes('description') || 
           normalized.includes('dean') || 
           normalized.includes('address') || 
           normalized.includes('programme') || 
           normalized.includes('course');
  };

  interface SearchMatch {
    type: 'faculty' | 'department';
    faculty: Faculty;
    department?: Department;
  }

  const findMatches = (query: string): SearchMatch[] => {
    const normalized = query.toLowerCase().trim();
    const words = normalized.split(/[^a-z0-9]+/);
    const matches: SearchMatch[] = [];

    // Check faculties
    for (const f of LASU_KNOWLEDGE_BASE) {
      const name = f.faculty.toLowerCase();
      const abbr = f.abbreviation.toLowerCase();

      if (words.includes(abbr) || 
          normalized.includes(name) || 
          normalized.includes(name.replace(/faculty of|school of/g, '').trim())) {
        matches.push({ type: 'faculty', faculty: f });
      }
    }

    // Check departments
    for (const f of LASU_KNOWLEDGE_BASE) {
      for (const d of f.departments) {
        const name = d.name.toLowerCase();
        
        let matched = normalized.includes(name);
        
        if (!matched) {
          matched = d.aliases.some(alias => {
            const normAlias = alias.toLowerCase();
            if (normAlias.length <= 4) {
              return words.includes(normAlias);
            }
            return normalized.includes(normAlias);
          });
        }

        if (matched) {
          if (!matches.some(m => m.type === 'department' && m.department?.name === d.name && m.faculty.faculty === f.faculty)) {
            matches.push({ type: 'department', faculty: f, department: d });
          }
        }
      }
    }

    return matches;
  };

  // Helper for Levenshtein edit distance
  const getLevenshteinDistance = (a: string, b: string): number => {
    const tmp = [];
    let i, j;
    for (i = 0; i <= a.length; i++) {
      tmp[i] = [i];
    }
    for (j = 0; j <= b.length; j++) {
      tmp[0][j] = j;
    }
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        tmp[i][j] = Math.min(
          tmp[i - 1][j] + 1,
          tmp[i][j - 1] + 1,
          tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return tmp[a.length][b.length];
  };

  const isFuzzyMatch = (q: string, target: string): boolean => {
    const normQ = q.toLowerCase().trim();
    const normT = target.toLowerCase().trim();
    if (normQ.length < 3 || normT.length < 3) return false;
    
    // Substring checks
    if (normT.includes(normQ) || normQ.includes(normT)) return true;

    // Edit distance threshold
    const dist = getLevenshteinDistance(normQ, normT);
    const maxAllowedDist = Math.max(1, Math.floor(normT.length * 0.25));
    return dist <= maxAllowedDist;
  };

  const ABBREVIATION_MAP: { [key: string]: string } = {
    'csc': 'computer science',
    'slt': 'makanjuola lecture theatre',
    'lt1': 'buba marwa auditorium',
    'lt2': 'lasu main auditorium',
    'pg school': 'postgraduate school',
    'law library': 'taslim olawale elias law library',
    'main library': 'fatiu ademola akesode library',
    'lasu library': 'akesode library',
    'university library': 'akesode library',
    'sanwo-olu library': 'babajide olusola sanwo-olu library complex'
  };

  // Helper formatting functions for processQuery
  const getCampusName = (location: string): string => {
    const loc = location.toLowerCase();
    if (loc.includes('ipe') || loc.includes('epe')) return 'LASU Epe';
    if (loc.includes('ikeja') || loc.includes('lasucom')) return 'LASUCOM, Ikeja';
    return 'LASU Ojo';
  };

  const getDeptDescription = (deptName: string): string => {
    const name = deptName.toLowerCase();
    if (name.includes('computer science') || name === 'csc') {
      return "Focuses on the study of algorithms, software development, data structures, and computing systems.";
    }
    if (name.includes('fisheries') || name.includes('aquaculture')) {
      return "Dedicated to the study of aquatic resources, aquaculture, fish breeding, and fisheries management.";
    }
    if (name.includes('mathematics') || name === 'maths' || name === 'mth') {
      return "Focuses on mathematical theories, logic, quantitative analysis, and mathematical problem-solving.";
    }
    if (name.includes('chemistry') || name === 'chm') {
      return "Focuses on the study of matter, chemical compounds, reactions, and laboratory analysis.";
    }
    if (name.includes('physics') || name === 'phy') {
      return "Investigates the fundamental laws of nature, energy, mechanics, and physical systems.";
    }
    if (name.includes('biochemistry') || name === 'bch') {
      return "Explores the chemical processes within and relating to living organisms.";
    }
    if (name.includes('microbiology') || name === 'mcb') {
      return "Focuses on the study of microscopic organisms, their biology, and applications in health and industry.";
    }
    if (name.includes('botany') || name.includes('plant biology')) {
      return "Dedicated to the study of plant life, physiology, ecology, and botanical research.";
    }
    if (name.includes('zoology') || name.includes('animal biology') || name === 'zeb') {
      return "Focuses on animal biology, wildlife conservation, and environmental ecosystems.";
    }
    if (name.includes('english')) {
      return "Focuses on English language studies, literature, linguistics, and creative writing.";
    }
    if (name.includes('accounting') || name === 'acc') {
      return "Focuses on financial reporting, auditing, taxation, and accounting information systems.";
    }
    if (name.includes('business administration')) {
      return "Focuses on business management, organizational behavior, and entrepreneurship.";
    }
    if (name.includes('economics') || name === 'eco') {
      return "Studies the production, distribution, and consumption of goods and services.";
    }
    if (name.includes('history') || name === 'his') {
      return "Examines historical events, international relations, diplomacy, and global politics.";
    }
    if (name.includes('music') || name === 'mus') {
      return "Focuses on musical theory, history, composition, and performance studies.";
    }
    if (name.includes('philosophy') || name === 'phl') {
      return "Explores critical thinking, logic, ethics, and the history of ideas.";
    }
    if (name.includes('religion') || name === 'crs') {
      return "Studies religious systems, ethics, conflict resolution, and peace building.";
    }
    if (name.includes('theatre') || name.includes('drama')) {
      return "Focuses on dramatic literature, performing arts, theatre production, and design.";
    }
    if (name.includes('broadcasting')) {
      return "Trains students in television production, radio broadcasting, and media programming.";
    }
    if (name.includes('journalism')) {
      return "Focuses on news reporting, investigative journalism, and media writing.";
    }
    if (name.includes('public relations') || name.includes('advertising') || name === 'pr') {
      return "Studies public relations campaigns, brand strategy, and media communications.";
    }
    return `Focuses on academic training, research, and applications in the field of ${deptName}.`;
  };

  const findFacultyInQuery = (query: string): Faculty | undefined => {
    const norm = query.toLowerCase();
    const sortedFaculties = [...LASU_KNOWLEDGE_BASE].sort((a, b) => b.faculty.length - a.faculty.length);
    
    for (const f of sortedFaculties) {
      const name = f.faculty.toLowerCase();
      const abbr = f.abbreviation.toLowerCase();
      const shortName = name.replace(/faculty of|school of/g, '').trim();

      const words = norm.split(/[^a-z0-9]+/);
      if (words.includes(abbr)) {
        return f;
      }

      if (norm.includes(name) || (shortName.length > 3 && norm.includes(shortName))) {
        return f;
      }
    }
    return undefined;
  };

  const findDepartmentInQuery = (query: string): { dept: Department; faculty: Faculty } | undefined => {
    const norm = query.toLowerCase();
    
    for (const f of LASU_KNOWLEDGE_BASE) {
      for (const d of f.departments) {
        const name = d.name.toLowerCase();
        
        if (norm.includes(name)) {
          return { dept: d, faculty: f };
        }
        
        for (const alias of d.aliases) {
          const normAlias = alias.toLowerCase();
          const words = norm.split(/[^a-z0-9]+/);
          if (normAlias.length <= 4) {
            if (words.includes(normAlias)) {
              return { dept: d, faculty: f };
            }
          } else if (norm.includes(normAlias)) {
            return { dept: d, faculty: f };
          }
        }
      }
    }
    return undefined;
  };

  const findPoiInQuery = (query: string): POI | undefined => {
    const norm = query.toLowerCase();
    
    if (norm.includes('law library') || norm.includes('elias')) {
      const lawLib = pois.find(p => p.name.toLowerCase().includes('elias') || p.name.toLowerCase().includes('law library'));
      if (lawLib) return lawLib;
    }
    if (norm.includes('sanwo-olu') || norm.includes('sanwo olu') || norm.includes('sanwoolu') || norm.includes('library complex') || norm.includes('new library') || norm.includes('central library') || norm.includes('reading room') || norm.includes('study area')) {
      const sanwoOluLib = pois.find(p => p.name.toLowerCase().includes('sanwo-olu') || p.name.toLowerCase().includes('sanwo olu') || p.id === '26');
      if (sanwoOluLib) return sanwoOluLib;
    }
    if (norm.includes('library')) {
      const mainLibrary = pois.find(p => p.name.toLowerCase().includes('akesode') || p.id === '4');
      if (mainLibrary) return mainLibrary;
    }

    const sortedPois = [...pois].sort((a, b) => b.name.length - a.name.length);
    
    for (const p of sortedPois) {
      const name = p.name.toLowerCase();
      if (norm.includes(name)) {
        return p;
      }
    }

    for (const p of sortedPois) {
      if (p.searchAliases) {
        for (const alias of p.searchAliases) {
          const normAlias = alias.toLowerCase();
          const words = norm.split(/[^a-z0-9]+/);
          if (normAlias.length <= 4) {
            if (words.includes(normAlias)) {
              return p;
            }
          } else if (norm.includes(normAlias)) {
            return p;
          }
        }
      }
    }
    return undefined;
  };

  const formatPoiLocationResponse = (poi: POI): { text: string; poi?: POI } => {
    let nearbyText = "";
    if (poi.nearbyLandmarks && poi.nearbyLandmarks.length > 0) {
      nearbyText = poi.nearbyLandmarks.map(n => `• ${n}`).join('\n');
    } else {
      nearbyText = getNearbyLandmarks(poi);
    }

    let text = `📍 ${poi.name}\n\n`;
    text += `${poi.description}\n\n`;
    if (nearbyText) {
      text += `Nearby:\n${nearbyText}\n\n`;
    }
    text += `Would you like to start navigation?`;

    return { text, poi };
  };

  const formatDeptResponse = (dept: Department, faculty: Faculty): { text: string; poi?: POI } => {
    const poi = findPOIForFaculty(faculty);
    let nearbyText = "";
    if (poi) {
      const landmarks = poi.nearbyLandmarks && poi.nearbyLandmarks.length > 0
        ? poi.nearbyLandmarks
        : pois
            .filter(p => p.id !== poi.id)
            .map(p => ({
              poi: p,
              distance: getDistance(Number(poi.latitude), Number(poi.longitude), Number(p.latitude), Number(p.longitude))
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 2)
            .map(item => item.poi.name);
      
      nearbyText = landmarks.map(n => `• ${n}`).join('\n');
    }

    const campus = getCampusName(faculty.location);
    const description = getDeptDescription(dept.name);

    let text = `📍 ${dept.name}\n\n`;
    text += `Location: ${faculty.faculty}, ${campus}\n\n`;
    text += `Faculty: ${faculty.faculty}\n\n`;
    if (nearbyText) {
      text += `Nearby:\n${nearbyText}\n\n`;
    }
    text += `Short Description:\n${description}\n\n`;
    text += `Would you like to start navigation?`;

    return { text, poi };
  };

  const formatFacultyResponse = (faculty: Faculty, poi?: POI, includeProgrammes = false): { text: string; poi?: POI } => {
    let nearbyText = "";
    if (poi) {
      const landmarks = poi.nearbyLandmarks && poi.nearbyLandmarks.length > 0
        ? poi.nearbyLandmarks
        : pois
            .filter(p => p.id !== poi.id)
            .map(p => ({
              poi: p,
              distance: getDistance(Number(poi.latitude), Number(poi.longitude), Number(p.latitude), Number(p.longitude))
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 2)
            .map(item => item.poi.name);
      
      nearbyText = landmarks.map(n => `• ${n}`).join('\n');
    }

    const deptsList = faculty.departments.map(d => `• ${d.name}`).join('\n');

    let text = `📍 ${faculty.faculty}\n\n`;
    text += `${faculty.description}\n\n`;
    text += `Dean: ${faculty.dean}\n\n`;
    text += `Departments:\n${deptsList}\n\n`;
    if (nearbyText) {
      text += `Nearby Landmarks:\n${nearbyText}\n\n`;
    }
    
    if (includeProgrammes && faculty.programmes && faculty.programmes.length > 0) {
      text += `Programmes offered:\n${faculty.programmes.map(p => `• ${p}`).join('\n')}\n\n`;
    }

    text += `Would you like to start navigation?`;
    return { text, poi };
  };

  const formatFacultyDepartmentsResponse = (faculty: Faculty, poi?: POI): { text: string; poi?: POI } => {
    const deptsList = faculty.departments.map(d => `• ${d.name}`).join('\n');
    
    let text = `📍 ${faculty.faculty}\n\n`;
    text += `Departments:\n${deptsList}\n\n`;
    text += `Would you like to start navigation?`;
    return { text, poi };
  };

  const formatFacultyProgrammesResponse = (faculty: Faculty, poi?: POI): { text: string; poi?: POI } => {
    const programmesList = faculty.programmes.map(p => `• ${p}`).join('\n');
    
    let text = `📍 ${faculty.faculty}\n\n`;
    text += `Programmes offered:\n${programmesList}\n\n`;
    text += `Would you like to start navigation?`;
    return { text, poi };
  };

  const formatFacultyLocationResponse = (faculty: Faculty, poi?: POI): { text: string; poi?: POI } => {
    let nearbyText = "";
    if (poi) {
      const landmarks = poi.nearbyLandmarks && poi.nearbyLandmarks.length > 0
        ? poi.nearbyLandmarks
        : pois
            .filter(p => p.id !== poi.id)
            .map(p => ({
              poi: p,
              distance: getDistance(Number(poi.latitude), Number(poi.longitude), Number(p.latitude), Number(p.longitude))
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 2)
            .map(item => item.poi.name);
      
      nearbyText = landmarks.map(n => `• ${n}`).join('\n');
    }

    let text = `📍 ${faculty.faculty}\n\n`;
    text += `Location: ${faculty.location}\n\n`;
    if (nearbyText) {
      text += `Nearby Landmarks:\n${nearbyText}\n\n`;
    }
    text += `Would you like to start navigation?`;

    return { text, poi };
  };

  const processQuery = (query: string): { text: string; poi?: POI } => {
    const rawNormalized = query.toLowerCase().trim();
    const normalized = ABBREVIATION_MAP[rawNormalized] || rawNormalized;

    // 1. Identify Intent
    let intent: 'dean' | 'programmes' | 'departments' | 'location' | 'info' | 'default' = 'default';
    if (normalized.includes('dean')) {
      intent = 'dean';
    } else if (normalized.includes('programme') || normalized.includes('program') || normalized.includes('course') || normalized.includes('offer')) {
      intent = 'programmes';
    } else if (normalized.includes('department') || normalized.includes('dept')) {
      intent = 'departments';
    } else if (normalized.includes('where') || normalized.includes('location') || normalized.includes('find') || normalized.includes('navigate') || normalized.includes('how to get to') || normalized.includes('direction')) {
      intent = 'location';
    } else if (normalized.includes('tell me about') || normalized.includes('info') || normalized.includes('details') || normalized.includes('description')) {
      intent = 'info';
    }

    // 2. Identify Entity
    const deptMatch = findDepartmentInQuery(normalized);
    const facultyMatch = findFacultyInQuery(normalized);
    const poiMatch = findPoiInQuery(normalized);

    // 3. Generate response based on Intent and matched entities
    if (intent === 'dean') {
      const targetFaculty = facultyMatch || (deptMatch ? deptMatch.faculty : undefined);
      if (targetFaculty) {
        return { text: `The Dean of the ${targetFaculty.faculty} is ${targetFaculty.dean}.` };
      }
      return { text: "I could not find the dean's information for the requested faculty." };
    }

    if (intent === 'departments') {
      const targetFaculty = facultyMatch || (deptMatch ? deptMatch.faculty : undefined);
      if (targetFaculty) {
        const poi = findPOIForFaculty(targetFaculty);
        return formatFacultyDepartmentsResponse(targetFaculty, poi);
      }
      return { text: "I could not find the departments for the requested faculty." };
    }

    if (intent === 'programmes') {
      const targetFaculty = facultyMatch || (deptMatch ? deptMatch.faculty : undefined);
      if (targetFaculty) {
        const poi = findPOIForFaculty(targetFaculty);
        return formatFacultyProgrammesResponse(targetFaculty, poi);
      }
      return { text: "I could not find the programmes offered by the requested faculty." };
    }

    // Entity priorities
    if (deptMatch) {
      return formatDeptResponse(deptMatch.dept, deptMatch.faculty);
    }

    if (facultyMatch) {
      const poi = findPOIForFaculty(facultyMatch);
      if (intent === 'location') {
        return formatFacultyLocationResponse(facultyMatch, poi);
      }
      return formatFacultyResponse(facultyMatch, poi);
    }

    if (poiMatch) {
      const matchedFaculty = LASU_KNOWLEDGE_BASE.find(f => 
        f.faculty.toLowerCase().includes(poiMatch.name.toLowerCase()) || 
        poiMatch.name.toLowerCase().includes(f.faculty.toLowerCase()) ||
        poiMatch.searchAliases?.some(a => a.toLowerCase() === f.abbreviation.toLowerCase())
      );
      if (matchedFaculty) {
        if (intent === 'location') {
          return formatFacultyLocationResponse(matchedFaculty, poiMatch);
        }
        return formatFacultyResponse(matchedFaculty, poiMatch);
      }
      return formatPoiLocationResponse(poiMatch);
    }

    // Fallback fuzzy checks
    for (const f of LASU_KNOWLEDGE_BASE) {
      const fuzzyDept = f.departments.find(d => 
        isFuzzyMatch(normalized, d.name) ||
        d.aliases.some(alias => isFuzzyMatch(normalized, alias))
      );
      if (fuzzyDept) {
        return formatDeptResponse(fuzzyDept, f);
      }
    }

    const fuzzyFaculty = LASU_KNOWLEDGE_BASE.find(f => 
      isFuzzyMatch(normalized, f.faculty) ||
      isFuzzyMatch(normalized, f.abbreviation) ||
      isFuzzyMatch(normalized, f.faculty.replace(/faculty of|school of/g, '').trim())
    );
    if (fuzzyFaculty) {
      const poi = findPOIForFaculty(fuzzyFaculty);
      return formatFacultyResponse(fuzzyFaculty, poi);
    }

    const fuzzyPoi = pois.find(p => 
      isFuzzyMatch(normalized, p.name) ||
      p.searchAliases?.some(a => isFuzzyMatch(normalized, a))
    );
    if (fuzzyPoi) {
      return formatPoiLocationResponse(fuzzyPoi);
    }

    return {
      text: "I could not find that information in the LASU database."
    };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userQuery = inputValue;
    const userMsgId = `user-${Date.now()}`;
    
    // Add user message
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: userQuery }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = processQuery(userQuery);
      const assistantMsgId = `assistant-${Date.now()}`;
      
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        sender: 'assistant',
        text: response.text,
        poi: response.poi,
      }]);
      setIsTyping(false);

      // Play voice if enabled
      speakInstruction(response.text);
    }, 600);
  };

  const SUGGESTED_CHIPS = [
    "Where is Computer Science?",
    "Where is LT1?",
    "Which faculty is Accounting under?",
    "Departments in Faculty of Arts"
  ];

  const handleChipClick = (question: string) => {
    setInputValue('');
    setIsTyping(true);

    // Add user message
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: question }]);

    setTimeout(() => {
      const response = processQuery(question);
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        poi: response.poi,
      }]);
      setIsTyping(false);
      speakInstruction(response.text);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-28 right-6 lg:bottom-10 lg:right-10 z-[2500]",
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-lg animate-fade-in",
          isOpen 
            ? "bg-zinc-800 text-white shadow-zinc-800/20"
            : "bg-lasu-accent text-white shadow-md hover:scale-105 border-none"
        )}
        title="Campus Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Panel Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={cn(
              "fixed bottom-24 right-4 z-[3000] w-[calc(100%-2rem)] max-w-sm lg:bottom-28 lg:right-10 lg:w-96",
              "bg-white  border border-zinc-250  shadow-2xl rounded-3xl h-[480px] flex flex-col overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
              <div className="flex items-center gap-2">
                <img 
                  src="https://lasu.edu.ng/home/img/logo1.png"
                  alt="LASU Logo"
                  className="w-8 h-8 object-contain shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xs font-black text-lasu-primary flex items-center gap-1.5 leading-none">
                    <span className="w-2 h-2 rounded-full bg-lasu-secondary animate-pulse" />
                    LASU Assistant
                  </h3>
                  <p className="text-[9px] text-zinc-650 font-bold uppercase tracking-wider mt-1">Official Guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-zinc-200 rounded-full text-zinc-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col custom-scrollbar">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-1 text-xs max-w-[85%]",
                    msg.sender === 'user' ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-2xl font-black whitespace-pre-line leading-relaxed shadow-sm",
                      msg.sender === 'user'
                        ? "bg-[rgb(245,235,224)]  text-[rgb(49,30,2)]  rounded-tr-none border border-[rgb(230,215,200)] "
                        : "bg-white  text-[rgb(49,30,2)]  border border-zinc-250  rounded-tl-none"
                    )}
                  >
                    {msg.text}
                  </div>

                  {msg.poi && (
                    <button
                      onClick={() => {
                        onNavigate(msg.poi!);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "mt-1 px-3 py-1.5 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-xl shadow-md",
                        "flex items-center gap-1.5 font-black uppercase text-[10px] hover:scale-102 transition-all duration-200 active:scale-95 cursor-pointer border-none"
                      )}
                    >
                      <Navigation className="w-3.5 h-3.5 fill-current text-white" />
                      Navigate
                    </button>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col gap-1 text-xs self-start items-start">
                  <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-zinc-200 rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Chips (Scrollable list above input box) */}
            <div className="px-3 py-2 bg-zinc-50 border-t border-zinc-200 flex gap-2 overflow-x-auto scrollbar-none shrink-0 max-w-full">
              {SUGGESTED_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-lasu-primary rounded-full text-[10px] font-bold text-zinc-700 hover:text-lasu-primary whitespace-nowrap active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input area */}
            <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 bg-zinc-50 flex gap-2 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask about departments, buildings..."
                className="flex-1 bg-white border border-zinc-250 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-700 placeholder-zinc-400 focus:outline-none focus:border-lasu-primary focus:ring-2 focus:ring-lasu-primary/10"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 border cursor-pointer",
                  inputValue.trim()
                    ? "bg-lasu-primary hover:bg-lasu-primary-dark border-lasu-primary text-white shadow-md active:scale-95"
                    : "bg-white  border-zinc-250  text-zinc-350 "
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
