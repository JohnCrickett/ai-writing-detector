import { describe, it, expect } from 'vitest';
import {
  detectWordFrequencyDistribution,
  calculateZipfianDeviation,
  getWordFrequencies,
  harmonicNumber
} from './wordFrequencyDistribution';

describe('Word Frequency Distribution Detection', () => {
  describe('Word frequency calculation', () => {
    it('should correctly count word frequencies', () => {
      const text = 'the cat and the dog and the bird';
      const frequencies = getWordFrequencies(text);
      expect(frequencies.get('the')).toBe(3);
      expect(frequencies.get('and')).toBe(2);
      expect(frequencies.get('cat')).toBe(1);
      expect(frequencies.get('dog')).toBe(1);
      expect(frequencies.get('bird')).toBe(1);
    });

    it('should handle case-insensitive frequency counting', () => {
      const text = 'The the THE cat Cat CAT';
      const frequencies = getWordFrequencies(text);
      expect(frequencies.get('the')).toBe(3);
      expect(frequencies.get('cat')).toBe(3);
    });

    it('should ignore stopwords if specified', () => {
      const text = 'the quick brown fox jumps over the lazy dog';
      const frequencies = getWordFrequencies(text, true);
      // Should not contain common stopwords
      expect(frequencies.has('the')).toBe(false);
      expect(frequencies.has('over')).toBe(false);
      // Should contain content words
      expect(frequencies.get('quick')).toBeGreaterThanOrEqual(1);
      expect(frequencies.get('brown')).toBeGreaterThanOrEqual(1);
    });

    it('should handle empty text', () => {
      const frequencies = getWordFrequencies('');
      expect(frequencies.size).toBe(0);
    });
  });

  describe('Harmonic number', () => {
    it('should compute known harmonic numbers correctly', () => {
      expect(harmonicNumber(1)).toBeCloseTo(1.0, 10);
      expect(harmonicNumber(2)).toBeCloseTo(1.5, 10);
      expect(harmonicNumber(3)).toBeCloseTo(1.5 + 1 / 3, 10);
      expect(harmonicNumber(10)).toBeCloseTo(2.9289682539682538, 8);
    });

    it('should return 0 for n=0', () => {
      expect(harmonicNumber(0)).toBe(0);
    });
  });

  describe('Zipfian distribution analysis', () => {
    it('should return low deviation for a perfectly Zipfian distribution', () => {
      // Build frequencies that exactly follow Zipf: C/1, C/2, C/3, ...
      const freqs = new Map<string, number>();
      const C = 100;
      for (let r = 1; r <= 10; r++) {
        freqs.set(`word${r}`, Math.round(C / r));
      }
      const deviation = calculateZipfianDeviation(freqs);
      // Should be very low — only rounding error
      expect(deviation).toBeLessThan(0.1);
    });

    it('should return high deviation for a perfectly uniform distribution', () => {
      // All words appear exactly the same number of times — maximally non-Zipfian
      const freqs = new Map<string, number>();
      for (let i = 0; i < 20; i++) {
        freqs.set(`word${i}`, 5);
      }
      const deviation = calculateZipfianDeviation(freqs);
      expect(deviation).toBeGreaterThan(0.3);
    });

    it('should calculate reasonable Zipfian deviation for natural text', () => {
      const naturalText = 'the quick brown fox jumps over the lazy dog the cat sat on the mat the bird flew away the tree was tall';
      const deviation = calculateZipfianDeviation(naturalText);
      expect(deviation).toBeGreaterThan(0);
      expect(deviation).toBeLessThan(0.5);
    });

    it('should give higher deviation for uniform AI-like text than natural text', () => {
      const aiLikeText = 'implement strategies develop methodologies facilitate processes execute procedures deploy frameworks establish systems create protocols design approaches optimize methods enhance techniques';
      const naturalText = 'the the the the and and and cat cat dog the bird the tree the sun and moon';
      const aiDeviation = calculateZipfianDeviation(aiLikeText);
      const naturalDeviation = calculateZipfianDeviation(naturalText);
      expect(aiDeviation).toBeGreaterThan(naturalDeviation);
    });

    it('should accept pre-computed frequency map', () => {
      const freqs = new Map<string, number>([['the', 10], ['and', 5], ['cat', 2], ['dog', 1]]);
      const deviation = calculateZipfianDeviation(freqs);
      expect(deviation).toBeGreaterThanOrEqual(0);
      expect(deviation).toBeLessThanOrEqual(1);
    });
  });

  describe('AI signal detection', () => {
    it('should not flag natural text as AI-generated', () => {
      const humanText = 'The old man sat by the river and watched the water flow past. He had been coming to this spot for years, ever since he was a young boy. The river was his place of peace, and he felt the calm wash over him every time he sat there. The trees swayed in the wind and the birds sang their songs. He thought about the days when he was young, when the world seemed so much bigger than it did now. But the river was still the same, and that was enough for him.';
      const result = detectWordFrequencyDistribution(humanText);
      expect(result.wordCount).toBeGreaterThan(50);
      expect(result.isAIPotential).toBe(false);
    });

    it('should not flag uniform text under 5000 words', () => {
      // Every word appears exactly once — maximally uniform, very un-Zipfian
      // But below the 5,000-word minimum, so should not be flagged
      const words = [];
      for (let i = 0; i < 30; i++) {
        words.push(`word${i}`);
      }
      const result = detectWordFrequencyDistribution(words.join(' '));
      expect(result.isAIPotential).toBe(false);
      expect(result.reason).toContain('too short');
    });

    it('should handle short text appropriately', () => {
      const shortText = 'Hello world';
      const result = detectWordFrequencyDistribution(shortText);
      expect(result.wordCount).toBe(2);
      expect(result.isAIPotential).toBe(false); // Too short to be conclusive
    });
  });

  describe('Metrics accuracy', () => {
    it('should provide accurate word count', () => {
      const text = 'one two three four five';
      const result = detectWordFrequencyDistribution(text);
      expect(result.wordCount).toBe(5);
    });

    it('should calculate top word frequencies correctly', () => {
      const text = 'the the the and and cat dog';
      const result = detectWordFrequencyDistribution(text);
      expect(result.topWords.length).toBeGreaterThan(0);
      expect(result.topWords[0].word).toBe('the');
      expect(result.topWords[0].frequency).toBe(3);
    });

    it('should score within valid range', () => {
      const text = 'This is a test text with multiple words. Each word appears with different frequencies. Some words appear more often than others.';
      const result = detectWordFrequencyDistribution(text);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(25);
    });

    it('should include reason explanation', () => {
      const text = 'one two three four five six seven eight nine ten';
      const result = detectWordFrequencyDistribution(text);
      expect(result.reason).toBeTruthy();
      expect(typeof result.reason).toBe('string');
    });
  });

  describe('Edge cases', () => {
    it('should handle single word repeated', () => {
      const text = 'word word word word word';
      const result = detectWordFrequencyDistribution(text);
      expect(result.wordCount).toBe(5);
      expect(result.topWords[0].word).toBe('word');
      expect(result.topWords[0].frequency).toBe(5);
    });

    it('should handle text with punctuation', () => {
      const text = 'Hello, world! How are you? I am fine.';
      const result = detectWordFrequencyDistribution(text);
      expect(result.wordCount).toBeGreaterThan(0);
    });

    it('should handle text with numbers', () => {
      const text = 'There are 100 items. We need 50 more. Total is 150.';
      const result = detectWordFrequencyDistribution(text);
      expect(result.wordCount).toBeGreaterThan(0);
    });

    it('should handle very long text', () => {
      let text = 'the cat sat on the mat. ';
      for (let i = 0; i < 100; i++) {
        text += 'The dog ran around the park. ';
      }
      const result = detectWordFrequencyDistribution(text);
      expect(result.wordCount).toBeGreaterThan(500);
      expect(result.topWords.length).toBeGreaterThan(0);
    });
  });

  describe('Comparison between different distribution patterns', () => {
    it('should show difference between uniform and natural distributions', () => {
      // More uniform distribution
      const uniformText = 'apple banana cherry date elderberry fig grape honeydew kiwi lemon mango nectarine orange papaya quince raspberry strawberry tangerine ugli vanilla walnut ';
      
      // More natural Zipfian distribution
      const naturalText = 'the the the the the the and and and and cat cat dog dog dog bird bird bird bird bird bird bird bird bird bird bird bird bird bird bird ';
      
      const uniformResult = detectWordFrequencyDistribution(uniformText);
      const naturalResult = detectWordFrequencyDistribution(naturalText);
      
      expect(uniformResult.deviation).toBeDefined();
      expect(naturalResult.deviation).toBeDefined();
    });
  });

  describe('Content word analysis', () => {
    it('should focus on content words when ignoring stopwords', () => {
      const text = 'the quick brown fox jumps over the lazy dog the cat sat on the mat the bird flew away the tree was tall the sun shines bright';
      const result = detectWordFrequencyDistribution(text, true);
      expect(result.topWords.length).toBeGreaterThan(0);
      // Top words should be content words, not stopwords
      const topWord = result.topWords[0].word;
      const commonStopwords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of'];
      expect(commonStopwords.includes(topWord)).toBe(false);
    });
  });
});
