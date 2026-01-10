import { describe, it, expect } from 'vitest';
import { detectSuperficialAnalysis } from './superficialAnalysis';

describe('Superficial Analysis Detection', () => {
  describe('Present participle "-ing" phrases at sentence end', () => {
    it('should detect "-ing" phrase at sentence end indicating significance', () => {
      const text = 'This policy change demonstrates a commitment to environmental sustainability, ensuring cleaner air for communities.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'participle-phrase')).toBe(true);
    });

    it('should detect "-ing" phrase indicating broader impact', () => {
      const text = 'The new technology provides significant benefits, contributing to economic growth and job creation.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'participle-phrase')).toBe(true);
    });

    it('should detect multiple "-ing" phrases in one text', () => {
      const text = 'The initiative helped local economies grow, benefiting small businesses. The program also promoted education, cultivating a more informed citizenry.';
      const matches = detectSuperficialAnalysis(text);
      const participleMatches = matches.filter(m => m.category === 'participle-phrase');
      expect(participleMatches.length).toBeGreaterThanOrEqual(2);
    });

    it('should detect "-ing" phrase with vague scope', () => {
      const text = 'This decision affects millions of people globally, shaping the future of entire nations.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'participle-phrase')).toBe(true);
    });

    it('should detect "-ing" phrase at end of clause before punctuation', () => {
      const text = 'The author\'s work remains relevant, highlighting timeless human struggles.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'participle-phrase')).toBe(true);
    });
  });

  describe('Watch words: ensuring, reflecting, conducive/tantamount/contributing', () => {
    it('should detect "ensuring" in superficial context', () => {
      const text = 'The policy ensures greater equality in society.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('ensuring'))).toBe(true);
    });

    it('should detect "reflecting" as vague analysis', () => {
      const text = 'This trend reflects changing social attitudes in the modern world.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('reflecting'))).toBe(true);
    });

    it('should detect "conducive to"', () => {
      const text = 'These measures are conducive to long-term economic stability.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('conducive'))).toBe(true);
    });

    it('should detect "tantamount to"', () => {
      const text = 'This action is tantamount to a complete transformation of the industry.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('tantamount'))).toBe(true);
    });

    it('should detect "contributing to"', () => {
      const text = 'These factors are contributing to unprecedented change in global markets.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('contributing'))).toBe(true);
    });

    it('should detect "cultivating" in figurative sense', () => {
      const text = 'The organization is cultivating a new generation of leaders.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('cultivating'))).toBe(true);
    });

    it('should detect "encompassing"', () => {
      const text = 'This vision encompasses the full spectrum of human experience.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('encompassing'))).toBe(true);
    });

    it('should detect "essentially is"', () => {
      const text = 'This movement is essentially a revolution in how we think about society.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('essentially'))).toBe(true);
    });

    it('should detect "fundamentally is"', () => {
      const text = 'The proposal is fundamentally transformative for our institutions.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('fundamentally'))).toBe(true);
    });

    it('should detect "valuable insights"', () => {
      const text = 'The research provides valuable insights into human psychology.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('valuable insights'))).toBe(true);
    });
  });

  describe('Vague attributions to third parties', () => {
    it('should detect vague attribution "many believe"', () => {
      const text = 'Many believe this change represents progress for society.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'vague-attribution')).toBe(true);
    });

    it('should detect vague attribution "some argue"', () => {
      const text = 'Some argue that this demonstrates the power of innovation.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'vague-attribution')).toBe(true);
    });

    it('should detect vague attribution "observers note"', () => {
      const text = 'Observers note that this reflects a broader cultural shift.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'vague-attribution')).toBe(true);
    });

    it('should detect vague attribution "experts suggest"', () => {
      const text = 'Experts suggest this is indicative of fundamental social change.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'vague-attribution')).toBe(true);
    });

    it('should detect vague attribution "it is often said"', () => {
      const text = 'It is often said that this marks a turning point in history.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'vague-attribution')).toBe(true);
    });

    it('should detect vague attribution "sources say"', () => {
      const text = 'Sources say this achievement signals a new era of cooperation.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'vague-attribution')).toBe(true);
    });

    it('should detect vague attribution "critics argue"', () => {
      const text = 'Critics argue that this exemplifies corporate greed.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'vague-attribution')).toBe(true);
    });
  });

  describe('Named source attributions (RAG-style false citations)', () => {
    it('should detect suspicious attribution to named person without specific claim', () => {
      const text = 'Roger Ebert highlighted the lasting influence of classic cinema.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'named-attribution')).toBe(true);
    });

    it('should detect attribution with vague significance claim', () => {
      const text = 'Malcolm Gladwell noted the profound impact of small changes.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'named-attribution')).toBe(true);
    });

    it('should detect named source with superficial analysis phrase', () => {
      const text = 'Stephen Hawking emphasized that this reveals fundamental truths about the universe.';
      const matches = detectSuperficialAnalysis(text);
      const namedMatches = matches.filter(m => m.category === 'named-attribution');
      expect(namedMatches.length).toBeGreaterThan(0);
    });

    it('should detect multiple named attributions in same text', () => {
      const text = 'Einstein suggested relativity demonstrates the interconnected nature of reality. Newton showed how forces shape our world.';
      const matches = detectSuperficialAnalysis(text);
      const namedMatches = matches.filter(m => m.category === 'named-attribution');
      expect(namedMatches.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Combination patterns', () => {
    it('should detect named source + watch word + significance claim', () => {
      const text = 'Maya Angelou emphasized that literature is fundamentally transformative for how we understand ourselves.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.category === 'named-attribution')).toBe(true);
      expect(matches.some(m => m.phrase.toLowerCase().includes('fundamentally'))).toBe(true);
    });

    it('should detect vague attribution + "-ing" phrase pattern', () => {
      const text = 'Many observe that education systems continue changing, reflecting society\'s evolving needs.';
      const matches = detectSuperficialAnalysis(text);
      const combined = matches.some(m => m.category === 'vague-attribution') && 
                      matches.some(m => m.phrase.toLowerCase().includes('reflecting'));
      expect(combined).toBe(true);
    });

    it('should detect watch word in sentence with "-ing" ending', () => {
      const text = 'This development is conducive to progress, ensuring better outcomes for all.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('conducive'))).toBe(true);
      expect(matches.some(m => m.phrase.toLowerCase().includes('ensuring'))).toBe(true);
    });

    it('should handle complex superficial analysis sentence', () => {
      const text = 'According to historians, this period essentially marks a fundamental shift in civilization, shaping the trajectory of human progress.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.length).toBeGreaterThan(2);
    });
  });

  describe('Multiple occurrences and counting', () => {
    it('should count multiple "-ing" phrases', () => {
      const text = 'The initiative fostered growth, building confidence. The program expanded access, creating opportunities.';
      const matches = detectSuperficialAnalysis(text);
      const ingMatches = matches.filter(m => m.category === 'participle-phrase');
      expect(ingMatches.length).toBeGreaterThanOrEqual(2);
    });

    it('should count multiple watch word occurrences', () => {
      const text = 'Ensuring quality is essential. Ensuring fairness matters. Ensuring transparency helps.';
      const matches = detectSuperficialAnalysis(text);
      const ensuringMatch = matches.find(m => m.phrase.toLowerCase().includes('ensuring'));
      expect(ensuringMatch?.count).toBeGreaterThan(1);
    });

    it('should aggregate different superficial patterns', () => {
      const text = 'Experts suggest this reflects profound cultural shifts, ensuring lasting change. This is fundamentally transformative, cultivating new values.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.length).toBeGreaterThan(3);
    });
  });

  describe('Case sensitivity and word boundaries', () => {
    it('should handle case-insensitive matching for watch words', () => {
      const text = 'ENSURING quality. Reflecting change. CONDUCIVE to growth.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('ensuring'))).toBe(true);
      expect(matches.some(m => m.phrase.toLowerCase().includes('reflecting'))).toBe(true);
      expect(matches.some(m => m.phrase.toLowerCase().includes('conducive'))).toBe(true);
    });

    it('should not match partial words', () => {
      const text = 'The ensuing events were unexpected.'; // ensuing, not ensuring
      const matches = detectSuperficialAnalysis(text);
      const falseMatch = matches.find(m => m.phrase.toLowerCase() === 'ensuring');
      expect(falseMatch).toBeUndefined();
    });
  });

  describe('Edge cases and false positives', () => {
    it('should handle text with no superficial analysis', () => {
      const text = 'The cat sat on the mat.';
      const matches = detectSuperficialAnalysis(text);
      expect(matches.length).toBe(0);
    });

    it('should distinguish legitimate "-ing" usage from superficial patterns', () => {
      const text = 'Running faster helps build endurance.'; // legitimate "-ing", not at sentence end with significance claim
      const matches = detectSuperficialAnalysis(text);
      expect(matches.length).toBe(0);
    });

    it('should handle "-ing" in middle of sentence differently', () => {
      const text = 'The building stands tall.'; // "building" is a noun, not a participle phrase
      const matches = detectSuperficialAnalysis(text);
      // Should not detect as superficial analysis
      expect(matches.some(m => m.category === 'participle-phrase')).toBe(false);
    });
  });
});
