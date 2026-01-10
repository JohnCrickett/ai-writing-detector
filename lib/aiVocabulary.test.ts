import { describe, it, expect } from 'vitest';
import { detectAIVocabulary } from './aiVocabulary';

describe('Overused AI Vocabulary Detection', () => {
  describe('Individual word detection', () => {
    it('should detect "Additionally" at sentence start', () => {
      const text = 'Additionally, AI has transformed industries worldwide.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('additionally'))).toBe(true);
    });

    it('should detect "align with"', () => {
      const text = 'These strategies align with our core objectives.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('align'))).toBe(true);
    });

    it('should detect "crucial"', () => {
      const text = 'It is crucial to understand this concept.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('crucial'))).toBe(true);
    });

    it('should detect "delve"', () => {
      const text = 'Let us delve deeper into this topic.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('delve'))).toBe(true);
    });

    it('should detect "emphasizing"', () => {
      const text = 'We are emphasizing the importance of innovation.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('emphasiz'))).toBe(true);
    });

    it('should detect "enduring"', () => {
      const text = 'This creates an enduring partnership.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('enduring'))).toBe(true);
    });

    it('should detect "enhance"', () => {
      const text = 'Technology can enhance productivity significantly.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('enhance'))).toBe(true);
    });

    it('should detect "fostering"', () => {
      const text = 'We are fostering a culture of innovation.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('foster'))).toBe(true);
    });

    it('should detect "garner"', () => {
      const text = 'This approach will garner significant support.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('garner'))).toBe(true);
    });

    it('should detect "highlight" as verb', () => {
      const text = 'We highlight the key benefits here.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('highlight'))).toBe(true);
    });

    it('should detect "interplay"', () => {
      const text = 'The interplay between factors is complex.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('interplay'))).toBe(true);
    });

    it('should detect "intricate" and "intricacies"', () => {
      const text = 'The intricate intricacies of this system require attention.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('intricat'))).toBe(true);
    });

    it('should detect "key" as adjective', () => {
      const text = 'Key stakeholders must be involved.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('key'))).toBe(true);
    });

    it('should detect "landscape" as abstract noun', () => {
      const text = 'The digital landscape continues to evolve.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('landscape'))).toBe(true);
    });

    it('should detect "pivotal"', () => {
      const text = 'This is a pivotal moment for change.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('pivotal'))).toBe(true);
    });

    it('should detect "showcase"', () => {
      const text = 'Let us showcase the impressive results.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('showcase'))).toBe(true);
    });

    it('should detect "tapestry" as abstract noun', () => {
      const text = 'The rich tapestry of cultures is evident.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('tapestry'))).toBe(true);
    });

    it('should detect "testament"', () => {
      const text = 'This is a testament to our success.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('testament'))).toBe(true);
    });

    it('should detect "underscore" as verb', () => {
      const text = 'These results underscore the importance of planning.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('underscore'))).toBe(true);
    });

    it('should detect "valuable"', () => {
      const text = 'This provides valuable insights for decision-making.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('valuable'))).toBe(true);
    });

    it('should detect "vibrant"', () => {
      const text = 'The vibrant ecosystem supports growth.';
      const matches = detectAIVocabulary(text);
      expect(matches.some(m => m.phrase.toLowerCase().includes('vibrant'))).toBe(true);
    });
  });

  describe('Multiple word occurrences', () => {
    it('should detect multiple instances of the same word', () => {
      const text = 'Additionally, we must emphasize the crucial nature. Additionally, this pivotal moment is crucial.';
      const matches = detectAIVocabulary(text);
      const crucialMatch = matches.find(m => m.phrase.toLowerCase().includes('crucial'));
      expect(crucialMatch?.count).toBeGreaterThan(1);
    });

    it('should accumulate score for multiple AI vocabulary words', () => {
      const text = 'This pivotal showcase will highlight and underscore the vibrant landscape of opportunities.';
      const matches = detectAIVocabulary(text);
      expect(matches.length).toBeGreaterThan(3);
    });
  });

  describe('Complex passages', () => {
    it('should detect multiple words in realistic AI-written passage', () => {
      const text = `Additionally, the field has emerged as crucial to our understanding. 
        We delve into the pivotal landscape and showcase how this interplay of factors 
        demonstrates an enduring testament to innovation. By fostering partnerships that 
        highlight valuable intricacies, we garner support and underscore our commitment.`;
      
      const matches = detectAIVocabulary(text);
      expect(matches.length).toBeGreaterThan(5);
      expect(matches.some(m => m.category === 'aiVocabulary')).toBe(true);
    });

    it('should handle case-insensitive matching', () => {
      const text = 'CRUCIAL, Crucial, and crucial are all detected.';
      const matches = detectAIVocabulary(text);
      const crucialMatches = matches.filter(m => m.phrase.toLowerCase().includes('crucial'));
      expect(crucialMatches.length).toBeGreaterThan(0);
    });
  });
});
