import { CAMPUS_POLYGON, isPointInPolygon, getMinDistanceToRoute } from './utils/geo';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SafetyInfoModal } from './components/SafetyInfoModal';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { 
  db, 
  collection, 
  onSnapshot, 
  query
} from './firebase';
import { POI } from './types';
import { cn } from './lib/utils';
import { Share2 } from 'lucide-react';
import { KalmanFilter } from './lib/kalmanFilter';
import { CampusMap, MapStyle } from './components/Map';
import { SearchBar } from './components/SearchBar';
import { findShortestPath, getDistance, getBearing } from './lib/pathNetwork';
import { MobileBottomSheet, SheetSnap } from './components/MobileBottomSheet';

// Lazy loaded heavy components
const POIInfo = React.lazy(() => import('./components/POIInfo').then(m => ({ default: m.POIInfo })));
const WelcomeScreen = React.lazy(() => import('./components/WelcomeScreen').then(m => ({ default: m.WelcomeScreen })));
const CampusAssistant = React.lazy(() => import('./components/CampusAssistant').then(m => ({ default: m.CampusAssistant })));
import { Home, Bell, Map as MapIcon, Info, LogIn, User as UserIcon, Navigation, Search, Menu, X, ChevronRight, ChevronUp, ChevronDown, Layers, LogOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerUpLeft, CornerUpRight, CornerDownLeft, CornerDownRight, Play, Pause, Square, WifiOff, Wifi, Volume2, VolumeX, Tag, Compass, AlertTriangle, MessageSquare, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';







const INITIAL_POIS: POI[] = [
  {
    "id": "1",
    "name": "Lagos State University",
    "description": "Main campus of LASU, Ojo. Established 1983 along Lagos-Badagry Expressway, Alasia, Ojo. Seat of central administration. Houses Faculties of Arts, Education, Law, Management Sciences, Science, Social Sciences, School of Transport, School of Communication, and several centres.",
    "category": "Building",
    "latitude": 6.466600486821916,
    "longitude": 3.2010087980515363,
    "imageUrl": "/senate-building.png",
    "tags": [
      "admin",
      "senate",
      "vc",
      "headquarters"
    ],
    "searchAliases": [
      "admin",
      "senate",
      "vc",
      "headquarters",
      "lagos",
      "state",
      "university",
      "main",
      "campus"
    ],
    "nearbyLandmarks": [
      "Faculty of Science",
      "LASU Press Bus Stop",
      "LASU Bursary / Finance Department",
      "Faculty of Science Junction",
      "Bursary Junction"
    ]
  },
  {
    "id": "2",
    "name": "Senate Building",
    "description": "University Senate House and main administrative HQ of LASU Ojo. Named after former Lagos State Governor Babatunde Raji Fashola. Houses Senate Chamber, central administration, and LASU-SDG Centre (3rd floor).",
    "category": "Administrative",
    "latitude": 6.471234728121685,
    "longitude": 3.2000209921511447,
    "imageUrl": "/senate-building.png",
    "tags": [
      "admin",
      "senate",
      "vc",
      "headquarters"
    ],
    "imageUrls": [
      "/senate-building.png"
    ],
    "searchAliases": [
      "admin",
      "senate",
      "vc",
      "headquarters",
      "babatunde",
      "raji",
      "fashola",
      "house"
    ],
    "nearbyLandmarks": [
      "LASU Radio Station (95.7 FM)",
      "Babajide Olusola Sanwo-Olu Library Complex",
      "LASU Student Affairs Building",
      "LASU Registry / Registrar's Office",
      "Vice-Chancellor's Office"
    ]
  },
  {
    "id": "3",
    "name": "Senate Chambers",
    "description": "Formal senate assembly chamber within the LASU Ojo campus administrative complex.",
    "category": "Administrative",
    "latitude": 6.4647,
    "longitude": 3.2004,
    "imageUrl": "https://picsum.photos/seed/lasu-library/800/600",
    "tags": [
      "study",
      "books",
      "research",
      "library"
    ],
    "searchAliases": [
      "study",
      "books",
      "research",
      "library",
      "senate",
      "chambers"
    ],
    "nearbyLandmarks": [
      "Fatiu Ademola Akesode Library (Main Library)",
      "Taslim Olawale Elias Law Library",
      "LASU Bookshop",
      "Main Gate Junction",
      "Mosque Walkway Intersection",
      "Library Pedestrian Crossing"
    ]
  },
  {
    "id": "4",
    "name": "Fatiu Akesode Library",
    "description": "Main university library established 1983. Named after former VC Prof. Fatiu Ademola Akesode. Contains textbooks, journals, digital databases and e-library services. Part of a broader library system including the Law Library and branch libraries.",
    "category": "Library",
    "latitude": 6.464890552980209,
    "longitude": 3.2005754349316247,
    "imageUrl": "/main-library.jpg",
    "imageUrls": [
      "/main-library.jpg",
      "/main-library-2.jpg"
    ],
    "tags": [
      "engineering",
      "lab",
      "technology",
      "mechanical",
      "electronics",
      "chemical",
      "polymer"
    ],
    "searchAliases": [
      "engineering",
      "lab",
      "technology",
      "mechanical",
      "electronics",
      "chemical",
      "polymer",
      "fatiu",
      "ademola",
      "akesode",
      "library",
      "main"
    ],
    "nearbyLandmarks": [
      "Senate Chambers",
      "LASU Bookshop",
      "LASU Central Mosque",
      "Main Gate Junction",
      "Mosque Walkway Intersection",
      "Library Pedestrian Crossing"
    ]
  },
  {
    "id": "5",
    "name": "Taslim Olawale Elias Law Library",
    "description": "Specialised law library adjacent to Faculty of Law (Block A). Named after jurist and former ICJ President Taslim Olawale Elias. Open Monday–Sunday 8 AM–6 PM.",
    "category": "Library",
    "latitude": 6.46787998163229,
    "longitude": 3.2018192345712313,
    "imageUrl": "/law-library-1.jpg",
    "tags": [
      "library",
      "books",
      "law",
      "elias",
      "reading",
      "study"
    ],
    "imageUrls": [
      "/law-library-1.jpg",
      "/law-library-2.jpg"
    ],
    "searchAliases": [
      "library",
      "books",
      "law",
      "elias",
      "reading",
      "study",
      "taslim",
      "olawale"
    ],
    "nearbyLandmarks": [
      "Senate Chambers",
      "Main Gate Junction"
    ]
  },
  {
    "id": "6",
    "name": "LASU Bookshop",
    "description": "University bookshop located close to the main library. Stocks academic texts and reading materials. Open Monday–Friday 8 AM–4 PM.",
    "category": "Administrative",
    "latitude": 6.465019395427171,
    "longitude": 3.200397519738991,
    "imageUrl": "https://picsum.photos/seed/lasu-admin1/800/600",
    "tags": [
      "admin",
      "block1",
      "administrative",
      "records",
      "register"
    ],
    "searchAliases": [
      "admin",
      "block1",
      "administrative",
      "records",
      "register",
      "lasu",
      "bookshop"
    ],
    "nearbyLandmarks": [
      "Senate Chambers",
      "Fatiu Ademola Akesode Library (Main Library)",
      "LASU Central Mosque",
      "Main Gate Junction",
      "Mosque Walkway Intersection",
      "Library Pedestrian Crossing"
    ]
  },
  {
    "id": "7",
    "name": "Faculty of Law",
    "description": "One of LASU's founding faculties (1983). Located in Block A beside the Taslim Olawale Elias Law Library. Has produced notable alumni including the current Vice-Chancellor. Open Monday–Friday 8 AM–6 PM. Contact: +234 706 644 4999.",
    "category": "Building",
    "latitude": 6.468810305420531,
    "longitude": 3.2043812491346735,
    "imageUrl": "/law-1.jpg",
    "tags": [
      "law",
      "legal",
      "faculty",
      "common law",
      "islamic law"
    ],
    "imageUrls": [
      "/law-1.jpg"
    ],
    "searchAliases": [
      "law",
      "legal",
      "faculty",
      "common law",
      "islamic law"
    ],
    "nearbyLandmarks": [
      "LASU Sport Centre"
    ]
  },
  {
    "id": "8",
    "name": "Faculty of Science",
    "description": "Faculty of Science, LASU Ojo. Air-conditioned offices and lecture rooms. Offers science degree programmes. Open daily 7 AM–9 PM.",
    "category": "Building",
    "latitude": 6.466313029359872,
    "longitude": 3.200116094596366,
    "imageUrl": "/science-1.jpg",
    "tags": [
      "science",
      "biochemistry",
      "botany",
      "chemistry",
      "computer science",
      "fisheries",
      "mathematics",
      "microbiology",
      "physics",
      "sltech",
      "zoology"
    ],
    "imageUrls": [
      "/science-1.jpg",
      "/science-2.jpg",
      "/science-3.jpg"
    ],
    "searchAliases": [
      "science",
      "biochemistry",
      "botany",
      "chemistry",
      "computer science",
      "fisheries",
      "mathematics",
      "microbiology",
      "physics",
      "sltech",
      "zoology",
      "faculty"
    ],
    "nearbyLandmarks": [
      "Lagos State University (Main Campus)",
      "LASU Bursary / Finance Department",
      "Faculty of Science Junction",
      "Bursary Junction"
    ]
  },
  {
    "id": "9",
    "name": "Faculty of Arts",
    "description": "Faculty of Arts, LASU Ojo. Offers programmes in arts, culture, drama, language, and humanities. Contact: +234 706 156 6438.",
    "category": "Building",
    "latitude": 6.4674,
    "longitude": 3.202,
    "imageUrl": "/arts-1.jpg",
    "tags": [
      "arts",
      "humanities",
      "english",
      "foreign languages",
      "history",
      "linguistics",
      "african languages",
      "music",
      "philosophy",
      "religions",
      "the theatre"
    ],
    "imageUrls": [
      "/arts-1.jpg",
      "/arts-2.jpg"
    ],
    "searchAliases": [
      "arts",
      "humanities",
      "english",
      "foreign languages",
      "history",
      "linguistics",
      "african languages",
      "music",
      "philosophy",
      "religions",
      "the theatre",
      "faculty"
    ],
    "nearbyLandmarks": [
      "School of Communication (LASUSOC)"
    ]
  },
  {
    "id": "10",
    "name": "Faculty of Management Sciences",
    "description": "Located on Igbo Elerin Road. Houses 8 departments: Accounting, Business Administration, Insurance, Banking & Finance, Industrial Relations & Personnel Management, Management Technology, Marketing, and Public Administration. Has 24/7 free Wi-Fi.",
    "category": "Building",
    "latitude": 6.476540790428714,
    "longitude": 3.200887433041905,
    "imageUrl": "/management-sciences.png",
    "tags": [
      "management",
      "accounting",
      "finance",
      "business",
      "marketing",
      "hr",
      "insurance",
      "taxation"
    ],
    "imageUrls": [
      "/management-sciences.png"
    ],
    "searchAliases": [
      "management",
      "accounting",
      "finance",
      "business",
      "marketing",
      "hr",
      "insurance",
      "taxation",
      "faculty",
      "sciences"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "11",
    "name": "Faculty of Social Sciences",
    "description": "Located beside the School of Transport, opposite the old LASU External System Secretariat. Fully accessibility-compliant entrance with security desk.",
    "category": "Building",
    "latitude": 6.4755769158405085,
    "longitude": 3.1975277158575857,
    "imageUrl": "https://picsum.photos/seed/lasu-social/800/600",
    "tags": [
      "social",
      "sociology",
      "economics",
      "politics",
      "psychology",
      "geography"
    ],
    "searchAliases": [
      "social",
      "sociology",
      "economics",
      "politics",
      "psychology",
      "geography",
      "faculty",
      "sciences"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "12",
    "name": "Faculty of Education (3-in-1 Hall)",
    "description": "Faculty of Education, LASU Ojo. Offers undergraduate and postgraduate education programmes. Exact building coordinates require on-ground verification.",
    "category": "Building",
    "latitude": 6.47306938523979,
    "longitude": 3.199933437952813,
    "imageUrl": "/education-1.png",
    "tags": [
      "education",
      "teaching",
      "research",
      "counselling",
      "curriculum"
    ],
    "imageUrls": [
      "/education-1.png",
      "/education-2.png"
    ],
    "searchAliases": [
      "education",
      "teaching",
      "research",
      "counselling",
      "curriculum",
      "faculty"
    ],
    "nearbyLandmarks": [
      "MBA Complex",
      "United Bank for Africa (UBA) LASU Branch"
    ]
  },
  {
    "id": "13",
    "name": "School of Communication",
    "description": "First-of-its-kind degree-awarding School of Communication in Nigeria. Established early 2000s. Open Monday–Saturday 9 AM–5 PM.",
    "category": "Building",
    "latitude": 6.472409536604193,
    "longitude": 3.199629891153961,
    "imageUrl": "/lasusoc.png",
    "imageUrls": [
      "/lasusoc.png"
    ],
    "tags": [
      "science",
      "biochemistry",
      "botany",
      "chemistry",
      "computer science",
      "fisheries",
      "mathematics",
      "microbiology",
      "physics",
      "sltech",
      "zoology"
    ],
    "searchAliases": [
      "science",
      "biochemistry",
      "botany",
      "chemistry",
      "computer science",
      "fisheries",
      "mathematics",
      "microbiology",
      "physics",
      "sltech",
      "zoology",
      "school",
      "communication",
      "lasusoc"
    ],
    "nearbyLandmarks": [
      "Faculty of Arts",
      "Babajide Olusola Sanwo-Olu Library Complex",
      "LASU Student Affairs Building",
      "Vice-Chancellor's Office"
    ]
  },
  {
    "id": "14",
    "name": "School of Transport and Logistics",
    "description": "Offers professional transport and logistics programmes. Well-equipped building with ventilated lecture rooms, modern toilets, and good parking. 100% accessibility compliant. Contact: +234 814 070 8307.",
    "category": "Building",
    "latitude": 6.474404337101407,
    "longitude": 3.198833634017693,
    "imageUrl": "/school-of-transport.jpg",
    "tags": [
      "transport",
      "logistics",
      "management",
      "planning",
      "school"
    ],
    "imageUrls": [
      "/school-of-transport.jpg"
    ],
    "searchAliases": [
      "transport",
      "logistics",
      "management",
      "planning",
      "school"
    ],
    "nearbyLandmarks": [
      "Centre for Entrepreneurship Studies"
    ]
  },
  {
    "id": "15",
    "name": "Post Graduate School",
    "description": "Manages all postgraduate programmes at the Ojo campus. Located along Lagos-Badagry Expressway near MBA Bus Stop. Open Monday–Friday 8 AM–4 PM.",
    "category": "Administrative",
    "latitude": 6.468513470995953,
    "longitude": 3.20133278658194,
    "imageUrl": "/postgraduate-school-1.jpg",
    "tags": [
      "postgraduate",
      "pg",
      "research",
      "admin"
    ],
    "imageUrls": [
      "/postgraduate-school-1.jpg"
    ],
    "searchAliases": [
      "postgraduate",
      "pg",
      "research",
      "admin",
      "school"
    ],
    "nearbyLandmarks": [
      "LASU ICT Centre",
      "LASU Sport Centre",
      "MBA Bus Stop"
    ]
  },
  {
    "id": "16",
    "name": "MBA Hall",
    "description": "MBA Complex at LASU Ojo. Located in the Science Shops area of the campus. Gives its name to the nearby MBA Bus Stop. Houses postgraduate management and business administration programmes.",
    "category": "Building",
    "latitude": 6.468590759870086,
    "longitude": 3.2004878907995575,
    "imageUrl": "/mba-complex.png",
    "tags": [
      "mba",
      "business",
      "postgraduate",
      "management",
      "complex"
    ],
    "imageUrls": [
      "/mba-complex.png",
      "/mba-complex-2.jpg"
    ],
    "searchAliases": [
      "mba",
      "business",
      "postgraduate",
      "management",
      "complex"
    ],
    "nearbyLandmarks": [
      "Faculty of Education"
    ]
  },
  {
    "id": "17",
    "name": "Kena's Kitchen",
    "description": "AJ Complex within LASU campus. Houses shops, food vendors (including Kena's Kitchen, Shop A3), and services for the university community.",
    "category": "Building",
    "latitude": 6.4698342310347,
    "longitude": 3.2013090988940482,
    "imageUrl": "https://picsum.photos/seed/lasu-aj-complex/800/600",
    "tags": [
      "complex"
    ],
    "searchAliases": [
      "complex"
    ],
    "nearbyLandmarks": [
      "Exams and Records Office (Postgraduate)",
      "Kena's Kitchen (AJ Complex)"
    ]
  },
  {
    "id": "18",
    "name": "LASU Open and Distance Learning and Research Institute (ODLRI)",
    "description": "Institute managing online, open, and distance learning programmes at LASU. Located along Lagos-Badagry Expressway internal road. Open Monday–Friday 9 AM–4 PM.",
    "category": "Administrative",
    "latitude": 6.4748,
    "longitude": 3.2001,
    "imageUrl": "/odlri.png",
    "tags": [
      "lasu",
      "open",
      "and",
      "distance",
      "learning",
      "and",
      "research",
      "institute",
      "odlri"
    ],
    "searchAliases": [
      "lasu",
      "open",
      "and",
      "distance",
      "learning",
      "research",
      "institute",
      "odlri"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "19",
    "name": "Centre for Entrepreneurship Studies",
    "description": "LASU Centre for Entrepreneurship Studies. Located near the School of Transport on Ogunleye Street. Fully accessibility-compliant building with multiple halls, offices, and good parking. Has hosted major academic conferences. Contact: +234 803 311 0158.",
    "category": "Building",
    "latitude": 6.474,
    "longitude": 3.1984,
    "imageUrl": "/entrepreneurship-centre.png",
    "tags": [
      "centre",
      "for",
      "entrepreneurship",
      "studies"
    ],
    "searchAliases": [
      "centre",
      "for",
      "entrepreneurship",
      "studies"
    ],
    "nearbyLandmarks": [
      "School of Transport and Logistics"
    ]
  },
  {
    "id": "20",
    "name": "Africa Centre of Excellence for Innovative and Transformative STEM Education (ACEITSE)",
    "description": "Africa Centre of Excellence for Innovative and Transformative STEM Education, located on FMS Pathway, LASU Ojo. Open Monday–Friday 8 AM–4 PM.",
    "category": "Building",
    "latitude": 6.4759,
    "longitude": 3.1989,
    "imageUrl": "/aceitse.jpg",
    "tags": [
      "africa",
      "centre",
      "excellence",
      "for",
      "innovative",
      "and",
      "transformative",
      "stem",
      "education",
      "aceitse"
    ],
    "imageUrls": [
      "/aceitse.jpg"
    ],
    "searchAliases": [
      "africa",
      "centre",
      "excellence",
      "for",
      "innovative",
      "and",
      "transformative",
      "stem",
      "education",
      "aceitse"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "21",
    "name": "Exams and Records Office (Postgraduate)",
    "description": "Postgraduate Exams and Records office located inside the Postgraduate School complex, LASU Ojo. Open Monday–Friday 9 AM–6 PM, Saturday 9 AM–4 AM.",
    "category": "Administrative",
    "latitude": 6.47,
    "longitude": 3.2013,
    "imageUrl": "https://picsum.photos/seed/lasu-exams-and-records-office-postgraduate/800/600",
    "tags": [
      "exams",
      "and",
      "records",
      "office",
      "postgraduate"
    ],
    "searchAliases": [
      "exams",
      "and",
      "records",
      "office",
      "postgraduate"
    ],
    "nearbyLandmarks": [
      "AJ Complex",
      "Kena's Kitchen (AJ Complex)"
    ]
  },
  {
    "id": "22",
    "name": "LASU ICT Centre",
    "description": "Information and Communication Technology Centre (ICTC) of LASU. Located near MBA Bus Stop. Provides ICT services and online/distance learning support. Contact: +234 813 930 9402.",
    "category": "Administrative",
    "latitude": 6.468994533150156,
    "longitude": 3.2019330207536485,
    "imageUrl": "/ict-centre-1.jpg",
    "tags": [
      "ict",
      "computer",
      "technology",
      "internet",
      "cbt",
      "portal"
    ],
    "imageUrls": [
      "/ict-centre-1.jpg",
      "/ict-centre-2.jpg"
    ],
    "searchAliases": [
      "ict",
      "computer",
      "technology",
      "internet",
      "cbt",
      "portal",
      "lasu",
      "centre"
    ],
    "nearbyLandmarks": [
      "Postgraduate School",
      "MBA Bus Stop"
    ]
  },
  {
    "id": "23",
    "name": "Lagos State University Radio",
    "description": "Campus radio station broadcasting at 95.7 FM. Founded 2016. Inside LASU campus along Lagos-Badagry Expressway. Fully equipped studios. Open Monday–Friday 8 AM–5 PM.",
    "category": "Administrative",
    "latitude": 6.471199252490675,
    "longitude": 3.200082345317681,
    "imageUrl": "/lasu-radio.jpg",
    "tags": [
      "radio",
      "broadcast",
      "media",
      "news"
    ],
    "imageUrls": [
      "/lasu-radio.jpg"
    ],
    "searchAliases": [
      "radio",
      "broadcast",
      "media",
      "news",
      "lasu",
      "station"
    ],
    "nearbyLandmarks": [
      "Babatunde Raji Fashola Senate House",
      "Babajide Olusola Sanwo-Olu Library Complex",
      "LASU Student Affairs Building",
      "LASU Registry / Registrar's Office",
      "Vice-Chancellor's Office",
      "Senate Building Junction"
    ]
  },
  {
    "id": "24",
    "name": "University Press",
    "description": "University Press and publications centre of LASU Ojo. Handles official printing and publications for the university. Open Monday–Friday 8 AM–4 PM. Gives its name to the nearby LASU Press Bus Stop.",
    "category": "Administrative",
    "latitude": 6.46614796791818,
    "longitude": 3.201916098017867,
    "imageUrl": "/lasu-press-centre.png",
    "tags": [
      "lasu",
      "press",
      "centre"
    ],
    "searchAliases": [
      "lasu",
      "press",
      "centre"
    ],
    "nearbyLandmarks": [
      "LASU Health Centre"
    ]
  },
  {
    "id": "25",
    "name": "Buba Marwa Auditorium",
    "description": "Main auditorium for large convocations and academic/social events. Wheelchair-accessible with spacious secured parking.",
    "category": "Lecture Theatre",
    "latitude": 6.473341458279467,
    "longitude": 3.200822178604921,
    "imageUrl": "/auditorium-1.jpg",
    "tags": [
      "events",
      "hall",
      "convocation",
      "auditorium"
    ],
    "imageUrls": [
      "/auditorium-1.jpg",
      "/auditorium-2.jpg"
    ],
    "searchAliases": [
      "events",
      "hall",
      "convocation",
      "auditorium",
      "lasu",
      "main"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "26",
    "name": "Babajide Olusola Sanwo-Olu Library Complex",
    "description": "The Babajide Olusola Sanwo-Olu Library Complex is the main university library at Lagos State University, Ojo Campus. It is a modern academic library that provides reading areas, study spaces, digital library services, seminar rooms, and administrative offices. It is one of the major academic landmarks on the LASU Ojo campus.",
    "category": "Library",
    "latitude": 6.4716,
    "longitude": 3.2002,
    "imageUrl": "/sanwo-olu-library.png",
    "imageUrls": [
      "/sanwo-olu-library.png"
    ],
    "tags": [
      "library",
      "lasu library",
      "new library",
      "babajide",
      "olusola",
      "sanwo-olu",
      "complex",
      "reading room",
      "study area"
    ],
    "searchAliases": [
      "library",
      "lasu library",
      "new library",
      "babajide olusola sanwo-olu library complex",
      "library complex",
      "central library",
      "reading room",
      "study area",
      "sanwo-olu",
      "sanwoolu",
      "sanwo olu",
      "olusola"
    ],
    "nearbyLandmarks": [
      "Babatunde Raji Fashola Senate House",
      "School of Communication (LASUSOC)",
      "LASU Radio Station (95.7 FM)",
      "LASU Student Affairs Building",
      "LASU Registry / Registrar's Office",
      "Vice-Chancellor's Office"
    ]
  },
  {
    "id": "27",
    "name": "LASU Health Centre",
    "description": "University Health Centre providing primary healthcare to students and staff of LASU Ojo campus.",
    "category": "Administrative",
    "latitude": 6.465747640060314,
    "longitude": 3.202199698773363,
    "imageUrl": "/health-centre.jpg",
    "tags": [
      "medical",
      "health",
      "clinic",
      "hospital"
    ],
    "imageUrls": [
      "/health-centre.jpg"
    ],
    "searchAliases": [
      "medical",
      "health",
      "clinic",
      "hospital",
      "lasu",
      "centre"
    ],
    "nearbyLandmarks": [
      "LASU Press Centre"
    ]
  },
  {
    "id": "28",
    "name": "LASU Central Mosque",
    "description": "Central Mosque of LASU Ojo campus. Open 24 hours. Serves daily and Friday (Jumat) prayers for Muslim students and staff. Houses the Muslim Students' Society (MSS) secretariat. Surrounded by shading trees.",
    "category": "Other",
    "latitude": 6.4656623553050325,
    "longitude": 3.1994209304224164,
    "imageUrl": "/mosque-1.jpg",
    "tags": [
      "mosque",
      "muslim",
      "jumat",
      "prayer",
      "mss",
      "worship",
      "religious"
    ],
    "imageUrls": [
      "/mosque-1.jpg",
      "/mosque-2.jpg",
      "/mosque-3.jpg"
    ],
    "searchAliases": [
      "mosque",
      "muslim",
      "jumat",
      "prayer",
      "mss",
      "worship",
      "religious",
      "lasu",
      "central"
    ],
    "nearbyLandmarks": [
      "Fatiu Ademola Akesode Library (Main Library)",
      "LASU Bookshop",
      "Mosque Walkway Intersection",
      "Library Pedestrian Crossing"
    ]
  },
  {
    "id": "29",
    "name": "LASU Chapel of Light",
    "description": "Christian chapel of LASU Ojo campus. Open 24 hours. Regular services and evangelical activities for Christian students and staff.",
    "category": "Other",
    "latitude": 6.467634561590337,
    "longitude": 3.199388743916421,
    "imageUrl": "/chapel-of-light.jpg",
    "imageUrls": [
      "/chapel-of-light.jpg"
    ],
    "tags": [
      "radio",
      "broadcast",
      "media",
      "news"
    ],
    "searchAliases": [
      "radio",
      "broadcast",
      "media",
      "news",
      "lasu",
      "chapel",
      "light"
    ],
    "nearbyLandmarks": [
      "United Bank for Africa (UBA) LASU Branch"
    ]
  },
  {
    "id": "30",
    "name": "Sports Centre",
    "description": "Main sports complex. Grass football pitch with running track, sand football pitches, volleyball, basketball, and tennis courts. Features the Hussam Okoya-Thomas Sports Hall (indoor) nearby. Open daily 7 AM–5 PM. Contact: +234 703 458 7838.",
    "category": "Sports",
    "latitude": 6.467941043974533,
    "longitude": 3.201677891556921,
    "imageUrl": "/sports-centre-1.png",
    "imageUrls": [
      "/sports-centre-1.png",
      "/sports-centre-2.png"
    ],
    "tags": [
      "sports",
      "centre",
      "complex",
      "football",
      "track"
    ],
    "searchAliases": [
      "sports",
      "centre",
      "complex",
      "football",
      "track",
      "lasu",
      "sport"
    ],
    "nearbyLandmarks": [
      "Faculty of Law",
      "Postgraduate School"
    ]
  },
  {
    "id": "31",
    "name": "Hussam Okoya-Thomas Sports Complex (Indoor Hall)",
    "description": "Indoor sports hall within LASU Ojo campus. Named after Hussam Okoya-Thomas. Accessibility-compliant entrance. Hosts indoor sports including taekwondo classes and other indoor athletic activities.",
    "category": "Sports",
    "latitude": 6.4687,
    "longitude": 3.2038,
    "imageUrl": "https://picsum.photos/seed/lasu-hussam-okoya-thomas-sports-complex-indoor-hall/800/600",
    "tags": [
      "hussam",
      "okoya",
      "thomas",
      "sports",
      "complex",
      "indoor",
      "hall"
    ],
    "searchAliases": [
      "hussam",
      "okoya",
      "thomas",
      "sports",
      "complex",
      "indoor",
      "hall"
    ],
    "nearbyLandmarks": [
      "LASU Sports Complex (Secondary Facility)"
    ]
  },
  {
    "id": "32",
    "name": "LASU Sports Complex (Secondary Facility)",
    "description": "Secondary sports complex on the LASU Ojo campus. Features up-to-date sports equipment in a calm environment.",
    "category": "Sports",
    "latitude": 6.4693,
    "longitude": 3.2037,
    "imageUrl": "https://picsum.photos/seed/lasu-guest/800/600",
    "tags": [
      "accommodation",
      "hotel",
      "visitors"
    ],
    "searchAliases": [
      "accommodation",
      "hotel",
      "visitors",
      "lasu",
      "sports",
      "complex",
      "secondary",
      "facility"
    ],
    "nearbyLandmarks": [
      "Hussam Okoya-Thomas Sports Complex (Indoor Hall)"
    ]
  },
  {
    "id": "33",
    "name": "Amala Extra (Eco Market)",
    "description": "Main on-campus market at LASU Ojo. Houses food canteens, shops, and service vendors including the campus bank arena (Access Bank, UBA, Wema Bank ATM). A central commercial hub for students.",
    "category": "Other",
    "latitude": 6.464462981048976,
    "longitude": 3.2035992985853547,
    "imageUrl": "https://picsum.photos/seed/lasu-vclodge/800/600",
    "tags": [
      "vc",
      "residence",
      "lodge"
    ],
    "searchAliases": [
      "vc",
      "residence",
      "lodge",
      "market"
    ],
    "nearbyLandmarks": [
      "Amala Extra Restaurant",
      "Costain Food Canteen (Faculty of Arts / Eco Market)",
      "Access Bank LASU Campus Branch",
      "Wema Bank ATM (LASU Campus)"
    ]
  },
  {
    "id": "34",
    "name": "Amala Extra Restaurant",
    "description": "Popular food restaurant inside the LASU main campus. Specialises in traditional Yoruba cuisine: amala, ewedu, egusi, and assorted meats. Well-known to both students and lecturers. Open Monday–Friday 8 AM–5 PM.",
    "category": "Other",
    "latitude": 6.4644,
    "longitude": 3.2036,
    "imageUrl": "https://picsum.photos/seed/lasu-amala-extra-restaurant/800/600",
    "tags": [
      "amala",
      "extra",
      "restaurant"
    ],
    "searchAliases": [
      "amala",
      "extra",
      "restaurant"
    ],
    "nearbyLandmarks": [
      "Eco Market",
      "Costain Food Canteen (Faculty of Arts / Eco Market)",
      "Access Bank LASU Campus Branch",
      "Wema Bank ATM (LASU Campus)"
    ]
  },
  {
    "id": "35",
    "name": "Costain Food Canteen (Faculty of Arts / Eco Market)",
    "description": "Food canteen located in the Faculty of Arts area (Shop SS/E23, Eco Market). Contact: +234 907 549 6002.",
    "category": "Other",
    "latitude": 6.4648,
    "longitude": 3.2037,
    "imageUrl": "https://picsum.photos/seed/lasu-costain-food-canteen-faculty-of-arts-eco-market/800/600",
    "tags": [
      "costain",
      "food",
      "canteen",
      "faculty",
      "arts",
      "eco",
      "market"
    ],
    "searchAliases": [
      "costain",
      "food",
      "canteen",
      "faculty",
      "arts",
      "eco",
      "market"
    ],
    "nearbyLandmarks": [
      "Eco Market",
      "Amala Extra Restaurant",
      "Access Bank LASU Campus Branch",
      "Wema Bank ATM (LASU Campus)"
    ]
  },
  {
    "id": "36",
    "name": "Olaiya Staff Food Canteen",
    "description": "Staff food canteen near the LASU Senior Staff Club. Open Monday–Saturday. Contact: +234 915 384 5108.",
    "category": "Other",
    "latitude": 6.4691,
    "longitude": 3.1987,
    "imageUrl": "https://picsum.photos/seed/lasu-worship/800/600",
    "tags": [
      "mosque",
      "chapel",
      "worship",
      "religion"
    ],
    "searchAliases": [
      "mosque",
      "chapel",
      "worship",
      "religion",
      "olaiya",
      "staff",
      "food",
      "canteen"
    ],
    "nearbyLandmarks": [
      "LASU Senior Staff Club"
    ]
  },
  {
    "id": "37",
    "name": "Kena's Kitchen (AJ Complex)",
    "description": "Food vendor located in Shop A3, AJ Complex, Lagos State University campus.",
    "category": "Other",
    "latitude": 6.4698,
    "longitude": 3.2012,
    "imageUrl": "https://picsum.photos/seed/lasu-kena-s-kitchen-aj-complex/800/600",
    "tags": [
      "kena",
      "kitchen",
      "complex"
    ],
    "searchAliases": [
      "kena",
      "kitchen",
      "complex"
    ],
    "nearbyLandmarks": [
      "AJ Complex",
      "Exams and Records Office (Postgraduate)"
    ]
  },
  {
    "id": "38",
    "name": "Access Bank",
    "description": "Access Bank Plc branch on the LASU Ojo campus, in the campus bank arena near Eco Market. Contact: +234 27120057.",
    "category": "Administrative",
    "latitude": 6.4646709189691,
    "longitude": 3.203433514836525,
    "imageUrl": "https://picsum.photos/seed/lasu-cbt/800/600",
    "tags": [
      "cbt",
      "exam",
      "computer",
      "testing",
      "library"
    ],
    "searchAliases": [
      "cbt",
      "exam",
      "computer",
      "testing",
      "library",
      "access",
      "bank",
      "lasu",
      "campus",
      "branch"
    ],
    "nearbyLandmarks": [
      "Eco Market",
      "Amala Extra Restaurant",
      "Costain Food Canteen (Faculty of Arts / Eco Market)",
      "Wema Bank ATM (LASU Campus)"
    ]
  },
  {
    "id": "39",
    "name": "ATM (WEMA Bank)",
    "description": "Wema Bank ATM located within the LASU campus bank area near Eco Market. Open 24 hours. Contact: +234 12779883.",
    "category": "Administrative",
    "latitude": 6.4741882,
    "longitude": 3.1997335,
    "imageUrl": "https://picsum.photos/seed/lasu-pg/800/600",
    "tags": [
      "postgraduate",
      "pg",
      "research",
      "admin"
    ],
    "searchAliases": [
      "postgraduate",
      "pg",
      "research",
      "admin",
      "wema",
      "bank",
      "lasu",
      "campus"
    ],
    "nearbyLandmarks": [
      "Eco Market",
      "Amala Extra Restaurant",
      "Costain Food Canteen (Faculty of Arts / Eco Market)",
      "Access Bank LASU Campus Branch"
    ]
  },
  {
    "id": "40",
    "name": "Wema Bank Branch (LASU)",
    "description": "Wema Bank branch serving LASU community. Open Monday–Friday 8 AM–6 PM. 24-hour ATM. Contact: +234 12779879.",
    "category": "Administrative",
    "latitude": 6.4628,
    "longitude": 3.203,
    "imageUrl": "https://picsum.photos/seed/lasu-security/800/600",
    "tags": [
      "security",
      "safety",
      "police",
      "admin"
    ],
    "searchAliases": [
      "security",
      "safety",
      "police",
      "admin",
      "wema",
      "bank",
      "branch",
      "lasu"
    ],
    "nearbyLandmarks": [
      "LASU Microfinance Bank",
      "LASU Post Office"
    ]
  },
  {
    "id": "41",
    "name": "United Bank for Africa (UBA) LASU Branch",
    "description": "UBA branch inside LASU campus bank arena, opposite Access Bank near Eco Market. Open Monday–Friday 8 AM–4 PM. Contact: +234 700 225 5822.",
    "category": "Administrative",
    "latitude": 6.4678,
    "longitude": 3.1988,
    "imageUrl": "https://picsum.photos/seed/lasu-bursary/800/600",
    "tags": [
      "bursary",
      "finance",
      "admin",
      "fees"
    ],
    "searchAliases": [
      "bursary",
      "finance",
      "admin",
      "fees",
      "united",
      "bank",
      "africa",
      "lasu",
      "branch"
    ],
    "nearbyLandmarks": [
      "Faculty of Education",
      "LASU Chapel of Light"
    ]
  },
  {
    "id": "42",
    "name": "Sterling Bank LASU",
    "description": "Sterling Bank branch on the LASU campus. Contact: +234 14484481.",
    "category": "Administrative",
    "latitude": 6.4632,
    "longitude": 3.2008,
    "imageUrl": "https://picsum.photos/seed/lasu-registry/800/600",
    "tags": [
      "registry",
      "records",
      "admin",
      "admission"
    ],
    "searchAliases": [
      "registry",
      "records",
      "admin",
      "admission",
      "sterling",
      "bank",
      "lasu"
    ],
    "nearbyLandmarks": [
      "LASU Main Bus Station (Alasia Terminal)",
      "LASU Main Gate (Badagry Expressway Entrance)"
    ]
  },
  {
    "id": "43",
    "name": "LASU Microfinance Bank",
    "description": "LASU Microfinance Bank along Lagos-Badagry Expressway on campus. Provides micro-financial services to the university community.",
    "category": "Administrative",
    "latitude": 6.4624,
    "longitude": 3.2029,
    "imageUrl": "https://picsum.photos/seed/lasu-gate2/800/600",
    "tags": [
      "gate",
      "entrance",
      "badagry",
      "exit"
    ],
    "searchAliases": [
      "gate",
      "entrance",
      "badagry",
      "exit",
      "lasu",
      "microfinance",
      "bank"
    ],
    "nearbyLandmarks": [
      "Wema Bank Branch (LASU)"
    ]
  },
  {
    "id": "44",
    "name": "LASU Press Bus Stop",
    "description": "Named bus stop along Lasu Main Road near the LASU Press Centre. Key transit point for campus shuttle buses and commercial vehicles.",
    "category": "Other",
    "latitude": 6.4662,
    "longitude": 3.2009,
    "imageUrl": "/school-of-transport.jpg",
    "tags": [
      "transport",
      "logistics",
      "management",
      "planning",
      "school"
    ],
    "searchAliases": [
      "transport",
      "logistics",
      "management",
      "planning",
      "school",
      "lasu",
      "press",
      "stop"
    ],
    "nearbyLandmarks": [
      "Lagos State University (Main Campus)",
      "LASU Bursary / Finance Department",
      "Faculty of Science Junction",
      "Bursary Junction"
    ]
  },
  {
    "id": "45",
    "name": "Law Bus Stop",
    "description": "Named bus stop adjacent to the Faculty of Law. Drop-off/pick-up point for students and shuttle buses.",
    "category": "Other",
    "latitude": 6.4671,
    "longitude": 3.201,
    "imageUrl": "https://picsum.photos/seed/lasu-media/800/600",
    "tags": [
      "communication",
      "media",
      "mass communication",
      "journalism",
      "broadcasting"
    ],
    "searchAliases": [
      "communication",
      "media",
      "mass communication",
      "journalism",
      "broadcasting",
      "stop"
    ],
    "nearbyLandmarks": [
      "Law Block Pedestrian Crossing"
    ]
  },
  {
    "id": "46",
    "name": "MBA Bus Stop",
    "description": "Named bus stop adjacent to the MBA Complex and Postgraduate School area. A key internal shuttle navigation reference point for students and staff.",
    "category": "Other",
    "latitude": 6.468614322716986,
    "longitude": 3.200750133732416,
    "imageUrl": "https://picsum.photos/seed/lasu-mba-busstop/800/600",
    "tags": [
      "bus",
      "stop",
      "mba",
      "transport",
      "shuttle",
      "internal"
    ],
    "searchAliases": [
      "bus",
      "stop",
      "mba",
      "transport",
      "shuttle",
      "internal"
    ],
    "nearbyLandmarks": [
      "Postgraduate School",
      "LASU ICT Centre"
    ]
  },
  {
    "id": "47",
    "name": "LASU Main Bus Station (Alasia Terminal)",
    "description": "Main transit hub at the LASU campus entrance (Alasia). Primary arrival/departure point for students commuting via commercial buses from Ojo, Badagry Expressway, and surrounding areas.",
    "category": "Other",
    "latitude": 6.4628,
    "longitude": 3.2006,
    "imageUrl": "https://picsum.photos/seed/lasu-innovation/800/600",
    "tags": [
      "innovation",
      "entrepreneurship",
      "centre",
      "awori"
    ],
    "searchAliases": [
      "innovation",
      "entrepreneurship",
      "centre",
      "awori",
      "lasu",
      "main",
      "station",
      "alasia",
      "terminal"
    ],
    "nearbyLandmarks": [
      "Sterling Bank LASU",
      "LASU Main Gate (Badagry Expressway Entrance)"
    ]
  },
  {
    "id": "48",
    "name": "LASUSU Student Arcade",
    "description": "Student Union Government (SUG) buildings housing the student union secretariat and student representative offices.",
    "category": "Administrative",
    "latitude": 6.46593953070712,
    "longitude": 3.20349788784851,
    "imageUrl": "/student-union.jpg",
    "imageUrls": [
      "/student-union.jpg"
    ],
    "tags": [
      "political",
      "science",
      "department",
      "social sciences"
    ],
    "searchAliases": [
      "political",
      "science",
      "department",
      "social sciences",
      "student",
      "union",
      "buildings"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "49",
    "name": "LASU Post Office",
    "description": "NIPOST branch within LASU campus. Provides mail and EMS courier services. Open Monday–Friday 8 AM–4 PM.",
    "category": "Administrative",
    "latitude": 6.4632,
    "longitude": 3.2031,
    "imageUrl": "https://picsum.photos/seed/lasu-physics/800/600",
    "tags": [
      "physics",
      "laboratory",
      "lab",
      "science",
      "research"
    ],
    "searchAliases": [
      "physics",
      "laboratory",
      "lab",
      "science",
      "research",
      "lasu",
      "post",
      "office"
    ],
    "nearbyLandmarks": [
      "Wema Bank Branch (LASU)"
    ]
  },
  {
    "id": "50",
    "name": "LASU Staff School",
    "description": "Primary school for children of LASU staff within the Ojo campus grounds. Open Monday–Friday 7 AM–4 PM. Contact: +234 703 685 2915.",
    "category": "Other",
    "latitude": 6.46601415482787,
    "longitude": 3.19728589219138,
    "imageUrl": "/staff-school-1.jpg",
    "imageUrls": [
      "/staff-school-1.jpg",
      "/staff-school-2.jpg"
    ],
    "tags": [
      "admin",
      "block2",
      "administrative",
      "records",
      "office"
    ],
    "searchAliases": [
      "admin",
      "block2",
      "administrative",
      "records",
      "office",
      "lasu",
      "staff",
      "school",
      "primary"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "51",
    "name": "Lagos State University International School (LASUIS)",
    "description": "LASU International School inside the university campus along Lagos-Badagry Expressway, Ojo. Contact: +234 809 662 3765.",
    "category": "Other",
    "latitude": 6.4801,
    "longitude": 3.1987,
    "imageUrl": "/lasuis.png",
    "tags": [
      "buba",
      "marwa",
      "hall",
      "lecture",
      "events"
    ],
    "searchAliases": [
      "buba",
      "marwa",
      "hall",
      "lecture",
      "events",
      "lagos",
      "state",
      "university",
      "international",
      "school",
      "lasuis"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "52",
    "name": "LASU Car Wash",
    "description": "Car wash facility on the LASU campus on Igbo Elerin Road, close to the Senior Staff Club. Open Monday–Friday 24 hours.",
    "category": "Other",
    "latitude": 6.469765672813498,
    "longitude": 3.200119995745576,
    "imageUrl": "https://picsum.photos/seed/lasu-lasu-car-wash/800/600",
    "tags": [
      "lasu",
      "car",
      "wash"
    ],
    "searchAliases": [
      "lasu",
      "car",
      "wash"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "53",
    "name": "LASU Senior Staff Club",
    "description": "Recreational facility for senior academic and non-academic staff. Located on the campus grounds near the car wash and Olaiya canteen.",
    "category": "Administrative",
    "latitude": 6.4691,
    "longitude": 3.1985,
    "imageUrl": "/senior-staff-club.jpg",
    "imageUrls": [
      "/senior-staff-club.jpg"
    ],
    "tags": [
      "food",
      "cafeteria",
      "restaurant",
      "sub",
      "meals",
      "eat"
    ],
    "searchAliases": [
      "food",
      "cafeteria",
      "restaurant",
      "sub",
      "meals",
      "eat",
      "lasu",
      "senior",
      "staff",
      "club"
    ],
    "nearbyLandmarks": [
      "Olaiya Staff Food Canteen"
    ]
  },
  {
    "id": "54",
    "name": "L.A.S.U Staff Quarters",
    "description": "LASU staff quarters located within Iba Housing Estate (Zone E), Ojo. A gated housing complex for academic and non-academic staff with shared water and power supply. About 2 km from the main campus.",
    "category": "Other",
    "latitude": 6.4911,
    "longitude": 3.1925,
    "imageUrl": "/staff-quarters-1.jpg",
    "imageUrls": [
      "/staff-quarters-1.jpg",
      "/staff-quarters-2.jpg"
    ],
    "tags": [
      "staff",
      "quarters",
      "iba"
    ],
    "searchAliases": [
      "staff",
      "quarters",
      "iba"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "55",
    "name": "LASU Main Gate (Badagry Expressway Entrance)",
    "description": "Primary entrance gate onto Lagos-Badagry Expressway. Main access point for vehicles and pedestrians arriving from Ojo/Lagos. 24-hour security checkpoint.",
    "category": "Other",
    "latitude": 6.463,
    "longitude": 3.2005,
    "imageUrl": "https://picsum.photos/seed/lasu-zenithbank/800/600",
    "tags": [
      "bank",
      "zenith",
      "atm",
      "finance",
      "money"
    ],
    "searchAliases": [
      "bank",
      "zenith",
      "atm",
      "finance",
      "money",
      "lasu",
      "main",
      "gate",
      "badagry",
      "expressway",
      "entrance"
    ],
    "nearbyLandmarks": [
      "Sterling Bank LASU",
      "LASU Main Bus Station (Alasia Terminal)"
    ]
  },
  {
    "id": "56",
    "name": "LASU Back Gate (Isheri Road Entrance)",
    "description": "Secondary entrance via Lasu-Isheri Road. Alternative entry/exit point frequently used by students residing in Igbo-Elerin off-campus areas.",
    "category": "Other",
    "latitude": 6.478,
    "longitude": 3.197,
    "imageUrl": "https://picsum.photos/seed/lasu-ubabank/800/600",
    "tags": [
      "bank",
      "uba",
      "atm",
      "finance",
      "money"
    ],
    "searchAliases": [
      "bank",
      "uba",
      "atm",
      "finance",
      "money",
      "lasu",
      "back",
      "gate",
      "isheri",
      "road",
      "entrance"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "57",
    "name": "LASU TETFund Student Hostel",
    "description": "1,500-bed on-campus student hostel being funded and constructed by TETFund at LASU Ojo. Announced 2025/2026. Exact location within campus to be confirmed upon completion.",
    "category": "Hostel",
    "latitude": 6.4695,
    "longitude": 3.202,
    "imageUrl": "https://picsum.photos/seed/lasu-wemabank/800/600",
    "tags": [
      "bank",
      "wema",
      "atm",
      "finance",
      "money"
    ],
    "searchAliases": [
      "bank",
      "wema",
      "atm",
      "finance",
      "money",
      "lasu",
      "tetfund",
      "student",
      "hostel"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "58",
    "name": "Student Affairs Complex",
    "description": "Handles student welfare, accommodation administration, and student-related services. Located near the Senate House and the Babajide Olusola Sanwo-Olu Library Complex.",
    "category": "Administrative",
    "latitude": 6.470483379775232,
    "longitude": 3.201276583178638,
    "imageUrl": "https://picsum.photos/seed/lasu-staffclub/800/600",
    "tags": [
      "food",
      "restaurant",
      "cafeteria",
      "staff",
      "club",
      "eat",
      "bar"
    ],
    "searchAliases": [
      "food",
      "restaurant",
      "cafeteria",
      "staff",
      "club",
      "eat",
      "bar",
      "lasu",
      "student",
      "affairs",
      "building"
    ],
    "nearbyLandmarks": [
      "Babatunde Raji Fashola Senate House",
      "School of Communication (LASUSOC)",
      "LASU Radio Station (95.7 FM)",
      "Babajide Olusola Sanwo-Olu Library Complex",
      "LASU Registry / Registrar's Office",
      "Vice-Chancellor's Office"
    ]
  },
  {
    "id": "59",
    "name": "LASU Bursary / Finance Department",
    "description": "University Bursary office responsible for school fees, financial transactions and payment administration.",
    "category": "Administrative",
    "latitude": 6.4665,
    "longitude": 3.2005,
    "imageUrl": "https://picsum.photos/seed/lasu-senatepark/800/600",
    "tags": [
      "parking",
      "car",
      "lot",
      "senate",
      "vehicles"
    ],
    "searchAliases": [
      "parking",
      "car",
      "lot",
      "senate",
      "vehicles",
      "lasu",
      "bursary",
      "finance",
      "department"
    ],
    "nearbyLandmarks": [
      "Lagos State University (Main Campus)",
      "Faculty of Science",
      "LASU Press Bus Stop",
      "Faculty of Science Junction",
      "Bursary Junction"
    ]
  },
  {
    "id": "60",
    "name": "LASU Registry / Registrar's Office",
    "description": "The Office of the University Registrar is responsible for student admissions, academic records, examinations, matriculation, graduation processes, and other academic administrative services at Lagos State University.",
    "category": "Administrative",
    "latitude": 6.4715,
    "longitude": 3.2001,
    "imageUrl": "/senate-building.png",
    "tags": [
      "registry",
      "registrar",
      "administration",
      "admissions",
      "student records",
      "academic affairs",
      "examinations",
      "matriculation",
      "graduation",
      "office"
    ],
    "searchAliases": [
      "registry",
      "registrar",
      "registrar office",
      "registry office",
      "admissions office",
      "student records",
      "academic affairs",
      "admin office",
      "administration",
      "lasu registry"
    ],
    "nearbyLandmarks": [
      "Babatunde Raji Fashola Senate House",
      "LASU Radio Station (95.7 FM)",
      "Babajide Olusola Sanwo-Olu Library Complex",
      "LASU Student Affairs Building",
      "Vice-Chancellor's Office"
    ]
  },
  {
    "id": "61",
    "name": "Vice-Chancellor's Office",
    "description": "Office of the Vice-Chancellor of LASU, within the Senate House complex. Executive head of the university appointed by the Governor of Lagos State.",
    "category": "Administrative",
    "latitude": 6.4716,
    "longitude": 3.2,
    "imageUrl": "/senate-building.png",
    "tags": [
      "vc",
      "vice",
      "chancellor",
      "office",
      "senate",
      "admin"
    ],
    "searchAliases": [
      "vc",
      "vice",
      "chancellor",
      "office",
      "senate",
      "admin"
    ],
    "nearbyLandmarks": [
      "Babatunde Raji Fashola Senate House",
      "School of Communication (LASUSOC)",
      "LASU Radio Station (95.7 FM)",
      "Babajide Olusola Sanwo-Olu Library Complex",
      "LASU Student Affairs Building",
      "LASU Registry / Registrar's Office"
    ]
  },
  {
    "id": "62",
    "name": "LASU Works and Services Department",
    "description": "University department responsible for maintenance of buildings, roads, and infrastructure on the Ojo campus. Original site of the university before relocation. Exact current building coordinates require physical verification.",
    "category": "Administrative",
    "latitude": 6.466,
    "longitude": 3.199,
    "imageUrl": "https://picsum.photos/seed/lasu-lasu-works-and-services-department/800/600",
    "tags": [
      "lasu",
      "works",
      "and",
      "services",
      "department"
    ],
    "searchAliases": [
      "lasu",
      "works",
      "and",
      "services",
      "department"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "63",
    "name": "Main Gate Junction",
    "description": "Key junction right inside the LASU Main Gate connecting the Badagry Expressway entrance to the Law and Bus Station pathways.",
    "category": "Other",
    "latitude": 6.4645,
    "longitude": 3.2005,
    "imageUrl": "https://picsum.photos/seed/lasu-maingate-junc/800/600",
    "tags": [
      "gate",
      "junction",
      "main",
      "entrance"
    ],
    "searchAliases": [
      "gate",
      "junction",
      "main",
      "entrance"
    ],
    "nearbyLandmarks": [
      "Senate Chambers",
      "Fatiu Ademola Akesode Library (Main Library)",
      "Taslim Olawale Elias Law Library",
      "LASU Bookshop",
      "Library Pedestrian Crossing"
    ]
  },
  {
    "id": "64",
    "name": "Mosque Walkway Intersection",
    "description": "Intersection along the main campus walkway branching off to the LASU Central Mosque and the Fatiu Ademola Akesode Library.",
    "category": "Other",
    "latitude": 6.4654,
    "longitude": 3.2005,
    "imageUrl": "https://picsum.photos/seed/lasu-mosque-junc/800/600",
    "tags": [
      "mosque",
      "walkway",
      "intersection",
      "library"
    ],
    "searchAliases": [
      "mosque",
      "walkway",
      "intersection",
      "library"
    ],
    "nearbyLandmarks": [
      "Senate Chambers",
      "Fatiu Ademola Akesode Library (Main Library)",
      "LASU Bookshop",
      "LASU Central Mosque",
      "Library Pedestrian Crossing"
    ]
  },
  {
    "id": "65",
    "name": "Faculty of Science Junction",
    "description": "Junction on the main walkway adjacent to the Faculty of Science, leading to the LASU Bursary and the Sport Centre.",
    "category": "Other",
    "latitude": 6.4664,
    "longitude": 3.2005,
    "imageUrl": "https://picsum.photos/seed/lasu-science-junc/800/600",
    "tags": [
      "science",
      "junction",
      "walkway"
    ],
    "searchAliases": [
      "science",
      "junction",
      "walkway",
      "faculty"
    ],
    "nearbyLandmarks": [
      "Lagos State University (Main Campus)",
      "Faculty of Science",
      "LASU Press Bus Stop",
      "LASU Bursary / Finance Department",
      "Bursary Junction"
    ]
  },
  {
    "id": "66",
    "name": "Senate Building Junction",
    "description": "Major walkway junction near the Senate House complex, branching to the Faculty of Law, AJ Complex, and MBA Complex.",
    "category": "Other",
    "latitude": 6.4705,
    "longitude": 3.2003,
    "imageUrl": "https://picsum.photos/seed/lasu-senate-junc/800/600",
    "tags": [
      "senate",
      "junction",
      "building"
    ],
    "searchAliases": [
      "senate",
      "junction",
      "building"
    ],
    "nearbyLandmarks": [
      "LASU Radio Station (95.7 FM)"
    ]
  },
  {
    "id": "80",
    "name": "Bursary Junction",
    "description": "Named road junction near the LASU Bursary and Faculty of Science, connecting the central walkway to the administrative department.",
    "category": "Other",
    "latitude": 6.4665,
    "longitude": 3.2005,
    "imageUrl": "https://picsum.photos/seed/lasu-bursary-junc/800/600",
    "tags": [
      "bursary",
      "junction",
      "finance"
    ],
    "searchAliases": [
      "bursary",
      "junction",
      "finance"
    ],
    "nearbyLandmarks": [
      "Lagos State University (Main Campus)",
      "Faculty of Science",
      "LASU Press Bus Stop",
      "LASU Bursary / Finance Department",
      "Faculty of Science Junction"
    ]
  },
  {
    "id": "83",
    "name": "Library Pedestrian Crossing",
    "description": "Main pedestrian crossing on the main road segment leading to the Fatiu Ademola Akesode Library walkway.",
    "category": "Other",
    "latitude": 6.465,
    "longitude": 3.2005,
    "imageUrl": "https://picsum.photos/seed/lasu-lib-cross/800/600",
    "tags": [
      "library",
      "crossing",
      "zebra"
    ],
    "searchAliases": [
      "library",
      "crossing",
      "zebra",
      "pedestrian"
    ],
    "nearbyLandmarks": [
      "Senate Chambers",
      "Fatiu Ademola Akesode Library (Main Library)",
      "LASU Bookshop",
      "LASU Central Mosque",
      "Main Gate Junction",
      "Mosque Walkway Intersection"
    ]
  },
  {
    "id": "84",
    "name": "Law Block Pedestrian Crossing",
    "description": "Pedestrian crossing along the main campus road adjacent to the Faculty of Law Block.",
    "category": "Other",
    "latitude": 6.4674,
    "longitude": 3.2005,
    "imageUrl": "https://picsum.photos/seed/lasu-law-cross/800/600",
    "tags": [
      "law",
      "crossing",
      "block"
    ],
    "searchAliases": [
      "law",
      "crossing",
      "block",
      "pedestrian"
    ],
    "nearbyLandmarks": [
      "Law Bus Stop"
    ]
  },
  {
    "id": "120",
    "name": "Science Library",
    "description": "Library serving the Faculty of Science",
    "category": "Library",
    "latitude": 6.464563388498464,
    "longitude": 3.1996374457202577,
    "imageUrl": "",
    "tags": [
      "science",
      "library"
    ],
    "searchAliases": [
      "science",
      "library"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "121",
    "name": "Zenith Bank",
    "description": "Zenith Bank branch on campus",
    "category": "Building",
    "latitude": 6.463882032753872,
    "longitude": 3.2040128719444443,
    "imageUrl": "",
    "tags": [
      "zenith",
      "bank"
    ],
    "searchAliases": [
      "zenith",
      "bank"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "122",
    "name": "Moot Court",
    "description": "Moot court facility within the Faculty of Law",
    "category": "Sports",
    "latitude": 6.467728343450508,
    "longitude": 3.201202651276919,
    "imageUrl": "",
    "tags": [
      "moot",
      "court"
    ],
    "searchAliases": [
      "moot",
      "court"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "123",
    "name": "Department of International and Islamic Law",
    "description": "Department offering international and Islamic law programmes",
    "category": "Building",
    "latitude": 6.467217104718152,
    "longitude": 3.201502171387113,
    "imageUrl": "",
    "tags": [
      "department",
      "international",
      "islamic",
      "law"
    ],
    "searchAliases": [
      "department",
      "international",
      "islamic",
      "law"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "124",
    "name": "Department of Philosophy",
    "description": "Department of Philosophy within the Faculty of Arts",
    "category": "Building",
    "latitude": 6.473175502500556,
    "longitude": 3.2004073393023633,
    "imageUrl": "",
    "tags": [
      "department",
      "philosophy"
    ],
    "searchAliases": [
      "department",
      "philosophy"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "125",
    "name": "LASU CBT Centre",
    "description": "Computer-based testing centre for exams and assessments",
    "category": "Building",
    "latitude": 6.475146934481338,
    "longitude": 3.2015570512444502,
    "imageUrl": "",
    "tags": [
      "cbt",
      "centre"
    ],
    "searchAliases": [
      "cbt",
      "centre"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "126",
    "name": "FMS Shuttle Park",
    "description": "Shuttle pickup and drop-off point near School of Transport",
    "category": "Building",
    "latitude": 6.474570863424578,
    "longitude": 3.1992912188474905,
    "imageUrl": "",
    "tags": [
      "fms",
      "shuttle",
      "park"
    ],
    "searchAliases": [
      "fms",
      "shuttle",
      "park"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "127",
    "name": "LASU International School",
    "description": "Secondary school located within the university campus",
    "category": "Building",
    "latitude": 6.48044246920321,
    "longitude": 3.197089425334433,
    "imageUrl": "",
    "tags": [
      "international",
      "school"
    ],
    "searchAliases": [
      "international",
      "school"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "128",
    "name": "Gbolahan Elias Hall",
    "description": "Multipurpose hall used for lectures and events",
    "category": "Lecture Theatre",
    "latitude": 6.4769104085997276,
    "longitude": 3.1994430311932183,
    "imageUrl": "",
    "tags": [
      "gbolahan",
      "elias",
      "hall"
    ],
    "searchAliases": [
      "gbolahan",
      "elias",
      "hall"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "129",
    "name": "Department of History and International Relations",
    "description": "Department offering history and international relations programmes",
    "category": "Building",
    "latitude": 6.47327146011797,
    "longitude": 3.1997040732631596,
    "imageUrl": "",
    "tags": [
      "department",
      "history",
      "international",
      "relations"
    ],
    "searchAliases": [
      "department",
      "history",
      "international",
      "relations"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "130",
    "name": "Innovation Hub",
    "description": "Event and innovation space for student and external programmes",
    "category": "Administrative",
    "latitude": 6.465547880153592,
    "longitude": 3.2005384188095283,
    "imageUrl": "",
    "tags": [
      "innovation",
      "hub"
    ],
    "searchAliases": [
      "innovation",
      "hub"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "131",
    "name": "Department of Theatre Arts and Music",
    "description": "Department offering theatre, performing arts and music programmes",
    "category": "Lecture Theatre",
    "latitude": 6.464678991995442,
    "longitude": 3.200726927736389,
    "imageUrl": "",
    "tags": [
      "department",
      "theatre",
      "arts",
      "music"
    ],
    "searchAliases": [
      "department",
      "theatre",
      "arts",
      "music"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "132",
    "name": "Faculty of Arts Munch It Stand",
    "description": "Popular food stand located in the Faculty of Arts area",
    "category": "Building",
    "latitude": 6.464102547918738,
    "longitude": 3.2020920021656263,
    "imageUrl": "",
    "tags": [
      "faculty",
      "arts",
      "munch",
      "it",
      "stand"
    ],
    "searchAliases": [
      "faculty",
      "arts",
      "munch",
      "it",
      "stand"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "133",
    "name": "Pavilion / Quadrangle",
    "description": "Open relaxation and gathering space in the Faculty of Education area",
    "category": "Administrative",
    "latitude": 6.465124989116374,
    "longitude": 3.202393233191559,
    "imageUrl": "",
    "tags": [
      "pavilion",
      "quadrangle"
    ],
    "searchAliases": [
      "pavilion",
      "quadrangle"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "134",
    "name": "Iya Dayo Restaurant (Eco Market)",
    "description": "Well-known restaurant in the Eco Market food zone",
    "category": "Building",
    "latitude": 6.464173721914673,
    "longitude": 3.2036483620601244,
    "imageUrl": "",
    "tags": [
      "iya",
      "dayo",
      "restaurant",
      "eco",
      "market"
    ],
    "searchAliases": [
      "iya",
      "dayo",
      "restaurant",
      "eco",
      "market"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "135",
    "name": "Centre for Planning Studies",
    "description": "Faculty offering urban and regional planning programmes",
    "category": "Building",
    "latitude": 6.464600166744562,
    "longitude": 3.2029082966705356,
    "imageUrl": "",
    "tags": [
      "centre",
      "planning",
      "studies"
    ],
    "searchAliases": [
      "centre",
      "planning",
      "studies"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "136",
    "name": "Abe Igi",
    "description": "Iconic relaxation spot under the trees in the Faculty of Arts",
    "category": "Administrative",
    "latitude": 6.4638801145689015,
    "longitude": 3.201351900855808,
    "imageUrl": "",
    "tags": [
      "abe",
      "igi"
    ],
    "searchAliases": [
      "abe",
      "igi"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "137",
    "name": "Football Pitch",
    "description": "Main football field within the Sports Centre complex",
    "category": "Sports",
    "latitude": 6.467987173640815,
    "longitude": 3.2032192255159466,
    "imageUrl": "",
    "tags": [
      "football",
      "pitch"
    ],
    "searchAliases": [
      "football",
      "pitch"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "138",
    "name": "Flavours Canteen",
    "description": "Restaurant adjacent to the Postgraduate School building",
    "category": "Building",
    "latitude": 6.46811370076866,
    "longitude": 3.201509812364915,
    "imageUrl": "",
    "tags": [
      "flavours",
      "canteen"
    ],
    "searchAliases": [
      "flavours",
      "canteen"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "139",
    "name": "S.L. Edu Lecture Hall",
    "description": "Large lecture hall in the Faculty of Science used for classes and events",
    "category": "Lecture Theatre",
    "latitude": 6.468071058592406,
    "longitude": 3.1999836355389606,
    "imageUrl": "",
    "tags": [
      "s",
      "l",
      "edu",
      "lecture",
      "hall"
    ],
    "searchAliases": [
      "s",
      "l",
      "edu",
      "lecture",
      "hall"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "140",
    "name": "Science Market",
    "description": "Campus market in the Faculty of Science for stationery and materials",
    "category": "Building",
    "latitude": 6.4682736088931945,
    "longitude": 3.19935768837566,
    "imageUrl": "",
    "tags": [
      "science",
      "market"
    ],
    "searchAliases": [
      "science",
      "market"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "141",
    "name": "AJ Bus Stop",
    "description": "Popular campus bus stop opposite Love Garden",
    "category": "Administrative",
    "latitude": 6.469642683201162,
    "longitude": 3.200909505018672,
    "imageUrl": "",
    "tags": [
      "aj",
      "bus",
      "stop"
    ],
    "searchAliases": [
      "aj",
      "bus",
      "stop"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "142",
    "name": "Faculty of Computing",
    "description": "The new Faculty of Computing and Information Technologies",
    "category": "Building",
    "latitude": 6.4735945,
    "longitude": 3.1999947,
    "imageUrl": "",
    "tags": [
      "faculty",
      "computing"
    ],
    "searchAliases": [
      "faculty",
      "computing"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "143",
    "name": "Road to School of Transportation",
    "description": "The Junction opposite CBT centre that leads to school of transportation",
    "category": "Sports",
    "latitude": 6.4742798,
    "longitude": 3.1999062,
    "imageUrl": "",
    "tags": [
      "road",
      "school",
      "transportation"
    ],
    "searchAliases": [
      "road",
      "school",
      "transportation"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "144",
    "name": "femi-gbajabiamila-conference-center",
    "description": "Femi Gbajabiamila Conference Center for events",
    "category": "Administrative",
    "latitude": 6.4742105,
    "longitude": 3.1994831,
    "imageUrl": "",
    "tags": [
      "femi",
      "gbajabiamila",
      "conference",
      "center"
    ],
    "searchAliases": [
      "femi",
      "gbajabiamila",
      "conference",
      "center"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "145",
    "name": "Laundromat",
    "description": "On-campus laundry facility",
    "category": "Building",
    "latitude": 6.4741755,
    "longitude": 3.1992631,
    "imageUrl": "",
    "tags": [
      "laundromat"
    ],
    "searchAliases": [
      "laundromat"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "146",
    "name": "ENT Building",
    "description": "The building for Enterpreneurship activities",
    "category": "Building",
    "latitude": 6.4735732,
    "longitude": 3.197687,
    "imageUrl": "",
    "tags": [
      "ent",
      "building"
    ],
    "searchAliases": [
      "ent",
      "building"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "147",
    "name": "FSS Market",
    "description": "Food market serving the Faculty of Social Sciences area",
    "category": "Building",
    "latitude": 6.4745766,
    "longitude": 3.1984595,
    "imageUrl": "",
    "tags": [
      "fss",
      "market"
    ],
    "searchAliases": [
      "fss",
      "market"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "148",
    "name": "STEM Education Laboratory",
    "description": "",
    "category": "Building",
    "latitude": 6.4763792,
    "longitude": 3.1991545,
    "imageUrl": "",
    "tags": [
      "stem",
      "education",
      "laboratory"
    ],
    "searchAliases": [
      "stem",
      "education",
      "laboratory"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "149",
    "name": "FMS Market",
    "description": "Food market serving the Faculty of Management Sciences area",
    "category": "Building",
    "latitude": 6.4748851,
    "longitude": 3.2003843,
    "imageUrl": "",
    "tags": [
      "fms",
      "market"
    ],
    "searchAliases": [
      "fms",
      "market"
    ],
    "nearbyLandmarks": []
  },
  {
    "id": "150",
    "name": "ATM (Providus Bank)",
    "description": "Providus Bank ATM on campus",
    "category": "Building",
    "latitude": 6.4747362,
    "longitude": 3.2011196,
    "imageUrl": "",
    "tags": [
      "atm",
      "providus",
      "bank"
    ],
    "searchAliases": [
      "atm",
      "providus",
      "bank"
    ],
    "nearbyLandmarks": []
  }
];


const findMatchingInitialPoi = (id: string, name: string): POI | undefined => {
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

const overridePoiData = (poisList: POI[]): POI[] => {
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

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}



function AppContent() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [session, setSession] = useState<{
    firstVisit: boolean;
    lastScreen: string;
    lastDestination: string;
  } | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    // Always remove stale dark mode preference - light theme is now the default
    localStorage.removeItem('lasu_navigator_dark_mode');
    document.documentElement.classList.remove('dark');
  }, []);

  const [pois, setPois] = useState<POI[]>(() => {
    localStorage.removeItem('poi_data');
    localStorage.removeItem('poi_data_v4');
    localStorage.removeItem('poi_data_v5');
    localStorage.removeItem('poi_data_v10');
    
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
          return overridePoiData(merged);
        }
      } catch (e) {
        console.warn("Failed to parse cached POIs:", e);
      }
    }
    return overridePoiData(INITIAL_POIS);
  });
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [routingTo, setRoutingTo] = useState<any | null>(null);
  const [routingFrom, setRoutingFrom] = useState<any | null>(null);
  const [startSearchQuery, setStartSearchQuery] = useState("My Location");
  const [endSearchQuery, setEndSearchQuery] = useState("");
  const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userHeading, setUserHeading] = useState<number | null>(null);

  useEffect(() => {
    setStartSearchQuery(routingFrom ? routingFrom.name : "My Location");
  }, [routingFrom]);

  useEffect(() => {
    setEndSearchQuery(routingTo ? routingTo.name : "My Location");
  }, [routingTo]);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [followMe, setFollowMe] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('peek');
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isRouteHighlighted, setIsRouteHighlighted] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>('voyager');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; coordinates: any[]; segmentsCount: number; instructions: any[] } | null>(null);
  const [focusedCoordinate, setFocusedCoordinate] = useState<[number, number] | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccuracyWarning, setShowAccuracyWarning] = useState(false);
  const [isRouteBlocked, setIsRouteBlocked] = useState(false);
  const [isUserOffCampus, setIsUserOffCampus] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isRouteDrawerExpanded, setIsRouteDrawerExpanded] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [tourMockedRouteActive, setTourMockedRouteActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const latFilter = useRef<KalmanFilter | null>(null);
  const lonFilter = useRef<KalmanFilter | null>(null);
  const userLocationRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  const saveSession = (updates: Partial<{ firstVisit: boolean; lastScreen: string; lastDestination: string }>) => {
    setSession(prev => {
      const next = prev ? { ...prev, ...updates, firstVisit: false } : { firstVisit: false, lastScreen: 'welcome', lastDestination: '', ...updates };
      localStorage.setItem('lasu_navigator_session', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const cachedSession = localStorage.getItem('lasu_navigator_session');
    let currentSession: any = null;
    let isFirstTime = false;
    
    if (cachedSession) {
      try {
        currentSession = JSON.parse(cachedSession);
      } catch (e) {
        console.warn("Failed to parse cached session:", e);
      }
    }
    
    if (!currentSession) {
      isFirstTime = true;
      currentSession = {
        firstVisit: true,
        lastScreen: 'welcome',
        lastDestination: ''
      };
      localStorage.setItem('lasu_navigator_session', JSON.stringify(currentSession));
    }
    
    setSession(currentSession);
    setIsLoading(true);
    
    const delay = isFirstTime ? 2500 : 1500;
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isFirstTime) {
        setShowWelcomeBack(true);
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, []);

  // Sync showWelcome to session lastScreen
  useEffect(() => {
    saveSession({ lastScreen: showWelcome ? 'welcome' : 'map' });
  }, [showWelcome]);

  // Sync routingTo to session lastDestination
  useEffect(() => {
    if (routingTo && routingTo.name) {
      saveSession({ lastDestination: routingTo.name });
    }
  }, [routingTo]);

  const handleContinuePreviousSession = () => {
    if (session?.lastDestination) {
      const matchedPoi = pois.find(p => p.name.toLowerCase() === session.lastDestination.toLowerCase() || p.name.toLowerCase().includes(session.lastDestination.toLowerCase()));
      if (matchedPoi) {
        setRoutingTo(matchedPoi);
        setSelectedPoi(null);
      }
    }
    setShowWelcome(false);
    setShowWelcomeBack(false);
    saveSession({ lastScreen: 'map' });
  };

  // Guided Welcome Tour Transitions & State Coordination
  useEffect(() => {
    if (tourStep === 1) {
      if (window.innerWidth < 1024) {
        setSheetSnap('half');
      }
    } else if (tourStep === 2) {
      setFocusedCoordinate([6.4687, 3.2000]); // Senate Building
      if (window.innerWidth < 1024) {
        setSheetSnap('peek');
      }
    } else if (tourStep === 3) {
      if (window.innerWidth < 1024) {
        setSheetSnap('peek');
      }
    } else if (tourStep === 4) {
      if (!routingTo) {
        const senatePoi = pois.find(p => p.id === '1') || INITIAL_POIS[0];
        setUserLocation([6.4642, 3.1972]); // Main Gate
        setRoutingFrom(null);
        setRoutingTo(senatePoi);
        setIsRouteHighlighted(true);
        setIsRouteDrawerExpanded(false);
        setTourMockedRouteActive(true);
      }
      if (window.innerWidth < 1024) {
        setSheetSnap('peek');
      }
    } else {
      // If we exit Step 4, clean up the mocked route if active
      if (tourMockedRouteActive && tourStep !== 4) {
        setRoutingTo(null);
        setRoutingFrom(null);
        setIsRouteHighlighted(false);
        setTourMockedRouteActive(false);
      }
    }
  }, [tourStep, pois]);

  const [isWalkSimulationActive, setIsWalkSimulationActive] = useState(false);
  const [walkSimulationIndex, setWalkSimulationIndex] = useState(0);
  const walkIntervalRef = useRef<any>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const lastSpokenIndexRef = useRef<number | null>(null);

  const speakInstruction = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("[Speech Event] SpeechSynthesis API not supported in this browser.");
      return;
    }
    if (!isVoiceEnabled || isMuted) {
      console.log("[Speech Event] Speech skipped: voice engine disabled or muted.");
      return;
    }
    
    // Cancel previous speech before speaking a new instruction
    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Query available voices and select a default English voice if found
    const allVoices = window.speechSynthesis.getVoices();
    console.log("[Speech Debug] Available voices:", allVoices.map(v => `${v.name} (${v.lang})`));
    const enVoice = allVoices.find(v => v.lang.startsWith('en')) || allVoices[0];
    if (enVoice) {
      utterance.voice = enVoice;
      console.log("[Speech Debug] Selected Voice:", enVoice.name, `(${enVoice.lang})`);
    }

    utterance.onstart = () => console.log("[Speech Event] Speech started:", text);
    utterance.onend = () => console.log("[Speech Event] Speech ended:", text);
    utterance.onerror = (e) => console.error("[Speech Event] Speech error:", e.error, e);
    
    window.speechSynthesis.speak(utterance);
  };

  const replayCurrentInstruction = () => {
    if (!routeInfo || !routeInfo.instructions || routeInfo.instructions.length === 0 || !routingTo) return;
    const idx = Math.max(0, currentInstructionIndex - 1);
    const step = routeInfo.instructions[idx];
    if (step) {
      const textToSpeak = idx === 0 ? `Starting route to ${routingTo.name}. ${step.text}` : step.text;
      console.log("[Speech Event] Replaying instruction index:", idx, "Text:", textToSpeak);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onstart = () => console.log("[Speech Event] Started speaking replay:", textToSpeak);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleToggleVoice = () => {
    const nextVal = !isVoiceEnabled;
    setIsVoiceEnabled(nextVal);
    if (nextVal) {
      setTimeout(() => {
        speakInstruction("Voice navigation is now active.");
      }, 50);
    }
  };

  // Pre-load voices on component mount to support asynchronous voices loading in Chrome
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("[Speech Debug] Available voices loaded:", voices.map(v => `${v.name} (${v.lang})` + (v.default ? ' [Default]' : '')));
      };
      
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const renderHomePanelContent = (isMobile: boolean = false) => {
    const paddingClass = isMobile ? "p-4 space-y-4 pb-12" : "p-5 space-y-4";
    const brandPadding = isMobile ? "p-4" : "p-5";
    const textSmall = isMobile ? "text-[10px]" : "text-[11px]";

    return (
      <div className={paddingClass}>
        {/* Brand strip */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-zinc-50 border border-zinc-200 shadow-md">
          <p className="text-[9px] font-black text-lasu-secondary uppercase tracking-[0.18em] mb-1">LASU Campus Navigator</p>
          <h2 className="text-base font-black text-lasu-primary leading-tight">Find your way <span className="text-lasu-secondary">around campus</span></h2>
          <p className="text-[10px] text-zinc-700 mt-1.5 font-semibold">Search, navigate & explore all landmarks.</p>
        </div>


        {/* Tips Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-zinc-700 uppercase tracking-wider pl-1">
            Quick Navigation Tips
          </h3>
          <div className="space-y-2.5">
            {[
              { num: '01', icon: 'Tag', title: 'Filter by Category', desc: 'Tap the category filter tags below the search bar to highlight specific building types on the map.' },
              { num: '02', icon: 'Layers', title: 'Change Map Themes', desc: 'Switch between CARTO Voyager and OpenStreetMap views via the Layers button.' },
            ].map((tip) => (
              <div 
                key={tip.num} 
                className="group flex gap-3.5 bg-white border border-zinc-150 rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <div className="shrink-0 w-8.5 h-8.5 rounded-xl bg-orange-50 border border-orange-100/85 text-orange-600 flex items-center justify-center transition-colors group-hover:bg-orange-100/50">
                  {tip.title.includes('Filter') ? '🏷️' : '🥞'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="text-[9px] font-black text-orange-500/60 tabular-nums">{tip.num}</span>
                    <p className="text-[11px] font-black text-zinc-800 leading-tight">{tip.title}</p>
                  </div>
                  <p className="text-[10.5px] text-zinc-700 leading-relaxed font-semibold">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getCoordinatesForPoint = (point: any): [number, number] | null => {
    if (!point) {
      return userLocation ? [Number(userLocation[0]), Number(userLocation[1])] : null;
    }
    const lat = Number(point.latitude);
    const lng = Number(point.longitude);
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
  };

  const startCoordinates = getCoordinatesForPoint(routingFrom);
  const endCoordinates = getCoordinatesForPoint(routingTo);

  const handleSwapRoute = () => {
    const temp = routingFrom;
    setRoutingFrom(routingTo);
    setRoutingTo(temp);
  };

  const handlePoiSelect = useCallback((poi: POI) => {
    setSelectedPoi(poi);
    setRoutingTo(null);
    // Mobile: open bottom sheet; desktop: sidebar handles itself
    if (window.innerWidth < 1024) {
      setSheetSnap('half');
    }
  }, []);

  const handleMapDrag = useCallback(() => {
    setFollowMe(false);
  }, []);

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

  const startCoordinatesKey = startCoordinates ? `${startCoordinates[0]},${startCoordinates[1]}` : '';
  const endCoordinatesKey = endCoordinates ? `${endCoordinates[0]},${endCoordinates[1]}` : '';

  // Calculate shortest path synchronously using local Dijkstra algorithm
  useEffect(() => {
    if (startCoordinates && endCoordinates) {
      try {
        const route = findShortestPath(
          startCoordinates,
          endCoordinates,
          isRouteBlocked
        );
        setRouteInfo(route);
      } catch (err) {
        console.error("Pathfinding error:", err);
        setRouteInfo(null);
      }
    } else {
      setRouteInfo(null);
    }
  }, [startCoordinatesKey, endCoordinatesKey, isRouteBlocked]);

  // Cleanup simulation when routing changes or stops
  useEffect(() => {
    if (!routingTo || !routeInfo) {
      if (walkIntervalRef.current) {
        clearInterval(walkIntervalRef.current);
        walkIntervalRef.current = null;
      }
      setIsWalkSimulationActive(false);
      setWalkSimulationIndex(0);
      setUserHeading(null);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      lastSpokenIndexRef.current = null;
      setRoutingFrom(null);
    }
  }, [routingTo, routeInfo]);

  useEffect(() => {
    return () => {
      if (walkIntervalRef.current) {
        clearInterval(walkIntervalRef.current);
      }
    };
  }, []);

  const handleStartWalkSimulation = () => {
    if (!routeInfo || !routeInfo.coordinates || routeInfo.coordinates.length === 0) return;
    
    setIsSimulated(true); // Enable simulation mode so user's real GPS is ignored
    setIsWalkSimulationActive(true);
    
    // Clear any existing interval first to be safe
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
    }
    
    // Determine where to start/resume from
    let currentIndex = walkSimulationIndex;
    if (currentIndex >= routeInfo.coordinates.length - 1) {
      currentIndex = 0;
      setWalkSimulationIndex(0);
    }
    
    walkIntervalRef.current = setInterval(() => {
      currentIndex++;
      if (currentIndex < routeInfo.coordinates.length) {
        setWalkSimulationIndex(currentIndex);
        const coord = routeInfo.coordinates[currentIndex];
        const prevCoord = routeInfo.coordinates[currentIndex - 1];
        if (prevCoord) {
          const heading = getBearing(prevCoord.lat, prevCoord.lng, coord.lat, coord.lng);
          setUserHeading(heading);
        }
        setUserLocation([coord.lat, coord.lng]);
        setFocusedCoordinate([coord.lat, coord.lng]); // Pan map to user location
      } else {
        // Finished the route!
        if (walkIntervalRef.current) {
          clearInterval(walkIntervalRef.current);
          walkIntervalRef.current = null;
        }
        setIsWalkSimulationActive(false);
        setWalkSimulationIndex(0);
        setUserHeading(null);
        
        // Congratulatory Toast/Alert
        alert(`You have arrived at ${routingTo?.name || 'your destination'}! 🎉`);
        setIsSimulated(false); // Resume real GPS tracking
      }
    }, 350); // smooth stepping
  };

  const handlePauseWalkSimulation = () => {
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }
    setIsWalkSimulationActive(false);
  };

  const handleStopWalkSimulation = () => {
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }
    setIsWalkSimulationActive(false);
    setWalkSimulationIndex(0);
    setUserHeading(null);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    lastSpokenIndexRef.current = null;
    if (routeInfo && routeInfo.coordinates && routeInfo.coordinates.length > 0) {
      const startCoord = routeInfo.coordinates[0];
      setUserLocation([startCoord.lat, startCoord.lng]);
      setFocusedCoordinate([startCoord.lat, startCoord.lng]);
    }
    setIsSimulated(false); // Resume real GPS tracking
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (locationAccuracy && locationAccuracy > 50) {
      timeoutId = setTimeout(() => {
        setShowAccuracyWarning(true);
      }, 5000); // 5 seconds
    } else {
      setShowAccuracyWarning(false);
    }
    return () => clearTimeout(timeoutId);
  }, [locationAccuracy]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const poiId = urlParams.get('poiId');
    if (poiId) {
      const poi = pois.find(p => p.id === poiId);
      if (poi) {
        setSelectedPoi(poi);
        setShowWelcome(false);
      }
    }
  }, [pois]);

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
      // Fail gracefully: load from localStorage
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
  }, []);

  const prevRouteInfoRef = useRef<any>(null);

  // Track route starts, destination changes, and off-route recalculations
  useEffect(() => {
    if (routingTo && routeInfo) {
      const isNewDestination = !prevRouteInfoRef.current || 
        prevRouteInfoRef.current.destinationName !== routingTo.name;

      if (isNewDestination) {
        console.log("[Voice Nav] Starting new navigation to:", routingTo.name);
        setCurrentInstructionIndex(0);
        prevRouteInfoRef.current = {
          coordinates: routeInfo.coordinates,
          destinationName: routingTo.name
        };
        return;
      }

      // Check if user has left the route (off-route recalculation check)
      if (userLocation && prevRouteInfoRef.current.coordinates) {
        const minDist = getMinDistanceToRoute(
          userLocation[0],
          userLocation[1],
          prevRouteInfoRef.current.coordinates
        );
        
        console.log("[Voice Nav] Distance to original route:", minDist.toFixed(1) + "m");

        // If distance from original route path > 25 meters, trigger off-route recalculation speech
        if (minDist > 25) {
          console.log("[Speech Event] Off-route detected. Recalculating route.");
          speakInstruction("You have left the route. Recalculating.");
          setCurrentInstructionIndex(0);
          prevRouteInfoRef.current.coordinates = routeInfo.coordinates;
        }
      }
    } else {
      setCurrentInstructionIndex(0);
      prevRouteInfoRef.current = null;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [routingTo, routeInfo]);

  // Track location and speak instructions on waypoint arrival (15-20 meters threshold)
  useEffect(() => {
    if (!routingTo || !routeInfo || !userLocation || !routeInfo.instructions || routeInfo.instructions.length === 0) {
      return;
    }

    const instructions = routeInfo.instructions;

    // Speak initial step immediately
    if (currentInstructionIndex === 0) {
      const firstStep = instructions[0];
      const startText = `Voice navigation is now active. Starting route to ${routingTo.name}. ${firstStep.text}`;
      console.log("[Speech Event] Starting route. Speaking:", startText);
      speakInstruction(startText);
      setCurrentInstructionIndex(1);
      return;
    }

    // Check distance to target coordinates for the step we are heading to
    const targetStep = instructions[currentInstructionIndex - 1];
    if (targetStep && targetStep.coords) {
      const dist = getDistance(
        userLocation[0],
        userLocation[1],
        targetStep.coords.lat,
        targetStep.coords.lng
      );

      console.log(`[Voice Nav Debug] Current location: [${userLocation[0].toFixed(6)}, ${userLocation[1].toFixed(6)}], target: [${targetStep.coords.lat.toFixed(6)}, ${targetStep.coords.lng.toFixed(6)}], distance to next waypoint: ${dist.toFixed(1)}m, current instruction index: ${currentInstructionIndex}`);

      // If user reaches within 15-20 meters of the instruction waypoint (using 20m threshold)
      if (dist <= 20) {
        if (currentInstructionIndex < instructions.length) {
          const nextStep = instructions[currentInstructionIndex];
          console.log(`[Speech Event] Waypoint reached. Index: ${currentInstructionIndex}, Speaking: ${nextStep.text}`);
          speakInstruction(nextStep.text);
          setCurrentInstructionIndex(prev => prev + 1);
        } else {
          console.log("[Speech Event] Reached final destination. Stopping voice guidance.");
          speakInstruction("You have arrived at your destination.");
          // Clear routing/navigation to stop
          setRoutingTo(null);
          setRouteInfo(null);
        }
      }
    }
  }, [userLocation, routingTo, routeInfo, currentInstructionIndex]);

  useEffect(() => {
    if (isSimulated) return;

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("Geolocation update:", position.coords.latitude, position.coords.longitude);
          
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Check if user is inside the polygon campus boundary
          const isInside = isPointInPolygon([lat, lon], CAMPUS_POLYGON);
          setIsUserOffCampus(!isInside);

          // Clear filter if measurement jumps significantly (helps recover from teleports or resets)
          if (userLocation) {
            const rawDist = getDistance(lat, lon, userLocation[0], userLocation[1]);
            if (rawDist > 20) {
              latFilter.current = null;
              lonFilter.current = null;
            }
          }

          // Dynamic filter parameters based on actual measurement accuracy
          // 1 degree latitude ~ 111,000 meters
          const accuracyInDegrees = position.coords.accuracy / 111000;
          const R = Math.max(0.00001, Math.min(0.0005, accuracyInDegrees));
          const Q = 0.00002; // Process noise (~2 meters)
          
          if (!latFilter.current) {
            latFilter.current = new KalmanFilter(Q, R, lat);
            lonFilter.current = new KalmanFilter(Q, R, lon);
          } else {
            latFilter.current.setNoise(Q, R);
            lonFilter.current.setNoise(Q, R);
          }
          
          const filteredLat = latFilter.current.filter(lat);
          const filteredLon = lonFilter.current.filter(lon);
          
          const loc: [number, number] = [filteredLat, filteredLon];
          
          setUserLocation(loc);
          setLocationAccuracy(position.coords.accuracy);
          setUserHeading(position.coords.heading);
          
          if (followMe) {
            setFocusedCoordinate(loc); // Pan the map to keep the user centered
            setSelectedPoi({ 
              id: `follow-${Date.now()}`, 
              name: 'My Location', 
              latitude: loc[0], 
              longitude: loc[1], 
              category: 'Other', 
              description: 'Automatically following your position.' 
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (!userLocationRef.current) {
            setIsSimulated(true);
            const gateLoc: [number, number] = [6.4642, 3.1972];
            setUserLocation(gateLoc);
            setLocationAccuracy(null);
            setSelectedPoi({ 
              id: `sim-loc-${Date.now()}`, 
              name: 'Simulated Location (Gate)', 
              latitude: gateLoc[0], 
              longitude: gateLoc[1], 
              category: 'Other', 
              description: 'Simulated position for testing navigation.' 
            });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [followMe, isSimulated]);

  const shareLocation = async (poi: POI) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?poiId=${poi.id}`;
    const shareData = {
      title: poi.name,
      text: `Check out this location at LASU: ${poi.name}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${poi.name}: ${shareUrl}`);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const shareCurrentLocation = async () => {
    if (!userLocation) {
      alert("Please enable your location to share it.");
      return;
    }
    const shareData = {
      title: "My Location at LASU",
      text: `Check out my current location at LASU: ${userLocation[0]}, ${userLocation[1]}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`My Location at LASU: ${userLocation[0]}, ${userLocation[1]} - ${window.location.href}`);
        alert("Location link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };



  // ... inside AppContent ...
  // Update POIInfo in sidebar and mobile sidebar
  // ...

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-50">
        <div className="w-16 h-16 border-4 border-zinc-200 border-t-lasu-primary rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-800 font-extrabold animate-pulse">Initializing LASU Navigator...</p>
      </div>
    );
  }
  // Walk simulation progress and countdown calculations
  const totalCoordinates = routeInfo && routeInfo.coordinates ? routeInfo.coordinates.length - 1 : 1;
  const progressPercent = routeInfo && totalCoordinates > 0 ? (walkSimulationIndex / totalCoordinates) * 100 : 0;
  const remainingFraction = routeInfo && totalCoordinates > 0 ? 1 - walkSimulationIndex / totalCoordinates : 1;
  
  const displayDuration = routeInfo
    ? (isWalkSimulationActive
        ? Math.max(Math.round((routeInfo.duration * remainingFraction) / 60), 0)
        : Math.round(routeInfo.duration / 60))
    : 0;

  const displayDistance = routeInfo
    ? (isWalkSimulationActive
        ? Math.max((routeInfo.distance * remainingFraction) / 1000, 0)
        : routeInfo.distance / 1000)
    : 0;

  const numTurns = routeInfo && routeInfo.instructions
    ? routeInfo.instructions.filter((step: any) => step.text.toLowerCase().includes('turn left') || step.text.toLowerCase().includes('turn right')).length
    : 0;

  // Find current active instruction step based on currentInstructionIndex state
  let currentInstructionStep: any = null;
  let nextInstructionStep: any = null;
  if (routeInfo && routeInfo.instructions && routeInfo.instructions.length > 0) {
    const activeIdx = Math.max(0, currentInstructionIndex - 1);
    currentInstructionStep = routeInfo.instructions[activeIdx];
    if (activeIdx + 1 < routeInfo.instructions.length) {
      nextInstructionStep = routeInfo.instructions[activeIdx + 1];
    }
  }

  const getDirectionIcon = (text: string) => {
    const txt = text.toLowerCase();
    if (txt.includes('left')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path d="M19 15V9a4 4 0 0 0-4-4H5M5 9l4-4M5 9l4 4"/>
        </svg>
      );
    }
    if (txt.includes('right')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path d="M5 15V9a4 4 0 0 1 4-4h10M19 9l-4-4M19 9l-4 4"/>
        </svg>
      );
    }
    if (txt.includes('arrive') || txt.includes('destination')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 animate-pulse">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    );
  };



  const handleEnableSimulationFromBanner = () => {
    const gateLoc: [number, number] = [6.4642, 3.1972];
    setIsSimulated(true);
    latFilter.current = null;
    lonFilter.current = null;
    setUserLocation(gateLoc);
    setLocationAccuracy(null);
    setSelectedPoi({ 
      id: `sim-loc-${Date.now()}`, 
      name: 'Simulated Location (Gate)', 
      latitude: gateLoc[0], 
      longitude: gateLoc[1], 
      category: 'Other', 
      description: 'Simulated position for testing navigation.' 
    });
    setIsUserOffCampus(false);
  };

  const navCardTop = "top-4";

  const LAYER_PREVIEWS = [
    { id: 'voyager' as MapStyle, label: 'CARTO Voyager', desc: 'OpenStreetMap (CARTO Voyager)', bg: 'from-sky-400 via-sky-300 to-emerald-200' },
    { id: 'osm' as MapStyle, label: 'OSM', desc: 'Pedestrian pathways', bg: 'from-sky-200 to-zinc-200' }
  ] as const;



  const renderRoutePlannerPanel = () => {
    return (
      <div className="flex flex-col h-full bg-white p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
          <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider flex items-center gap-2">
            <Navigation className="w-4 h-4 text-lasu-primary animate-pulse" />
            Route Planner
          </h3>
          <button 
            onClick={() => {
              setRoutingTo(null);
              setRoutingFrom(null);
              setRouteInfo(null);
            }}
            className="text-[10px] font-black text-zinc-650 hover:text-red-600 uppercase tracking-widest transition-colors cursor-pointer"
          >
            Clear Route
          </button>
        </div>

        {/* Input Fields Container with Swap Button */}
        <div className="relative flex gap-3.5 items-center">
          {/* Vertical timeline connector line */}
          <div className="absolute left-3.5 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-zinc-200/80 pointer-events-none z-0" />

          <div className="flex-1 flex flex-col gap-3 z-10">
            {/* Start Location Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 z-10" />
              <input
                type="text"
                value={startSearchQuery}
                onFocus={() => {
                  setIsStartDropdownOpen(true);
                  setIsEndDropdownOpen(false);
                }}
                onChange={(e) => {
                  setStartSearchQuery(e.target.value);
                  setIsStartDropdownOpen(true);
                }}
                placeholder="Choose starting point..."
                className="w-full pl-8.5 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-lasu-primary/20 focus:border-lasu-primary/70 focus:bg-white transition-all shadow-sm"
              />
              {startSearchQuery && (
                <button
                  onClick={() => {
                    setStartSearchQuery('');
                    setRoutingFrom(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 rounded-full text-zinc-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Start Dropdown */}
              <AnimatePresence>
                {isStartDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[1000]" onClick={() => setIsStartDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl z-[1005] max-h-48 overflow-y-auto p-1.5 space-y-1 scrollbar-hide"
                    >
                      <button
                        onClick={() => {
                          setRoutingFrom(null);
                          setIsStartDropdownOpen(false);
                          setIsSimulated(false); // Resume real GPS tracking
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:bg-lasu-primary/5 hover:text-lasu-primary flex items-center gap-2 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                        My Location (GPS)
                      </button>
                      <div className="h-px bg-zinc-100 my-1" />
                      {filteredStartPois.map((poi) => (
                        <button
                          key={poi.id}
                          onClick={() => {
                            setRoutingFrom(poi);
                            setIsStartDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-lasu-primary/5 hover:text-lasu-primary truncate cursor-pointer"
                        >
                          {poi.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Destination Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/10 z-10" />
              <input
                type="text"
                value={endSearchQuery}
                onFocus={() => {
                  setIsEndDropdownOpen(true);
                  setIsStartDropdownOpen(false);
                }}
                onChange={(e) => {
                  setEndSearchQuery(e.target.value);
                  setIsEndDropdownOpen(true);
                }}
                placeholder="Choose destination..."
                className="w-full pl-8.5 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-lasu-primary/20 focus:border-lasu-primary/70 focus:bg-white transition-all shadow-sm"
              />
              {endSearchQuery && (
                <button
                  onClick={() => {
                    setEndSearchQuery('');
                    setRoutingTo(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 rounded-full text-zinc-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* End Dropdown */}
              <AnimatePresence>
                {isEndDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[1000]" onClick={() => setIsEndDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl z-[1005] max-h-48 overflow-y-auto p-1.5 space-y-1 scrollbar-hide"
                    >
                      <button
                        onClick={() => {
                          setRoutingTo(null);
                          setIsEndDropdownOpen(false);
                          setIsSimulated(false); // Resume real GPS tracking
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:bg-lasu-primary/5 hover:text-lasu-primary flex items-center gap-2 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-red-500" />
                        My Location (GPS)
                      </button>
                      <div className="h-px bg-zinc-100 my-1" />
                      {filteredEndPois.map((poi) => (
                        <button
                          key={poi.id}
                          onClick={() => {
                            setRoutingTo(poi);
                            setIsEndDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-lasu-primary/5 hover:text-lasu-primary truncate cursor-pointer"
                        >
                          {poi.name}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapRoute}
            className="p-2.5 bg-zinc-100 hover:bg-lasu-primary/10 hover:text-lasu-primary text-zinc-700 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 border border-zinc-200 shadow-sm z-10"
            title="Swap start and end locations"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4.5 h-4.5">
              <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l-4-4M17 20l4-4"/>
            </svg>
          </button>
        </div>

        {/* Detailed directions preview summary */}
        {routeInfo && (
          <div className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Selected Path Info</span>
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span>Distance:</span>
              <span className="text-lasu-primary font-extrabold">{(routeInfo.distance / 1000).toFixed(2)} km</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span>Est. Walk Time:</span>
              <span className="text-lasu-primary font-extrabold">{Math.round(routeInfo.duration / 60)} mins</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span>Route Segments:</span>
              <span>{routeInfo.segmentsCount} segments</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStatusBadge = () => {
    if (isOffline) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[10px] font-bold shadow-sm animate-pulse whitespace-nowrap">
          <WifiOff className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden xs:inline">Offline Mode</span>
          <span className="xs:hidden">Offline</span>
        </div>
      );
    }
    if (isUserOffCampus && !isSimulated) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-red-800 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap">
          <MapIcon className="w-3.5 h-3.5 text-red-600 animate-bounce" />
          <span className="hidden sm:inline">Outside Campus Bounds</span>
          <span className="sm:hidden">Off-Campus</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnableSimulationFromBanner();
            }}
            className="ml-1 bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded-lg text-[9px] font-black uppercase transition-all shadow-sm active:scale-95 animate-pulse cursor-pointer border-none"
          >
            Simulate
          </button>
        </div>
      );
    }
    if (showAccuracyWarning) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-lasu-secondary/10 border border-lasu-secondary/20 text-lasu-secondary rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-lasu-secondary animate-pulse" />
          <span className="hidden xs:inline">Weak GPS Signal</span>
          <span className="xs:hidden">Weak GPS</span>
        </div>
      );
    }
    return null;
  };

  if (showWelcome) {
    const matchedPoi = session?.lastDestination 
      ? pois.find(p => p.name.toLowerCase() === session.lastDestination.toLowerCase() || p.name.toLowerCase().includes(session.lastDestination.toLowerCase()))
      : null;

    return (
      <div className="relative w-full min-h-screen overflow-y-auto">
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500 font-bold bg-white">Loading Welcome...</div>}>
          <WelcomeScreen 
            pois={pois}
            onStart={() => {
              setShowWelcome(false);
              setTourStep(1);
            }}
            onExplore={(category) => {
              setShowWelcome(false);
              if (category) {
                setFilterCategory(category);
              } else {
                setFilterCategory('All');
              }
              if (window.innerWidth < 1024) {
                setSheetSnap('half');
              }
            }}
            onAskAssistant={() => {
              setShowWelcome(false);
              setIsAssistantOpen(true);
            }}
            onSelectPoi={(poi) => {
              setShowWelcome(false);
              setSelectedPoi(poi);
              setRoutingTo(null);
              if (window.innerWidth < 1024) {
                setSheetSnap('half');
              }
            }}
          />
        </React.Suspense>

        {/* Welcome Back / Session Restore Dialog Overlay */}
        <AnimatePresence>
          {showWelcomeBack && (
            <WelcomeBackModal
              matchedPoi={matchedPoi}
              onContinuePreviousSession={handleContinuePreviousSession}
              onSkipToMap={() => {
                setShowWelcome(false);
                setShowWelcomeBack(false);
                saveSession({ lastScreen: 'map' });
              }}
              onAskAssistant={() => {
                setShowWelcome(false);
                setIsAssistantOpen(true);
                setShowWelcomeBack(false);
                saveSession({ lastScreen: 'map' });
              }}
              onGoToDashboard={() => {
                setShowWelcomeBack(false);
                saveSession({ lastScreen: 'welcome' });
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen w-screen bg-white flex flex-col overflow-hidden font-sans text-[rgb(49,30,2)] transition-colors duration-300">
      {/* Header */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 md:px-6 z-[2000] shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Brand accent bar */}
          <div className="w-1.5 h-9 rounded-full bg-lasu-primary shrink-0" />
          <img 
            src="https://lasu.edu.ng/home/img/logo1.png" 
            alt="LASU Logo" 
            className="w-10 h-10 object-contain shrink-0 cursor-pointer"
            onClick={() => setShowWelcome(true)}
            referrerPolicy="no-referrer"
          />
          <div className="shrink-0 cursor-pointer" onClick={() => setShowWelcome(true)}>
            <h1 className="font-black text-[15px] leading-tight tracking-tight text-zinc-900">LASU Navigator</h1>
            <p className="text-[9px] text-lasu-primary font-black uppercase tracking-[0.18em] leading-none">Campus Guide</p>
          </div>
          {renderStatusBadge()}
        </div>

        {/* Mobile Header Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <button 
            onClick={() => setShowWelcome(true)} 
            className="p-2 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm" 
            title="Go to Home Dashboard"
          >
            <Home className="w-4 h-4" />
          </button>


          <button 
            onClick={shareCurrentLocation} 
            className="p-2 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm" 
            title="Share My Location"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsInfoOpen(true)}
            className="p-2 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm"
            title="Show application information"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => setShowWelcome(true)} 
            className="p-2.5 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm flex items-center gap-1.5 font-bold text-xs" 
            title="Go to Home Dashboard"
          >
            <Home className="w-4.5 h-4.5" />
            Home
          </button>


          <button 
            onClick={shareCurrentLocation} 
            className="p-2.5 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm" 
            title="Share My Location"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
          
          <button 
            onClick={() => setIsInfoOpen(true)}
            className="p-2.5 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm"
            title="Show application information"
          >
            <Info className="w-4.5 h-4.5" />
          </button>

          <SearchBar 
            pois={pois} 
            onSelect={(poi) => {
              setSelectedPoi(poi);
              setRoutingTo(null);
            }} 
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            isHeader={true}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </header>

      <main className="flex-1 flex relative overflow-hidden">
        {/* ── Mobile Bottom Sheet ─────────────────────────────────────── */}
        <div className="lg:hidden">
          <MobileBottomSheet
            snap={sheetSnap}
            onSnapChange={setSheetSnap}
            pois={pois}
            selectedPoi={selectedPoi}
            routingTo={routingTo}
            userLocation={userLocation}
            isRouteHighlighted={isRouteHighlighted}
            onPoiSelect={(poi) => {
              setSelectedPoi(poi);
              setRoutingTo(null);
              setSheetSnap('half');
            }}
            onClose={() => {
              setSelectedPoi(null);
              setRoutingTo(null);
              setIsRouteHighlighted(false);
              setSheetSnap('peek');
            }}
            onGetDirections={(poi) => {
              setRoutingTo(poi);
              setRoutingFrom(null);
              setSelectedPoi(null);
              setSheetSnap('half');
            }}
            onRouteFromHere={(poi) => {
              setRoutingFrom(poi);
              setRoutingTo(null);
              setSelectedPoi(null);
              setSheetSnap('full');
            }}
            onHighlightRoute={() => setIsRouteHighlighted(!isRouteHighlighted)}
            onShare={shareLocation}
            renderRoutePlannerPanel={renderRoutePlannerPanel}
            renderHomePanel={() => renderHomePanelContent(true)}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchOpen={isSearchOpen}
            onSearchOpenChange={setIsSearchOpen}
          />
        </div>

        {/* Left Sidebar - Desktop Updates */}
        <aside className="hidden lg:flex w-80 border-r border-zinc-200 bg-white flex-col shrink-0">
          {routingTo ? (
            renderRoutePlannerPanel()
          ) : selectedPoi ? (
            <React.Suspense fallback={<div className="p-6 text-center text-xs text-zinc-500 font-semibold bg-white flex-1 flex items-center justify-center">Loading details...</div>}>
              <POIInfo 
                poi={selectedPoi} 
                userLocation={userLocation}
                onClose={() => {
                  setSelectedPoi(null);
                  setRoutingTo(null);
                  setIsRouteHighlighted(false);
                }}
                onGetDirections={(poi) => {
                  setRoutingTo(poi);
                  setRoutingFrom(null);
                  setSelectedPoi(null);
                }} 
                onRouteFromHere={(poi) => {
                  setRoutingFrom(poi);
                  setRoutingTo(null);
                  setSelectedPoi(null);
                }}
                isRouteHighlighted={isRouteHighlighted}
                onHighlightRoute={() => setIsRouteHighlighted(!isRouteHighlighted)}
                onShare={shareLocation}
                isSidebar={true}
              />
            </React.Suspense>
          ) : (
            <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
              {renderHomePanelContent(false)}
            </div>
          )}
        </aside>

        {/* Map Area */}
        <section className="flex-1 relative">
          {routingTo && routeInfo && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className={cn(
                  "absolute left-1/2 z-[2500] w-[calc(100%-2rem)] max-w-sm transition-all duration-300",
                  navCardTop
                )}
              >
                <div className="bg-white border border-zinc-200 shadow-2xl rounded-3xl p-4 flex items-center gap-4">
                  {/* SVG next-turn icon container */}
                  <div className="w-12 h-12 rounded-2xl bg-lasu-primary/10 border border-lasu-primary/10 flex items-center justify-center shrink-0 text-lasu-primary">
                    {getDirectionIcon(currentInstructionStep ? currentInstructionStep.text : '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black text-lasu-primary uppercase tracking-widest leading-none block mb-0.5 animate-pulse">
                      Navigation Mode
                    </span>
                    <h4 className="font-extrabold text-xs text-[rgb(49,30,2)] leading-snug truncate">
                      {currentInstructionStep ? currentInstructionStep.text : `Walk towards ${routingTo.name}`}
                    </h4>
                    {nextInstructionStep && (
                      <p className="text-[10px] text-zinc-600 font-bold truncate mt-0.5">
                        Next: {nextInstructionStep.text}
                      </p>
                    )}
                  </div>
                  {/* Voice Navigation Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Voice Master ON/OFF Toggle */}
                    <button
                      onClick={handleToggleVoice}
                      className={cn(
                        "p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border shadow-sm text-[10px] font-bold gap-1",
                        isVoiceEnabled ? "bg-green-50 text-green-700 border-green-200" : "bg-zinc-50 text-zinc-650 border-zinc-200"
                      )}
                      title={isVoiceEnabled ? "Disable Voice Engine" : "Enable Voice Engine"}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isVoiceEnabled ? "Voice ON" : "Voice OFF"}</span>
                    </button>

                    {isVoiceEnabled && (
                      <>
                        {/* Mute/Unmute */}
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className={cn(
                            "p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border shadow-sm text-xs font-bold",
                            isMuted ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-zinc-700 border-zinc-200"
                          )}
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-lasu-primary animate-pulse" />}
                        </button>

                        {/* Replay */}
                        <button
                          onClick={replayCurrentInstruction}
                          className="p-2 bg-white hover:bg-zinc-50 rounded-xl text-zinc-750 transition-colors flex items-center justify-center border border-zinc-200 shadow-sm"
                          title="Replay Instruction"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-lasu-primary" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* ETA display */}
                  <div className="w-11 h-11 rounded-2xl border border-lasu-primary/15 flex flex-col items-center justify-center shrink-0 bg-lasu-primary/5 text-center leading-none">
                    <span className="text-xs font-black text-lasu-primary">{displayDuration}</span>
                    <span className="text-[8px] font-black text-lasu-primary uppercase tracking-tighter mt-0.5">min</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          <CampusMap 
            pois={pois} 
            filterCategory={filterCategory}
            selectedPoi={selectedPoi} 
            onPoiSelect={handlePoiSelect} 
            userLocation={userLocation}
            locationAccuracy={locationAccuracy}
            isLocating={isLocating}
            userHeading={userHeading}
            routingTo={routingTo}
            routingFrom={routingFrom}
            onRouteFound={setRouteInfo}
            mapStyle={mapStyle}
            isRouteHighlighted={isRouteHighlighted}
            focusedCoordinate={focusedCoordinate}
            routeCoordinates={routeInfo?.coordinates}
            routeInfo={routeInfo}
            onMapDrag={handleMapDrag}
            searchQuery={searchQuery}
          />
          
          {routingTo && routeInfo && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2500] w-[calc(100%-2rem)] max-w-sm bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
              style={{ maxHeight: isRouteDrawerExpanded ? '400px' : '96px' }}
            >
              {/* Header / Collapsed view */}
              <div className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none bg-zinc-50 hover:bg-zinc-100 transition-colors group border-b border-zinc-100" onClick={() => setIsRouteDrawerExpanded(!isRouteDrawerExpanded)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105 bg-lasu-primary shadow-lasu-primary/15">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
                      Directions
                    </p>
                    <h3 className="font-black text-sm text-[rgb(49,30,2)] truncate pr-2">
                      {routingTo.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-lasu-primary bg-lasu-primary/5 border border-lasu-primary/20 px-2 py-0.5 rounded-lg">
                        {displayDuration} min
                      </span>
                      <span className="text-[11px] font-bold text-zinc-700">
                        ({displayDistance.toFixed(2)} km • {numTurns} {numTurns === 1 ? 'turn' : 'turns'} • {routeInfo.segmentsCount} segments)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  {/* Voice Navigation Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Voice Master ON/OFF Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVoice();
                      }}
                      className={cn(
                        "p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border text-[10px] font-bold gap-1",
                        isVoiceEnabled ? "bg-green-50 text-green-700 border-green-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"
                      )}
                      title={isVoiceEnabled ? "Disable Voice Engine" : "Enable Voice Engine"}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isVoiceEnabled ? "Voice ON" : "Voice OFF"}</span>
                    </button>

                    {isVoiceEnabled && (
                      <>
                        {/* Mute/Unmute */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                          }}
                          className={cn(
                            "p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border text-xs font-bold",
                            isMuted ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-zinc-700 border-zinc-200"
                          )}
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-lasu-primary animate-pulse" />}
                        </button>

                        {/* Replay */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            replayCurrentInstruction();
                          }}
                          className="p-2 bg-white hover:bg-zinc-50 rounded-xl text-zinc-750 transition-colors flex items-center justify-center border border-zinc-200"
                          title="Replay Instruction"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-lasu-primary" />
                        </button>
                      </>
                    )}
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRouteDrawerExpanded(!isRouteDrawerExpanded);
                    }}
                    className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-500 hover:text-zinc-800 transition-colors flex items-center justify-center"
                  >
                    {isRouteDrawerExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoutingTo(null);
                      setRouteInfo(null);
                      setIsRouteDrawerExpanded(false);
                    }}
                    className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-500 hover:text-red-500 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Turn-by-Turn Steps */}
              {isRouteDrawerExpanded && (
                <div className="flex-1 overflow-y-auto border-t border-zinc-200 p-4 space-y-2 bg-zinc-50 max-h-[300px] scrollbar-hide">
                  {routeInfo.instructions && routeInfo.instructions.length > 0 &&
                    routeInfo.instructions.map((step: any, i: number) => {
                      const text = step.text.toLowerCase();
                      let Icon = Navigation;
                      if (text.includes('left')) Icon = CornerUpLeft;
                      else if (text.includes('right')) Icon = CornerUpRight;
                      else if (text.includes('straight')) Icon = ArrowUp;
                      else if (text.includes('south')) Icon = ArrowDown;
                      else if (text.includes('north')) Icon = ArrowUp;
                      else if (text.includes('east')) Icon = ArrowRight;
                      else if (text.includes('west')) Icon = ArrowLeft;
                      else if (text.includes('arrive')) Icon = MapIcon;

                      return (
                        <button 
                          key={i}
                          onClick={() => {
                            setIsRouteHighlighted(true);
                            if (routeInfo.coordinates[step.index]) {
                              setFocusedCoordinate([routeInfo.coordinates[step.index].lat, routeInfo.coordinates[step.index].lng]);
                            }
                          }}
                          className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-lasu-primary/5 hover:text-lasu-primary transition-all border border-zinc-200 hover:border-lasu-primary/20 shadow-sm flex items-center gap-3 active:scale-[0.99]"
                        >
                          <div className="w-6 h-6 rounded-lg bg-lasu-primary/5 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-lasu-primary" />
                          </div>
                          <span className="text-[11px] font-semibold text-zinc-700 leading-snug">{step.text}</span>
                        </button>
                      );
                    })
                  }
                </div>
              )}
            </motion.div>
          )}
          
          {/* Glassmorphic Map Control HUD */}
          <div className="absolute top-6 right-6 z-[2000] flex gap-3.5 items-start select-none">
            {/* Visual Layer Selector Drawer */}
            <AnimatePresence>
              {showLayerPanel && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  className="bg-white border border-zinc-200 shadow-2xl rounded-[28px] p-3 flex gap-3 items-center mr-1"
                >
                  {LAYER_PREVIEWS.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setMapStyle(layer.id)}
                      className={cn(
                        "w-20 h-20 rounded-2xl overflow-hidden relative border transition-all duration-300 flex flex-col justify-end p-2 cursor-pointer shadow-md text-left active:scale-95 group shrink-0",
                        mapStyle === layer.id 
                          ? "border-lasu-primary ring-4 ring-lasu-primary/20 scale-102" 
                          : "border-white/40 hover:border-zinc-300/80 hover:scale-102"
                      )}
                    >
                      <div className={cn("absolute inset-0 bg-gradient-to-tr opacity-90 z-0", layer.bg)} />
                      {/* Grid representation */}
                      <div className="absolute inset-0 z-0 opacity-10 flex flex-col justify-between p-1.5 pointer-events-none">
                        <div className="h-px bg-white w-full" />
                        <div className="h-px bg-white w-full transform rotate-12" />
                        <div className="h-px bg-white w-full transform -rotate-12" />
                      </div>
                      <div className="relative z-10 text-[9px] font-black uppercase text-white drop-shadow-md leading-none">
                        {layer.label}
                      </div>
                      <div className="relative z-10 text-[7px] text-white/90 drop-shadow-sm font-semibold truncate leading-none mt-1 max-w-full">
                        {layer.desc}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vertical Control Bar */}
            <div className="bg-white border border-zinc-200 shadow-2xl rounded-[28px] p-2 flex flex-col gap-3 items-center">
              {/* GPS Locate Button */}
              <button 
                onClick={() => {
                  setIsSimulated(false); // Resume real GPS updates
                  latFilter.current = null;
                  lonFilter.current = null;
                  if ("geolocation" in navigator) {
                    setIsLocating(true);
                    setUserLocation(null);
                    setLocationAccuracy(null);
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
                        const distToCenter = getDistance(loc[0], loc[1], 6.4687, 3.2000);
                        const isFarOffCampus = distToCenter >= 1500;
                        
                        setIsUserOffCampus(isFarOffCampus);

                        if (isFarOffCampus) {
                          alert("Your real GPS location is outside the LASU Ojo campus bounds. Switched to Simulation Mode at the Main Gate so you can test the application.");
                          setIsSimulated(true);
                          const gateLoc: [number, number] = [6.4642, 3.1972];
                          setUserLocation(gateLoc);
                          setLocationAccuracy(null);
                          setSelectedPoi({ 
                            id: `sim-loc-${Date.now()}`, 
                            name: 'Simulated Location (Gate)', 
                            latitude: gateLoc[0], 
                            longitude: gateLoc[1], 
                            category: 'Other', 
                            description: 'Simulated position for testing navigation.' 
                          });
                        } else {
                          setUserLocation(loc);
                          setLocationAccuracy(position.coords.accuracy);
                          setFocusedCoordinate(loc); // Pan/center map on user location
                          setFollowMe(true); // Lock map tracking on user
                          setSelectedPoi({ 
                            id: `user-loc-${Date.now()}`, 
                            name: 'My Location', 
                            latitude: loc[0], 
                            longitude: loc[1], 
                            category: 'Other', 
                            description: 'Your current position on campus.' 
                          });
                        }
                        setIsLocating(false);
                      },
                      (error) => {
                        console.error("Error getting location:", error);
                        let msg = "Could not access your location.";
                        if (error.code === error.PERMISSION_DENIED) {
                          msg = "Location access was denied. Please check your browser/system settings to allow location permissions for this app.";
                        } else if (error.code === error.POSITION_UNAVAILABLE) {
                          msg = "Location coordinates are currently unavailable. Ensure your device's location services (GPS) are turned on.";
                        } else if (error.code === error.TIMEOUT) {
                          msg = "Location request timed out. Please try again or move to an area with a stronger GPS signal.";
                        }
                        
                        alert(`${msg}\n\nDefaulting to Simulation Mode at the Main Gate so you can test navigation.`);
                        
                        setIsSimulated(true);
                        const gateLoc: [number, number] = [6.4642, 3.1972];
                        setUserLocation(gateLoc);
                        setLocationAccuracy(null);
                        setSelectedPoi({ 
                          id: `sim-loc-${Date.now()}`, 
                          name: 'Simulated Location (Gate)', 
                          latitude: gateLoc[0], 
                          longitude: gateLoc[1], 
                          category: 'Other', 
                          description: 'Simulated position for testing navigation.' 
                        });
                        setIsLocating(false);
                      },
                      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
                    );
                  } else {
                    alert("Geolocation is not supported by your browser.");
                  }
                }}
                className={cn(
                  "relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-sm border",
                  (isLocating || followMe)
                    ? "bg-lasu-primary text-white border-lasu-primary shadow-lg shadow-lasu-primary/20 scale-102" 
                    : "bg-white border-zinc-250 hover:bg-zinc-50 text-zinc-800 hover:text-zinc-950 hover:border-zinc-300   "
                )}
                disabled={isLocating}
                title="Find my location"
              >
                <Navigation className={cn("w-4.5 h-4.5", isLocating && "animate-spin")} />
              </button>

              {/* Layer Panel Switcher */}
              <button 
                onClick={() => setShowLayerPanel(!showLayerPanel)}
                className={cn(
                  "w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-sm border",
                  showLayerPanel 
                    ? "bg-lasu-primary text-white border-lasu-primary shadow-lg shadow-lasu-primary/20 scale-102" 
                    : "bg-white  border-zinc-200  hover:bg-zinc-50  text-zinc-700  hover:text-lasu-primary "
                )}
                title="Select map style layers"
              >
                <Layers className="w-4.5 h-4.5" />
                <span className="text-[7px] font-black uppercase mt-0.5 leading-none">{mapStyle}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Info Modal */}
      <AnimatePresence>
        {isInfoOpen && (
          <SafetyInfoModal
            onClose={() => setIsInfoOpen(false)}
            onStartTour={() => {
              setIsInfoOpen(false);
              setTourStep(1);
            }}
          />
        )}
      </AnimatePresence>

      {/* Campus Information Assistant */}
      <React.Suspense fallback={null}>
        <CampusAssistant
          pois={pois}
          onNavigate={(poi) => {
            setRoutingTo(poi);
            setSelectedPoi(null);
          }}
          isVoiceEnabled={isVoiceEnabled}
          speakInstruction={speakInstruction}
          externalOpen={isAssistantOpen}
          onExternalOpenChange={setIsAssistantOpen}
          isSearchOpen={isSearchOpen}
        />
      </React.Suspense>

      {/* Interactive Welcome Tour */}
      <AnimatePresence>
        {tourStep !== null && (
          <div className="fixed inset-0 z-[4000] overflow-hidden pointer-events-none">
            {/* Spotlight cut-out overlay */}
            <div 
              className={cn(
                "transition-all duration-300 pointer-events-none z-[4050] border-2 border-lasu-secondary shadow-[0_0_0_9999px_rgba(9,9,11,0.655)] absolute",
                tourStep === 1 && (window.innerWidth < 1024 
                  ? "bottom-0 left-0 right-0 h-[52vh] rounded-t-[32px]" 
                  : "top-16 left-0 w-80 bottom-0"),
                tourStep === 2 && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full",
                tourStep === 3 && "top-[76px] right-3.5 w-13 h-[104px] rounded-3xl",
                tourStep === 4 && "bottom-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm h-16 rounded-2xl"
              )}
            />

            {/* Tour Dialog Card */}
            <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[4100]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={cn(
                  "absolute bg-white rounded-[28px] p-6 shadow-2xl border border-zinc-200/80 w-full max-w-sm flex flex-col gap-4 transition-all duration-300 pointer-events-auto",
                  tourStep === 1 && "lg:top-20 lg:left-88 lg:translate-x-0 lg:translate-y-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  tourStep === 2 && "bottom-12 lg:bottom-20 top-auto left-1/2 -translate-x-1/2",
                  tourStep === 3 && "top-48 lg:top-20 lg:right-20 lg:left-auto lg:translate-x-0 left-1/2 -translate-x-1/2",
                  tourStep === 4 && "bottom-36 lg:bottom-40 top-auto left-1/2 -translate-x-1/2"
                )}
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-lasu-primary flex items-center justify-center text-white text-xs font-black">
                      {tourStep}
                    </span>
                    <h3 className="font-extrabold text-sm text-zinc-900">
                      {tourStep === 1 && "Search & Categories"}
                      {tourStep === 2 && "Explore Landmarks"}
                      {tourStep === 3 && "Map Controls & Layers"}
                      {tourStep === 4 && "Routing & Simulation"}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setTourStep(null);
                      localStorage.setItem('lasu_navigator_tour_completed', 'true');
                      if (window.innerWidth < 1024) {
                        setSheetSnap('peek');
                      }
                    }}
                    className="text-zinc-600 hover:text-zinc-800 transition-colors text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    Skip
                  </button>
                </div>
                
                <p className="text-xs text-zinc-700 leading-relaxed font-semibold">
                  {tourStep === 1 && "Use the Search bar at the top (desktop) or in the bottom sheet (mobile) to find any landmark. Tap the category tag pills underneath (like 'Library' or 'Sports') to filter locations instantly."}
                  {tourStep === 2 && "Tap any category-coded pin on the map to open its details panel. You will find photos, a directory of academic departments, and quick actions to get directions."}
                  {tourStep === 3 && "Use the controls on the right of the map: tap GPS to center and lock the camera on your position, or tap Layers to switch between the CARTO Voyager Map and OpenStreetMap pathways."}
                  {tourStep === 4 && "Tap 'Route To Here' on any landmark card to plan a path, and unmute the Speaker icon for spoken turn-by-turn voice directions!"}
                </p>

                <div className="flex justify-between items-center mt-2 border-t border-zinc-200 pt-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(step => (
                      <div 
                        key={step} 
                        className={cn("w-1.5 h-1.5 rounded-full transition-colors", step === tourStep ? "bg-lasu-primary " : "bg-zinc-200 ")}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    {tourStep > 1 && (
                      <button 
                        onClick={() => setTourStep(tourStep - 1)}
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (tourStep < 4) {
                          setTourStep(tourStep + 1);
                        } else {
                          setTourStep(null);
                          localStorage.setItem('lasu_navigator_tour_completed', 'true');
                          if (window.innerWidth < 1024) {
                            setSheetSnap('peek');
                          }
                        }
                      }}
                      className="px-4 py-1.5 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {tourStep === 4 ? "Finish" : "Next"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>


    </div>
    </>
  );
}
