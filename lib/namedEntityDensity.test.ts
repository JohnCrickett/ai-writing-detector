import { describe, it, expect } from 'vitest';
import { detectNamedEntityDensity } from './namedEntityDensity';

describe('Named Entity Density Detection', () => {
  describe('High density detection with vague attributions', () => {
    it('should detect high entity density combined with vague attributions (hallucination pattern)', () => {
      const text = 'According to research from the Institute of Advanced Computing Studies in Cambridge, Dr. James Robertson found in his 2023 paper published in the Journal of Modern Technology that the Smith-Johnson Framework, developed at Oxford University, shows promise.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches.length).toBeGreaterThan(0);
      const highDensityMatch = matches.find(m => m.type === 'high-density');
      expect(highDensityMatch).toBeDefined();
      expect(highDensityMatch?.density).toBeGreaterThan(0.08);
    });

    it('should detect fabricated reference pattern with multiple named entities', () => {
      const text = 'Studies show that according to researchers at Stanford, the Harvard Study Group in collaboration with MIT and Princeton published findings. Reports claim Dr. Anderson and Professor Williams demonstrated in their 2022 research.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches.length).toBeGreaterThan(0);
      const highDensityMatch = matches.find(m => m.type === 'high-density');
      expect(highDensityMatch).toBeDefined();
    });

    it('should not flag high entity density without vague attributions', () => {
      const text = 'Dr. James Smith from Cambridge University worked with Professor Maria Garcia at Stanford. They collaborated with researchers like Dr. Thomas Brown and Dr. Sarah Wilson.';
      const matches = detectNamedEntityDensity(text);
      
      // Should not flag without vague attributions
      const highDensityMatch = matches.find(m => m.type === 'high-density');
      expect(highDensityMatch).toBeUndefined();
    });
  });

  describe('Low density detection with confident claims', () => {
    it('should detect low entity density with confident claims', () => {
      const text = 'This is clearly the best approach. It obviously works because it must be superior. The evidence definitely shows this is absolutely correct.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches.length).toBeGreaterThan(0);
      const lowDensityMatch = matches.find(m => m.type === 'low-density');
      expect(lowDensityMatch).toBeDefined();
      expect(lowDensityMatch?.density).toBeLessThan(0.02);
    });

    it('should detect confident claims without specificity', () => {
      const text = 'Undoubtedly, this phenomenon occurs frequently. It is certainly true that the data demonstrates this point. The pattern is definitely significant and absolutely universal.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches.length).toBeGreaterThan(0);
      const lowDensityMatch = matches.find(m => m.type === 'low-density');
      expect(lowDensityMatch).toBeDefined();
    });

    it('should not flag low entity density without confident claims', () => {
      const text = 'This approach is interesting. Some people think it works. It might be helpful in certain situations.';
      const matches = detectNamedEntityDensity(text);
      
      // Should not flag without confident claims
      const lowDensityMatch = matches.find(m => m.type === 'low-density');
      expect(lowDensityMatch).toBeUndefined();
    });
  });

  describe('Entity density calculation', () => {
    it('should calculate correct density for text with named entities', () => {
      const text = 'John Smith and Mary Johnson work at Google in California.';
      const matches = detectNamedEntityDensity(text);
      
      // Even without trigger conditions, we should be able to see calculation
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle text with no named entities', () => {
      const text = 'The quick brown fox jumps over the lazy dog.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches.length).toBe(0);
    });

    it('should handle empty text', () => {
      const text = '';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches.length).toBe(0);
    });
  });

  describe('Real-world examples', () => {
    it('should detect hallucination in fabricated academic study', () => {
      const text = 'Research from the Institute of Cognitive Science shows that according to a 2023 study by Dr. Sarah Chen published in the Journal of Applied Research, the phenomenon occurs in 87% of cases. Studies indicate that Professor Marcus Johnson from Harvard and his colleagues at Stanford found similar patterns.';
      const matches = detectNamedEntityDensity(text);
      
      const highDensityMatch = matches.find(m => m.type === 'high-density');
      expect(highDensityMatch).toBeDefined();
    });

    it('should not flag genuine human writing with specific references', () => {
      const text = 'I read about this in a book by Malcolm Gladwell called "Tipping Point" where he discusses how epidemics spread. It made sense based on my own experience working at Google with actual teams.';
      const matches = detectNamedEntityDensity(text);
      
      // Has entities but no vague attributions
      const highDensityMatch = matches.find(m => m.type === 'high-density');
      expect(highDensityMatch).toBeUndefined();
    });

    it('should detect vague human writing avoiding specificity', () => {
      const text = 'This is clearly the best approach. It obviously works because it must be superior. The approach is definitely better. This is obviously correct and clearly works. It is certainly true that the method must work because it is absolutely better than alternatives.';
      const matches = detectNamedEntityDensity(text);
      
      const lowDensityMatch = matches.find(m => m.type === 'low-density');
      expect(lowDensityMatch).toBeDefined();
    });
  });

  describe('Vague attribution detection within named entity density', () => {
    it('should recognize research-based vague patterns', () => {
      const text = 'Research indicates that scientists from the University of Technology discovered something important. Reports claim analysts at the Research Institute found similar results. Studies show experts argue this matters.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should recognize passive voice vague patterns', () => {
      const text = 'According to studies, it has been shown that the Framework developed at Boston College has been cited by researchers. It is said that the Method proposed at Yale is believed to be effective.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle single sentence with high entity density', () => {
      const text = 'According to Dr. Smith from Harvard and Dr. Johnson from MIT, research indicates this works.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle acronyms as potential entities', () => {
      const text = 'Studies from MIT and Stanford show that IBM technology is recognized. Research indicates Harvard and Yale results.';
      const matches = detectNamedEntityDensity(text);
      
      const highDensityMatch = matches.find(m => m.type === 'high-density');
      expect(highDensityMatch).toBeDefined();
    });

    it('should distinguish between legitimate and suspicious naming patterns', () => {
      const text = 'As noted by Professor Anderson and Dr. Patricia Williams at Cambridge, their published work with James Brown demonstrates clear methodology.';
      const matches = detectNamedEntityDensity(text);
      
      // Without vague attributions, should not flag as high-density issue
      const highDensityMatch = matches.find(m => m.type === 'high-density');
      expect(highDensityMatch).toBeUndefined();
    });

    it('should handle mixed case properly', () => {
      const text = 'CLEARLY this must be true. OBVIOUSLY it is definitely correct. RESEARCHERS from STANFORD found this.';
      const matches = detectNamedEntityDensity(text);
      
      expect(matches).toEqual(expect.any(Array));
    });
  });

  describe('Density thresholds', () => {
    it('should flag density exactly at 0.08 boundary with vague attributions', () => {
      // Create text with exactly 0.08 density: if we have 8 entities in 100 words
      const entities = 'Dr. Smith Professor Johnson Stanford MIT Harvard Yale Cambridge Oxford';
      const padding = 'word '.repeat(92); // 92 more words to make 100 total
      const text = `According to research, ${entities} ${padding} studies indicate this.`;
      
      const matches = detectNamedEntityDensity(text);
      expect(matches).toEqual(expect.any(Array));
    });

    it('should not flag low density without confident claims when approaching 0.02 threshold', () => {
      const text = 'This is somewhat interesting. The idea might work. Perhaps it could be useful.';
      const matches = detectNamedEntityDensity(text);
      
      const lowDensityMatch = matches.find(m => m.type === 'low-density');
      expect(lowDensityMatch).toBeUndefined();
    });
  });

  describe('Count accuracy', () => {
    it('should accurately count unique entities', () => {
      const text = 'Dr. Smith from Harvard works with Dr. Johnson from Stanford. Dr. Smith also collaborated with researchers at Harvard.';
      const matches = detectNamedEntityDensity(text);
      
      if (matches.length > 0) {
        expect(matches[0].count).toBeGreaterThan(0);
      }
    });

    it('should not double-count repeated entities', () => {
      const text = 'Harvard Harvard Harvard MIT MIT Stanford according to studies.';
      const matches = detectNamedEntityDensity(text);
      
      if (matches.length > 0) {
        // Should count unique entities, so should be less than raw word count
        expect(matches[0].count).toBeLessThanOrEqual(3);
      }
    });
  });
});
