import { describe, it, expect } from 'vitest';
import { detectUndueEmphasis } from './undueEmphasis';

describe('Undue Emphasis Detection', () => {
  describe('Symbolism, Legacy, and Importance', () => {
    it('should detect "stands as"', () => {
      const text = 'This building stands as a symbol of progress.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('stands'))).toBe(true);
    });

    it('should detect "serves as"', () => {
      const text = 'This initiative serves as a beacon of hope.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('serves'))).toBe(true);
    });

    it('should detect "is a testament to"', () => {
      const text = 'The success is a testament to hard work.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('testament'))).toBe(true);
    });

    it('should detect "is a reminder of"', () => {
      const text = 'This event is a reminder of past struggles.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('reminder'))).toBe(true);
    });

    it('should detect "plays a vital role"', () => {
      const text = 'Technology plays a vital role in modern society.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('vital role'))).toBe(true);
    });

    it('should detect "plays a significant role"', () => {
      const text = 'Education plays a significant role in development.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('significant role'))).toBe(true);
    });

    it('should detect "plays a crucial role"', () => {
      const text = 'Trust plays a crucial role in relationships.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('crucial role'))).toBe(true);
    });

    it('should detect "plays a pivotal role"', () => {
      const text = 'The leader plays a pivotal role in the organization.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('pivotal role'))).toBe(true);
    });

    it('should detect "underscores its importance"', () => {
      const text = 'This decision underscores its importance for the future.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('underscores'))).toBe(true);
    });

    it('should detect "highlights its significance"', () => {
      const text = 'The data highlights its significance in the field.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('highlights'))).toBe(true);
    });

    it('should detect "impactful"', () => {
      const text = 'This was an impactful change for the community.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('impactful'))).toBe(true);
    });

    it('should detect "important to social cohesion"', () => {
      const text = 'These rituals are important to social cohesion.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('social cohesion'))).toBe(true);
    });

    it('should detect "reflects broader"', () => {
      const text = 'This trend reflects broader changes in society.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('reflects broader'))).toBe(true);
    });

    it('should detect "symbolizing its ongoing impact"', () => {
      const text = 'The monument symbolizes its ongoing impact on culture.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('symboliz'))).toBe(true);
    });

    it('should detect "symbolizing its enduring impact"', () => {
      const text = 'The legacy symbolizes its enduring impact.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('symboliz'))).toBe(true);
    });

    it('should detect "symbolizing its lasting impact"', () => {
      const text = 'The tradition symbolizes its lasting impact.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('symboliz'))).toBe(true);
    });

    it('should detect "key turning point"', () => {
      const text = 'This was a key turning point in history.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('turning point'))).toBe(true);
    });

    it('should detect "promotes collaboration"', () => {
      const text = 'This policy promotes collaboration among teams.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('promotes'))).toBe(true);
    });

    it('should detect "indelible mark"', () => {
      const text = 'The leader left an indelible mark on the industry.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('indelible'))).toBe(true);
    });

    it('should detect "deeply rooted"', () => {
      const text = 'These traditions are deeply rooted in culture.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('deeply rooted'))).toBe(true);
    });

    it('should detect "profound heritage"', () => {
      const text = 'This nation has a profound heritage.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('profound'))).toBe(true);
    });

    it('should detect "revolutionary"', () => {
      const text = 'This was a revolutionary approach to the problem.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('revolutionary'))).toBe(true);
    });

    it('should detect "reinforces good habits"', () => {
      const text = 'This program reinforces good habits.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('reinforces'))).toBe(true);
    });

    it('should detect "healthy relationship"', () => {
      const text = 'Building a healthy relationship requires trust.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('healthy'))).toBe(true);
    });

    it('should detect "steadfast dedication"', () => {
      const text = 'Her steadfast dedication inspired the team.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('steadfast'))).toBe(true);
    });
  });

  describe('Notability, Attribution, and Media Coverage', () => {
    it('should detect "independent coverage"', () => {
      const text = 'The story received independent coverage from major outlets.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('independent coverage'))).toBe(true);
    });

    it('should detect "local media outlets"', () => {
      const text = 'Local media outlets reported on the event.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('local media'))).toBe(true);
    });

    it('should detect "regional media outlets"', () => {
      const text = 'Regional media outlets covered the announcement.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('regional media'))).toBe(true);
    });

    it('should detect "national media outlets"', () => {
      const text = 'National media outlets picked up the story.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('national media'))).toBe(true);
    });

    it('should detect "[country name] media outlets"', () => {
      const text = 'French media outlets gave extensive coverage.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('media outlets'))).toBe(true);
    });

    it('should detect "music outlets"', () => {
      const text = 'Music outlets praised the album.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('music outlets'))).toBe(true);
    });

    it('should detect "business outlets"', () => {
      const text = 'Business outlets recognized the company achievement.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('business outlets'))).toBe(true);
    });

    it('should detect "tech outlets"', () => {
      const text = 'Tech outlets featured the innovation.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('tech outlets'))).toBe(true);
    });

    it('should detect "written by a leading expert"', () => {
      const text = 'The article was written by a leading expert in the field.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('leading expert'))).toBe(true);
    });

    it('should detect "active social media presence"', () => {
      const text = 'The brand maintains an active social media presence.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('active social media'))).toBe(true);
    });
  });

  describe('Multiple occurrences and combinations', () => {
    it('should detect multiple instances in the same text', () => {
      const text = 'This stands as a testament to hard work and is a reminder of past success. It plays a vital role in our community.';
      const matches = detectUndueEmphasis(text);
      expect(matches.length).toBeGreaterThan(2);
    });

    it('should detect mixed categories in the same passage', () => {
      const text = 'The initiative stands as a symbol and received coverage from local media outlets. A leading expert praised its revolutionary impact.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.category.includes('symbolism'))).toBe(true);
      expect(matches.some(m => m.category.includes('media'))).toBe(true);
    });

    it('should be case-insensitive', () => {
      const text = 'STANDS as a symbol. Serves AS a beacon. IS A TESTAMENT.';
      const matches = detectUndueEmphasis(text);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should not flag similar words that are not in the list', () => {
      const text = 'The standing ovation served the purpose.';
      const matches = detectUndueEmphasis(text);
      // Should either find nothing or only match legitimate terms
      matches.filter(m => !m.phrase.includes('serves'));
      expect(matches.every(m => m.phrase.toLowerCase().includes('serves') || m.phrase.toLowerCase().includes('stand'))).toBe(true);
    });

    it('should handle text with no undue emphasis', () => {
      const text = 'The weather is sunny today.';
      const matches = detectUndueEmphasis(text);
      expect(matches.length).toBe(0);
    });

    it('should handle partial phrase matches correctly', () => {
      const text = 'This plays a vital role in everything.';
      const matches = detectUndueEmphasis(text);
      expect(matches.some(m => m.phrase.includes('vital role'))).toBe(true);
    });
  });
});
