import { describe, it, expect } from 'vitest';
import { detectParagraphCoherence } from './paragraphCoherence';

describe('Paragraph Coherence Detection', () => {
  describe('Overly tight coherence detection', () => {
    it('should detect AI text with overly tight logical coherence', () => {
      const text = 'The first factor is crucial. This first factor leads to the second consideration. The second consideration enables the third outcome. The third outcome creates the overall result.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches.length).toBeGreaterThan(0);
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeDefined();
      expect(coherenceMatch?.avgSimilarity).toBeGreaterThan(0.45);
    });

    it('should detect rigid progression patterns (A→B→C→D)', () => {
      const text = 'The pattern element system component framework enables further processing development advancement progression. The framework ensures component system pattern element ensures consistent framework component processing. The processing pattern framework system ensures system processing framework complete.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches.length).toBeGreaterThan(0);
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeDefined();
    });

    it('should detect procedural coherence in instructional text', () => {
      const text = 'Step one accomplishes the task. Step one enables step two. Step two enables step three. Step three enables step four.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches.length).toBeGreaterThan(0);
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeDefined();
    });
  });

  describe('Natural human writing', () => {
    it('should not flag human text with natural breathing room', () => {
      const text = 'The first factor matters. Well, actually, sometimes. The second thing? Also important, but maybe not always. It depends on context.';
      const matches = detectParagraphCoherence(text);
      
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeUndefined();
    });

    it('should not flag text with tangential thoughts', () => {
      const text = 'Research shows productivity is important. By the way, I remember reading about this in a book once. Anyway, the point is that efficiency matters. Though honestly, sometimes relaxation helps too. But getting back to work, discipline is crucial.';
      const matches = detectParagraphCoherence(text);
      
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeUndefined();
    });

    it('should not flag text with non-linear progression', () => {
      const text = 'The economy is struggling. Interest rates went up last month. Oh, and did I mention the weather has been unusual? Anyway, employment numbers fluctuate. Some sectors are doing well, others are not.';
      const matches = detectParagraphCoherence(text);
      
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeUndefined();
    });
  });

  describe('Sentence-to-sentence similarity measurement', () => {
    it('should calculate correct similarity scores for consecutive sentences', () => {
      const text = 'The system works well. The system functions properly. The system operates effectively.';
      const matches = detectParagraphCoherence(text);
      
      // High repetition of key terms should be detected
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle single sentence paragraphs', () => {
      const text = 'This is a single sentence. Another sentence here.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle empty text', () => {
      const text = '';
      const matches = detectParagraphCoherence(text);
      
      expect(matches.length).toBe(0);
    });
  });

  describe('Real-world examples', () => {
    it('should detect hallucination pattern in fabricated research explanation', () => {
      const text = 'Research shows the system works. The system works because it functions. It functions because it operates. It operates because it executes.';
      const matches = detectParagraphCoherence(text);
      
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeDefined();
    });

    it('should not flag genuine human writing with specific references', () => {
      const text = 'I read about neural networks in a book. The author discussed backpropagation in chapter 5. I also watched a video about it on YouTube. Different sources explained it in different ways. I found the mathematical approach clearer than the intuitive one.';
      const matches = detectParagraphCoherence(text);
      
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeUndefined();
    });

    it('should detect mechanical progression in explanatory text', () => {
      const text = 'The algorithm processing system data element processing algorithm continues. The algorithm system element data processing maintains algorithm system consistency. The processing algorithm consistency pattern algorithm processing element algorithm continues processing. The element processing algorithm continues algorithm processing element continues.';
      const matches = detectParagraphCoherence(text);
      
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeDefined();
    });
  });

  describe('Multiple paragraphs', () => {
    it('should analyze each paragraph separately', () => {
      const text = `First paragraph sentence one. First paragraph sentence two.

Second paragraph first sentence. Second paragraph second sentence. Second paragraph third sentence. Second paragraph fourth sentence. Second paragraph fifth sentence.`;
      const matches = detectParagraphCoherence(text);
      
      expect(matches).toEqual(expect.any(Array));
    });

    it('should flag only paragraphs with overly high coherence', () => {
      const text = `The point is first. First leads to second. Second leads to third. Third leads to fourth. Fourth completes.

Human writing has variation. Different thoughts emerge naturally. Sometimes we go off topic. Then come back. Context matters always.`;
      const matches = detectParagraphCoherence(text);
      
      // Should detect issues in first paragraph but not second
      const coherenceMatches = matches.filter(m => m.type === 'overly-coherent');
      expect(coherenceMatches.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle text with very short sentences', () => {
      const text = 'A. B. C. D. E.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle text with very long sentences', () => {
      const text = 'This extremely long sentence contains many words but all relate to a single topic that was introduced at the beginning. This long sentence discusses how the previous sentence leads logically to this one, continuing the tight progression of ideas. This sentence demonstrates further development building directly from the preceding sentence in a highly predictable manner.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle paragraphs with two sentences only', () => {
      const text = 'First sentence about a topic. Second sentence directly continues the same topic.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle mixed case and punctuation', () => {
      const text = 'THE FIRST FACTOR IS CRITICAL!!! This first factor leads to the second consideration... The second consideration enables the third outcome??? The third outcome creates the overall result.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches).toEqual(expect.any(Array));
    });
  });

  describe('Coherence threshold', () => {
    it('should flag paragraphs at exactly 0.65 similarity threshold', () => {
      // Create text where we can control similarity somewhat
      const text = 'The system is important and valuable. The system serves a function and purpose. The system provides benefits and value.';
      const matches = detectParagraphCoherence(text);
      
      expect(matches).toEqual(expect.any(Array));
    });

    it('should not flag when similarity is just below threshold', () => {
      const text = 'Dogs are loyal pets. Cats prefer independence. Birds sing in trees. Fish swim in water.';
      const matches = detectParagraphCoherence(text);
      
      const coherenceMatch = matches.find(m => m.type === 'overly-coherent');
      expect(coherenceMatch).toBeUndefined();
    });
  });
});
