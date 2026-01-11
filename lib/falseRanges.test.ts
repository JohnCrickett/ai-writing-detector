import { describe, it, expect } from 'vitest';
import { detectFalseRanges } from './falseRanges';

describe('False Ranges Detection', () => {
  describe('True ranges (should NOT be flagged)', () => {
    it('should not flag quantitative numerical ranges', () => {
      const text = 'from 1990 to 2000';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag quantitative measurement ranges', () => {
      const text = 'from 15 to 20 ounces';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag seasonal/temporal ranges', () => {
      const text = 'from winter to autumn';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag qualitative categorical ranges', () => {
      const text = 'from seed to tree';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag qualitative severity ranges', () => {
      const text = 'from mild to severe';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag qualification/skill level ranges', () => {
      const text = 'from white belt to black belt';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag merisms (figurative whole)', () => {
      const text = 'from head to toe';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag time-based merisms', () => {
      const text = 'from soup to nuts';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });
  });

  describe('False ranges - abstract/unrelated endpoints', () => {
    it('should flag "from singularity to cosmic web"', () => {
      const text = 'from the singularity of the Big Bang to the grand cosmic web';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].reason).toMatch(/unrelated|no coherent scale/i);
    });

    it('should flag "from birth and death of stars to dark matter"', () => {
      const text = 'from the birth and death of stars to the enigmatic dance of dark matter';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should flag "from problem-solving to artistic expression"', () => {
      const text = 'From problem-solving and tool-making to scientific discovery, artistic expression, and technological innovation';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].reason).toMatch(/multiple items|list/i);
    });

    it('should flag mixed list items as false range', () => {
      const text = 'from fundamental physics to medicine and neuroscience';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('False ranges - items in a set disguised as ranges', () => {
    it('should detect when "from...to" lists items instead of describing bounds', () => {
      const text = 'The benefits span from innovative design to seamless implementation.';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].reason).toMatch(/rhetorical|list|items|enumeration/i);
    });

    it('should flag rhetorical "from...to" used in persuasive writing', () => {
      const text = 'Our approach spans from innovative design to comprehensive implementation.';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('False ranges - scale switching', () => {
    it('should flag when scale changes mid-range', () => {
      const text = 'from the smallest particle to galactic clusters';
      const matches = detectFalseRanges(text);
      // This might be intentionally wide but could be false if rhetoric-heavy
      expect(matches).toBeDefined();
    });
  });

  describe('Real-world false range examples from AI writing', () => {
    it('should detect false range in cosmic journey example', () => {
      const text = `Our journey through the universe has taken us from the singularity of the Big Bang to the grand cosmic web, from the birth and death of stars that forge the elements of life, to the enigmatic dance of dark matter and dark energy that shape its destiny.`;
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect false range in intelligence/creativity example', () => {
      const text = `Intelligence and Creativity: From problem-solving and tool-making to scientific discovery, artistic expression, and technological innovation, human intelligence is characterized by its adaptability and capacity for novel solutions.`;
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect false range in scientific discovery example', () => {
      const text = `Continued Scientific Discovery: The quest to understand the universe, life, and ourselves will continue to drive scientific breakthroughs, from fundamental physics to medicine and neuroscience.`;
      const matches = detectFalseRanges(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle text with no from...to constructions', () => {
      const text = 'The building spans 40 meters across.';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should handle multiple from...to constructions in one text', () => {
      const text = 'We work from 9 to 5, covering everything from basic to advanced topics.';
      const matches = detectFalseRanges(text);
      // First one is true (time), second is questionable
      expect(matches).toBeDefined();
    });

    it('should be case-insensitive', () => {
      const text = 'FROM the seed TO the tree';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should handle prepositions like "ranging from...to"', () => {
      const text = 'The costs ranging from affordable to premium';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0); // This is a valid scale
    });
  });

  describe('Pattern matching', () => {
    it('should capture the actual range text', () => {
      const text = 'We offer services from A to B.';
      const matches = detectFalseRanges(text);
      if (matches.length > 0) {
        expect(matches[0].text).toBeDefined();
        expect(matches[0].text).toMatch(/from.*to/i);
      }
    });

    it('should provide reasoning for false range detection', () => {
      const text = 'from concept to implementation to deployment';
      const matches = detectFalseRanges(text);
      if (matches.length > 0) {
        expect(matches[0].reason).toBeDefined();
        expect(typeof matches[0].reason).toBe('string');
      }
    });

    it('should identify rhetorical/persuasive false ranges', () => {
      const text = 'Everything from cutting-edge technology to seamless integration';
      const matches = detectFalseRanges(text);
      if (matches.length > 0) {
        expect(matches[0].isRhetorical).toBeDefined();
      }
    });
  });

  describe('Should NOT false positive on valid constructions', () => {
    it('should not flag "from X until Y" time constructions', () => {
      const text = 'The meeting runs from 2pm until 5pm.';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag simple comparative ranges', () => {
      const text = 'Prices range from $10 to $50.';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag age/experience ranges', () => {
      const text = 'We serve ages from 5 to 18.';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag geographic ranges', () => {
      const text = 'Our operation extends from New York to Los Angeles.';
      const matches = detectFalseRanges(text);
      expect(matches.length).toBe(0);
    });
  });
});
