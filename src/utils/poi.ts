import { POI } from '../types';
import { INITIAL_POIS } from '../data/initialPois';

export const findMatchingInitialPoi = (id: string, name: string): POI | undefined => {
  const cleanId = id.trim();
  const cleanName = name.trim().toLowerCase();
  
  // 1. Direct ID match
  let found = INITIAL_POIS.find(p => String(p.id).trim() === cleanId);
  if (found) return found;
  
  // 2. Exact name match
  found = INITIAL_POIS.find(p => String(p.name || '').trim().toLowerCase() === cleanName);
  if (found) return found;
  
  // 3. Fuzzy matches for known name variations to handle database/cache inconsistencies
  if (cleanName.includes('senate')) return INITIAL_POIS.find(p => String(p.id).trim() === '2');
  if (cleanName.includes('sanwo-olu') || cleanName.includes('sanwo olu') || cleanName.includes('sanwoolu') || cleanName.includes('sanwo_olu')) return INITIAL_POIS.find(p => String(p.id).trim() === '26');
  if (cleanName.includes('library') || cleanName.includes('akesode')) return INITIAL_POIS.find(p => String(p.id).trim() === '4');
  if (cleanName.includes('health') || cleanName.includes('clinic')) return INITIAL_POIS.find(p => String(p.id).trim() === '27');
  if (cleanName.includes('mosque')) return INITIAL_POIS.find(p => String(p.id).trim() === '28');
  if (cleanName.includes('chapel') || cleanName.includes('light')) return INITIAL_POIS.find(p => String(p.id).trim() === '29');
  if (cleanName.includes('sports')) return INITIAL_POIS.find(p => String(p.id).trim() === '30');
  if (cleanName.includes('gate') && (cleanName.includes('main') || cleanName.includes('expressway'))) return INITIAL_POIS.find(p => String(p.id).trim() === '55');
  if (cleanName.includes('law')) return INITIAL_POIS.find(p => String(p.id).trim() === '7');
  if (cleanName.includes('science') && !cleanName.includes('management') && !cleanName.includes('social') && !cleanName.includes('political')) return INITIAL_POIS.find(p => String(p.id).trim() === '8');
  if (cleanName.includes('social')) return INITIAL_POIS.find(p => String(p.id).trim() === '11');
  if (cleanName.includes('auditorium') || cleanName.includes('marwa')) return INITIAL_POIS.find(p => String(p.id).trim() === '25');
  if (cleanName.includes('mba complex') || cleanName.includes('mba building')) return INITIAL_POIS.find(p => String(p.id).trim() === '16');
  if (cleanName.includes('arts')) return INITIAL_POIS.find(p => String(p.id).trim() === '9');
  if (cleanName.includes('education')) return INITIAL_POIS.find(p => String(p.id).trim() === '12');
  if (cleanName.includes('management science')) return INITIAL_POIS.find(p => String(p.id).trim() === '10');
  if (cleanName.includes('communication') || cleanName.includes('soc')) return INITIAL_POIS.find(p => String(p.id).trim() === '13');
  if (cleanName.includes('transport') || cleanName.includes('sotl')) return INITIAL_POIS.find(p => String(p.id).trim() === '14');
  if (cleanName.includes('postgraduate') || cleanName.includes('spgs')) return INITIAL_POIS.find(p => String(p.id).trim() === '15');
  if (cleanName.includes('radio')) return INITIAL_POIS.find(p => String(p.id).trim() === '23');
  if (cleanName.includes('ict') || cleanName.includes('dict')) return INITIAL_POIS.find(p => String(p.id).trim() === '22');
  if (cleanName.includes('staff school')) return INITIAL_POIS.find(p => String(p.id).trim() === '50');
  if (cleanName.includes('international school') || cleanName.includes('lasuis')) return INITIAL_POIS.find(p => String(p.id).trim() === '51');
  
  return undefined;
};

export const overridePoiData = (poisList: POI[]): POI[] => {
  return poisList.map(poi => {
    const poiIdStr = String(poi.id).trim();
    const poiNameStr = String(poi.name || '').trim().toLowerCase();
    
    // Resilient lookup with fuzzy matching
    const corrected = findMatchingInitialPoi(poiIdStr, poiNameStr);

    if (corrected) {
      const correctedIdStr = String(corrected.id).trim();
      let imageUrl = corrected.imageUrl;
      let imageUrls = corrected.imageUrls && corrected.imageUrls.length > 0 
        ? corrected.imageUrls 
        : (corrected.imageUrl ? [corrected.imageUrl] : undefined);
      
      if (correctedIdStr === '4' || poiNameStr.toLowerCase().includes('akesode') || poiNameStr.toLowerCase().includes('main library')) {
        imageUrl = '/main-library.jpg';
        imageUrls = ['/main-library.jpg', '/main-library-2.jpg'];
      } else if (correctedIdStr === '2' || poiNameStr.includes('senate building') || poiNameStr.includes('senate house')) {
        imageUrl = '/senate-building.png';
        imageUrls = ['/senate-building.png'];
      } else if (correctedIdStr === '5' || poiNameStr.toLowerCase().includes('law library') || poiNameStr.toLowerCase().includes('elias')) {
        imageUrl = '/law-library-1.jpg';
        imageUrls = ['/law-library-1.jpg', '/law-library-2.jpg'];
      } else if (correctedIdStr === '7' || (poiNameStr.toLowerCase().includes('law') && !poiNameStr.toLowerCase().includes('library'))) {
        imageUrl = '/law-1.jpg';
        imageUrls = ['/law-1.jpg'];
      } else if (correctedIdStr === '8' || (poiNameStr.toLowerCase().includes('science') && !poiNameStr.toLowerCase().includes('management') && !poiNameStr.toLowerCase().includes('social') && !poiNameStr.toLowerCase().includes('political'))) {
        imageUrl = '/science-1.jpg';
        imageUrls = ['/science-1.jpg', '/science-2.jpg', '/science-3.jpg'];
      } else if (correctedIdStr === '9' || poiNameStr === 'faculty of arts' || poiNameStr === 'faculty of arts block') {
        imageUrl = '/arts-1.jpg';
        imageUrls = ['/arts-1.jpg', '/arts-2.jpg'];
      } else if (correctedIdStr === '12' || poiNameStr === 'faculty of education' || poiNameStr === 'faculty of education block') {
        imageUrl = '/education-1.png';
        imageUrls = ['/education-1.png', '/education-2.png'];
      } else if (correctedIdStr === '10' || poiNameStr === 'faculty of management sciences') {
        imageUrl = '/management-sciences.png';
        imageUrls = ['/management-sciences.png'];
      } else if (correctedIdStr === '15' || poiNameStr.toLowerCase().includes('postgraduate') || poiNameStr.toLowerCase().includes('spgs')) {
        imageUrl = '/postgraduate-school-1.jpg';
        imageUrls = ['/postgraduate-school-1.jpg'];
      } else if (correctedIdStr === '16' || poiNameStr === 'mba complex') {
        imageUrl = '/mba-complex.png';
        imageUrls = ['/mba-complex.png', '/mba-complex-2.jpg'];
      } else if (correctedIdStr === '25' || poiNameStr.includes('auditorium') || poiNameStr.includes('marwa')) {
        imageUrl = '/auditorium-1.jpg';
        imageUrls = ['/auditorium-1.jpg', '/auditorium-2.jpg'];
      } else if (correctedIdStr === '13' || poiNameStr.toLowerCase().includes('lasusoc') || poiNameStr.toLowerCase().includes('school of communication')) {
        imageUrl = '/lasusoc.png';
        imageUrls = ['/lasusoc.png'];
      } else if (correctedIdStr === '14' || poiNameStr.includes('transport')) {
        imageUrl = '/school-of-transport.jpg';
        imageUrls = ['/school-of-transport.jpg'];
      } else if (correctedIdStr === '22' || poiNameStr.toLowerCase().includes('ict')) {
        imageUrl = '/ict-centre-1.jpg';
        imageUrls = ['/ict-centre-1.jpg', '/ict-centre-2.jpg'];
      } else if (correctedIdStr === '23' || poiNameStr.includes('radio')) {
        imageUrl = '/lasu-radio.jpg';
        imageUrls = ['/lasu-radio.jpg'];
      } else if (correctedIdStr === '29' || poiNameStr.toLowerCase().includes('chapel')) {
        imageUrl = '/chapel-of-light.jpg';
        imageUrls = ['/chapel-of-light.jpg'];
      } else if (correctedIdStr === '27' || poiNameStr.includes('health centre') || poiNameStr.includes('health center')) {
        imageUrl = '/health-centre.jpg';
        imageUrls = ['/health-centre.jpg'];
      } else if (correctedIdStr === '28' || poiNameStr.toLowerCase().includes('mosque')) {
        imageUrl = '/mosque-1.jpg';
        imageUrls = ['/mosque-1.jpg', '/mosque-2.jpg', '/mosque-3.jpg'];
      } else if (correctedIdStr === '54' || poiNameStr.toLowerCase().includes('staff quarters') || poiNameStr.toLowerCase().includes('iba')) {
        imageUrl = '/staff-quarters-1.jpg';
        imageUrls = ['/staff-quarters-1.jpg', '/staff-quarters-2.jpg'];
      } else if (correctedIdStr === '20' || poiNameStr.toLowerCase().includes('aceitse') || poiNameStr.toLowerCase().includes('africa centre of excellence')) {
        imageUrl = '/aceitse.jpg';
        imageUrls = ['/aceitse.jpg'];
      } else if (correctedIdStr === '48' || poiNameStr.toLowerCase().includes('student union')) {
        imageUrl = '/student-union.jpg';
        imageUrls = ['/student-union.jpg'];
      } else if (correctedIdStr === '53' || poiNameStr.toLowerCase().includes('senior staff club')) {
        imageUrl = '/senior-staff-club.jpg';
        imageUrls = ['/senior-staff-club.jpg'];
      } else if (correctedIdStr === '50' || poiNameStr.toLowerCase().includes('staff school') || poiNameStr.toLowerCase().includes('primary school')) {
        imageUrl = '/staff-school-1.jpg';
        imageUrls = ['/staff-school-1.jpg', '/staff-school-2.jpg'];
      }

      return {
        ...poi,
        name: corrected.name,
        description: corrected.description,
        latitude: Number(corrected.latitude),
        longitude: Number(corrected.longitude),
        category: corrected.category,
        tags: corrected.tags,
        imageUrl: imageUrl || poi.imageUrl,
        imageUrls: imageUrls || poi.imageUrls,
        videoUrl: corrected.videoUrl,
        videoUrls: corrected.videoUrls
      };
    }
    return {
      ...poi,
      latitude: Number(poi.latitude),
      longitude: Number(poi.longitude)
    };
  });
};
