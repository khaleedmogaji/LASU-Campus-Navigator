import { describe, it, expect } from 'vitest';
import { isPointInPolygon, CAMPUS_POLYGON } from './geo';

describe('Geographic Bound Helpers', () => {
  describe('isPointInPolygon', () => {
    it('should return true for points inside the campus polygon bounds', () => {
      // Senate Building coordinates
      const senatePoint: [number, number] = [6.4664, 3.2003];
      expect(isPointInPolygon(senatePoint, CAMPUS_POLYGON)).toBe(true);

      // Main Gate coordinates
      const gatePoint: [number, number] = [6.4642, 3.1972];
      expect(isPointInPolygon(gatePoint, CAMPUS_POLYGON)).toBe(true);
    });

    it('should return false for points clearly outside the campus bounds', () => {
      // Off-campus point far away (e.g. Ikeja or Atlantic Ocean)
      const offCampusFarPoint: [number, number] = [6.6000, 3.3500];
      expect(isPointInPolygon(offCampusFarPoint, CAMPUS_POLYGON)).toBe(false);

      const nearButOutsidePoint: [number, number] = [6.4500, 3.1800];
      expect(isPointInPolygon(nearButOutsidePoint, CAMPUS_POLYGON)).toBe(false);
    });
  });
});
