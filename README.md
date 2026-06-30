# LASU Campus Navigation System

A web-based campus navigation system developed for Lagos State University (LASU), Ojo Campus. The system enables users to search for campus locations, view landmarks, and navigate between locations using Dijkstra's shortest path algorithm and an interactive map.

---

## 🚀 Features

* **Interactive Campus Map**: Powered by Leaflet with customized markers, geofenced campus boundaries, and custom image layers.
* **Campus Search**: Find building entrances, walkways, lecture halls, and administrative offices instantly.
* **Route Navigation**: Generates turn-by-turn walking directions for students and staff.
* **Dijkstra Shortest Path Algorithm**: Computes the absolute shortest route across walkway junctions and crossings.
* **Rule-Based Campus Assistant**: Searchable knowledge assistant panel with custom aliases and parent faculty lookup.
* **Firebase Firestore Integration**: Real-time updates and synchronization for POIs.
* **Responsive Design**: Mobile-first interface utilizing responsive bottom sheets and sticky action panels.
* **Voice Navigation Support**: Built-in speech synthesis engine to read instructions aloud (can be toggled on/off).

---

## 🛠️ Technologies Used

* **React 19**: Core framework for declarative, component-driven UI.
* **TypeScript**: Type-safe logic across coordinates, graphs, and search entities.
* **Vite**: Ultra-fast build tool and development server.
* **Tailwind CSS**: Utility-first CSS styling.
* **Leaflet**: Interactive map rendering layer.
* **Leaflet Routing Machine**: Path display and routing overlay.
* **Firebase Firestore**: Real-time database for Point of Interest (POI) storage.
* **Framer Motion**: Smooth animations and gesture-driven bottom sheet transitions.

---

## 📂 Project Structure

```
LASU-Campus-Navigator/
├── public/                 # Static assets (images, service-worker, favicon)
├── src/
│   ├── components/         # Reusable React components
│   │   ├── CampusAssistant.tsx  # AI/Rule-based Chatbot interface
│   │   ├── Map.tsx              # Leaflet Map container & marker layer
│   │   ├── MobileBottomSheet.tsx# Responsive drawer container
│   │   ├── POIInfo.tsx          # Detail card with media slider & buttons
│   │   ├── SearchBar.tsx        # Auto-complete campus search
│   │   └── WelcomeScreen.tsx    # Dashboard landing modal
│   ├── lib/                # Core helper libraries & algorithms
│   │   ├── pathNetwork.ts       # Dijkstra shortest path graph & nodes
│   │   ├── lasuKnowledgeBase.ts # Faculties, deans, and departments list
│   │   ├── kalmanFilter.ts      # GPS coordinate smoothing filter
│   │   └── utils.ts             # Tailwind class merging utility
│   ├── App.tsx             # Main application layout, state, & controllers
│   ├── firebase.ts         # Firebase App initialization & SDK setups
│   ├── index.css           # Global CSS variables & Tailwind directives
│   ├── main.tsx            # DOM entry point & Service Worker registration
│   └── types.ts            # POI, Route, Node, and Faculty type definitions
├── vite.config.ts          # Vite compilation & plugin settings
├── tsconfig.json           # TypeScript configuration
└── package.json            # Scripts & package dependencies
```

---

## 📦 Installation

To run the project locally, follow these steps:

1. Clone the project repository.
2. Open your terminal in the project root directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the local development server:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3000`.

---

## 🏗️ Production Build

To generate the optimized production assets:

```bash
npm run build
```

This compiles the source code and outputs static assets into the `dist/` directory, ready to be served by any static host.

---

## 🔑 Environment Variables

The application does not require any custom environment variables for its core functionality. Firebase configuration is loaded dynamically at runtime from:
* `firebase-applet-config.json` (located in the project root)

---

## 🚀 Deployment

The project can be deployed seamlessly to Vercel:

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Import your repository.
3. Vercel will automatically detect Vite. Keep the default settings:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Click **Deploy**.

---

## ✍️ Author

* **Mogaji khaleed Korede 220591186**

---

