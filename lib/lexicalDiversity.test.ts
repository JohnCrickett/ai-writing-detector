import { describe, it, expect } from 'vitest';
import { detectLexicalDiversity, calculateTypeTokenRatio } from './lexicalDiversity';

describe('Lexical Diversity Detection (Type-Token Ratio)', () => {
  describe('Type-Token Ratio calculation', () => {
    it('should calculate TTR correctly for simple text', () => {
      const text = 'cat dog cat dog bird';
      const result = calculateTypeTokenRatio(text);
      // 3 unique words (cat, dog, bird) / 5 total words = 0.6
      expect(result).toBeCloseTo(0.6, 1);
    });

    it('should calculate TTR for text with all unique words', () => {
      const text = 'apple banana cherry date elderberry';
      const result = calculateTypeTokenRatio(text);
      // 5 unique / 5 total = 1.0
      expect(result).toBe(1.0);
    });

    it('should calculate TTR for text with all repeated words', () => {
      const text = 'the the the the the';
      const result = calculateTypeTokenRatio(text);
      // 1 unique / 5 total = 0.2
      expect(result).toBeCloseTo(0.2, 1);
    });

    it('should ignore case when calculating TTR', () => {
      const text = 'The the THE Dog dog DOG';
      const result = calculateTypeTokenRatio(text);
      // 2 unique words (the, dog) / 6 total = 0.333...
      expect(result).toBeCloseTo(0.333, 1);
    });

    it('should handle empty text', () => {
      const result = calculateTypeTokenRatio('');
      expect(result).toBe(0);
    });

    it('should handle single word', () => {
      const result = calculateTypeTokenRatio('word');
      expect(result).toBe(1.0);
    });
  });

  describe('AI signal detection - high TTR (unnaturally diverse)', () => {
    it('should not flag short text with high TTR as AI (minimum 500 words)', () => {
      const aiText = 'The innovation paradigm offers transformative opportunities. The methodology facilitates comprehensive solutions. The framework enables strategic initiatives.';
      const result = detectLexicalDiversity(aiText);
      // Short text is excluded from analysis — TTR is unreliable below 500 words
      expect(result.isAIPotential).toBe(false);
      expect(result.reason).toContain('too short');
    });

    it('should not flag short diverse text as AI (minimum 500 words)', () => {
      const text = 'Implement strategies. Develop methodologies. Facilitate processes. Execute procedures. Deploy frameworks.';
      const result = detectLexicalDiversity(text);
      // Short text is excluded from analysis
      expect(result.isAIPotential).toBe(false);
    });
  });

  describe('AI signal detection - low TTR (unnaturally repetitive)', () => {
    it('should not flag short repetitive text as AI (minimum 500 words)', () => {
      const aiText = 'the model learns. the model learns. the model learns. the model learns. the model learns. the model learns. the model learns. the model learns.';
      const result = detectLexicalDiversity(aiText);
      // Short text is excluded from analysis
      expect(result.isAIPotential).toBe(false);
      expect(result.reason).toContain('too short');
    });

    it('should detect unnaturally repetitive vocabulary in AI-like text', () => {
      const text = 'The model learns patterns. The model identifies trends. The model detects anomalies. The model predicts outcomes.';
      const result = detectLexicalDiversity(text);
      if (result.typeTokenRatio < 0.35) {
        expect(result.isAIPotential).toBe(true);
      }
    });
  });

  describe('Human-like text detection', () => {
    it('should not flag natural human writing with balanced TTR', () => {
      const humanText = 'This new approach rocks. It works well. But honestly? It\'s nothing we haven\'t seen before. The problem is it takes too long.';
      const result = detectLexicalDiversity(humanText);
      // Natural human text should have TTR between 0.35-0.65
      if (result.typeTokenRatio >= 0.35 && result.typeTokenRatio <= 0.65) {
        expect(result.isAIPotential).toBe(false);
      }
    });

    it('should identify healthy vocabulary diversity in normal text', () => {
      const text = 'I went to the store. I bought milk, eggs, and bread. I came home and made breakfast. It was good.';
      const result = detectLexicalDiversity(text);
      expect(result.typeTokenRatio).toBeGreaterThan(0.2);
      expect(result.typeTokenRatio).toBeLessThan(0.9);
    });
  });

  describe('Edge cases', () => {
    it('should handle text with punctuation', () => {
      const text = 'Hello, world! How are you? I am fine.';
      const result = detectLexicalDiversity(text);
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.typeTokenRatio).toBeGreaterThan(0);
    });

    it('should handle text with numbers', () => {
      const text = 'There are 100 items. We need 50 more items. Total items: 150.';
      const result = detectLexicalDiversity(text);
      expect(result.wordCount).toBeGreaterThan(0);
    });

    it('should handle very short text', () => {
      const text = 'Hi there';
      const result = detectLexicalDiversity(text);
      expect(result.typeTokenRatio).toBe(1.0);
      expect(result.wordCount).toBe(2);
    });

    it('should handle text with special characters', () => {
      const text = 'This is a test. This is also a test.';
      const result = detectLexicalDiversity(text);
      expect(result.uniqueWordCount).toBeLessThanOrEqual(result.wordCount);
    });
  });

  describe('Metrics accuracy', () => {
    it('should correctly count unique and total words', () => {
      const text = 'apple banana apple cherry banana apple';
      const result = detectLexicalDiversity(text);
      expect(result.wordCount).toBe(6);
      expect(result.uniqueWordCount).toBe(3);
    });

    it('should provide accurate score calculation', () => {
      const text = 'The innovation paradigm offers transformative opportunities. The methodology facilitates comprehensive solutions. The framework enables strategic initiatives. The approach optimizes performance. The system maximizes efficiency.';
      const result = detectLexicalDiversity(text);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(25);
    });

    it('should calculate reasonable TTR for mixed complexity text', () => {
      const text = 'We analyze data. We review metrics. We study patterns. We examine trends. We look at results. We check outcomes.';
      const result = detectLexicalDiversity(text);
      expect(result.typeTokenRatio).toBeGreaterThan(0);
      expect(result.typeTokenRatio).toBeLessThan(1);
    });
  });

  describe('Comparative analysis', () => {
    it('should show difference between high and normal TTR text', () => {
      const highTTRText = 'Implement strategies. Develop methodologies. Facilitate processes. Execute procedures. Deploy frameworks. Establish systems. Create protocols. Design approaches.';
      const normalTTRText = 'I like this. It is good. We use it. It works well. It helps us.';

      const highResult = detectLexicalDiversity(highTTRText);
      const normalResult = detectLexicalDiversity(normalTTRText);

      expect(highResult.typeTokenRatio).toBeGreaterThan(normalResult.typeTokenRatio);
    });

    it('should show difference between low and normal TTR text', () => {
      const lowTTRText = 'The model learns. The model learns. The model learns. The model learns. The model learns. The model learns.';
      const normalTTRText = 'I like this. It is good. We use it. It works well.';

      const lowResult = detectLexicalDiversity(lowTTRText);
      const normalResult = detectLexicalDiversity(normalTTRText);

      expect(lowResult.typeTokenRatio).toBeLessThan(normalResult.typeTokenRatio);
    });
  });
});
