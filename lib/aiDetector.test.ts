import { describe, it, expect } from 'vitest';
import { detectAIVocabulary } from './aiVocabulary';
import { analyzeText } from './aiDetector';

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

describe('Integrated AI Detection (analyzeText)', () => {
  describe('AI Vocabulary Detection', () => {
    it('should detect AI vocabulary in analyzeText', () => {
      const text = 'This pivotal showcase highlights the vibrant landscape.';
      const result = analyzeText(text);
      
      expect(result.patterns.some(p => p.category === 'AI Vocabulary')).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should generate highlights for AI vocabulary', () => {
      const text = 'Additionally, this crucial matter underscore the importance.';
      const result = analyzeText(text);
      
      expect(result.highlights.length).toBeGreaterThan(0);
      expect(result.highlights.some(h => h.category === 'AI Vocabulary')).toBe(true);
    });
  });

  describe('Undue Emphasis Detection', () => {
    it('should detect undue emphasis in analyzeText', () => {
      const text = 'This stands as a testament to our commitment.';
      const result = analyzeText(text);
      
      expect(result.patterns.some(p => p.category === 'Undue Emphasis')).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should generate highlights for undue emphasis', () => {
      const text = 'This plays a vital role and is a reminder of the past.';
      const result = analyzeText(text);
      
      expect(result.highlights.some(h => h.category === 'Undue Emphasis')).toBe(true);
    });

    it('should detect media emphasis patterns', () => {
      const text = 'The story received coverage from local media outlets.';
      const result = analyzeText(text);
      
      expect(result.patterns.some(p => p.category === 'Undue Emphasis')).toBe(true);
    });
  });

  describe('Rule of Three Detection', () => {
    it('should detect rule of three with adjectives', () => {
      const text = 'This is an innovative, strategic, and comprehensive solution.';
      const result = analyzeText(text);
      
      expect(result.patterns.some(p => p.category === 'Rule of Three')).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should detect rule of three with adjectives', () => {
      const text = 'This is an innovative, strategic, and comprehensive solution.';
      const result = analyzeText(text);
      
      expect(result.patterns.some(p => p.category === 'Rule of Three')).toBe(true);
      expect(result.highlights.some(h => h.category === 'Rule of Three')).toBe(true);
    });

    it('should detect rule of three with verbs', () => {
      const text = 'Companies must innovate, adapt, and evolve to survive.';
      const result = analyzeText(text);
      
      expect(result.patterns.some(p => p.category === 'Rule of Three')).toBe(true);
    });

    it('should detect rule of three with gerunds', () => {
      const text = 'The approach focuses on identifying, evaluating, and implementing solutions.';
      const result = analyzeText(text);
      
      expect(result.patterns.some(p => p.category === 'Rule of Three')).toBe(true);
    });
  });

  describe('Combined Detection', () => {
    it('should detect both AI vocabulary and undue emphasis', () => {
      const text = 'Additionally, this pivotal initiative stands as a testament to crucial innovation that plays a vital role.';
      const result = analyzeText(text);
      
      expect(result.patterns.length).toBeGreaterThanOrEqual(2);
      expect(result.patterns.some(p => p.category === 'AI Vocabulary')).toBe(true);
      expect(result.patterns.some(p => p.category === 'Undue Emphasis')).toBe(true);
      expect(result.highlights.length).toBeGreaterThan(3);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should calculate combined score capped at 100', () => {
      const text = 'Additionally, this crucial and pivotal and essential showcase stands as a testament and plays a vital role.';
      const result = analyzeText(text);
      
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should combine highlights from both detectors', () => {
      const text = 'This crucial matter stands as a testament to important work that plays a vital role.';
      const result = analyzeText(text);
      
      const vocabHighlights = result.highlights.filter(h => h.category === 'AI Vocabulary');
      const emphasisHighlights = result.highlights.filter(h => h.category !== 'AI Vocabulary');
      
      expect(vocabHighlights.length).toBeGreaterThan(0);
      expect(emphasisHighlights.length).toBeGreaterThan(0);
    });

    it('should detect multiple patterns including rule of three', () => {
      const text = 'Additionally, our innovative, strategic, and comprehensive solution brings together strategists, engineers, and designers to deliver pivotal results.';
      const result = analyzeText(text);
      
      expect(result.patterns.some(p => p.category === 'Rule of Three')).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should report punctuation patterns in linguistic factors', () => {
      const text = 'The research indicates three key findings; first, the results demonstrate significance. Additionally, the implications warrant further study—a fact that bears consideration. Finally, conclusions emerge clearly.';
      const result = analyzeText(text);
      
      expect(result.factors.punctuationPatterns).toBeDefined();
      expect(result.factors.punctuationPatterns).toBeGreaterThan(0);
    });
  });
});
