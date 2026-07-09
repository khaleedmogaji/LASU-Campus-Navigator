import { POI } from '../types';
import { getDistance } from '../lib/pathNetwork';
import { LASU_KNOWLEDGE_BASE, Faculty, Department } from '../lib/lasuKnowledgeBase';

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
  
  if (normT.includes(normQ) || normQ.includes(normT)) return true;

  const dist = getLevenshteinDistance(normQ, normT);
  const maxAllowedDist = Math.max(1, Math.floor(normT.length * 0.25));
  return dist <= maxAllowedDist;
};

const findPOIForFaculty = (faculty: Faculty, pois: POI[]): POI | undefined => {
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

const getNearbyLandmarks = (poi: POI, pois: POI[]): string => {
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

const findPoiInQuery = (query: string, pois: POI[]): POI | undefined => {
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

const formatPoiLocationResponse = (poi: POI, pois: POI[]): { text: string; poi?: POI } => {
  let nearbyText = "";
  if (poi.nearbyLandmarks && poi.nearbyLandmarks.length > 0) {
    nearbyText = poi.nearbyLandmarks.map(n => `• ${n}`).join('\n');
  } else {
    nearbyText = getNearbyLandmarks(poi, pois);
  }

  let text = `📍 ${poi.name}\n\n`;
  text += `${poi.description}\n\n`;
  if (nearbyText) {
    text += `Nearby:\n${nearbyText}\n\n`;
  }
  text += `Would you like to start navigation?`;

  return { text, poi };
};

const formatDeptResponse = (dept: Department, faculty: Faculty, pois: POI[]): { text: string; poi?: POI } => {
  const poi = findPOIForFaculty(faculty, pois);
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

const formatFacultyResponse = (faculty: Faculty, pois: POI[], poi?: POI, includeProgrammes = false): { text: string; poi?: POI } => {
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

const formatFacultyLocationResponse = (faculty: Faculty, poi?: POI, pois: POI[] = []): { text: string; poi?: POI } => {
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

export const processQuery = (query: string, pois: POI[]): { text: string; poi?: POI } => {
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
  const poiMatch = findPoiInQuery(normalized, pois);

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
      const poi = findPOIForFaculty(targetFaculty, pois);
      return formatFacultyDepartmentsResponse(targetFaculty, poi);
    }
    return { text: "I could not find the departments for the requested faculty." };
  }

  if (intent === 'programmes') {
    const targetFaculty = facultyMatch || (deptMatch ? deptMatch.faculty : undefined);
    if (targetFaculty) {
      const poi = findPOIForFaculty(targetFaculty, pois);
      return formatFacultyProgrammesResponse(targetFaculty, poi);
    }
    return { text: "I could not find the programmes offered by the requested faculty." };
  }

  // Entity priorities
  if (deptMatch) {
    return formatDeptResponse(deptMatch.dept, deptMatch.faculty, pois);
  }

  if (facultyMatch) {
    const poi = findPOIForFaculty(facultyMatch, pois);
    if (intent === 'location') {
      return formatFacultyLocationResponse(facultyMatch, poi, pois);
    }
    return formatFacultyResponse(facultyMatch, pois, poi);
  }

  if (poiMatch) {
    const matchedFaculty = LASU_KNOWLEDGE_BASE.find(f => 
      f.faculty.toLowerCase().includes(poiMatch.name.toLowerCase()) || 
      poiMatch.name.toLowerCase().includes(f.faculty.toLowerCase()) ||
      poiMatch.searchAliases?.some(a => a.toLowerCase() === f.abbreviation.toLowerCase())
    );
    if (matchedFaculty) {
      if (intent === 'location') {
        return formatFacultyLocationResponse(matchedFaculty, poiMatch, pois);
      }
      return formatFacultyResponse(matchedFaculty, pois, poiMatch);
    }
    return formatPoiLocationResponse(poiMatch, pois);
  }

  // Fallback fuzzy checks
  for (const f of LASU_KNOWLEDGE_BASE) {
    const fuzzyDept = f.departments.find(d => 
      isFuzzyMatch(normalized, d.name) ||
      d.aliases.some(alias => isFuzzyMatch(normalized, alias))
    );
    if (fuzzyDept) {
      return formatDeptResponse(fuzzyDept, f, pois);
    }
  }

  const fuzzyFaculty = LASU_KNOWLEDGE_BASE.find(f => 
    isFuzzyMatch(normalized, f.faculty) ||
    isFuzzyMatch(normalized, f.abbreviation) ||
    isFuzzyMatch(normalized, f.faculty.replace(/faculty of|school of/g, '').trim())
  );
  if (fuzzyFaculty) {
    const poi = findPOIForFaculty(fuzzyFaculty, pois);
    return formatFacultyResponse(fuzzyFaculty, pois, poi);
  }

  const fuzzyPoi = pois.find(p => 
    isFuzzyMatch(normalized, p.name) ||
    p.searchAliases?.some(a => isFuzzyMatch(normalized, a))
  );
  if (fuzzyPoi) {
    return formatPoiLocationResponse(fuzzyPoi, pois);
  }

  return {
    text: "I could not find that information in the LASU database."
  };
};
