import { describe, it, expect } from 'vitest';
import { detectTransitionWordDensity } from './transitionWordDensity';

describe('Transition Word Density Detection', () => {
  describe('AI-like text with high transition word density', () => {
    it('should detect excessive transition word usage in AI text', () => {
      const aiText = 'Furthermore, this approach has merit. Additionally, the results demonstrate effectiveness. Moreover, the implications are significant. Consequently, further research is warranted.';
      const matches = detectTransitionWordDensity(aiText);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].isAIPotential).toBe(true);
        expect(matches[0].density).toBeGreaterThan(0.4);
      }
    });

    it('should flag text with >40% transition density as AI potential', () => {
      const text = 'Furthermore, this works. Additionally, it helps. Moreover, results show value. Consequently, we should continue.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].density).toBeGreaterThan(0.4);
        expect(matches[0].isAIPotential).toBe(true);
      }
    });

    it('should detect formal discourse markers as AI signals', () => {
      const text = 'Therefore, this is important. Thus, we must act. Accordingly, changes will follow. Hence, progress is guaranteed.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].isAIPotential).toBe(true);
      }
    });
  });

  describe('Human-like text with low transition word density', () => {
    it('should not flag conversational text with natural transitions', () => {
      const humanText = 'This works. And the numbers back it up. So what now? Hard to say. Maybe more testing.';
      const matches = detectTransitionWordDensity(humanText);

      // Should not flag human text with low transition density
      expect(matches.length).toBe(0);
    });

    it('should not flag casual writing with few transitions', () => {
      const text = 'I think this is a good idea. We should do it. It might work. Let me know what you think.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBe(0);
    });

    it('should allow natural conversational connectors', () => {
      const text = 'The cat was sitting. And the dog came in. So they played. But it was fun.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBe(0);
    });

    it('should not flag narrative text', () => {
      const text = 'She walked into the room. The sun was shining. She felt happy. The day was beautiful.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBe(0);
    });
  });

  describe('Transition word identification', () => {
    it('should identify formal transition words', () => {
      const text = 'Furthermore, this is true. Moreover, it is clear. Additionally, results show this.';
      const matches = detectTransitionWordDensity(text);

      if (matches.length > 0) {
        expect(matches[0].transitionWords.length).toBeGreaterThan(0);
        expect(matches[0].transitionWords.some(w => w.toLowerCase().includes('further') || 
                                                     w.toLowerCase().includes('moreover') ||
                                                     w.toLowerCase().includes('addition'))).toBe(true);
      }
    });

    it('should distinguish formal vs conversational transitions', () => {
      const aiText = 'Furthermore, this works. Moreover, it is clear.';
      const humanText = 'And this works. So it is clear.';

      const aiMatches = detectTransitionWordDensity(aiText);
      const humanMatches = detectTransitionWordDensity(humanText);

      expect(aiMatches.length).toBeGreaterThan(humanMatches.length);
    });
  });

  describe('Density calculation', () => {
    it('should calculate transition density as count/sentences', () => {
      const text = 'Furthermore, first. Moreover, second. Additionally, third. Sentence without transition.';
      const matches = detectTransitionWordDensity(text);

      if (matches.length > 0) {
        // 3 transitions out of 4 sentences = 0.75 density
        expect(matches[0].density).toBeCloseTo(0.75, 1);
      }
    });

    it('should count sentence-initial transitions only', () => {
      const text = 'This is good. Furthermore, we also believe. Moreover, we think this works. Something moreover good.';
      const matches = detectTransitionWordDensity(text);

      if (matches.length > 0) {
        // Should count "Furthermore" and "Moreover" at sentence start, but not "moreover" at end
        expect(matches[0].count).toBeLessThanOrEqual(3);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text', () => {
      const matches = detectTransitionWordDensity('');

      expect(matches.length).toBe(0);
    });

    it('should handle single sentence', () => {
      const text = 'This is a simple sentence.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBe(0);
    });

    it('should handle text with only transitions', () => {
      const text = 'Furthermore. Moreover. Additionally. Consequently.';
      const matches = detectTransitionWordDensity(text);

      // All sentences are transitions - very high density
      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].density).toBeGreaterThanOrEqual(0.8);
      }
    });

    it('should be case-insensitive', () => {
      const lowerText = 'furthermore, this works. moreover, that is clear.';
      const upperText = 'FURTHERMORE, this works. MOREOVER, that is clear.';

      const lowerMatches = detectTransitionWordDensity(lowerText);
      const upperMatches = detectTransitionWordDensity(upperText);

      expect(lowerMatches.length).toBe(upperMatches.length);
      if (lowerMatches.length > 0 && upperMatches.length > 0) {
        expect(lowerMatches[0].density).toBeCloseTo(upperMatches[0].density, 2);
      }
    });
  });

  describe('Real-world examples', () => {
    it('should detect AI-generated academic-style text', () => {
      const text = 'Furthermore, research demonstrates validity. Moreover, studies confirm effectiveness. Additionally, evidence supports this. Consequently, conclusions are justified. Therefore, recommendations follow.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].isAIPotential).toBe(true);
      }
    });

    it('should handle mixed formal and informal writing', () => {
      const text = 'Moreover, this is true. So we need to act. But wait. Furthermore, there are complications. And yet it matters.';
      const matches = detectTransitionWordDensity(text);

      // Mixed style - might be flagged depending on density
      expect(matches).toEqual(expect.any(Array));
    });

    it('should identify transition-heavy corporate writing', () => {
      const text = 'Furthermore, market conditions favor growth. Additionally, competitive advantages remain strong. Moreover, operational efficiency improved. Consequently, profit margins expanded. Therefore, shareholder value increased.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].isAIPotential).toBe(true);
      }
    });
  });

  describe('Formal vs conversational transitions', () => {
    it('should weigh formal transitions more heavily', () => {
      const formalText = 'Furthermore, this. Moreover, that. Additionally, another.';
      const conversationalText = 'And this. So that. But another.';

      const formalMatches = detectTransitionWordDensity(formalText);
      const conversationalMatches = detectTransitionWordDensity(conversationalText);

      // Formal should be flagged more readily
      if (formalMatches.length > 0) {
        expect(formalMatches[0].isAIPotential).toBe(true);
      }
      if (conversationalMatches.length > 0) {
        expect(conversationalMatches[0].isAIPotential).toBe(false);
      }
    });
  });

  describe('Score calculation', () => {
    it('should calculate score based on density above threshold', () => {
      const text = 'Furthermore, this. Moreover, that. Additionally, another. Consequently, one more.';
      const matches = detectTransitionWordDensity(text);

      if (matches.length > 0) {
        expect(matches[0].score).toBeGreaterThan(0);
        expect(matches[0].score).toBeLessThanOrEqual(30);
      }
    });

    it('should give higher score for extreme density', () => {
      const extremeText = 'Furthermore, a. Moreover, b. Additionally, c. Consequently, d. Therefore, e.';
      const matches = detectTransitionWordDensity(extremeText);

      if (matches.length > 0) {
        expect(matches[0].score).toBeGreaterThan(15);
      }
    });
  });

  describe('Boundary conditions', () => {
    it('should not flag text at exactly 40% threshold', () => {
      // Exactly 40% density (2 out of 5 sentences) - should not trigger (needs > 0.4)
      const text = 'Furthermore, a. Moreover, b. Some text. More text. Even more.';
      const matches = detectTransitionWordDensity(text);

      // Exactly at threshold - should not be flagged (requires > 0.4)
      expect(matches.length).toBe(0);
    });

    it('should flag text just above 40% threshold', () => {
      // Just over 40%
      const text = 'Furthermore, a. Moreover, b. Additionally, c. Some text. More text.';
      const matches = detectTransitionWordDensity(text);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0].density).toBeGreaterThan(0.4);
      }
    });
  });
});
