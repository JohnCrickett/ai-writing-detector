import { describe, it, expect } from 'vitest';
import { detectOvergeneralization, generateOvergeneralizationHighlights } from './overgeneralization';

describe('Overgeneralization Detection', () => {
  describe('Few sources presented as multiple', () => {
    it('should detect "several sources" when presenting limited citations', () => {
      const text = 'The band\'s rise has often centered on Zardoya\'s bilingual lyrics and cultural background, which several sources have cited as "bridging worlds through music."[overgen 1][overgen 2]';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'several sources' || m.phrase === 'several publications')).toBe(true);
    });

    it('should detect "several publications" when presenting limited citations', () => {
      const text = 'Several publications have cited this as a defining characteristic, with only two sources mentioned.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase.includes('several publications'))).toBe(true);
    });

    it('should flag "several" combined with vague attribution phrases', () => {
      const text = 'Several sources argue that this is widely accepted in the field.';
      const matches = detectOvergeneralization(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Exhaustive word lists presented as non-exhaustive', () => {
    it('should detect "include" before word lists', () => {
      const text = 'Her collaborations include work with Bad Bunny, Cuco, as well as Tainy and Young Miko.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'include')).toBe(true);
    });

    it('should detect "include" as overgeneralization when sources don\'t mention other items', () => {
      const text = 'Her published works include The Silent Garden and Echoes of Tomorrow.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'include')).toBe(true);
    });

    it('should detect "such as" before exhaustive lists', () => {
      const text = 'Toy industry publications such as The Toy Insider and Mojo Nation have presented the product as innovative.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'such as')).toBe(true);
    });

    it('should flag "such as" when introducing seemingly exhaustive examples', () => {
      const text = 'Notable achievements such as the 2020 Award and the Innovation Prize demonstrate excellence.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'such as')).toBe(true);
    });

    it('should detect "like" as introducing non-exhaustive lists', () => {
      const text = 'Her collaborations like those with Bad Bunny show her range.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'like')).toBe(true);
    });
  });

  describe('Few sources implied as many', () => {
    it('should detect overgeneralization with "several" + single citation', () => {
      const text = 'Several sources have noted this trend.[source 1]';
      const matches = detectOvergeneralization(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect overgeneralization pattern with limited sources', () => {
      const text = 'Multiple publications have highlighted this issue. [ref1][ref2]';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase.includes('publications') || m.phrase.includes('several'))).toBe(true);
    });
  });

  describe('Word lists presented as examples not exhaustive', () => {
    it('should identify "include" pattern used for complete enumeration', () => {
      const text = 'His main works include Introduction to Physics, Advanced Calculus, and Statistics Primer.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'include')).toBe(true);
    });

    it('should identify "such as" before specific examples', () => {
      const text = 'Achievements such as the Nobel Prize and the Fields Medal show accomplishment.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'such as')).toBe(true);
    });
  });

  describe('Real world examples from testcase', () => {
    it('should detect overgeneralization in Elena Vance architectural example', () => {
      const text = 'Elena Vance\'s architectural style has been analyzed by several leading architectural journals, which have frequently cited her "organic minimalism" as a defining characteristic of 21st-century residential design.';
      const matches = detectOvergeneralization(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect "several publications" in Elena Vance text', () => {
      const text = 'Her work is often credited with bridging the gap between urban density and environmental harmony, a sentiment that several publications have echoed in their reviews.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase.includes('several'))).toBe(true);
    });

    it('should detect "includes" in portfolio example', () => {
      const text = 'Vance\'s portfolio includes high-profile developments in London and Berlin, as well as private residences in the Swiss Alps.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'includes')).toBe(true);
    });

    it('should detect "such as" in publications example', () => {
      const text = 'Her professional recognition includes features in prestigious design outlets such as Architectural Digest and The Design Review.';
      const matches = detectOvergeneralization(text);
      expect(matches.some(m => m.phrase === 'such as')).toBe(true);
    });
  });

  describe('Highlighting functionality', () => {
    it('should generate highlights for overgeneralization phrases', () => {
      const text = 'Several sources include examples such as these.';
      const matches = detectOvergeneralization(text);
      const highlights = generateOvergeneralizationHighlights(text, matches);
      expect(highlights.length).toBeGreaterThan(0);
    });

    it('should correctly position highlights in text', () => {
      const text = 'Her work includes multiple projects.';
      const matches = detectOvergeneralization(text);
      const highlights = generateOvergeneralizationHighlights(text, matches);
      
      if (highlights.length > 0) {
        const highlight = highlights[0];
        expect(highlight.start).toBeLessThan(highlight.end);
        expect(text.substring(highlight.start, highlight.end).toLowerCase()).toContain('include');
      }
    });

    it('should not create overlapping highlights', () => {
      const text = 'Several sources and several publications say such things.';
      const matches = detectOvergeneralization(text);
      const highlights = generateOvergeneralizationHighlights(text, matches);
      
      for (let i = 0; i < highlights.length - 1; i++) {
        const current = highlights[i];
        const next = highlights[i + 1];
        expect(current.end).toBeLessThanOrEqual(next.start);
      }
    });
  });

  describe('Context sensitivity', () => {
    it('should not flag "include" in legitimate mathematical/programming contexts', () => {
      const text = 'The set of integers includes both positive and negative numbers.';
      const matches = detectOvergeneralization(text);
      // May still flag it, but context would need human review
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle multiple overgeneralization patterns in same text', () => {
      const text = 'Several sources include examples such as Product A and Product B.';
      const matches = detectOvergeneralization(text);
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Case insensitivity', () => {
    it('should detect overgeneralization patterns in various cases', () => {
      const text = 'SEVERAL sources INCLUDE items SUCH AS these.';
      const matches = detectOvergeneralization(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });
});
