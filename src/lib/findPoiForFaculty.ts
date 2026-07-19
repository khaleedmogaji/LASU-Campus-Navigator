import { POI } from "../types";
import { Faculty } from "./lasuKnowledgeBase";

export const findPOIForFaculty = (
  pois: POI[],
  faculty: Faculty,
): POI | undefined => {
  const abbr = faculty.abbreviation.toLowerCase();
  const mapping: { [key: string]: string } = {
    fa: "9", // Faculty of Arts
    fs: "8", // Faculty of Science
    fl: "7", // Faculty of Law
    fe: "12", // Faculty of Education
    fms: "10", // Faculty of Management Sciences
    fss: "11", // Faculty of Social Sciences
    stl: "14", // School of Transport & Logistics
    sc: "13", // School of Communication
    fcs: "13", // Faculty of Clinical Sciences
    fcit: "8", // Faculty of Computing and Information Technology
    stfpc: "9", // School of Tourism, Film, Performing Arts
    slais: "4", // School of Library
  };

  const poiId = mapping[abbr];
  if (poiId) {
    const match = pois.find((p) => String(p.id).trim() === poiId);
    if (match) return match;
  }

  const normalizedFaculty = faculty.faculty
    .toLowerCase()
    .replace(/faculty of|school of/g, "")
    .trim();
  return pois.find(
    (p) =>
      p.name.toLowerCase().includes(normalizedFaculty) ||
      normalizedFaculty.includes(p.name.toLowerCase()),
  );
};
