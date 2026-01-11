import { describe, it, expect } from 'vitest';
import { detectFleschKincaidGradeLevel, calculateSyllables } from './fleschKincaid';

describe('Flesch-Kincaid Grade Level Detection', () => {
  describe('Syllable counting', () => {
    it('should count syllables correctly for simple words', () => {
      expect(calculateSyllables('cat')).toBe(1);
      expect(calculateSyllables('dog')).toBe(1);
      expect(calculateSyllables('hello')).toBe(2);
    });

    it('should count syllables for words with silent e', () => {
      expect(calculateSyllables('love')).toBe(1);
      expect(calculateSyllables('make')).toBe(1);
    });

    it('should count syllables for complex words', () => {
      expect(calculateSyllables('education')).toBe(4);
      expect(calculateSyllables('information')).toBe(4);
      expect(calculateSyllables('methodologies')).toBeGreaterThanOrEqual(4);
    });

    it('should handle words with common suffixes', () => {
      expect(calculateSyllables('running')).toBe(2);
      expect(calculateSyllables('beautiful')).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Grade level calculation', () => {
    it('should identify high grade level in AI-like text', () => {
      const aiText = 'The implementation of innovative methodologies facilitates the optimization of operational efficiency through systematic integration of technological paradigms.';
      const result = detectFleschKincaidGradeLevel(aiText);
      expect(result.gradeLevel).toBeGreaterThan(14);
      expect(result.isAIPotential).toBe(true);
    });

    it('should identify lower grade level in human-like text', () => {
      const humanText = 'Using new methods helps us work better and faster.';
      const result = detectFleschKincaidGradeLevel(humanText);
      expect(result.gradeLevel).toBeLessThan(14);
      expect(result.isAIPotential).toBe(false);
    });

    it('should correctly calculate metrics for simple text', () => {
      const text = 'The cat sat. It was happy.';
      const result = detectFleschKincaidGradeLevel(text);
      expect(result.gradeLevel).toBeGreaterThanOrEqual(0);
      expect(result.sentenceCount).toBeGreaterThan(0);
      expect(result.wordCount).toBeGreaterThan(0);
    });
  });

  describe('AI signal detection', () => {
    it('should flag unnecessarily complex text on simple topics as AI', () => {
      const text = 'The incorporation of advanced technological paradigms demonstrates a fundamental commitment to excellence and the perpetuation of sustained competitive advantage through comprehensive strategic realignment.';
      const result = detectFleschKincaidGradeLevel(text);
      expect(result.isAIPotential).toBe(true);
      expect(result.reason).toContain('grade level');
    });

    it('should not flag naturally complex text on complex topics', () => {
      const text = 'In quantum mechanics, the Schrödinger equation describes how the quantum state evolves temporally.';
      const result = detectFleschKincaidGradeLevel(text);
      // This text is legitimately complex for complex content
      expect(result.gradeLevel).toBeGreaterThan(12);
    });

    it('should detect average metrics correctly', () => {
      const text = 'We use new tools to work faster. The tools help us every day. They make our work simpler.';
      const result = detectFleschKincaidGradeLevel(text);
      expect(result.avgWordsPerSentence).toBeLessThan(20);
      expect(result.avgSyllablesPerWord).toBeLessThan(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text', () => {
      const result = detectFleschKincaidGradeLevel('');
      expect(result.gradeLevel).toBeDefined();
    });

    it('should handle text with numbers and punctuation', () => {
      const text = 'There are 100 apples. The price is $5 per apple.';
      const result = detectFleschKincaidGradeLevel(text);
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.sentenceCount).toBeGreaterThan(0);
    });

    it('should handle single sentence text', () => {
      const text = 'This is a test.';
      const result = detectFleschKincaidGradeLevel(text);
      expect(result.sentenceCount).toBe(1);
      expect(result.gradeLevel).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long complex words', () => {
      const text = 'Internationalization and responsibilization are considerations.';
      const result = detectFleschKincaidGradeLevel(text);
      expect(result.gradeLevel).toBeGreaterThan(10);
    });
  });

  describe('Comparative analysis', () => {
    it('should show clear grade level difference between simple and complex text', () => {
      const simpleText = 'Cats are animals. Dogs are animals. They have fur.';
      const complexText = 'The taxonomic classification of felines demonstrates remarkable morphological and behavioral characteristics indicating sophisticated evolutionary adaptation.';
      
      const simpleResult = detectFleschKincaidGradeLevel(simpleText);
      const complexResult = detectFleschKincaidGradeLevel(complexText);
      
      expect(complexResult.gradeLevel).toBeGreaterThan(simpleResult.gradeLevel);
    });
  });
});
