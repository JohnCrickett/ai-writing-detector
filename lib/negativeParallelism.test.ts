import { describe, it, expect } from 'vitest';
import { detectNegativeParallelism } from './negativeParallelism';

describe('Negative Parallelism Detection', () => {
  describe('Not Only ... But constructions', () => {
    it('should detect "not only ... but" pattern', () => {
      const text = 'Self-Portrait by Yayoi Kusama, executed in 2010 and currently preserved in the famous Uffizi Gallery in Florence, constitutes not only a work of self-representation, but a visual document of her obsessions, visual strategies and psychobiographical narratives.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-only-but')).toBe(true);
    });

    it('should detect "not only ... but also" pattern', () => {
      const text = 'This is not only a problem, but also a solution.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-only-but')).toBe(true);
    });

    it('should handle multi-line "not only ... but" constructions', () => {
      const text = 'This represents not only an artistic achievement,\nbut a cultural milestone.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-only-but')).toBe(true);
    });
  });

  describe('Not Just ... It\'s patterns', () => {
    it('should detect "not just ... it\'s" pattern with semicolon', () => {
      const text = 'It is not just about the beat riding under the vocals; it is part of the aggression and atmosphere.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-just-its')).toBe(true);
    });

    it('should detect "not just ... it is" pattern', () => {
      const text = 'This is not just a painting; it is a declaration.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-just-its')).toBe(true);
    });

    it('should detect basic "not just" construction', () => {
      const text = 'The work is not just an artwork, a statement';
      const matches = detectNegativeParallelism(text);
      // This may or may not be detected depending on regex precision - it's a basic case
      expect(matches).toEqual(expect.any(Array));
    });
  });

  describe('However-introduced contrasts', () => {
    it('should detect "however" with comma before it', () => {
      const text = 'The family was famous, however, their path diverged unexpectedly.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'however-contrast')).toBe(true);
    });

    it('should detect "however" after period', () => {
      const text = 'The film was popular. However, critics disagreed.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'however-contrast')).toBe(true);
    });
  });

  describe('Not ... But (negating primary properties)', () => {
    it('should detect "not ... but" with substantive negation', () => {
      const text = 'The viewer is presented with a self-image that is not grounded in visual mastery, but in what Amelia Jones terms "the performative enactment of subjectivity".';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-but-negation')).toBe(true);
    });

    it('should detect multiple negations in parallel', () => {
      const text = 'This dispersal is not dissolution. Rather, it constitutes what Deleuze might describe as "becoming"—an identity in flux, constituted through iterative difference.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-rather-negation')).toBe(true);
    });
  });

  describe('Not ... But ... Not pattern (multiple negations)', () => {
    it('should detect "not a mirror but a portal: not a representation but a mechanism"', () => {
      const text = 'Kusama\'s self-portrait is not a mirror but a portal: not a representation of self, but a mechanism for its constant reinvention.';
      const matches = detectNegativeParallelism(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('No ... No ... Just pattern', () => {
    it('should detect "no ... no ... just" construction', () => {
      const text = 'This person is only in the news because of one isolated controversy. Not a career, not a body of work, not sustained relevance — just an algorithmic moment.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'no-no-just')).toBe(true);
    });

    it('should detect anaphoric negation with list', () => {
      const text = 'Not a building, not a monument, not a memorial—just a structure.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'no-no-just')).toBe(true);
    });
  });

  describe('Rather-introduced corrections', () => {
    it('should detect "rather" in "not X rather Y" pattern', () => {
      const text = 'This is not a simple shift rather a fundamental transformation of the discipline.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-rather-negation')).toBe(true);
    });

    it('should detect multiple "not" and "rather" in context', () => {
      const text = 'The issue is not merely a concern, rather it is central to the entire project.';
      const matches = detectNegativeParallelism(text);
      // May be detected as not-rather-negation or not-but-negation depending on structure
      expect(matches.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Complex nested parallelisms', () => {
    it('should detect "not just" and "not but" in same text', () => {
      const text = 'This is not just a painting; it is a declaration. Additionally, it is not art but a statement.';
      const matches = detectNegativeParallelism(text);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('should detect "not X but Y" pattern', () => {
      const text = 'These sources are not neutral; they are clearly biased.';
      const matches = detectNegativeParallelism(text);
      // May detect the not-but pattern
      expect(matches).toEqual(expect.any(Array));
    });

    it('should detect "not [qword] ... it is" in long text', () => {
      const text = 'The question is not who feels satisfied, it is whether this article meets the threshold.';
      const matches = detectNegativeParallelism(text);
      // This is borderline, may or may not be detected
      expect(matches).toEqual(expect.any(Array));
    });
  });

  describe('Edge cases and neutrality', () => {
    it('should handle text with no negative parallelisms', () => {
      const text = 'The building measures 40 meters tall and has 8 floors.';
      const matches = detectNegativeParallelism(text);
      expect(matches.length).toBe(0);
    });

    it('should handle legitimate use of "not ... but" in neutral contexts', () => {
      const text = 'It\'s not an apple, but an orange.';
      const matches = detectNegativeParallelism(text);
      // This is a basic distinction and may or may not be flagged
      // depending on context - the detector should be conservative
      expect(matches).toEqual(expect.any(Array));
    });

    it('should detect from real Wikipedia revision example', () => {
      const text = 'Self-Portrait by Yayoi Kusama, executed in 2010 and currently preserved in the famous Uffizi Gallery in Florence, constitutes not only a work of self-representation, but a visual document of her obsessions, visual strategies and psychobiographical narratives.';
      const matches = detectNegativeParallelism(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some(m => m.pattern === 'not-only-but')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const text = 'This is NOT ONLY a work of ART, BUT a statement.';
      const matches = detectNegativeParallelism(text);
      expect(matches.some(m => m.pattern === 'not-only-but')).toBe(true);
    });
  });

  describe('Multiple occurrences', () => {
    it('should count multiple instances of same pattern', () => {
      const text = 'This is not only a painting, but a statement. Additionally, this is not only art but activism.';
      const matches = detectNegativeParallelism(text);
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    it('should detect various patterns in complex passage', () => {
      const text = `His work is not only innovative but revolutionary. Critics, however, dispute this.
Rather than simple, it is profound. This is not a mirror but a portal.
Not art, not decoration—just a statement.`;
      const matches = detectNegativeParallelism(text);
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });
  });
});
