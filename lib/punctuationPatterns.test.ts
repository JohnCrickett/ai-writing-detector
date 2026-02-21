import { describe, it, expect } from 'vitest';
import { detectPunctuationPatterns } from './punctuationPatterns';

describe('Punctuation Patterns Detection', () => {
  describe('Punctuation counting', () => {
    it('should detect semicolons', () => {
      const text = 'The research indicates three key findings; first, the results demonstrate significance.';
      const matches = detectPunctuationPatterns(text);
      const semicolonMatch = matches.find(m => m.phrase.includes('semicolon'));
      expect(semicolonMatch).toBeDefined();
      expect(semicolonMatch?.count).toBe(1);
    });

    it('should detect em-dashes', () => {
      const text = 'Additionally, the implications warrant further study—a fact that bears consideration.';
      const matches = detectPunctuationPatterns(text);
      const dashMatch = matches.find(m => m.phrase.includes('em-dash'));
      expect(dashMatch).toBeDefined();
      expect(dashMatch?.count).toBeGreaterThan(0);
    });

    it('should detect ellipses', () => {
      const text = 'So there are three things... first, it works.';
      const matches = detectPunctuationPatterns(text);
      const ellipsisMatch = matches.find(m => m.phrase.toLowerCase().includes('ellipses'));
      expect(ellipsisMatch).toBeDefined();
      expect(ellipsisMatch?.count).toBeGreaterThan(0);
    });

    it('should detect exclamation marks', () => {
      const text = 'This is important! Really important! Absolutely crucial!';
      const matches = detectPunctuationPatterns(text);
      const exclamationMatch = matches.find(m => m.phrase.toLowerCase().includes('exclamation'));
      expect(exclamationMatch).toBeDefined();
      expect(exclamationMatch?.count).toBe(3);
    });
  });

  describe('AI signal detection', () => {
    it('should flag high semicolon density (>0.05)', () => {
      const text = 'First point; second point. Third point; fourth point. Fifth point; sixth point.';
      const matches = detectPunctuationPatterns(text);
      const aiSignal = matches.find(m => m.phrase.includes('High semicolon'));
      expect(aiSignal).toBeDefined();
      expect(aiSignal?.score).toBeGreaterThan(0);
    });

    it('should flag high em-dash density (>0.08)', () => {
      const text = 'The research demonstrates—importantly—significant findings. The implications—which are considerable—warrant study. The conclusion—clearly—emerges.';
      const matches = detectPunctuationPatterns(text);
      const aiSignal = matches.find(m => m.phrase.includes('High em-dash'));
      expect(aiSignal).toBeDefined();
    });

    it('should flag low ellipsis usage in conversational text with multiple markers', () => {
      const text = 'So I think there are three things, you know. First, it works. Second, it matters. And third, honestly, we need more data.';
      const matches = detectPunctuationPatterns(text);
      const signal = matches.find(m => m.phrase.includes('Low ellipsis'));
      // Conversational text without ellipses despite conversational tone
      expect(signal).toBeDefined();
    });

    it('should not flag low ellipsis usage when text is not truly conversational', () => {
      const text = 'Sounds like an AI problem. It took down Cost Explorer. Push hard for adoption without pushing equally hard to create the right processes.';
      const matches = detectPunctuationPatterns(text);
      const signal = matches.find(m => m.phrase.includes('Low ellipsis'));
      // Normal prose using "like" as a preposition should not trigger
      expect(signal).toBeUndefined();
    });
  });

  describe('AI text examples', () => {
    it('should detect AI characteristics in formal passage', () => {
      const text = 'The research indicates three key findings; first, the results demonstrate significance. Additionally, the implications warrant further study—a fact that bears consideration. Finally, conclusions emerge clearly.';
      const matches = detectPunctuationPatterns(text);
      const highSemicolon = matches.find(m => m.phrase.includes('High semicolon'));
      expect(highSemicolon).toBeDefined();
      expect(highSemicolon?.score).toBeGreaterThan(0);
    });
  });

  describe('Human text examples', () => {
    it('should detect ellipses in human conversational text', () => {
      const text = 'So there are three things... first, it works. Second, it matters. And third... well, we\'ll need more data.';
      const matches = detectPunctuationPatterns(text);
      const ellipsisMatch = matches.find(m => m.phrase.toLowerCase().includes('ellipses'));
      expect(ellipsisMatch).toBeDefined();
      expect(ellipsisMatch?.count).toBeGreaterThan(0);
    });

    it('should not flag human writing with varied punctuation', () => {
      const text = 'I went to the store. Picked up some groceries... maybe too many. But hey, that\'s life!';
      const matches = detectPunctuationPatterns(text);
      const aiSignals = matches.filter(m => m.score > 30);
      // Human text should have low AI scores
      expect(aiSignals.length).toBeLessThan(matches.length);
    });
  });

  describe('Consistency analysis', () => {
    it('should analyze punctuation consistency across paragraphs', () => {
      const text = `First paragraph; with semicolons. Second point; and another. 

      Second paragraph; also with semicolons. Another point; consistent style.`;
      const matches = detectPunctuationPatterns(text);
      const consistency = matches.find(m => m.phrase.toLowerCase().includes('consistent'));
      expect(consistency).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle text with no punctuation marks', () => {
      const text = 'This is a simple sentence';
      const matches = detectPunctuationPatterns(text);
      expect(matches).toBeDefined();
    });

    it('should handle empty text', () => {
      const text = '';
      const matches = detectPunctuationPatterns(text);
      expect(Array.isArray(matches)).toBe(true);
    });

    it('should handle text with only punctuation', () => {
      const text = '...;;;---!!!';
      const matches = detectPunctuationPatterns(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });
});
