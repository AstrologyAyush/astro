import { describe, it, expect } from 'vitest';
import { calculateBirthday } from './numerologyUtils';

describe('numerologyUtils', () => {
  describe('calculateBirthday', () => {
    it('should return the correct birthday number for a single-digit day', () => {
      const birthDate = new Date('1990-01-05');
      expect(calculateBirthday(birthDate)).toBe(5);
    });

    it('should return the reduced birthday number for a double-digit day', () => {
      const birthDate = new Date('1990-01-28');
      expect(calculateBirthday(birthDate)).toBe(1); // 2 + 8 = 10, 1 + 0 = 1
    });
  });
});
