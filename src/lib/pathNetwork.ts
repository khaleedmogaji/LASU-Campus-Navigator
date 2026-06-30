export interface GraphNode {
  id: string;
  lat: number;
  lng: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  blockedOnlyIfCentralBlocked?: boolean;
}

export interface PathResult {
  coordinates: { lat: number; lng: number }[];
  distance: number; // meters
  duration: number; // seconds
  segmentsCount: number; // number of route segments
  instructions: { text: string; distance: number; index: number; coords?: { lat: number; lng: number } }[];
  debugStartNodeId?: string;
  debugEndNodeId?: string;
  debugPathNodeIds?: string[];
}

// Calculate bearing between two coordinates in degrees
export function getBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

// Compare bearings to determine turn direction
export function getTurnDirection(bearing1: number, bearing2: number): 'left' | 'right' | 'straight' {
  let diff = bearing2 - bearing1;
  while (diff < -180) diff += 360;
  while (diff > 180) diff -= 360;
  
  if (diff < -30) return 'left';
  if (diff > 30) return 'right';
  return 'straight';
}


// Haversine distance calculator in meters
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // meters
  const dLat = (Number(lat2) - Number(lat1)) * Math.PI / 180;
  const dLon = (Number(lon2) - Number(lon1)) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(Number(lat1) * Math.PI / 180) * Math.cos(Number(lat2) * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Nodes mapping representing all main landmarks and walkway intersections
export const GRAPH_NODES: GraphNode[] = [
  {
    "id": "1",
    "lat": 6.4664,
    "lng": 3.2003
  },
  {
    "id": "2",
    "lat": 6.4715,
    "lng": 3.2
  },
  {
    "id": "3",
    "lat": 6.4647,
    "lng": 3.2004
  },
  {
    "id": "4",
    "lat": 6.465,
    "lng": 3.2004
  },
  {
    "id": "5",
    "lat": 6.4641,
    "lng": 3.2002
  },
  {
    "id": "6",
    "lat": 6.465,
    "lng": 3.2004
  },
  {
    "id": "7",
    "lat": 6.4674,
    "lng": 3.202
  },
  {
    "id": "8",
    "lat": 6.4663,
    "lng": 3.2
  },
  {
    "id": "9",
    "lat": 6.473,
    "lng": 3.1999
  },
  {
    "id": "10",
    "lat": 6.476,
    "lng": 3.1999
  },
  {
    "id": "11",
    "lat": 6.4581,
    "lng": 3.1916
  },
  {
    "id": "12",
    "lat": 6.468,
    "lng": 3.1995
  },
  {
    "id": "13",
    "lat": 6.4723,
    "lng": 3.2002
  },
  {
    "id": "14",
    "lat": 6.4742,
    "lng": 3.1981
  },
  {
    "id": "15",
    "lat": 6.4685,
    "lng": 3.2013
  },
  {
    "id": "16",
    "lat": 6.4682,
    "lng": 3.1995
  },
  {
    "id": "17",
    "lat": 6.4698,
    "lng": 3.2012
  },
  {
    "id": "18",
    "lat": 6.4748,
    "lng": 3.2001
  },
  {
    "id": "19",
    "lat": 6.474,
    "lng": 3.1984
  },
  {
    "id": "20",
    "lat": 6.4759,
    "lng": 3.1989
  },
  {
    "id": "21",
    "lat": 6.47,
    "lng": 3.2013
  },
  {
    "id": "22",
    "lat": 6.4687,
    "lng": 3.2011
  },
  {
    "id": "23",
    "lat": 6.4711,
    "lng": 3.1999
  },
  {
    "id": "24",
    "lat": 6.4661,
    "lng": 3.2018
  },
  {
    "id": "25",
    "lat": 6.4731,
    "lng": 3.2019
  },
  {
    "id": "26",
    "lat": 6.4716,
    "lng": 3.2002
  },
  {
    "id": "27",
    "lat": 6.4654,
    "lng": 3.2017
  },
  {
    "id": "28",
    "lat": 6.4654,
    "lng": 3.2
  },
  {
    "id": "29",
    "lat": 6.4675,
    "lng": 3.1987
  },
  {
    "id": "30",
    "lat": 6.4679,
    "lng": 3.2016
  },
  {
    "id": "31",
    "lat": 6.4687,
    "lng": 3.2038
  },
  {
    "id": "32",
    "lat": 6.4693,
    "lng": 3.2037
  },
  {
    "id": "33",
    "lat": 6.4644,
    "lng": 3.2037
  },
  {
    "id": "34",
    "lat": 6.4644,
    "lng": 3.2036
  },
  {
    "id": "35",
    "lat": 6.4648,
    "lng": 3.2037
  },
  {
    "id": "36",
    "lat": 6.4691,
    "lng": 3.1987
  },
  {
    "id": "37",
    "lat": 6.4698,
    "lng": 3.2012
  },
  {
    "id": "38",
    "lat": 6.4645,
    "lng": 3.2041
  },
  {
    "id": "39",
    "lat": 6.4648,
    "lng": 3.2041
  },
  {
    "id": "40",
    "lat": 6.4628,
    "lng": 3.203
  },
  {
    "id": "41",
    "lat": 6.4678,
    "lng": 3.1988
  },
  {
    "id": "42",
    "lat": 6.4632,
    "lng": 3.2008
  },
  {
    "id": "43",
    "lat": 6.4624,
    "lng": 3.2029
  },
  {
    "id": "44",
    "lat": 6.4662,
    "lng": 3.2009
  },
  {
    "id": "45",
    "lat": 6.4671,
    "lng": 3.201
  },
  {
    "id": "46",
    "lat": 6.4686,
    "lng": 3.2008
  },
  {
    "id": "47",
    "lat": 6.4628,
    "lng": 3.2006
  },
  {
    "id": "48",
    "lat": 6.4658,
    "lng": 3.2031
  },
  {
    "id": "49",
    "lat": 6.4632,
    "lng": 3.2031
  },
  {
    "id": "50",
    "lat": 6.4658,
    "lng": 3.1982
  },
  {
    "id": "51",
    "lat": 6.4801,
    "lng": 3.1987
  },
  {
    "id": "52",
    "lat": 6.4697,
    "lng": 3.1999
  },
  {
    "id": "53",
    "lat": 6.4691,
    "lng": 3.1985
  },
  {
    "id": "54",
    "lat": 6.4911,
    "lng": 3.1925
  },
  {
    "id": "55",
    "lat": 6.463,
    "lng": 3.2005
  },
  {
    "id": "56",
    "lat": 6.478,
    "lng": 3.197
  },
  {
    "id": "57",
    "lat": 6.4695,
    "lng": 3.202
  },
  {
    "id": "58",
    "lat": 6.4716,
    "lng": 3.2003
  },
  {
    "id": "59",
    "lat": 6.4665,
    "lng": 3.2005
  },
  {
    "id": "60",
    "lat": 6.4715,
    "lng": 3.2001
  },
  {
    "id": "61",
    "lat": 6.4716,
    "lng": 3.2
  },
  {
    "id": "62",
    "lat": 6.466,
    "lng": 3.199
  },
  {
    "id": "63",
    "lat": 6.4645,
    "lng": 3.2005
  },
  {
    "id": "64",
    "lat": 6.4654,
    "lng": 3.2005
  },
  {
    "id": "65",
    "lat": 6.4664,
    "lng": 3.2005
  },
  {
    "id": "66",
    "lat": 6.4705,
    "lng": 3.2003
  },
  {
    "id": "67",
    "lat": 6.4715,
    "lng": 3.2003
  },
  {
    "id": "68",
    "lat": 6.4725,
    "lng": 3.2001
  },
  {
    "id": "69",
    "lat": 6.474,
    "lng": 3.1999
  },
  {
    "id": "70",
    "lat": 6.476,
    "lng": 3.1985
  },
  {
    "id": "71",
    "lat": 6.4679,
    "lng": 3.2008
  },
  {
    "id": "72",
    "lat": 6.4687,
    "lng": 3.2025
  },
  {
    "id": "73",
    "lat": 6.465,
    "lng": 3.1995
  },
  {
    "id": "74",
    "lat": 6.4674,
    "lng": 3.2008
  },
  {
    "id": "75",
    "lat": 6.4698,
    "lng": 3.2005
  },
  {
    "id": "76",
    "lat": 6.4682,
    "lng": 3.2005
  },
  {
    "id": "77",
    "lat": 6.46,
    "lng": 3.195
  },
  {
    "id": "78",
    "lat": 6.4628,
    "lng": 3.2015
  },
  {
    "id": "79",
    "lat": 6.4665,
    "lng": 3.2003
  },
  {
    "id": "80",
    "lat": 6.4665,
    "lng": 3.2005
  },
  {
    "id": "81",
    "lat": 6.4705,
    "lng": 3.2005
  },
  {
    "id": "83",
    "lat": 6.465,
    "lng": 3.2005
  },
  {
    "id": "84",
    "lat": 6.4674,
    "lng": 3.2005
  },
  {
    "id": "85",
    "lat": 6.4658,
    "lng": 3.199
  },
  {
    "id": "86",
    "lat": 6.4691,
    "lng": 3.1999
  },
  {
    "id": "87",
    "lat": 6.4716,
    "lng": 3.1999
  },
  {
    "id": "88",
    "lat": 6.4661,
    "lng": 3.201
  },
  {
    "id": "89",
    "lat": 6.4675,
    "lng": 3.1999
  },
  {
    "id": "90",
    "lat": 6.4644,
    "lng": 3.203
  },
  {
    "id": "91",
    "lat": 6.4658,
    "lng": 3.2015
  },
  {
    "id": "92",
    "lat": 6.4716,
    "lng": 3.2015
  },
  {
    "id": "93",
    "lat": 6.4679,
    "lng": 3.2025
  },
  {
    "id": "94",
    "lat": 6.478,
    "lng": 3.1985
  },
  {
    "id": "95",
    "lat": 6.47,
    "lng": 3.2008
  }
];

// Undirected edges representing pedestrian pathways
export const GRAPH_EDGES: GraphEdge[] = [
  {
    "from": "55",
    "to": "47"
  },
  {
    "from": "47",
    "to": "42"
  },
  {
    "from": "42",
    "to": "43"
  },
  {
    "from": "43",
    "to": "40"
  },
  {
    "from": "40",
    "to": "49"
  },
  {
    "from": "49",
    "to": "33"
  },
  {
    "from": "33",
    "to": "9"
  },
  {
    "from": "9",
    "to": "39"
  },
  {
    "from": "39",
    "to": "38"
  },
  {
    "from": "55",
    "to": "5"
  },
  {
    "from": "47",
    "to": "5"
  },
  {
    "from": "5",
    "to": "4"
  },
  {
    "from": "4",
    "to": "6"
  },
  {
    "from": "6",
    "to": "3"
  },
  {
    "from": "3",
    "to": "28"
  },
  {
    "from": "28",
    "to": "8"
  },
  {
    "from": "8",
    "to": "59"
  },
  {
    "from": "59",
    "to": "1"
  },
  {
    "from": "28",
    "to": "29"
  },
  {
    "from": "29",
    "to": "41"
  },
  {
    "from": "41",
    "to": "12"
  },
  {
    "from": "12",
    "to": "36"
  },
  {
    "from": "36",
    "to": "53"
  },
  {
    "from": "1",
    "to": "44"
  },
  {
    "from": "44",
    "to": "45"
  },
  {
    "from": "45",
    "to": "30"
  },
  {
    "from": "30",
    "to": "7"
  },
  {
    "from": "7",
    "to": "15"
  },
  {
    "from": "4",
    "to": "2",
    "blockedOnlyIfCentralBlocked": true
  },
  {
    "from": "2",
    "to": "61"
  },
  {
    "from": "2",
    "to": "60"
  },
  {
    "from": "60",
    "to": "26"
  },
  {
    "from": "26",
    "to": "58"
  },
  {
    "from": "58",
    "to": "2"
  },
  {
    "from": "2",
    "to": "23"
  },
  {
    "from": "23",
    "to": "13"
  },
  {
    "from": "13",
    "to": "9"
  },
  {
    "from": "9",
    "to": "14"
  },
  {
    "from": "14",
    "to": "10"
  },
  {
    "from": "10",
    "to": "56"
  },
  {
    "from": "56",
    "to": "51"
  },
  {
    "from": "2",
    "to": "25"
  },
  {
    "from": "25",
    "to": "48"
  },
  {
    "from": "48",
    "to": "27"
  },
  {
    "from": "27",
    "to": "44"
  },
  {
    "from": "48",
    "to": "33"
  },
  {
    "from": "22",
    "to": "15"
  },
  {
    "from": "22",
    "to": "57"
  },
  {
    "from": "57",
    "to": "32"
  },
  {
    "from": "50",
    "to": "29"
  },
  {
    "from": "11",
    "to": "47"
  },
  {
    "from": "8",
    "to": "44"
  },
  {
    "from": "7",
    "to": "25"
  },
  {
    "from": "41",
    "to": "36"
  },
  {
    "from": "22",
    "to": "30"
  },
  {
    "from": "53",
    "to": "2"
  },
  {
    "from": "16",
    "to": "4"
  },
  {
    "from": "16",
    "to": "29"
  },
  {
    "from": "46",
    "to": "22"
  },
  {
    "from": "46",
    "to": "15"
  },
  {
    "from": "17",
    "to": "15"
  },
  {
    "from": "17",
    "to": "37"
  },
  {
    "from": "18",
    "to": "2"
  },
  {
    "from": "18",
    "to": "58"
  },
  {
    "from": "19",
    "to": "14"
  },
  {
    "from": "20",
    "to": "14"
  },
  {
    "from": "21",
    "to": "15"
  },
  {
    "from": "24",
    "to": "44"
  },
  {
    "from": "31",
    "to": "32"
  },
  {
    "from": "34",
    "to": "33"
  },
  {
    "from": "52",
    "to": "53"
  },
  {
    "from": "54",
    "to": "56"
  },
  {
    "from": "62",
    "to": "29"
  },
  {
    "from": "62",
    "to": "53"
  },
  {
    "from": "35",
    "to": "33"
  },
  {
    "from": "35",
    "to": "39"
  },
  {
    "from": "55",
    "to": "63"
  },
  {
    "from": "63",
    "to": "64"
  },
  {
    "from": "63",
    "to": "5"
  },
  {
    "from": "63",
    "to": "47"
  },
  {
    "from": "64",
    "to": "65"
  },
  {
    "from": "64",
    "to": "28"
  },
  {
    "from": "64",
    "to": "73"
  },
  {
    "from": "73",
    "to": "4"
  },
  {
    "from": "73",
    "to": "6"
  },
  {
    "from": "73",
    "to": "12"
  },
  {
    "from": "65",
    "to": "66"
  },
  {
    "from": "65",
    "to": "8"
  },
  {
    "from": "65",
    "to": "79"
  },
  {
    "from": "65",
    "to": "44"
  },
  {
    "from": "79",
    "to": "59"
  },
  {
    "from": "66",
    "to": "67"
  },
  {
    "from": "66",
    "to": "74"
  },
  {
    "from": "66",
    "to": "75"
  },
  {
    "from": "66",
    "to": "76"
  },
  {
    "from": "74",
    "to": "7"
  },
  {
    "from": "75",
    "to": "17"
  },
  {
    "from": "75",
    "to": "2"
  },
  {
    "from": "76",
    "to": "16"
  },
  {
    "from": "76",
    "to": "22"
  },
  {
    "from": "67",
    "to": "68"
  },
  {
    "from": "67",
    "to": "61"
  },
  {
    "from": "67",
    "to": "60"
  },
  {
    "from": "68",
    "to": "69"
  },
  {
    "from": "68",
    "to": "9"
  },
  {
    "from": "68",
    "to": "23"
  },
  {
    "from": "69",
    "to": "70"
  },
  {
    "from": "69",
    "to": "18"
  },
  {
    "from": "69",
    "to": "19"
  },
  {
    "from": "69",
    "to": "15"
  },
  {
    "from": "70",
    "to": "56"
  },
  {
    "from": "70",
    "to": "20"
  },
  {
    "from": "70",
    "to": "51"
  },
  {
    "from": "71",
    "to": "30"
  },
  {
    "from": "71",
    "to": "65"
  },
  {
    "from": "72",
    "to": "31"
  },
  {
    "from": "72",
    "to": "71"
  },
  {
    "from": "77",
    "to": "11"
  },
  {
    "from": "77",
    "to": "63"
  },
  {
    "from": "78",
    "to": "41"
  },
  {
    "from": "78",
    "to": "43"
  },
  {
    "from": "78",
    "to": "47"
  },
  {
    "from": "78",
    "to": "63"
  },
  {
    "from": "80",
    "to": "65"
  },
  {
    "from": "80",
    "to": "79"
  },
  {
    "from": "81",
    "to": "66"
  },
  {
    "from": "81",
    "to": "75"
  },
  {
    "from": "83",
    "to": "63"
  },
  {
    "from": "83",
    "to": "64"
  },
  {
    "from": "83",
    "to": "73"
  },
  {
    "from": "84",
    "to": "79"
  },
  {
    "from": "84",
    "to": "66"
  },
  {
    "from": "84",
    "to": "74"
  },
  {
    "from": "85",
    "to": "50"
  },
  {
    "from": "85",
    "to": "73"
  },
  {
    "from": "86",
    "to": "53"
  },
  {
    "from": "86",
    "to": "66"
  },
  {
    "from": "86",
    "to": "87"
  },
  {
    "from": "87",
    "to": "58"
  },
  {
    "from": "87",
    "to": "61"
  },
  {
    "from": "87",
    "to": "86"
  },
  {
    "from": "88",
    "to": "22"
  },
  {
    "from": "88",
    "to": "24"
  },
  {
    "from": "88",
    "to": "76"
  },
  {
    "from": "89",
    "to": "29"
  },
  {
    "from": "89",
    "to": "74"
  },
  {
    "from": "90",
    "to": "33"
  },
  {
    "from": "90",
    "to": "34"
  },
  {
    "from": "90",
    "to": "35"
  },
  {
    "from": "90",
    "to": "78"
  },
  {
    "from": "91",
    "to": "48"
  },
  {
    "from": "91",
    "to": "71"
  },
  {
    "from": "92",
    "to": "25"
  },
  {
    "from": "92",
    "to": "26"
  },
  {
    "from": "92",
    "to": "75"
  },
  {
    "from": "93",
    "to": "30"
  },
  {
    "from": "93",
    "to": "32"
  },
  {
    "from": "93",
    "to": "72"
  },
  {
    "from": "94",
    "to": "70"
  },
  {
    "from": "94",
    "to": "56"
  },
  {
    "from": "95",
    "to": "21"
  },
  {
    "from": "95",
    "to": "75"
  }
];

export function findShortestPath(
  startLatLng: [number, number],
  endLatLng: [number, number],
  isRouteBlocked: boolean
): PathResult {
  const startLat = Number(startLatLng[0]);
  const startLng = Number(startLatLng[1]);
  const endLat = Number(endLatLng[0]);
  const endLng = Number(endLatLng[1]);

  const directDist = getDistance(startLat, startLng, endLat, endLng);

  // 1. Find top 3 closest nodes to start and end points
  const startCandidates = GRAPH_NODES
    .map(node => ({
      node,
      dist: getDistance(startLat, startLng, Number(node.lat), Number(node.lng))
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  const endCandidates = GRAPH_NODES
    .map(node => ({
      node,
      dist: getDistance(endLat, endLng, Number(node.lat), Number(node.lng))
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  // 2. Build adjacency list
  const adj: { [key: string]: { node: string; weight: number }[] } = {};
  GRAPH_NODES.forEach(node => {
    adj[node.id] = [];
  });

  GRAPH_EDGES.forEach(edge => {
    if (isRouteBlocked && edge.blockedOnlyIfCentralBlocked) {
      return;
    }
    const nodeFrom = GRAPH_NODES.find(n => n.id === edge.from);
    const nodeTo = GRAPH_NODES.find(n => n.id === edge.to);
    if (nodeFrom && nodeTo) {
      const weight = getDistance(Number(nodeFrom.lat), Number(nodeFrom.lng), Number(nodeTo.lat), Number(nodeTo.lng));
      adj[edge.from].push({ node: edge.to, weight });
      adj[edge.to].push({ node: edge.from, weight });
    }
  });

  // Helper to run standard Dijkstra between a start node and end node
  function runDijkstra(sId: string, eId: string) {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const queue: string[] = [];

    GRAPH_NODES.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      queue.push(node.id);
    });

    distances[sId] = 0;

    while (queue.length > 0) {
      let u = queue[0];
      let minD = distances[u];
      let minIdx = 0;

      for (let i = 1; i < queue.length; i++) {
        const node = queue[i];
        if (distances[node] < minD) {
          minD = distances[node];
          u = node;
          minIdx = i;
        }
      }

      if (u === eId || distances[u] === Infinity) {
        break;
      }

      queue.splice(minIdx, 1);

      const neighbors = adj[u] || [];
      neighbors.forEach(neighbor => {
        if (queue.includes(neighbor.node)) {
          const alt = distances[u] + neighbor.weight;
          if (alt < distances[neighbor.node]) {
            distances[neighbor.node] = alt;
            previous[neighbor.node] = u;
          }
        }
      });
    }

    return { distances, previous };
  }

  // Find the candidate pair that gives the best overall path
  let bestPathNodeIds: string[] = [];
  let bestTotalDist = Infinity;
  let bestStartMinDist = 0;
  let bestEndMinDist = 0;
  let bestStartNodeId = '';
  let bestEndNodeId = '';

  for (const sCand of startCandidates) {
    // Avoid choosing nodes that are excessively distant (e.g. > 150m) unless absolutely necessary
    if (sCand.dist > 150 && bestTotalDist < Infinity) continue;

    for (const eCand of endCandidates) {
      if (eCand.dist > 150 && bestTotalDist < Infinity) continue;

      const { distances, previous } = runDijkstra(sCand.node.id, eCand.node.id);
      const dijkstraDist = distances[eCand.node.id];

      if (dijkstraDist !== Infinity) {
        const candidateTotalDist = sCand.dist + dijkstraDist + eCand.dist;
        
        // Detour ratio validation: prevent detours that are more than 3.5 times the direct distance
        // unless direct distance is very small (e.g. < 50m) where detour ratios are naturally high
        const ratio = candidateTotalDist / Math.max(10, directDist);
        if (ratio > 3.5 && directDist > 50 && bestTotalDist < Infinity) {
          continue; // Skip this detour
        }

        if (candidateTotalDist < bestTotalDist) {
          bestTotalDist = candidateTotalDist;
          bestStartMinDist = sCand.dist;
          bestEndMinDist = eCand.dist;
          bestStartNodeId = sCand.node.id;
          bestEndNodeId = eCand.node.id;

          // Reconstruct path
          const pathNodeIds: string[] = [];
          let curr: string | null = eCand.node.id;
          while (curr !== null) {
            pathNodeIds.unshift(curr);
            curr = previous[curr];
          }
          bestPathNodeIds = pathNodeIds;
        }
      }
    }
  }

  // Fallback to direct line if no valid path was found
  if (bestTotalDist === Infinity || bestPathNodeIds.length === 0) {
    const duration = Math.round(directDist / 1.2);
    console.log("[Pathfinding Debug] Fallback to direct line path. Distance:", directDist.toFixed(1) + "m");
    return {
      coordinates: [
        { lat: startLat, lng: startLng },
        { lat: endLat, lng: endLng }
      ],
      distance: directDist,
      duration,
      segmentsCount: 1,
      instructions: [{ text: 'Walk directly to your destination.', distance: directDist, index: 1 }]
    };
  }

  // Convert node path to coordinate array
  const coordinates: { lat: number; lng: number }[] = [];
  coordinates.push({ lat: startLat, lng: startLng });

  bestPathNodeIds.forEach(nodeId => {
    const node = GRAPH_NODES.find(n => n.id === nodeId);
    if (node) {
      coordinates.push({ lat: Number(node.lat), lng: Number(node.lng) });
    }
  });

  coordinates.push({ lat: endLat, lng: endLng });

  // Log the computed path for debugging
  console.log(`[Pathfinding Debug] Dijkstra route computed. Start Node: ${bestStartNodeId}, End Node: ${bestEndNodeId}, Path Nodes: ${bestPathNodeIds.join(' -> ')}, Path Distance: ${bestTotalDist.toFixed(1)}m`);

  const instructions: { text: string; distance: number; index: number; coords?: { lat: number; lng: number } }[] = [];
  const pathNodes = bestPathNodeIds.map(id => GRAPH_NODES.find(n => n.id === id)).filter(Boolean) as GraphNode[];

  // Calculate bearings along the path
  const bearings: number[] = [];
  for (let i = 0; i < pathNodes.length - 1; i++) {
    bearings.push(getBearing(pathNodes[i].lat, pathNodes[i].lng, pathNodes[i+1].lat, pathNodes[i+1].lng));
  }

  const NODE_DISPLAY_NAMES: Record<string, string> = {
    "1": "Lagos State University (Main Campus)",
    "2": "Senate House",
    "3": "Senate Chambers",
    "4": "Fatiu Ademola Akesode Library",
    "5": "Taslim Olawale Elias Law Library",
    "6": "LASU Bookshop",
    "7": "Faculty of Law",
    "8": "Faculty of Science",
    "9": "Faculty of Arts",
    "10": "Faculty of Management Sciences",
    "11": "Faculty of Social Sciences",
    "12": "Faculty of Education",
    "13": "School of Communication (LASUSOC)",
    "14": "School of Transport and Logistics",
    "15": "Postgraduate School",
    "16": "MBA Complex",
    "17": "AJ Complex",
    "18": "LASU ODLRI Office",
    "19": "Centre for Entrepreneurship Studies",
    "20": "Africa Centre of Excellence (ACEITSE)",
    "21": "Exams and Records Office",
    "22": "LASU ICT Centre",
    "23": "LASU Radio Station",
    "24": "LASU Press Centre",
    "25": "LASU Main Auditorium",
    "26": "AWAN Theatre Hall",
    "27": "LASU Health Centre",
    "28": "LASU Central Mosque",
    "29": "LASU Chapel of Light",
    "30": "LASU Sport Centre",
    "31": "Hussam Okoya-Thomas Sports Complex",
    "32": "LASU Sports Complex (Secondary Facility)",
    "33": "Eco Market",
    "34": "Amala Extra Restaurant",
    "35": "Costain Food Canteen",
    "36": "Olaiya Staff Food Canteen",
    "37": "Kena's Kitchen",
    "38": "Access Bank",
    "39": "Wema Bank ATM",
    "40": "Wema Bank Branch",
    "41": "United Bank for Africa (UBA)",
    "42": "Sterling Bank",
    "43": "LASU Microfinance Bank",
    "44": "LASU Press Bus Stop",
    "45": "Law Bus Stop",
    "46": "MBA Bus Stop",
    "47": "LASU Main Bus Station",
    "48": "Student Union Buildings",
    "49": "LASU Post Office",
    "50": "LASU Staff School",
    "51": "LASU International School (LASUIS)",
    "52": "LASU Car Wash",
    "53": "LASU Senior Staff Club",
    "54": "Staff Quarters",
    "55": "LASU Main Gate",
    "56": "LASU Back Gate",
    "57": "TETFund Student Hostel",
    "58": "LASU Student Affairs Building",
    "59": "LASU Bursary",
    "60": "LASU Registry",
    "61": "Vice-Chancellor's Office",
    "62": "LASU Works and Services",
    "63": "Main Gate Junction",
    "64": "Mosque Walkway Intersection",
    "65": "Faculty of Science Junction",
    "66": "Senate Building Junction",
    "67": "Senate House Pathway",
    "68": "Faculty of Arts Road Junction",
    "69": "Postgraduate Road Corner",
    "70": "Back Gate Road Intersection",
    "71": "Sports Centre Pathway",
    "72": "Sports Complex Pathway",
    "73": "Library Walkway Junction",
    "74": "Faculty of Law Walkway",
    "75": "AJ Complex Intersection",
    "76": "MBA Complex Pathway",
    "77": "Social Sciences Access Pathway",
    "78": "Main Bus Station Pathway",
    "79": "LASU Bursary Pathway",
    "80": "Bursary Junction",
    "81": "Senate Building Junction",
    "83": "Library Pedestrian Crossing",
    "84": "Law Block Pedestrian Crossing",
    "85": "Staff School Junction",
    "86": "Senior Staff Club Junction",
    "87": "Student Affairs Junction",
    "88": "ICT / Press Junction",
    "89": "Chapel Pathway Intersection",
    "90": "Eco Market Junction",
    "91": "Student Union Junction",
    "92": "Auditorium / Theatre Junction",
    "93": "Sports Centre East Intersection",
    "94": "Main Road Turning Point North",
    "95": "Exams and Records Crossing",
    "96": "Social Sciences Road Corner",
    "97": "Social Sciences Road Midpoint",
    "98": "Social Sciences Road Junction",
    "99": "LASUIS Road Segment 1",
    "100": "LASUIS Road Segment 2",
    "101": "MBA Area Junction",
    "102": "Postgraduate Walkway Corner",
    "103": "Bank Avenue Junction",
    "104": "Microfinance Road Corner",
    "105": "Canteen Walkway Intersection"
  };

  let stepIndex = 1;
  const firstNode = pathNodes[0];
  const firstNodeIdNum = Number(firstNode.id);
  const isFirstNodeLandmark = firstNodeIdNum >= 1 && firstNodeIdNum <= 62;
  const firstNodeName = NODE_DISPLAY_NAMES[firstNode.id] || firstNode.id.toUpperCase();

  instructions.push({
    text: isFirstNodeLandmark
      ? `Walk straight towards the ${firstNodeName}.`
      : `Walk straight towards the next walkway junction.`,
    distance: Math.round(bestStartMinDist),
    index: stepIndex++,
    coords: { lat: firstNode.lat, lng: firstNode.lng }
  });

  for (let i = 0; i < pathNodes.length - 1; i++) {
    const fromNode = pathNodes[i];
    const toNode = pathNodes[i+1];
    const segmentDist = getDistance(fromNode.lat, fromNode.lng, toNode.lat, toNode.lng);

    const toNodeIdNum = Number(toNode.id);
    const isToNodeLandmark = toNodeIdNum >= 1 && toNodeIdNum <= 62;
    const toNodeName = NODE_DISPLAY_NAMES[toNode.id] || toNode.id.toUpperCase();
    const isDestination = (i === pathNodes.length - 2);

    let turn: 'left' | 'right' | 'straight' = 'straight';
    if (!isDestination) {
      const b1 = bearings[i];
      const b2 = bearings[i+1];
      turn = getTurnDirection(b1, b2);
    }

    let instructionText = '';
    if (isDestination) {
      instructionText = isToNodeLandmark
        ? `Continue straight to reach your destination, the ${toNodeName}.`
        : `Continue straight to reach your destination.`;
    } else if (turn !== 'straight') {
      instructionText = isToNodeLandmark
        ? `Turn ${turn} at the ${toNodeName}.`
        : `At the next intersection, turn ${turn}.`;
    } else {
      instructionText = isToNodeLandmark
        ? `Continue straight past the ${toNodeName}.`
        : `At the next walkway junction, continue straight.`;
    }

    instructions.push({
      text: instructionText,
      distance: Math.round(segmentDist),
      index: stepIndex++,
      coords: { lat: toNode.lat, lng: toNode.lng }
    });
  }

  instructions.push({
    text: `Arrive at your destination.`,
    distance: Math.round(bestEndMinDist),
    index: stepIndex++,
    coords: { lat: endLat, lng: endLng }
  });

  const duration = Math.round(bestTotalDist / 1.2);

  return {
    coordinates,
    distance: bestTotalDist,
    duration,
    segmentsCount: coordinates.length - 1,
    instructions,
    debugStartNodeId: bestStartNodeId,
    debugEndNodeId: bestEndNodeId,
    debugPathNodeIds: bestPathNodeIds
  };
}
