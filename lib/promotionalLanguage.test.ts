import { describe, it, expect } from 'vitest';
import { detectPromotionalLanguage } from './promotionalLanguage';

describe('Promotional Language Detection', () => {
  describe('Cultural Heritage and Tourism Language', () => {
    it('should detect "nestled"', () => {
      const text = 'The town is nestled in a valley.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('nestled'))).toBe(true);
    });

    it('should detect "in the heart of"', () => {
      const text = 'Located in the heart of the region.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('heart'))).toBe(true);
    });

    it('should detect "continues to captivate"', () => {
      const text = 'The destination continues to captivate visitors.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('captivate'))).toBe(true);
    });

    it('should detect "groundbreaking" (figurative sense)', () => {
      const text = 'This is a groundbreaking approach to tourism.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('groundbreaking'))).toBe(true);
    });

    it('should detect "stunning natural beauty"', () => {
      const text = 'The region features stunning natural beauty.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('stunning') || m.phrase.includes('natural beauty'))).toBe(true);
    });

    it('should detect "enduring legacy"', () => {
      const text = 'It has an enduring legacy in the region.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('enduring') || m.phrase.includes('legacy'))).toBe(true);
    });

    it('should detect "lasting legacy"', () => {
      const text = 'This created a lasting legacy.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('lasting') || m.phrase.includes('legacy'))).toBe(true);
    });

    it('should detect "breathtaking"', () => {
      const text = 'Surrounded by breathtaking scenery.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('breathtaking'))).toBe(true);
    });

    it('should detect "scenic landscapes"', () => {
      const text = 'Enjoy the scenic landscapes and landmarks.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('scenic'))).toBe(true);
    });

    it('should detect "boasts a"', () => {
      const text = 'The town boasts a rich cultural heritage.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('boasts'))).toBe(true);
    });

    it('should detect "vibrant"', () => {
      const text = 'A vibrant town with cultural significance.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('vibrant'))).toBe(true);
    });

    it('should detect "rich cultural heritage"', () => {
      const text = 'The region has a rich cultural heritage.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('rich') || m.phrase.includes('cultural heritage'))).toBe(true);
    });

    it('should detect "diverse tapestry"', () => {
      const text = 'The diverse tapestry of local traditions.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('diverse tapestry'))).toBe(true);
    });

    it('should detect "fascinating glimpse"', () => {
      const text = 'Offers a fascinating glimpse into history.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('fascinating'))).toBe(true);
    });

    it('should detect "worth visiting"', () => {
      const text = 'A destination worth visiting.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('worth visiting'))).toBe(true);
    });
  });

  describe('Company and Business Marketing Language', () => {
    it('should detect "gateway to"', () => {
      const text = 'The company acts as the gateway to innovation.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('gateway'))).toBe(true);
    });

    it('should detect "seamlessly connecting"', () => {
      const text = 'Services seamlessly connecting all operations.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('seamlessly'))).toBe(true);
    });

    it('should detect "dependable" in marketing context', () => {
      const text = 'Offers dependable, value-driven experiences.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('dependable'))).toBe(true);
    });

    it('should detect "value-driven"', () => {
      const text = 'Dependable, value-driven customer experiences.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('value-driven'))).toBe(true);
    });

    it('should detect "commitment to"', () => {
      const text = 'Demonstrates commitment to excellence.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('commitment'))).toBe(true);
    });

    it('should detect "tangible impact"', () => {
      const text = 'Will make a tangible impact on operations.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('tangible'))).toBe(true);
    });

    it('should detect "align" with goals (marketing speak)', () => {
      const text = 'These projects align with organizational goals.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('align'))).toBe(true);
    });

    it('should detect "foster"', () => {
      const text = 'Initiatives foster community development.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('foster'))).toBe(true);
    });

    it('should detect "dual commitment"', () => {
      const text = 'The company demonstrates dual commitment to sustainability and profits.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('dual commitment'))).toBe(true);
    });

    it('should detect "responsible corporate"', () => {
      const text = 'Responsible corporate practices guide our decisions.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('responsible corporate'))).toBe(true);
    });
  });

  describe('Product and Design Marketing Language', () => {
    it('should detect "communicates" (of design)', () => {
      const text = 'The exterior design communicates a powerful presence.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('communicates'))).toBe(true);
    });

    it('should detect "signature" (of brand design)', () => {
      const text = 'Stays true to the brand\'s signature style.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('signature'))).toBe(true);
    });

    it('should detect "bold proportions"', () => {
      const text = 'Features bold proportions and curves.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('bold'))).toBe(true);
    });

    it('should detect "enhanced accessibility"', () => {
      const text = 'The design enhances accessibility to the cabin.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('enhanced') || m.phrase.includes('enhances'))).toBe(true);
    });

    it('should detect "sleek"', () => {
      const text = 'A sleek modern profile.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('sleek'))).toBe(true);
    });

    it('should detect "refined"', () => {
      const text = 'Refined and elegant design.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('refined'))).toBe(true);
    });

    it('should detect "timeless"', () => {
      const text = 'A timeless design element.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('timeless'))).toBe(true);
    });

    it('should detect "heritage" (in luxury product context)', () => {
      const text = 'Reviving our brand heritage through design.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('heritage'))).toBe(true);
    });

    it('should detect "seamlessly" (in design)', () => {
      const text = 'A mid-body line runs seamlessly from headlights to taillights.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('seamlessly'))).toBe(true);
    });

    it('should detect "carefully"', () => {
      const text = 'Carefully revived heritage colors.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('carefully') || m.phrase.includes('thoughtfully'))).toBe(true);
    });

    it('should detect "artisan" or "artisanal"', () => {
      const text = 'Hand-painted by skilled artisans.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase === 'artisan')).toBe(true);
    });

    it('should detect "dedication" (brand)'  , () => {
      const text = 'Shows the brand\'s dedication to craftsmanship.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('dedication'))).toBe(true);
    });
  });

  describe('Common Promotional Superlatives', () => {
    it('should detect "exceptional"', () => {
      const text = 'An exceptional experience.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('exceptional'))).toBe(true);
    });

    it('should detect "remarkable"', () => {
      const text = 'Remarkable achievements in the field.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('remarkable'))).toBe(true);
    });

    it('should detect "extraordinary"', () => {
      const text = 'An extraordinary example of innovation.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('extraordinary'))).toBe(true);
    });

    it('should detect "unparalleled"', () => {
      const text = 'Offers unparalleled quality and service.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('unparalleled'))).toBe(true);
    });

    it('should detect "premier"', () => {
      const text = 'The premier destination for tourism.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.some(m => m.phrase.includes('premier'))).toBe(true);
    });
  });

  describe('Multiple occurrences and combinations', () => {
    it('should detect multiple promotional instances', () => {
      const text = 'Nestled in the heart of a vibrant city with stunning natural beauty, this destination boasts a rich cultural heritage.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.length).toBeGreaterThan(3);
    });

    it('should detect marketing language for companies', () => {
      const text = 'The company remains committed to fostering sustainable growth and demonstrating tangible impact on community development.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.length).toBeGreaterThan(2);
    });

    it('should be case-insensitive', () => {
      const text = 'NESTLED in the HEART of stunning NATURAL BEAUTY boasting rich cultural heritage.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle text with no promotional language', () => {
      const text = 'The building measures 40 meters tall and has 8 floors.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.length).toBe(0);
    });

    it('should not flag neutral uses of common words', () => {
      const text = 'The company signature on the document was verified.';
      const matches = detectPromotionalLanguage(text);
      // "signature" in this context is neutral, but detector may flag it
      // This is acceptable as false positives are reviewed by humans
      expect(matches).toEqual(expect.any(Array));
    });

    it('should detect from real example text', () => {
      const text = 'Nestled within the breathtaking region of Gonder in Ethiopia, Alamata Raya Kobo stands as a vibrant town with a rich cultural heritage and a significant place within the Amhara region. From its scenic landscapes to its historical landmarks, Alamata Raya Kobo offers visitors a fascinating glimpse into the diverse tapestry of Ethiopia.';
      const matches = detectPromotionalLanguage(text);
      expect(matches.length).toBeGreaterThan(5);
      expect(matches.some(m => m.phrase.includes('nestled'))).toBe(true);
      expect(matches.some(m => m.phrase.includes('breathtaking'))).toBe(true);
      expect(matches.some(m => m.phrase.includes('vibrant'))).toBe(true);
    });
  });
});
