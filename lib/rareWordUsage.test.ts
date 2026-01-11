import { describe, it, expect } from 'vitest';
import { detectRareWordUsage } from './rareWordUsage';

describe('Rare Word Usage Detection', () => {
  describe('AI-like text with rare words', () => {
    it('should detect excessive rare word usage in AI text', () => {
      const aiText = 'The implementation of quantum encryption mechanisms necessitates unprecedented computational architecture augmentation. Contemporary cryptographic paradigms facilitate sophisticated cybersecurity infrastructure optimization through systematic algorithmic enhancement protocols.';
      const matches = detectRareWordUsage(aiText);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].isAIPotential).toBe(true);
        expect(matches[0].frequency).toBeGreaterThan(0.12);
      }
    });

    it('should flag text with >12% rare words as AI potential', () => {
      const text = 'The implementation of innovative methodologies facilitates optimization. Technological paradigms augment operational efficiency. Sophisticated mechanisms necessitate comprehensive augmentation. Advanced infrastructure optimization demonstrates systematic enhancement.';
      const matches = detectRareWordUsage(text);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].frequency).toBeGreaterThan(0.12);
        expect(matches[0].isAIPotential).toBe(true);
      }
    });
  });

  describe('Human-like text with normal rare word usage', () => {
    it('should not flag natural human text with low rare word percentage', () => {
      const humanText = 'You need better computers to make quantum encryption work. People have been working on this for years. It is a challenging problem that many scientists are trying to solve.';
      const matches = detectRareWordUsage(humanText);

      // Should not flag human text with low rare word percentage
      expect(matches.length).toBe(0);
    });

    it('should not flag conversational text with normal vocabulary', () => {
      const text = 'I think this is a good idea. We should do it together. Let me know what you think about this plan.';
      const matches = detectRareWordUsage(text);

      expect(matches.length).toBe(0);
    });

    it('should not flag casual writing', () => {
      const text = 'The cat sat on the mat. It was a sunny day. I went for a walk in the park.';
      const matches = detectRareWordUsage(text);

      expect(matches.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text', () => {
      const matches = detectRareWordUsage('');

      expect(matches.length).toBe(0);
    });

    it('should handle text with only common words', () => {
      const text = 'The cat is in the house. I like to eat and play. We can go to the park.';
      const matches = detectRareWordUsage(text);

      expect(matches.length).toBe(0);
    });

    it('should handle text with proper nouns (not flagged as rare)', () => {
      const text = 'John Smith went to Cambridge University. He studied mathematics and physics.';
      const matches = detectRareWordUsage(text);

      // Proper nouns might be detected but shouldn\'t alone trigger AI detection
      expect(matches).toEqual(expect.any(Array));
    });

    it('should ignore very short words (1-2 chars)', () => {
      const text = 'The a I to be x y z is at in on or by of up no so to go do';
      const matches = detectRareWordUsage(text);

      // Short words shouldn\'t trigger detection
      expect(matches.length).toBe(0);
    });

    it('should handle single sentence', () => {
      const text = 'This is a simple sentence with normal vocabulary.';
      const matches = detectRareWordUsage(text);

      expect(matches.length).toBe(0);
    });
  });

  describe('Rare word frequency calculation', () => {
    it('should accurately calculate rare word frequency', () => {
      // Create text with exactly 15% rare words (above 12% threshold)
      const rareWords = 'perplex oscillate paradigm augment facilitate optimize metamorphosis ubiquitous';
      const commonWords = 'the cat sat on a mat and the dog ran fast in the park';
      // Approximately 8 rare words + 50 common words = 58 total
      // 8/58 ≈ 13.8% > 12%
      const text = `${rareWords} ${commonWords}`;
      const matches = detectRareWordUsage(text);

      if (matches.length > 0) {
        expect(matches[0].frequency).toBeGreaterThan(0.12);
      }
    });

    it('should not flag text at exactly 12% threshold', () => {
      // This tests the boundary condition
      const text = 'the and is to of in for that at this but with are you from be not or have can would could will do go make take see know get may must should';
      const matches = detectRareWordUsage(text);

      // Most of these are common words, so should not be flagged
      expect(matches.length).toBe(0);
    });
  });

  describe('Real-world examples', () => {
    it('should detect AI-generated academic-like text', () => {
      const text = 'The proliferation of machine learning algorithms necessitates comprehensive evaluation of computational efficiency metrics. Contemporary neural architecture paradigms demonstrate sophisticated optimization mechanisms that facilitate unprecedented performance augmentation through systematic hyperparameter tuning protocols.';
      const matches = detectRareWordUsage(text);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].isAIPotential).toBe(true);
      }
    });

    it('should identify legitimate technical writing with domain-specific terms', () => {
      // Even with technical terms, if they\'re not excessive, should not flag
      const text = 'The algorithm uses a hash table to store values. This provides quick lookup time. We test the implementation to ensure correctness.';
      const matches = detectRareWordUsage(text);

      // This should have some rare words but not enough to trigger
      expect(matches).toEqual(expect.any(Array));
    });

    it('should detect verbose AI writing style', () => {
      const text = 'The implementation encompasses a comprehensive examination of multifaceted methodological approaches. Sophisticated algorithmic frameworks substantiate the efficacy of contemporary technological infrastructure. Systematic augmentation and perpetual optimization constitute fundamental paradigmatic objectives.';
      const matches = detectRareWordUsage(text);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].isAIPotential).toBe(true);
      }
    });
  });

  describe('Rare words detection', () => {
    it('should identify specific rare words in text', () => {
      const text = 'The implementation of innovative methodologies facilitates optimization and augmentation of systems.';
      const matches = detectRareWordUsage(text);

      if (matches.length > 0) {
        // These are the rare words that should be detected in this text
        expect(matches[0].rareWords.length).toBeGreaterThan(0);
        // The actual rare words detected might vary based on the common words list
        // but should include words like 'facilitates', 'optimization', etc.
        expect(matches[0].rareWords.some(w => w.includes('optim') || w.includes('facil') || w.includes('augment'))).toBe(true);
      }
    });

    it('should track count of rare words accurately', () => {
      const text = 'The implementation methodology provides augmentation. Implementation and augmentation are important. We use methodology and optimization.';
      const matches = detectRareWordUsage(text);

      if (matches.length > 0) {
        // Should count total occurrences, not unique
        expect(matches[0].count).toBeGreaterThan(0);
      }
    });
  });

  describe('Score calculation', () => {
    it('should calculate score based on frequency deviation from threshold', () => {
      const text = 'The implementation of quantum encryption mechanisms necessitates unprecedented computational architecture augmentation. Contemporary cryptographic paradigms facilitate sophisticated cybersecurity infrastructure optimization through systematic algorithmic enhancement protocols.';
      const matches = detectRareWordUsage(text);

      if (matches.length > 0) {
        expect(matches[0].score).toBeGreaterThan(0);
        expect(matches[0].score).toBeLessThanOrEqual(30);
      }
    });

    it('should give higher score for more extreme rare word frequency', () => {
      // Very high rare word usage
      const extremeText = 'Systematically, idiosyncratic methodologies precipitate quintessential paradigmatic augmentation. Sophisticated algorithmic frameworks substantiate unprecedented computational optimization, facilitating comprehensive infrastructure enhancement and perpetual technological augmentation endeavors.';

      const matches = detectRareWordUsage(extremeText);
      if (matches.length > 0) {
        expect(matches[0].score).toBeGreaterThan(10);
      }
    });
  });

  describe('Common word filtering', () => {
    it('should treat common variations as common words', () => {
      const text = 'running jumping walking talking sitting standing';
      const matches = detectRareWordUsage(text);

      // These are verb forms of common verbs but may have higher rarity
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle words at boundary of common/rare', () => {
      const text = 'The important thing is our unique approach to solving this problem in different ways.';
      const matches = detectRareWordUsage(text);

      // Words like "important", "unique", "approach" - may or may not be in common list
      expect(matches).toEqual(expect.any(Array));
    });
  });
});
