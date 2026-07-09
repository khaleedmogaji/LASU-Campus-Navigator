import { describe, it, expect } from 'vitest';
import { findShortestPath, getDistance, getTurnDirection } from './pathNetwork';

describe('Pathfinding & Navigation Engine', () => {
  const mainGateCoords: [number, number] = [6.4642, 3.1972];
  const senateCoords: [number, number] = [6.4664, 3.2003];

  describe('getDistance', () => {
    it('should accurately calculate distance using Haversine formula', () => {
      const distance = getDistance(mainGateCoords[0], mainGateCoords[1], senateCoords[0], senateCoords[1]);
      // Distance between gate and senate is roughly 400-500 meters
      expect(distance).toBeGreaterThan(300);
      expect(distance).toBeLessThan(600);
    });
  });

  describe('getBearing & getTurnDirection', () => {
    it('should calculate correct turn bearings', () => {
      // Facing North to facing East should be a right turn
      const turn = getTurnDirection(0, 90);
      expect(turn).toBe('right');

      // Facing North to facing West should be a left turn
      const turnLeft = getTurnDirection(0, 270);
      expect(turnLeft).toBe('left');

      // Continuing straight
      const turnStraight = getTurnDirection(0, 10);
      expect(turnStraight).toBe('straight');
    });
  });

  describe('findShortestPath', () => {
    it('should calculate shortest path between coordinates', () => {
      const path = findShortestPath(mainGateCoords, senateCoords, false);
      expect(path).not.toBeNull();
      if (path) {
        expect(path.coordinates.length).toBeGreaterThan(0);
        expect(path.distance).toBeGreaterThan(0);
        expect(path.duration).toBeGreaterThan(0);
        expect(path.instructions.length).toBeGreaterThan(0);
      }
    });
  });
});
