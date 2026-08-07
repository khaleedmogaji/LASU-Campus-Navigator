import { CATEGORY_STYLES } from "../components/Map";
import L from "leaflet";

export const getMarkerIcon = (category: string, isSelected: boolean) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Default;
  let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

  switch (category) {
    case "Administrative":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M2 22h20M12 2v4M4 6h16v16H4zm4 5h2v6H8zm6 0h2v6h-2z"/></svg>`;
      break;
    case "Lecture Theatre":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5"/></svg>`;
      break;
    case "Library":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h10"/></svg>`;
      break;
    case "Sports":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 0-4 4v5c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6a4 4 0 0 0-4-4Z"/></svg>`;
      break;
    case "Building":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"/></svg>`;
      break;
    case "Hostel":
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4.5 h-4.5 text-white"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9M10 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>`;
      break;
  }

  const pulseHtml = isSelected
    ? `<div class="absolute -inset-4 ${style.ping} opacity-30 rounded-full animate-ping z-0"></div>
       <div class="absolute -inset-2 ${style.ping} opacity-20 rounded-full blur-md z-0"></div>`
    : "";

  const activeClass = isSelected
    ? "scale-110 -translate-y-1.5 shadow-2xl"
    : "hover:scale-110 hover:-translate-y-1.5 hover:drop-shadow-xl";

  return L.divIcon({
    className: "custom-poi-marker",
    html: `
      <div class="relative flex flex-col items-center justify-center transition-all duration-300 ease-out transform ${activeClass}">
        ${pulseHtml}
        <div class="relative z-10 flex items-center justify-center drop-shadow-lg">
          <svg class="w-10 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" style="color: ${style.fill};"/>
          </svg>
          <div class="absolute top-2.5 w-5 h-5 flex items-center justify-center text-white z-20">
            ${svgIcon}
          </div>
        </div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
  });
};
