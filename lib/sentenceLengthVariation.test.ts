import { describe, it, expect } from 'vitest';
import { 
  detectSentenceLengthVariation, 
  splitIntoSentences,
  countWords,
  calculateStandardDeviation
} from './sentenceLengthVariation';

describe('Sentence Length Variation Detection', () => {
  describe('Sentence splitting', () => {
    it('should split text into sentences correctly', () => {
      const text = 'First sentence. Second sentence. Third sentence.';
      const sentences = splitIntoSentences(text);
      expect(sentences.length).toBe(3);
    });

    it('should handle multiple punctuation marks', () => {
      const text = 'What is this? Why not! Perhaps so.';
      const sentences = splitIntoSentences(text);
      expect(sentences.length).toBe(3);
    });

    it('should ignore empty segments', () => {
      const text = 'First.  Second.   Third.';
      const sentences = splitIntoSentences(text);
      expect(sentences.every(s => s.trim().length > 0)).toBe(true);
    });
  });

  describe('Word counting', () => {
    it('should count words correctly', () => {
      expect(countWords('The quick brown fox')).toBe(4);
      expect(countWords('Hello world')).toBe(2);
      expect(countWords('One')).toBe(1);
    });

    it('should ignore punctuation', () => {
      expect(countWords('Hello, world!')).toBe(2);
      expect(countWords('What? Nothing!')).toBe(2);
    });

    it('should handle empty strings', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });
  });

  describe('Standard deviation calculation', () => {
    it('should calculate standard deviation correctly', () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = calculateStandardDeviation(numbers);
      // Std dev of [1,2,3,4,5] is sqrt(2) ≈ 1.414
      expect(result).toBeCloseTo(Math.sqrt(2), 1);
    });

    it('should handle identical numbers', () => {
      const numbers = [5, 5, 5, 5];
      expect(calculateStandardDeviation(numbers)).toBe(0);
    });

    it('should handle two numbers', () => {
      const numbers = [1, 3];
      expect(calculateStandardDeviation(numbers)).toBe(1);
    });
  });

  describe('Variation detection - AI text', () => {
    it('should detect unnaturally consistent AI text', () => {
      // AI text with highly consistent sentence lengths (all around 15-17 words)
      const aiText = `The technology has transformed the industry. The benefits are substantial and clear. The adoption rates continue to grow. The future looks promising and bright.`;
      const result = detectSentenceLengthVariation(aiText);
      expect(result.isAIPotential).toBe(true);
      expect(result.standardDeviation).toBeLessThan(6);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should provide meaningful reason for AI text', () => {
      const aiText = `Sentence one is medium. Sentence two is medium. Sentence three is medium.`;
      const result = detectSentenceLengthVariation(aiText);
      if (result.isAIPotential) {
        expect(result.reason).toContain('Unnaturally consistent');
      }
    });

    it('should detect low coefficient of variation', () => {
      const aiText = `The system works well. It functions properly. Progress continues steadily. Results improve gradually.`;
      const result = detectSentenceLengthVariation(aiText);
      expect(result.coefficientOfVariation).toBeLessThan(0.35);
    });
  });

  describe('Variation detection - Human text', () => {
    it('should not flag naturally varied human text', () => {
      // Human text with natural variation (short and long sentences mixed)
      const humanText = `Go. The quick brown fox jumped over the lazy dog with incredible speed. Why? Because it could. Now what?`;
      const result = detectSentenceLengthVariation(humanText);
      expect(result.isAIPotential).toBe(false);
      expect(result.standardDeviation).toBeGreaterThanOrEqual(4);
    });

    it('should show higher variation in natural text', () => {
      const humanText = `Go. The quick brown fox jumped over the lazy dog. Why? Because it could.`;
      const result = detectSentenceLengthVariation(humanText);
      expect(result.coefficientOfVariation).toBeGreaterThan(0.35);
    });

    it('should provide reasoning for normal text', () => {
      const humanText = `Short. This is a longer sentence with more complexity. Brief.`;
      const result = detectSentenceLengthVariation(humanText);
      if (!result.isAIPotential) {
        expect(result.reason).toContain('Natural sentence length variation');
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text', () => {
      const result = detectSentenceLengthVariation('');
      expect(result.sentenceCount).toBe(0);
      expect(result.isAIPotential).toBe(false);
    });

    it('should handle text with only whitespace', () => {
      const result = detectSentenceLengthVariation('   ');
      expect(result.isAIPotential).toBe(false);
    });

    it('should handle single sentence', () => {
      const result = detectSentenceLengthVariation('Just one sentence.');
      expect(result.sentenceCount).toBe(1);
      expect(result.isAIPotential).toBe(false);
      expect(result.reason).toContain('Insufficient sentences');
    });

    it('should handle two sentences', () => {
      const result = detectSentenceLengthVariation('First sentence. Second sentence.');
      expect(result.sentenceCount).toBe(2);
      expect(result.isAIPotential).toBe(false);
      expect(result.reason).toContain('Insufficient sentences');
    });

    it('should handle text with no ending punctuation', () => {
      const text = `First sentence. Second sentence. Third sentence`;
      const result = detectSentenceLengthVariation(text);
      expect(result.sentenceCount).toBeGreaterThanOrEqual(2);
    });

    it('should handle questions and exclamations', () => {
      const text = `What is this? Why not! Perhaps so.`;
      const result = detectSentenceLengthVariation(text);
      expect(result.sentenceCount).toBe(3);
    });
  });

  describe('Scoring', () => {
    it('should assign higher score to more consistent variation', () => {
      // Extremely consistent - CV < 0.2
      const veryConsistentText = `Implementation requires attention. Deployment involves planning. Execution demands resources. Success takes commitment.`;
      const result1 = detectSentenceLengthVariation(veryConsistentText);
      
      // Somewhat consistent - CV between 0.2-0.3
      const consistentText = `The system works. The methodology employed proves effective. The outcome achieved demonstrates value. The success factor emerges clearly.`;
      const result2 = detectSentenceLengthVariation(consistentText);
      
      if (result1.isAIPotential && result2.isAIPotential) {
        expect(result1.score).toBeGreaterThanOrEqual(result2.score);
      }
    });

    it('should return zero score for natural text', () => {
      const humanText = `Short. This is a much longer sentence with varied complexity. Mid.`;
      const result = detectSentenceLengthVariation(humanText);
      expect(result.score).toBe(0);
    });
  });

  describe('Real-world examples', () => {
    it('should detect ChatGPT-style consistent writing', () => {
      const text = `Artificial intelligence has revolutionized the way we work. It provides numerous benefits to organizations worldwide. The implementation of AI systems requires careful planning. Companies must invest in training their workforce. The results demonstrate significant improvements.`;
      const result = detectSentenceLengthVariation(text);
      expect(result.sentenceCount).toBe(5);
      // Should flag as AI due to consistency
      expect(result.isAIPotential).toBe(true);
    });

    it('should recognize human blog post variation', () => {
      const text = `Go. And I keep coming back to the same question: why do we accept this nonsensical situation? It makes no sense whatsoever. But then again. Life doesn't have to make sense. You just live it. OK.`;
      const result = detectSentenceLengthVariation(text);
      expect(result.isAIPotential).toBe(false);
    });
  });
});
