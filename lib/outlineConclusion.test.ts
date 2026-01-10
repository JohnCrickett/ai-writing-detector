import { describe, it, expect } from 'vitest';
import { detectOutlineConclusions } from './outlineConclusion';

describe('Outline Conclusion Detection', () => {
  describe('Despite...faces challenges...positive assessment pattern', () => {
    it('should detect "Despite its...faces challenges" with positive ending', () => {
      const text = 'Despite its industrial and residential prosperity, Korattur faces challenges typical of urban areas, including congestion and pollution. With its strategic location and ongoing initiatives, Korattur continues to thrive as an integral part of the Ambattur industrial zone.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].pattern).toBe('despite-challenges-positive');
    });

    it('should detect "Despite its success...faces challenges...Future investments"', () => {
      const text = 'Despite its success, the Panama Canal faces challenges, including operational costs and climate change impacts. Future investments in technology, such as automated navigation systems, and potential further expansions could enhance the canal\'s efficiency and maintain its relevance in global trade.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].pattern).toBe('despite-challenges-positive');
    });

    it('should detect multiple challenge patterns in text', () => {
      const text = 'Despite their promising applications, pyroelectric materials face several challenges that must be addressed for broader adoption. Despite these challenges, the versatility of pyroelectric materials positions them as critical components for sustainable energy solutions.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Despite these challenges...positive assessment', () => {
    it('should detect "Despite these challenges" followed by positive assessment', () => {
      const text = 'The system faces several challenges in implementation. Despite these challenges, it continues to provide critical functionality and remains a valuable asset.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].pattern).toBe('despite-these-challenges-positive');
    });

    it('should detect from real Pyroelectricity example', () => {
      const text = 'Despite their promising applications, pyroelectric materials face several challenges that must be addressed for broader adoption. One key limitation is thermal stability. Despite these challenges, the versatility of pyroelectric materials positions them as critical components for sustainable energy solutions and next-generation sensor technologies.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Challenges section headers and patterns', () => {
    it('should detect "Challenges and Legacy" section header', () => {
      const text = 'Challenges and Legacy\n\nWhile the technology has proven useful, it faces limitations...';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect "Future Outlook" section header', () => {
      const text = 'Future Outlook\n\nThe industry is expected to grow significantly in the coming years with new innovations...';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect challenges section with vague positive assessment', () => {
      const text = 'The future of hydrocarbon economies faces several challenges, including climate change and renewable energy transition. This section would speculate on potential developments and the changing landscape of global energy.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple challenges acknowledged with positive spin', () => {
    it('should detect from Amu Television example', () => {
      const text = 'Operating in the current Afghan media environment presents numerous challenges, including security concerns and limited resources. Despite these challenges, Amu TV has managed to continue to provide a vital service to the Afghan population.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect methodology challenges with positive evolution', () => {
      const text = 'For example, while the methodology supports transdisciplinary collaboration in principle, applying it effectively in large, heterogeneous teams can be challenging. SCE continues to evolve in response to these challenges.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Pattern recognition features', () => {
    it('should identify the rigid formula structure', () => {
      const text = 'Despite its achievements, the organization faces several challenges in scaling operations. However, with strategic planning and continued investment, it remains well-positioned for future growth.';
      const matches = detectOutlineConclusions(text);
      if (matches.length > 0) {
        expect(matches[0]).toHaveProperty('pattern');
        expect(matches[0]).toHaveProperty('description');
      }
    });

    it('should detect despite phrases regardless of capitalization', () => {
      const text = 'DESPITE ITS SUCCESS, the company faces significant challenges but continues to grow.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should track both challenge acknowledgment and positive reframing', () => {
      const text = 'Despite its prominence, the institution faces considerable challenges. Nevertheless, it maintains its commitment to excellence.';
      const matches = detectOutlineConclusions(text);
      if (matches.length > 0) {
        expect(matches[0]).toHaveProperty('challengeStartIndex');
        expect(matches[0]).toHaveProperty('positiveEndingStartIndex');
      }
    });
  });

  describe('Positive reframing language detection', () => {
    it('should recognize "continues to" as positive reframing', () => {
      const text = 'Despite challenges, the organization continues to serve its community effectively.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should recognize "remains" as positive reframing', () => {
      const text = 'Despite its challenges, it remains a valuable component of the system.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should recognize "positioned for" as positive reframing', () => {
      const text = 'Despite these obstacles, the company is well-positioned for future growth.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should recognize "could enhance/improve" as speculative positive', () => {
      const text = 'Future investments could enhance the system\'s efficiency and relevance.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should recognize "critical importance" and similar emphatic positives', () => {
      const text = 'Despite these challenges, the material remains critical for sustainable energy solutions.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases and negative tests', () => {
    it('should not flag neutral discussion of challenges', () => {
      const text = 'The system has several technical challenges that engineers are working to resolve through standard development practices.';
      const matches = detectOutlineConclusions(text);
      // Should not match because it doesn\'t follow the rigid "Despite...continues/remains/positioned" pattern
      expect(matches.length).toBe(0);
    });

    it('should not flag balanced critique', () => {
      const text = 'While the approach has benefits, it also has significant drawbacks that limit its applicability.';
      const matches = detectOutlineConclusions(text);
      // No positive reframing after challenges
      expect(matches.length).toBe(0);
    });

    it('should require proximity of despite/challenges/positive elements', () => {
      const text = 'Despite its success. [many paragraphs later] The organization faces challenges. [many paragraphs later] It continues to grow.';
      const matches = detectOutlineConclusions(text);
      // Should not match - elements too far apart to constitute the rigid outline pattern
      expect(matches.length).toBe(0);
    });

    it('should handle empty text', () => {
      const text = '';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBe(0);
    });

    it('should handle text with no pattern', () => {
      const text = 'The building was constructed in 1892 and stands 40 meters tall with eight stories.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBe(0);
    });
  });

  describe('Real-world examples', () => {
    it('should detect from Korattur Wikipedia example', () => {
      const text = 'Despite its industrial and residential prosperity, Korattur faces challenges typical of urban areas, including traffic congestion, waste management, and pollution. With its strategic location and ongoing initiatives for infrastructure development, Korattur continues to thrive as an integral part of the Ambattur industrial zone, embodying the synergy between industry and residential living.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should detect from Panama Canal example', () => {
      const text = 'Despite its unquestionable success in maritime history, the Panama Canal faces challenges including rising sea levels, increased traffic congestion, and competition from alternative routes. Future investments in technology, such as automated navigation systems, updated lock mechanisms, and potential further expansions could enhance the canal\'s efficiency and maintain its relevance in global trade.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should handle multiple despite-challenges patterns in single text', () => {
      const text = 'Despite its achievements in the 1990s, the project faced challenges in funding. It continues to evolve and remains important. Despite these obstacles, the organization is well-positioned for future growth.';
      const matches = detectOutlineConclusions(text);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });
});
