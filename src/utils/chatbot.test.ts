import { describe, it, expect } from 'vitest';
import { processQuery } from './chatbot';
import { INITIAL_POIS } from '../data/initialPois';

describe('Chatbot Query Processing Engine', () => {
  it('should correctly process department location queries', () => {
    const res = processQuery('where is computer science?', INITIAL_POIS);
    expect(res.text).toContain('Computer Science');
    expect(res.text).toContain('Faculty of Science');
    expect(res.poi).toBeDefined();
    // Faculty of Science POI ID is '8'
    expect(String(res.poi?.id)).toBe('8');
  });

  it('should correctly fetch the dean of a requested faculty', () => {
    const res = processQuery('who is the dean of the faculty of science?', INITIAL_POIS);
    expect(res.text).toContain('Dean of the Faculty of Science');
    expect(res.text).toContain('Professor'); // Should contain dean's name starting with title
  });

  it('should list departments under a requested faculty', () => {
    const res = processQuery('departments in faculty of arts', INITIAL_POIS);
    expect(res.text).toContain('Departments:');
    expect(res.text).toContain('English');
    expect(res.text).toContain('History and International Studies');
  });

  it('should return fallback message for completely unknown entities', () => {
    const res = processQuery('where is the nearest spaceship launchpad?', INITIAL_POIS);
    expect(res.text).toContain('I could not find that information');
  });
});
