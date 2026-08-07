export const CATEGORIES = [
  "Academic",
  "Administrative",
  "Hostel",
  "Food & Drink",
  "Bank",
  "Religious",
  "Sports",
  "Transport",
  "Security",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type TabKey = "landmarks" | "faculties" | "departments";

export interface Landmark {
  id: string;
  name: string;
  category: Category;
  lat: string;
  lng: string;
  description: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
}

export interface AppData {
  landmarks: Landmark[];
  faculties: Faculty[];
  departments: Department[];
}

// Discriminated-union editing state so each tab's form is typed to its own shape
export type EditingState =
  | {
      mode: "new" | "edit";
      tab: "landmarks";
      item: Landmark | Omit<Landmark, "id">;
    }
  | {
      mode: "new" | "edit";
      tab: "faculties";
      item: Faculty | Omit<Faculty, "id">;
    }
  | {
      mode: "new" | "edit";
      tab: "departments";
      item: Department | Omit<Department, "id">;
    };

export const seedData: AppData = {
  landmarks: [
    {
      id: "l1",
      name: "Faculty of Arts",
      category: "Academic",
      lat: "6.4657",
      lng: "3.1975",
      description: "Main Faculty of Arts building, near Moot Court.",
    },
    {
      id: "l2",
      name: "Science Library",
      category: "Academic",
      lat: "6.4638",
      lng: "3.1968",
      description: "Central library serving the Faculty of Science.",
    },
    {
      id: "l3",
      name: "LASU Health Centre",
      category: "Other",
      lat: "6.4645",
      lng: "3.1983",
      description: "Campus medical centre.",
    },
    {
      id: "l4",
      name: "LASU Central Mosque",
      category: "Religious",
      lat: "6.4634",
      lng: "3.1972",
      description: "Central mosque for Friday and daily prayers.",
    },
    {
      id: "l5",
      name: "LASU Chapel of Light",
      category: "Religious",
      lat: "6.4659",
      lng: "3.1963",
      description: "Campus chapel near the Law block.",
    },
    {
      id: "l6",
      name: "Zenith Bank",
      category: "Bank",
      lat: "6.4626",
      lng: "3.1994",
      description: "On-campus Zenith Bank branch.",
    },
    {
      id: "l7",
      name: "Sterling Bank LASU",
      category: "Bank",
      lat: "6.4611",
      lng: "3.1964",
      description: "On-campus Sterling Bank branch.",
    },
    {
      id: "l8",
      name: "LASU Main Bus Station (Alasia Terminal)",
      category: "Transport",
      lat: "6.4604",
      lng: "3.1966",
      description: "Main shuttle and bus terminal.",
    },
    {
      id: "l9",
      name: "Costain Food Canteen",
      category: "Food & Drink",
      lat: "6.4630",
      lng: "3.1998",
      description: "Popular canteen near Faculty of Arts / Eco Market.",
    },
    {
      id: "l10",
      name: "LASUSU Student Arcade",
      category: "Other",
      lat: "6.4644",
      lng: "3.2001",
      description: "Student union arcade and hangout spot.",
    },
  ],
  faculties: [
    { id: "f1", name: "Faculty of Arts", code: "FA" },
    { id: "f2", name: "Faculty of Science", code: "FSC" },
    { id: "f3", name: "Faculty of Law", code: "LAW" },
    { id: "f4", name: "Faculty of Engineering", code: "ENG" },
    { id: "f5", name: "Faculty of Education", code: "EDU" },
    { id: "f6", name: "Faculty of Social Sciences", code: "SSC" },
  ],
  departments: [
    { id: "d1", name: "Computer Science", facultyId: "f2" },
    { id: "d2", name: "International & Islamic Law", facultyId: "f3" },
    { id: "d3", name: "English Language", facultyId: "f1" },
    { id: "d4", name: "Civil Engineering", facultyId: "f4" },
    { id: "d5", name: "Economics", facultyId: "f6" },
    { id: "d6", name: "Educational Foundations", facultyId: "f5" },
  ],
};
