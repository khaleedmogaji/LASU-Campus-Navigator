# LASU Campus Navigation System

A modern web-based campus navigation platform developed for **Lagos State University (LASU), Ojo Campus**.

The system enables students, staff, and visitors to quickly locate campus facilities, search for departments and offices, receive intelligent route guidance, and navigate the campus using an interactive digital map.

Built with modern web technologies, the application combines interactive mapping, shortest-path algorithms, GPS tracking, real-time Firestore synchronization, and a rule-based campus assistant to provide a seamless navigation experience.

---

# 🚀 Features

### 🗺️ Interactive Campus Map

* Interactive map powered by Leaflet
* CARTO Voyager base map
* Zoom-dependent building labels
* Responsive map controls
* Custom campus boundary rendering

### 📍 Smart Navigation

* Turn-by-turn walking directions
* Dijkstra's Shortest Path Algorithm
* Google Maps-style user location indicator
* Dynamic route highlighting
* Nearby landmark references
* Voice-guided navigation
* Walking distance and estimated time

### 🔍 Intelligent Search

* Search buildings, departments, faculties, offices and landmarks
* Search aliases and abbreviations
* Smart autocomplete
* Faculty and department lookup
* Nearby landmark suggestions

### 🤖 Campus Assistant

* Rule-based campus assistant
* Faculty information
* Department lookup
* Dean information
* Administrative office lookup
* Location descriptions
* Navigation prompts

### 📚 Campus Database

* 90+ mapped campus landmarks
* Administrative buildings
* Faculties
* Departments
* Libraries
* Lecture theatres
* Religious centres
* Health facilities
* Hostels
* Sports facilities
* Cafeterias
* Parking areas
* Bus stops
* Banks & ATMs

### ☁️ Real-time Synchronization

* Firebase Firestore integration
* Live POI updates
* Dynamic landmark synchronization
* Cloud-based data management

### 📱 Responsive User Experience

* Mobile-first interface
* Bottom sheet navigation
* Responsive sidebar
* Smooth animations
* Desktop and mobile layouts

### 🎤 Voice Navigation

* Browser Speech Synthesis API
* Spoken navigation instructions
* Voice toggle
* Replay current instruction

### ⚡ Performance Optimizations

* Modular architecture
* Optimized landmark database
* Utility extraction
* Component-based UI
* Optimized search
* Faster production builds

---

# 🛠️ Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion

## Mapping

* Leaflet
* React Leaflet
* CARTO Voyager Tiles
* OpenStreetMap

## Backend

* Firebase Firestore

## Algorithms

* Dijkstra's Shortest Path Algorithm
* Haversine Distance Calculation
* Kalman Filter (GPS smoothing)

## Browser APIs

* Geolocation API
* Speech Synthesis API

---

# 📂 Project Structure

```text
LASU-Campus-Navigator/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── static assets
│
├── src/
│
├── components/
│   ├── CampusAssistant.tsx
│   ├── Map.tsx
│   ├── SearchBar.tsx
│   ├── POIInfo.tsx
│   ├── MobileBottomSheet.tsx
│   ├── WelcomeScreen.tsx
│   ├── ErrorBoundary.tsx
│   ├── SafetyInfoModal.tsx
│   └── WelcomeBackModal.tsx
│
├── data/
│   └── initialPois.ts
│
├── utils/
│   ├── geo.ts
│   └── poi.ts
│
├── lib/
│   ├── pathNetwork.ts
│   ├── kalmanFilter.ts
│   ├── lasuKnowledgeBase.ts
│   └── utils.ts
│
├── firebase.ts
├── types.ts
├── App.tsx
├── main.tsx
└── index.css
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

# 📦 Installation

Clone the repository

```bash
git clone <repository-url>
```

Navigate into the project

```bash
cd LASU-Campus-Navigator
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# 🏗️ Production Build

Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# ☁️ Firebase

The project uses **Firebase Firestore** for real-time storage and synchronization of campus Points of Interest (POIs).

Firestore stores:

* Campus landmarks
* User profiles
* Campus events
* Dynamic location updates

---

# 🚀 Deployment

The project is optimized for deployment on **Vercel**.

```bash
npm run build
```

Deploy the generated `dist` folder or connect the GitHub repository directly to Vercel for automatic deployments.

---

# 📈 Core Capabilities

* Interactive campus mapping
* Real-time GPS positioning
* Intelligent campus search
* Voice-guided navigation
* Turn-by-turn directions
* Landmark-based routing
* Faculty and department search
* Firestore synchronization
* Mobile responsive design
* Rule-based campus assistant

---

# 🔮 Future Enhancements

* Admin dashboard
* Indoor navigation
* Multi-stop routing
* Shuttle route integration
* QR code navigation
* Event notifications
* Offline support (PWA)
* Accessibility routes
* Analytics dashboard
* AI-powered campus assistant

---

# 👨💻 Author

**Mogaji Khaleed Korede**

**Matric Number:** 220591186

Department of Computer Science

Lagos State University (LASU)

---

## Acknowledgements

Special appreciation to the Department of Computer Science, Lagos State University, for the opportunity to develop this project as part of the undergraduate research and software development experience.
