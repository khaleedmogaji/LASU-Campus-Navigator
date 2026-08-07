export const getWalkTimeStr = (distanceMeters: number) => {
  const mins = Math.max(1, Math.round(distanceMeters / 75));
  if (distanceMeters < 1000) {
    return `${mins} min walk (${Math.round(distanceMeters)}m)`;
  } else {
    return `${mins} min walk (${(distanceMeters / 1000).toFixed(1)}km)`;
  }
};
