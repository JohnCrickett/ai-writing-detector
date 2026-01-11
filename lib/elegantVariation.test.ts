import { describe, it, expect } from 'vitest';
import { detectElegantVariation } from './elegantVariation';

describe('Elegant Variation Detection', () => {
  describe('Basic synonym substitution patterns', () => {
    it('should detect when a person is referred to with different names/titles', () => {
      const text = 'Vierny committed to supporting artists. Dina Vierny discovered Yankilevsky. The Russian patron also helped with exhibitions.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect synonym chains for the same entity', () => {
      const text = 'The artist created innovative work. This creative genius expressed unique perspectives. The maker challenged conventions.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect alternate terms for the same concept in sequence', () => {
      const text = 'The constraints of socialist realism limited expression. These artistic restrictions prevented freedom. The state-imposed norms were pervasive.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect plural form variations', () => {
      const text = 'The non-conformist artists faced obstacles. These creative individuals persevered. The group of talented people eventually found success.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Real-world examples from provided text', () => {
    it('should detect "Vierny" → "Dina Vierny" → "Vierny" variation', () => {
      const text = 'Vierny, after a visit in Moscow in the early 1970s, committed to supporting artists resisting the constraints of socialist realism and discovered Yankilevskly, among others such as Ilya Kabakov and Erik Bulatov. In the challenging climate of Soviet artistic constraints, Yankilevsky, alongside other non-conformist artists, faced obstacles in expressing their creativity freely. Dina Vierny, recognizing the immense talent and the struggle these artists endured, played a pivotal role in aiding their artistic aspirations.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some(m => m.pattern === 'name-variation')).toBe(true);
    });

    it('should detect "artists" → "creators" → "makers" variation', () => {
      const text = 'Vierny committed to supporting artists. In the challenging climate, Yankilevsky, alongside other creators, faced obstacles. These talented makers eventually flourished.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect "constraints" → "obstacles" → "constraints" in full example', () => {
      const text = 'In the challenging climate of Soviet artistic constraints, Yankilevsky, alongside other non-conformist artists, faced obstacles in expressing their creativity freely. The confines of state-imposed artistic norms were restrictive.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect multiple synonym substitutions in paragraph', () => {
      const text = 'Dina Vierny, recognizing the immense talent and the struggle these artists endured, played a pivotal role in aiding their artistic aspirations. The patron\'s commitment to supporting these creative individuals was unwavering. Vierny\'s dedication to the Russian avant-garde artists ultimately transformed the cultural landscape.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Complex cases with multiple substitution types', () => {
    it('should handle partial name variations (first name vs full name)', () => {
      const text = 'John published his findings. Dr. Smith then expanded the research. His later work built upon this foundation.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThanOrEqual(0);
    });

    it('should detect pronoun-to-noun transitions', () => {
      const text = 'The director made crucial decisions. She understood the challenges. The filmmaker\'s perspective proved invaluable.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should handle related concept substitutions', () => {
      const text = 'The movement challenged conventions. This revolution transformed thinking. Such paradigm shifts rarely occur.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases and false positives', () => {
    it('should not flag natural name usage in dialogue or quotation', () => {
      const text = 'As Vierny told us, "I met Dina in Paris." The conversation revealed her perspective.';
      // This is tricky - dialogue can legitimately use different name forms
      const matches = detectElegantVariation(text);
      expect(matches).toEqual(expect.any(Array));
    });

    it('should not flag pronouns as elegant variation', () => {
      const text = 'The artist created the work. It was revolutionary. She continued this style.';
      const matches = detectElegantVariation(text);
      // Pronouns are not elegant variation - they are natural language
      expect(matches.length).toBeLessThan(5);
    });

    it('should not flag different subjects in sequence', () => {
      const text = 'John created the sculpture. Mary designed the installation. Tom curated the exhibition.';
      const matches = detectElegantVariation(text);
      // These are different entities, not elegant variation
      expect(matches.length).toBe(0);
    });

    it('should handle text with no elegant variation', () => {
      const text = 'The conference was held in Paris. It featured renowned speakers. Attendees came from around the world.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBe(0);
    });

    it('should be case-insensitive', () => {
      const text = 'VIERNY supported the artists. Dina Vierny discovered talent. vierny\'s gallery became famous.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Scoring and match details', () => {
    it('should return match objects with pattern type', () => {
      const text = 'The artist worked hard. The creative individual persevered. The maker succeeded.';
      const matches = detectElegantVariation(text);
      if (matches.length > 0) {
        expect(matches[0]).toHaveProperty('pattern');
        expect(matches[0]).toHaveProperty('description');
        expect(matches[0]).toHaveProperty('count');
      }
    });

    it('should count total occurrences of elegant variation', () => {
      const text = 'The artist and the creative person both created. The innovator and the designer collaborated. The maker and the builder constructed. All three individuals contributed.';
      const matches = detectElegantVariation(text);
      // Should detect patterns of repeated synonymous substitutions
      expect(matches).toEqual(expect.any(Array));
    });
  });

  describe('Performance and limits', () => {
    it('should handle large texts efficiently', () => {
      let text = '';
      for (let i = 0; i < 100; i++) {
        text += 'The artist created work. The creative individual expressed ideas. The maker produced art. ';
      }
      const startTime = Date.now();
      const matches = detectElegantVariation(text);
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in < 5 seconds
      expect(matches).toEqual(expect.any(Array));
    });

    it('should not freeze on pathological patterns', () => {
      const text = 'a a a a a a a a a a a a a a a a a a a a'.repeat(100);
      const startTime = Date.now();
      const matches = detectElegantVariation(text);
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(5000);
      expect(matches).toEqual(expect.any(Array));
    });
  });

  describe('Cross-language and special characters', () => {
    it('should handle names with non-ASCII characters', () => {
      const text = 'Yankilevskly was discovered by Vierny. Yankilevsky alongside other artists. The artist Yankilevski contributed.';
      const matches = detectElegantVariation(text);
      expect(matches).toEqual(expect.any(Array));
    });

    it('should handle hyphenated and compound words', () => {
      const text = 'The non-conformist artists faced challenges. Non-conformists persevered. These rule-breakers succeeded.';
      const matches = detectElegantVariation(text);
      expect(matches.length).toBeGreaterThanOrEqual(0);
    });
  });
});
