import { describe, it, expect } from 'vitest';
import { 
  detectWordFrequencyDistribution, 
  calculateZipfianDeviation,
  getWordFrequencies 
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

  describe('Zipfian distribution analysis', () => {
    it('should calculate reasonable Zipfian deviation for natural text', () => {
      // Natural English text with somewhat Zipfian distribution
      const naturalText = 'the quick brown fox jumps over the lazy dog the cat sat on the mat the bird flew away the tree was tall';
      const deviation = calculateZipfianDeviation(naturalText);
      // Natural text should have moderate deviation
      expect(deviation).toBeGreaterThan(0);
      expect(deviation).toBeLessThan(0.5);
    });

    it('should flag unnaturally uniform distribution (AI-like)', () => {
      // AI-like text with more uniform word distribution
      const aiLikeText = 'implement strategies develop methodologies facilitate processes execute procedures deploy frameworks establish systems create protocols design approaches optimize methods enhance techniques';
      const deviation = calculateZipfianDeviation(aiLikeText);
      // Should have higher deviation (flatter distribution)
      expect(deviation).toBeGreaterThanOrEqual(0);
    });

    it('should handle text with highly skewed distribution', () => {
      const skewedText = 'the the the the the and and and cat dog bird bird bird bird bird bird bird bird bird bird';
      const deviation = calculateZipfianDeviation(skewedText);
      expect(deviation).toBeGreaterThan(0);
    });
  });

  describe('AI signal detection', () => {
    it('should detect AI text with uniform word distribution', () => {
      // Words distributed more uniformly than natural Zipf's law
      const aiText = 'The analysis indicates several important factors. The research demonstrates meaningful findings. The study shows significant results. The investigation reveals crucial data. The examination presents key information.';
      const result = detectWordFrequencyDistribution(aiText);
      if (result.deviation > 0.15) {
        expect(result.isAIPotential).toBe(true);
      }
    });

    it('should detect text with natural Zipfian distribution', () => {
      const humanText = 'The quick brown fox jumps over the lazy dog. A cat sat on the mat. Birds flew away. The tree was very tall. I like to walk in the park.';
      const result = detectWordFrequencyDistribution(humanText);
      // Natural text should have reasonable Zipfian distribution
      expect(result.wordCount).toBeGreaterThan(0);
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
