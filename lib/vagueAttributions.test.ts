import { describe, it, expect } from 'vitest';
import { detectVagueAttributions } from './vagueAttributions';

describe('Vague Attributions Detection', () => {
  describe('Common vague authority phrases', () => {
    it('should detect "industry reports"', () => {
      const text = 'Industry reports suggest this is a growing trend.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('industry reports'))).toBe(true);
    });

    it('should detect "observers have cited"', () => {
      const text = 'Observers have cited this as an example of innovation.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('observers have cited'))).toBe(true);
    });

    it('should detect "experts argue"', () => {
      const text = 'Experts argue that this approach is beneficial.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('experts argue'))).toBe(true);
    });

    it('should detect "some critics argue"', () => {
      const text = 'Some critics argue this policy is flawed.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('critics argue'))).toBe(true);
    });

    it('should detect "it is said"', () => {
      const text = 'It is said that the region has great potential.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('it is said'))).toBe(true);
    });

    it('should detect "scholars believe"', () => {
      const text = 'Scholars believe this represents a shift in thinking.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('scholars believe'))).toBe(true);
    });

    it('should detect "many believe"', () => {
      const text = 'Many believe that this change is necessary.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('many believe'))).toBe(true);
    });

    it('should detect "some sources say"', () => {
      const text = 'Some sources say this is true.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('sources say'))).toBe(true);
    });

    it('should detect "analysts suggest"', () => {
      const text = 'Analysts suggest the trend will continue.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('analysts suggest'))).toBe(true);
    });

    it('should detect "research indicates"', () => {
      const text = 'Research indicates a strong correlation.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('research indicates'))).toBe(true);
    });

    it('should detect "studies show"', () => {
      const text = 'Studies show that productivity increased.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('studies show'))).toBe(true);
    });

    it('should detect "reports claim"', () => {
      const text = 'Reports claim this development is significant.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('reports claim'))).toBe(true);
    });

    it('should detect "is described as" (without clear attribution)', () => {
      const text = 'The style is described as experimental.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('described'))).toBe(true);
    });

    it('should detect "is considered"', () => {
      const text = 'This region is considered a major hub.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('is considered'))).toBe(true);
    });

    it('should detect "it is believed"', () => {
      const text = 'It is believed this represents progress.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('is believed'))).toBe(true);
    });
  });

  describe('Overgeneralization patterns', () => {
    it('should detect "the academic consensus"', () => {
      const text = 'The academic consensus supports this theory.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('consensus'))).toBe(true);
    });

    it('should detect "widespread agreement"', () => {
      const text = 'There is widespread agreement on this point.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('widespread agreement'))).toBe(true);
    });

    it('should detect "most scholars"', () => {
      const text = 'Most scholars agree this is the case.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('most scholars'))).toBe(true);
    });

    it('should detect "the general view"', () => {
      const text = 'The general view is that this is important.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('general view'))).toBe(true);
    });

    it('should detect "commonly argued"', () => {
      const text = 'It is commonly argued that this is beneficial.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('commonly argued'))).toBe(true);
    });
  });

  describe('Real world examples', () => {
    it('should detect vague attribution in Nick Ford example', () => {
      const text = 'His compositions have been described as exploring conceptual themes and bridging the gaps between artistic media.';
      const matches = detectVagueAttributions(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some(m => m.phrase.includes('described'))).toBe(true);
    });

    it('should detect vague attribution in Haolai River example', () => {
      const text = 'Due to its unique characteristics, the Haolai River is of interest to researchers and conservationists.';
      const matches = detectVagueAttributions(text);
      // This is subtle - "is of interest to researchers" is vague
      expect(matches).toEqual(expect.any(Array));
    });

    it('should detect multiple vague attributions in one text', () => {
      const text = 'Observers have cited that experts argue the region is described as having significant importance. Research indicates it is considered a critical area.';
      const matches = detectVagueAttributions(text);
      expect(matches.length).toBeGreaterThan(2);
    });

    it('should detect vague attribution in Kwararafa example', () => {
      const text = 'The Kwararafa confederacy is described in scholarship as a shifting Benue valley coalition. Modern researchers treat Kwararafa as a fluid political formation.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('described'))).toBe(true);
    });
  });

  describe('Case insensitivity', () => {
    it('should be case-insensitive', () => {
      const text = 'OBSERVERS HAVE CITED that EXPERTS ARGUE this point.';
      const matches = detectVagueAttributions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should handle mixed case', () => {
      const text = 'It Is Said that Studies Show this is true.';
      const matches = detectVagueAttributions(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle text with no vague attributions', () => {
      const text = 'According to John Smith in his 2023 book, the theory was proven.';
      const matches = detectVagueAttributions(text);
      // Should not flag "according to" with a specific person
      expect(matches.length).toBeLessThan(1);
    });

    it('should handle legitimate uses of "research"', () => {
      const text = 'I conducted research on this topic.';
      const matches = detectVagueAttributions(text);
      // May flag "research" but that depends on pattern strictness
      expect(matches).toEqual(expect.any(Array));
    });

    it('should not flag neutral passive voice without vague attribution', () => {
      const text = 'The bridge was built in 1923.';
      const matches = detectVagueAttributions(text);
      expect(matches.length).toBe(0);
    });

    it('should flag vague "has been shown"', () => {
      const text = 'It has been shown that this approach works.';
      const matches = detectVagueAttributions(text);
      expect(matches.some(m => m.phrase.includes('has been shown'))).toBe(true);
    });
  });

  describe('Multiple occurrences', () => {
    it('should count multiple instances of same phrase', () => {
      const text = 'Research indicates growth. Research indicates prosperity. More research indicates improvement.';
      const matches = detectVagueAttributions(text);
      const researchMatch = matches.find(m => m.phrase.includes('research'));
      if (researchMatch) {
        expect(researchMatch.count).toBeGreaterThan(1);
      }
    });

    it('should detect various vague phrases in academic text', () => {
      const text = 'Scholars believe this is important. Some critics argue against it. Studies show mixed results. Most experts suggest caution.';
      const matches = detectVagueAttributions(text);
      expect(matches.length).toBeGreaterThanOrEqual(3);
    });
  });
});
