export interface Department {
  name: string;
  aliases: string[];
}

export interface Faculty {
  faculty: string;
  abbreviation: string;
  description: string;
  dean: string;
  departments: Department[];
  programmes: string[];
  location: string;
}

export const LASU_KNOWLEDGE_BASE: Faculty[] = [
  {
    "faculty": "Faculty of Arts",
    "abbreviation": "FA",
    "description": "Committed to fostering intellectual inquiry into the diverse manifestations of human realities, history, linguistics, philosophy, and creative expressions.",
    "dean": "Professor Ayodeji Olutumbi AYODELE",
    "departments": [
      {
        "name": "English",
        "aliases": [
          "english",
          "english language",
          "english department"
        ]
      },
      {
        "name": "Foreign Languages",
        "aliases": [
          "foreign languages",
          "french",
          "portuguese"
        ]
      },
      {
        "name": "History and International Studies",
        "aliases": [
          "history",
          "history and international studies",
          "his"
        ]
      },
      {
        "name": "Linguistics, African Languages, Literatures and Communication Arts",
        "aliases": [
          "linguistics",
          "african languages",
          "yoruba",
          "yoruba department"
        ]
      },
      {
        "name": "Music",
        "aliases": [
          "music",
          "music department",
          "mus"
        ]
      },
      {
        "name": "Philosophy",
        "aliases": [
          "philosophy",
          "philosophy department",
          "phl"
        ]
      },
      {
        "name": "Religions and Peace Studies",
        "aliases": [
          "religions",
          "religions and peace studies",
          "crs",
          "islamic studies"
        ]
      },
      {
        "name": "Theatre Arts",
        "aliases": [
          "theatre arts",
          "theatre",
          "drama"
        ]
      }
    ],
    "programmes": [
      "B.A. English Language",
      "B.A. French Language",
      "B.A. History and International Studies",
      "B.A. Music",
      "B.A. Philosophy",
      "B.A. Theatre Arts",
      "B.A. Yoruba and Communication Arts"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "Faculty of Basic Medical Sciences",
    "abbreviation": "FBMS",
    "description": "Provides the foundational preclinical and physiological training modules within the medical sciences curriculum.",
    "dean": "Professor AJONUMA LOUIS CHUKWUEMEKA",
    "departments": [
      {
        "name": "Anatomy",
        "aliases": [
          "anatomy",
          "anatomy department"
        ]
      },
      {
        "name": "Chemical Pathology",
        "aliases": [
          "chemical pathology",
          "chem path"
        ]
      },
      {
        "name": "Hematology and Blood Transfusion",
        "aliases": [
          "hematology",
          "blood transfusion"
        ]
      },
      {
        "name": "Medical Biochemistry",
        "aliases": [
          "medical biochemistry",
          "preclinical biochemistry"
        ]
      },
      {
        "name": "Medical Microbiology and Parasitology",
        "aliases": [
          "medical microbiology",
          "medical parasitology"
        ]
      },
      {
        "name": "Pathology and Forensic Medicine",
        "aliases": [
          "pathology",
          "forensic medicine",
          "forensics"
        ]
      },
      {
        "name": "Pharmacology",
        "aliases": [
          "pharmacology",
          "phm"
        ]
      },
      {
        "name": "Physiology",
        "aliases": [
          "physiology",
          "human physiology"
        ]
      }
    ],
    "programmes": [
      "B.Sc. Physiology",
      "B.Sc. Anatomy",
      "B.Sc. Medical Biochemistry"
    ],
    "location": "Lagos State University College of Medicine (LASUCOM) Campus, Ikeja, Lagos"
  },
  {
    "faculty": "Faculty of Clinical Sciences",
    "abbreviation": "FCS",
    "description": "Housed within the central Glass House building, this faculty coordinates advanced medical clinical postings, nursing certifications, and clinical residency preparations.",
    "dean": "Professor Kikelomo Ololade WRIGHT",
    "departments": [
      {
        "name": "Anesthesia",
        "aliases": [
          "anesthesia",
          "anasthesia"
        ]
      },
      {
        "name": "Behavioural Medicine",
        "aliases": [
          "behavioural medicine",
          "psychiatry",
          "mental health"
        ]
      },
      {
        "name": "Community Health and Primary Health Care",
        "aliases": [
          "community health",
          "public health",
          "primary health care"
        ]
      },
      {
        "name": "Surgery",
        "aliases": [
          "surgery",
          "general surgery"
        ]
      },
      {
        "name": "Medicine",
        "aliases": [
          "medicine",
          "internal medicine"
        ]
      },
      {
        "name": "Obstetrics & Gynaecology",
        "aliases": [
          "obstetrics and gynaecology",
          "obs and gynae",
          "o&g"
        ]
      },
      {
        "name": "Paediatrics & Child Health",
        "aliases": [
          "paediatrics",
          "pediatrics",
          "child health"
        ]
      },
      {
        "name": "Nursing",
        "aliases": [
          "nursing",
          "nursing sciences"
        ]
      },
      {
        "name": "Radiology",
        "aliases": [
          "radiology",
          "medical imaging"
        ]
      }
    ],
    "programmes": [
      "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
      "Bachelor of Nursing Science (B.N.Sc.)"
    ],
    "location": "Lagos State University College of Medicine (LASUCOM), Glass House Building, Ikeja, Lagos"
  },
  {
    "faculty": "Faculty of Dentistry",
    "abbreviation": "FD",
    "description": "Trains dental surgeons under full regulatory accreditation, focusing on oral and craniofacial health innovations in Africa.",
    "dean": "Dr. Adesina Oluwafemi Adewale",
    "departments": [
      {
        "name": "Department of Child Dental Health",
        "aliases": [
          "child dental health",
          "paediatric dentistry"
        ]
      },
      {
        "name": "Department of Oral and Maxillofacial Surgery",
        "aliases": [
          "oral surgery",
          "maxillofacial surgery",
          "omfs"
        ]
      },
      {
        "name": "Department of Oral Pathology and Oral Medicine",
        "aliases": [
          "oral pathology",
          "oral medicine"
        ]
      },
      {
        "name": "Department of Preventive Dentistry",
        "aliases": [
          "preventive dentistry"
        ]
      },
      {
        "name": "Department of Restorative Dentistry",
        "aliases": [
          "restorative dentistry"
        ]
      }
    ],
    "programmes": [
      "Bachelor of Dental Surgery (BDS)"
    ],
    "location": "Lagos State University College of Medicine (LASUCOM) Campus, Ikeja, Lagos"
  },
  {
    "faculty": "Faculty of Computing and Information Technology",
    "abbreviation": "FCIT",
    "description": "Fosters machine learning, biological image modeling, translational data science, and advanced technical computer science research.",
    "dean": "Professor Benjamin Aribisala",
    "departments": [
      {
        "name": "Computer Science",
        "aliases": [
          "computer science",
          "csc",
          "computer science department"
        ]
      }
    ],
    "programmes": [
      "B.Sc. Computer Science",
      "M.Sc. Computer Science"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "Faculty of Education",
    "abbreviation": "FE",
    "description": "Serves as the pedagogical hub of the university, providing instruction across language education, science education, and counseling psychology.",
    "dean": "Professor Olugbenga Gabriel AKINDOJU",
    "departments": [
      {
        "name": "Educational Management",
        "aliases": [
          "educational management",
          "ed administration"
        ]
      },
      {
        "name": "Human Kinetic Sports and Health Education",
        "aliases": [
          "human kinetics",
          "phe",
          "physical and health education",
          "sports science"
        ]
      },
      {
        "name": "Language Arts and Social Science Education",
        "aliases": [
          "language arts education",
          "social science education",
          "lasse"
        ]
      },
      {
        "name": "Educational Foundation and Counseling Psychology",
        "aliases": [
          "educational foundations",
          "counseling psychology",
          "guidance and counseling"
        ]
      },
      {
        "name": "Science and Technology Education",
        "aliases": [
          "science education",
          "technology education",
          "math education"
        ]
      }
    ],
    "programmes": [
      "B.Sc. (Ed.) Mathematics Education",
      "B.Sc. (Ed.) Physics Education",
      "B.A. (Ed.) English Education",
      "B.Sc. (Ed.) Physical and Health Education",
      "M.Ed. Sports Management and Administration"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "Faculty of Engineering",
    "abbreviation": "FENG",
    "description": "Coordinates advanced studies in aerospace, mechanical, polymer, and computer systems engineering in a fully residential technical campus environment.",
    "dean": "Professor Oyetunji Elkanah Olaosebikan",
    "departments": [
      {
        "name": "Aeronautics and Astronautics",
        "aliases": [
          "aeronautics",
          "aeronautical engineering"
        ]
      },
      {
        "name": "Aerospace Engineering",
        "aliases": [
          "aerospace engineering",
          "aerospace"
        ]
      },
      {
        "name": "Chemical Engineering",
        "aliases": [
          "chemical engineering",
          "polymer engineering",
          "chemical and polymer"
        ]
      },
      {
        "name": "Electronics and Computer",
        "aliases": [
          "electronics and computer engineering",
          "computer engineering",
          "ece"
        ]
      },
      {
        "name": "Mechanical Engineering",
        "aliases": [
          "mechanical engineering",
          "mechanical"
        ]
      }
    ],
    "programmes": [
      "B.Eng. Mechanical Engineering",
      "B.Eng. Electronics and Computer Engineering",
      "B.Eng. Chemical and Polymer Engineering",
      "B.Eng. Aerospace Engineering"
    ],
    "location": "Lagos State University Epe Campus, north side of Lekki Lagoon, Epe, Lagos"
  },
  {
    "faculty": "Faculty of Environmental Sciences",
    "abbreviation": "FES",
    "description": "Investigates residential planning, spatial landscape layout design, environmental water resources management, and hydrology studies.",
    "dean": "Professor Isaiah Sewanu Akoteyon",
    "departments": [
      {
        "name": "Geography & Planning",
        "aliases": [
          "geography and planning",
          "geography",
          "spatial planning"
        ]
      },
      {
        "name": "Environmental Management",
        "aliases": [
          "environmental management",
          "env management",
          "environmental sciences"
        ]
      },
      {
        "name": "Urban and Regional Planning",
        "aliases": [
          "urban and regional planning",
          "urp",
          "town planning"
        ]
      },
      {
        "name": "Architecture",
        "aliases": [
          "architecture",
          "arch"
        ]
      }
    ],
    "programmes": [
      "B.Sc. Geography and Planning",
      "B.Sc. Environmental Management",
      "Bachelor of Architecture"
    ],
    "location": "Lagos State University Epe Campus, north side of Lekki Lagoon, Epe, Lagos"
  },
  {
    "faculty": "Faculty of Law",
    "abbreviation": "FL",
    "description": "Widely recognized as the flagship of the university, presenting accredited professional studies in legal systems, business law, and common and Islamic law frameworks.",
    "dean": "Professor Kareem Adebayo OLATOYE",
    "departments": [
      {
        "name": "Business Law",
        "aliases": [
          "business law",
          "commercial law"
        ]
      },
      {
        "name": "International and Islamic Law",
        "aliases": [
          "international law",
          "islamic law",
          "sharia law"
        ]
      },
      {
        "name": "Jurisprudence and International Law",
        "aliases": [
          "jurisprudence",
          "jil"
        ]
      },
      {
        "name": "Public and Private Law",
        "aliases": [
          "public law",
          "private law"
        ]
      }
    ],
    "programmes": [
      "Bachelor of Laws (LL.B.)",
      "Master of Laws (LL.M.)",
      "Postgraduate Diploma in Maritime Law (PGDML)"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "Faculty of Management Sciences",
    "abbreviation": "FMS",
    "description": "Delivers educational pathways across professional business, accounting ledger systems, and local government management modules.",
    "dean": "Professor Omotayo Joseph Oyeniyi",
    "departments": [
      {
        "name": "Accounting",
        "aliases": [
          "accounting",
          "accounting department",
          "acc"
        ]
      },
      {
        "name": "Banking and Finance",
        "aliases": [
          "banking and finance",
          "finance",
          "b&f"
        ]
      },
      {
        "name": "Business Administration",
        "aliases": [
          "business administration",
          "bus admin"
        ]
      },
      {
        "name": "Industrial Relations and Personnel Management",
        "aliases": [
          "industrial relations",
          "personnel management",
          "human resources",
          "irpm"
        ]
      },
      {
        "name": "Insurance",
        "aliases": [
          "insurance",
          "ins"
        ]
      },
      {
        "name": "Local Government Administration",
        "aliases": [
          "local government studies",
          "lga",
          "local government administration"
        ]
      },
      {
        "name": "Management Technology",
        "aliases": [
          "management technology",
          "mgt tech"
        ]
      },
      {
        "name": "Marketing",
        "aliases": [
          "marketing",
          "mkt"
        ]
      },
      {
        "name": "Public Administration",
        "aliases": [
          "public administration",
          "pub admin"
        ]
      }
    ],
    "programmes": [
      "B.Sc. Accounting",
      "B.Sc. Banking and Finance",
      "B.Sc. Business Administration",
      "B.Sc. Public Administration",
      "B.Sc. Insurance",
      "B.Sc. Marketing",
      "Master of Business Administration (MBA)",
      "Doctor of Business Administration (DBA)"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "Faculty of Science",
    "abbreviation": "FS",
    "description": "Comprises ten fully accredited research departments specializing in physical, biological, molecular, and mathematical scientific inquiries.",
    "dean": "Professor Shehu Latunji AKINTOLA",
    "departments": [
      {
        "name": "Biochemistry",
        "aliases": [
          "biochemistry",
          "bch"
        ]
      },
      {
        "name": "Botany",
        "aliases": [
          "botany",
          "plant biology"
        ]
      },
      {
        "name": "Chemistry",
        "aliases": [
          "chemistry",
          "chm"
        ]
      },
      {
        "name": "Computer Science",
        "aliases": [
          "computer science",
          "csc"
        ]
      },
      {
        "name": "Fisheries",
        "aliases": [
          "fisheries",
          "aquaculture"
        ]
      },
      {
        "name": "Mathematics",
        "aliases": [
          "mathematics",
          "maths",
          "mth"
        ]
      },
      {
        "name": "Microbiology",
        "aliases": [
          "microbiology",
          "mcb"
        ]
      },
      {
        "name": "Physics",
        "aliases": [
          "physics",
          "phy"
        ]
      },
      {
        "name": "Science Laboratory and Technology",
        "aliases": [
          "science laboratory technology",
          "slt"
        ]
      },
      {
        "name": "Zoology and Environmental Biology",
        "aliases": [
          "zoology",
          "environmental biology",
          "zeb"
        ]
      }
    ],
    "programmes": [
      "B.Sc. Microbiology",
      "B.Sc. Biochemistry",
      "B.Sc. Chemistry",
      "B.Sc. Mathematics",
      "B.Sc. Physics with Electronics",
      "B.Sc. Zoology and Environmental Biology",
      "B.Sc. Fisheries"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "Faculty of Social Sciences",
    "abbreviation": "FSS",
    "description": "Dedicated to establishing analytical foundations across regional economics, societal structures, behavioral psychology, and governance models.",
    "dean": "Professor Olufemi Adigun LAWAL",
    "departments": [
      {
        "name": "Economics",
        "aliases": [
          "economics",
          "eco"
        ]
      },
      {
        "name": "Geography",
        "aliases": [
          "geography",
          "geography and planning"
        ]
      },
      {
        "name": "Political Science",
        "aliases": [
          "political science",
          "pol sci"
        ]
      },
      {
        "name": "Psychology",
        "aliases": [
          "psychology",
          "psy"
        ]
      },
      {
        "name": "Sociology",
        "aliases": [
          "sociology",
          "soc"
        ]
      }
    ],
    "programmes": [
      "B.Sc. Economics",
      "B.Sc. Political Science",
      "B.Sc. Sociology",
      "B.Sc. Psychology"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "School of Transport & Logistics",
    "abbreviation": "STL",
    "description": "Prepares transport planners, operational logisticians, and supply chain managers through rigorous academic programs and maritime and aviation industry integrations.",
    "dean": "Professor Ogochukwu Ugboma",
    "departments": [
      {
        "name": "Transport Management and Operations",
        "aliases": [
          "transport management",
          "tmo"
        ]
      },
      {
        "name": "Transport Planning and Policy",
        "aliases": [
          "transport planning",
          "tpp"
        ]
      },
      {
        "name": "Transport Technology and Infrastructure",
        "aliases": [
          "transport technology",
          "transport infrastructure"
        ]
      }
    ],
    "programmes": [
      "B.Sc. Transport Management and Operations",
      "M.Sc. Logistics and Supply Chain Management"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "School of Agriculture",
    "abbreviation": "SA",
    "description": "Coordinates advanced training in animal science, soil agronomy, farm operations, and agricultural economic networks.",
    "dean": "Designee from Faculty of Sciences",
    "departments": [
      {
        "name": "Agricultural Economics",
        "aliases": [
          "agricultural economics",
          "agric economics"
        ]
      },
      {
        "name": "Agriculture",
        "aliases": [
          "agriculture",
          "agric general"
        ]
      },
      {
        "name": "Crop Production",
        "aliases": [
          "crop production",
          "agronomy"
        ]
      },
      {
        "name": "Animal Science",
        "aliases": [
          "animal science",
          "animal husbandry"
        ]
      },
      {
        "name": "Agricultural Extension and Rural Development",
        "aliases": [
          "agricultural extension",
          "rural development"
        ]
      }
    ],
    "programmes": [
      "Bachelor of Agriculture (B.Agric.) in Crop Science",
      "Bachelor of Agriculture (B.Agric.) in Animal Science",
      "Bachelor of Agriculture (B.Agric.) in Agricultural Economics"
    ],
    "location": "Lagos State University Epe Campus, north side of Lekki Lagoon, Epe, Lagos"
  },
  {
    "faculty": "School of Communication",
    "abbreviation": "SC",
    "description": "Maintains an active campus broadcast radio station while training future journalists, broadcasters, and public relations specialists.",
    "dean": "Professor Sunday Olayinka ALAWODE",
    "departments": [
      {
        "name": "Broadcasting",
        "aliases": [
          "broadcasting",
          "tv production",
          "radio broadcasting"
        ]
      },
      {
        "name": "Journalism",
        "aliases": [
          "journalism",
          "investigative journalism",
          "news reporting"
        ]
      },
      {
        "name": "Public Relations and Advertising",
        "aliases": [
          "public relations",
          "advertising",
          "pr",
          "ad"
        ]
      }
    ],
    "programmes": [
      "B.Sc. Mass Communication",
      "M.Sc. Mass Communication",
      "Ph.D. Communication Studies"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "School of Tourism, Film, Performing Arts and Cultural Studies",
    "abbreviation": "STFPC",
    "description": "Specializes in creative sector operations, film dramaturgy, tourism planning, and performing arts management.",
    "dean": "Professor Tunji Azeez",
    "departments": [
      {
        "name": "Theater and film arts",
        "aliases": [
          "theatre arts",
          "theatre and film",
          "performing arts"
        ]
      },
      {
        "name": "Film Production",
        "aliases": [
          "film production",
          "cinematography"
        ]
      },
      {
        "name": "tourism and hospitality management",
        "aliases": [
          "tourism",
          "hospitality management",
          "tourism and hospitality"
        ]
      }
    ],
    "programmes": [
      "B.A. Theatre and Film Arts",
      "B.Sc. Tourism and Hospitality Management"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "School of Library, Archival and Information Science",
    "abbreviation": "SLAIS",
    "description": "Delivers specialized coursework in reference structures, archival management, cataloging, and digital resource curation.",
    "dean": "Under Reconstitution",
    "departments": [
      {
        "name": "Library and Information Science",
        "aliases": [
          "library and information science",
          "library science",
          "lis"
        ]
      }
    ],
    "programmes": [
      "Bachelor of Library and Information Science (B.LIS)"
    ],
    "location": "Lagos State University Main Campus, Ojo, Badagry Expressway, Lagos"
  },
  {
    "faculty": "Faculty of Basic Clinical Sciences",
    "abbreviation": "FBCS",
    "description": "Coordinates basic clinical disciplines, toxicology therapeutics, pharmacology sciences, and ophthalmic preparations.",
    "dean": "Under Reconstitution",
    "departments": [
      {
        "name": "Ophthalmology",
        "aliases": [
          "ophthalmology",
          "eye care"
        ]
      },
      {
        "name": "Pharmacology therapeutics and toxicology",
        "aliases": [
          "toxicology",
          "pharmacology therapeutics"
        ]
      }
    ],
    "programmes": [
      "MBBS Advanced Clinical Rotations"
    ],
    "location": "Lagos State University College of Medicine (LASUCOM) Campus, Ikeja, Lagos"
  }
];
