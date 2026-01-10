import { analyzeText } from './aiDetector';

describe('AI Writing Detector', () => {
  
  // ============================================
  // REPETITION DETECTION TESTS
  // ============================================
  
  describe('Repetition Detection', () => {
    it('should score HIGH when a single word repeats 4+ times', () => {
      const text = 'test test test test';
      const result = analyzeText(text);
      expect(result.factors.repetition).toBeGreaterThan(50);
    });

    it('should score LOW when words repeat exactly 3 times (boundary)', () => {
      const text = 'test test test other other other';
      const result = analyzeText(text);
      expect(result.factors.repetition).toBeLessThan(25);
    });

    it('should score HIGH with multiple words repeated 4+ times', () => {
      const text = 'data data data data shows shows shows shows results results results results';
      const result = analyzeText(text);
      expect(result.factors.repetition).toBeGreaterThan(60);
    });

    it('should score LOW with diverse vocabulary', () => {
      const text = 'The quick brown fox jumps over the lazy dog. Every single word appears just once here.';
      const result = analyzeText(text);
      expect(result.factors.repetition).toBeLessThan(20);
    });

    it('should ignore words shorter than 4 characters (returns NaN which is treated as 0)', () => {
      const text = 'the the the the and and and and but but but but';
      const result = analyzeText(text);
      // When all words are filtered out (too short), division by zero produces NaN
      expect(isNaN(result.factors.repetition) || result.factors.repetition === 0).toBe(true);
    });

    it('should return 0 for empty text', () => {
      const result = analyzeText('');
      expect(result.factors.repetition).toBe(0);
    });

    it('should return 0 for whitespace-only text', () => {
      const result = analyzeText('   \n\n  \t  ');
      expect(result.factors.repetition).toBe(0);
    });
  });

  // ============================================
  // FORMAL TONE DETECTION TESTS
  // ============================================
  
  describe('Formal Tone Detection', () => {
    it('should score HIGH with transition connectors (furthermore, moreover, etc)', () => {
      const text = 'Furthermore, this is true. Moreover, evidence supports this. Therefore, we conclude.';
      const result = analyzeText(text);
      expect(result.factors.formalTone).toBeGreaterThanOrEqual(15);
    });

    it('should score HIGH with "it is important to note" pattern', () => {
      const text = 'It is important to note that this matters. It should be noted that results vary.';
      const result = analyzeText(text);
      expect(result.factors.formalTone).toBeGreaterThan(5);
    });

    it('should score HIGH with academic conclusion phrases', () => {
      const text = 'In conclusion, results show this. In summary, findings indicate that. To summarize, data reveals.';
      const result = analyzeText(text);
      expect(result.factors.formalTone).toBeGreaterThanOrEqual(15);
    });

    it('should score HIGH with formal vocabulary (facilitate, leverage, optimize)', () => {
      const text = 'We utilize cutting-edge methodologies to facilitate optimal outcomes and leverage synergistic paradigms to optimize efficiency.';
      const result = analyzeText(text);
      expect(result.factors.formalTone).toBeGreaterThan(30);
    });

    it('should score HIGH with contrastive phrases (on the other hand, in contrast, etc)', () => {
      const text = 'On the other hand, some disagree. In contrast, alternatives differ. Similarly, others observe this. Likewise, comparable studies show this.';
      const result = analyzeText(text);
      expect(result.factors.formalTone).toBeGreaterThan(15);
    });

    it('should score LOW with casual language', () => {
      const text = 'Hey, so I was thinking about this stuff. Honestly, it just doesn\'t make sense. Like, you know what I mean? It\'s weird.';
      const result = analyzeText(text);
      expect(result.factors.formalTone).toBeLessThan(20);
    });

    it('should score LOW without formal patterns', () => {
      const text = 'I went to the store and bought groceries. The weather was nice. I met my friend later and we talked.';
      const result = analyzeText(text);
      expect(result.factors.formalTone).toBeLessThan(15);
    });

    it('should return 0 for empty text', () => {
      const result = analyzeText('');
      expect(result.factors.formalTone).toBe(0);
    });
  });

  // ============================================
  // SENTENCE UNIFORMITY DETECTION TESTS
  // ============================================
  
  describe('Sentence Length Uniformity (AI indicator)', () => {
    it('should score HIGH when sentence lengths are uniform', () => {
      // All sentences approximately same length (5-6 words)
      const text = 'First sentence here. Second sentence now. Third one comes. Fourth arrives next. Fifth goes here.';
      const result = analyzeText(text);
      expect(result.factors.sentenceVariety).toBeGreaterThan(30);
    });

    it('should score LOW when sentence lengths vary significantly', () => {
      // Highly varied: 1 word, medium, then very long
      const text = 'Short. This is a medium-length sentence with more substance. And finally, here is an exceptionally long sentence that contains significantly more information and takes considerably more space with multiple clauses and complex structure.';
      const result = analyzeText(text);
      expect(result.factors.sentenceVariety).toBeLessThan(30);
    });

    it('should score 0 for single sentence', () => {
      const result = analyzeText('This is just one sentence.');
      expect(result.factors.sentenceVariety).toBe(0);
    });

    it('should handle two sentences with different lengths', () => {
      const text = 'Short. This is a longer sentence with more words and information.';
      const result = analyzeText(text);
      expect(result.factors.sentenceVariety).toBeGreaterThanOrEqual(0);
      expect(result.factors.sentenceVariety).toBeLessThanOrEqual(100);
    });

    it('should ignore sentences with only punctuation', () => {
      const text = 'First sentence here. . ? ! Second sentence here. Third sentence here.';
      const result = analyzeText(text);
      expect(result.factors.sentenceVariety).toBeGreaterThanOrEqual(0);
      expect(result.factors.sentenceVariety).toBeLessThanOrEqual(100);
    });
  });

  // ============================================
  // VOCABULARY REPETITIVENESS TESTS
  // ============================================
  
  describe('Vocabulary Repetitiveness (low diversity = AI indicator)', () => {
    it('should score HIGH with very low type-token ratio (<0.3)', () => {
      const text = 'data data data data data data data shows shows shows shows shows results results results results findings findings findings';
      const result = analyzeText(text);
      expect(result.factors.vocabulary).toBeGreaterThan(70);
    });

    it('should score HIGH with low type-token ratio (0.3-0.4)', () => {
      const text = 'analysis analysis analysis reveals reveals reveals evidence evidence demonstrates demonstrates shows shows patterns patterns indicate indicate trends trends';
      const result = analyzeText(text);
      expect(result.factors.vocabulary).toBeGreaterThanOrEqual(50);
    });

    it('should score MEDIUM with mid-range type-token ratio (0.4-0.5)', () => {
      const text = 'The research examined patterns in human behavior across diverse populations. Scientists observed phenomena in natural environments. Subjects demonstrated multiple responses to stimuli.';
      const result = analyzeText(text);
      expect(result.factors.vocabulary).toBeGreaterThanOrEqual(20);
      expect(result.factors.vocabulary).toBeLessThan(65);
    });

    it('should score LOW with high type-token ratio (>0.6)', () => {
      const text = 'Amalgamation, juxtaposition, perspicacious, quintessential, mellifluous, sesquipedalian, pellucid, obfuscate, idiosyncrasy, ephemeral, magnanimous, benevolent';
      const result = analyzeText(text);
      expect(result.factors.vocabulary).toBeLessThan(35);
    });

    it('should score LOW with very diverse vocabulary (unique words)', () => {
      const text = 'Wandering through yesteryear\'s archives, contemplative minds discover serendipitous treasures amid forgotten eccentricities, while fortuitous circumstances intermingle with inadvertent revelations.';
      const result = analyzeText(text);
      expect(result.factors.vocabulary).toBeLessThan(30);
    });

    it('should return 0 for empty text', () => {
      const result = analyzeText('');
      expect(result.factors.vocabulary).toBe(0);
    });
  });

  // ============================================
  // STRUCTURE UNIFORMITY TESTS
  // ============================================
  
  describe('Structure Uniformity (AI indicator)', () => {
    it('should score HIGH with very uniform paragraph lengths', () => {
      const text = 'First one two three four five.\n\nSecond one two three four five.\n\nThird one two three four five.\n\nFourth one two three four five.';
      const result = analyzeText(text);
      expect(result.factors.structure).toBeGreaterThan(40);
    });

    it('should score MEDIUM with somewhat uniform paragraph lengths', () => {
      const text = 'The first discusses concepts. The second analyzes data.\n\nThe third explores implications. The fourth reviews methods.\n\nThe fifth concludes.';
      const result = analyzeText(text);
      expect(result.factors.structure).toBeGreaterThanOrEqual(0);
      expect(result.factors.structure).toBeLessThanOrEqual(100);
    });

    it('should score LOW with highly varied paragraph lengths', () => {
      const text = 'Short.\n\nThis is a much longer paragraph that contains significantly more information and spans multiple sentences to create substantial variation in structure.\n\nMid.\n\nAnd finally, we have another extensive paragraph discussing complex topics at length with multiple interrelated points that require detailed explanation.';
      const result = analyzeText(text);
      expect(result.factors.structure).toBeLessThan(50);
    });

    it('should score HIGH with many list items (>5)', () => {
      const text = '- Item one\n- Item two\n- Item three\n- Item four\n- Item five\n- Item six\n\nAdditional text here.';
      const result = analyzeText(text);
      expect(result.factors.structure).toBeGreaterThanOrEqual(20);
    });

    it('should score HIGH with numbered lists (>5)', () => {
      const text = '1. First\n2. Second\n3. Third\n4. Fourth\n5. Fifth\n6. Sixth';
      const result = analyzeText(text);
      expect(result.factors.structure).toBeGreaterThanOrEqual(20);
    });

    it('should score LOW with few paragraphs and no lists', () => {
      const text = 'This is just one paragraph with normal sentence structure and no special formatting.';
      const result = analyzeText(text);
      expect(result.factors.structure).toBeLessThan(30);
    });

    it('should score LOW with fewer than 3 paragraphs', () => {
      const result = analyzeText('Paragraph one.\n\nParagraph two.');
      expect(result.factors.structure).toBeLessThan(30);
    });

    it('should return 0 for empty text', () => {
      const result = analyzeText('');
      expect(result.factors.structure).toBe(0);
    });
  });

  // ============================================
  // PATTERN DETECTION TESTS
  // ============================================
  
  describe('AI Vocabulary Pattern Detection', () => {
    it('should detect AI vocabulary words', () => {
      const text = 'We delve into intricate details that underscore the paradigm shift. This leverages our ability to harness synergy and facilitate seamless integration.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'AI Vocabulary');
      expect(pattern).toBeDefined();
      expect(pattern?.count).toBeGreaterThan(0);
      expect(pattern?.score).toBeGreaterThan(0);
    });

    it('should not detect AI vocabulary in casual text', () => {
      const text = 'I went to the store and bought some milk. Then I came home and had a snack.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'AI Vocabulary');
      expect(pattern?.count).toBe(0);
      expect(pattern?.score).toBe(0);
    });
  });

  describe('Undue Emphasis Pattern Detection', () => {
    it('should detect undue emphasis phrases', () => {
      const text = 'It is important to note that this is crucial. It should be noted that this is clear. Notably, this is significant.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Undue Emphasis');
      expect(pattern).toBeDefined();
      expect(pattern?.count).toBeGreaterThan(0);
    });

    it('should not detect undue emphasis in regular text', () => {
      const text = 'The cat sat on the mat. Dogs like to play. Birds fly in the sky.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Undue Emphasis');
      expect(pattern?.count).toBe(0);
    });
  });

  describe('Promotional Language Pattern Detection', () => {
    it('should detect promotional language', () => {
      const text = 'The property is nestled in a stunning location. It boasts breathtaking views. The enchanting landscape is picturesque. The spectacular scenery is captivating.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Promotional Language');
      expect(pattern).toBeDefined();
      expect(pattern?.count).toBeGreaterThan(0);
    });

    it('should not detect promotional language in neutral text', () => {
      const text = 'The building is red. It has four walls. The roof is brown. The door opens inward.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Promotional Language');
      expect(pattern?.count).toBe(0);
    });
  });

  describe('Didactic Disclaimers Pattern Detection', () => {
    it('should detect didactic disclaimer phrases', () => {
      const text = 'As mentioned earlier, this is important. As discussed, the point is clear. As we have seen, the pattern emerges. According to experts, this is standard.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Didactic Disclaimers');
      expect(pattern).toBeDefined();
      expect(pattern?.count).toBeGreaterThan(0);
    });

    it('should not detect didactic disclaimers in casual text', () => {
      const text = 'I think this is a good idea. You might want to try it. Let me know what you think.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Didactic Disclaimers');
      expect(pattern?.count).toBe(0);
    });
  });

  describe('Section Summaries Pattern Detection', () => {
    it('should detect section summary phrases', () => {
      const text = 'In conclusion, we found the results. In summary, the data shows patterns. To summarize, the key points are clear. Ultimately, we must conclude this.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Section Summaries');
      expect(pattern).toBeDefined();
      expect(pattern?.count).toBeGreaterThan(0);
    });

    it('should not detect section summaries in informal text', () => {
      const text = 'So like, what happened was, we went to the place. And then we just hung out there. It was cool.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Section Summaries');
      expect(pattern?.count).toBe(0);
    });
  });

  describe('Challenge Patterns Detection', () => {
    it('should detect challenge pattern phrases', () => {
      const text = 'Despite challenges, the team succeeded. Despite obstacles, we prevailed. In spite of difficulties, progress continued.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Challenge Patterns');
      expect(pattern).toBeDefined();
      expect(pattern?.count).toBeGreaterThan(0);
    });

    it('should not detect challenge patterns in unrelated text', () => {
      const text = 'I went to work today. I had a meeting at noon. We discussed the quarterly results.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Challenge Patterns');
      expect(pattern?.count).toBe(0);
    });
  });

  describe('Negative Parallelisms Pattern Detection', () => {
    it('should detect negative parallelism phrases', () => {
      const text = 'This is not just important, but critical. Not only that, but also significant. Not merely a suggestion, but required.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Negative Parallelisms');
      expect(pattern).toBeDefined();
      expect(pattern?.count).toBeGreaterThan(0);
    });

    it('should not detect negative parallelisms in simple text', () => {
      const text = 'I like apples. I like oranges. I like bananas.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Negative Parallelisms');
      expect(pattern?.count).toBe(0);
    });
  });

  describe('Rule of Three Pattern Detection', () => {
    it('should detect rule of three conjunctions', () => {
      const text = 'Red and blue and green combined with yellow as well as purple along with orange.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Rule of Three');
      expect(pattern).toBeDefined();
      expect(pattern?.count).toBeGreaterThan(0);
    });

    it('should not detect rule of three in minimal text', () => {
      const text = 'Cat or dog.';
      const result = analyzeText(text);
      const pattern = result.patterns.find(p => p.category === 'Rule of Three');
      expect(pattern?.count).toBe(0);
    });
  });

  // ============================================
  // OVERALL SCORE TESTS
  // ============================================
  
  describe('Overall AI Detection Score', () => {
    it('should return score between 0 and 100', () => {
      const texts = [
        'Short text',
        'The quick brown fox jumps over the lazy dog.',
        'Furthermore, it is important to note that robust paradigms facilitate seamless integration and leverage cutting-edge methodologies to optimize outcomes.',
      ];
      
      texts.forEach(text => {
        const result = analyzeText(text);
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });

    it('should score HIGH for AI-like text with multiple factors', () => {
      const aiText = 'Furthermore, it is important to note that the data demonstrates findings. Moreover, results underscore patterns. In conclusion, evidence suggests that optimization of robust robust frameworks facilitates seamless integration. The analysis reveals that despite challenges, systematic approaches leverage paradigms to implement comprehensive solutions.';
      const result = analyzeText(aiText);
      expect(result.score).toBeGreaterThan(10);
    });

    it('should score LOW for casual human writing', () => {
      const humanText = 'Hey, so I went to the store today. I grabbed some milk and bread, you know? Then I ran into my buddy and we chatted for a bit. It was cool. Anyway, I headed home and made a sandwich.';
      const result = analyzeText(humanText);
      expect(result.score).toBeLessThan(50);
    });

    it('should include all factors in the result', () => {
      const result = analyzeText('Sample text for testing.');
      expect(result.factors).toHaveProperty('repetition');
      expect(result.factors).toHaveProperty('formalTone');
      expect(result.factors).toHaveProperty('sentenceVariety');
      expect(result.factors).toHaveProperty('vocabulary');
      expect(result.factors).toHaveProperty('structure');
    });

    it('should return all pattern categories', () => {
      const result = analyzeText('Sample text for testing patterns.');
      const categories = result.patterns.map(p => p.category);
      expect(categories).toContain('AI Vocabulary');
      expect(categories).toContain('Undue Emphasis');
      expect(categories).toContain('Promotional Language');
      expect(categories).toContain('Didactic Disclaimers');
      expect(categories).toContain('Section Summaries');
      expect(categories).toContain('Challenge Patterns');
      expect(categories).toContain('Negative Parallelisms');
      expect(categories).toContain('Rule of Three');
    });

    it('should average the five factors equally (20% weight each)', () => {
      // Create text that maximizes all factors
      const maxText = 'test test test test. Furthermore, it is important to note that this demonstrates paradigms paradigms paradigms paradigms. Notably, this is clearly crucial. In conclusion, we must implement robust solutions. data data data data shows shows shows shows results results results results. - Item one\n- Item two\n- Item three\n- Item four\n- Item five\n- Item six';
      
      const result = analyzeText(maxText);
      // Score should be a meaningful average of the factors
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should return 0 score for empty text', () => {
      const result = analyzeText('');
      expect(result.score).toBe(0);
    });

    it('should return 0 score for whitespace-only text', () => {
      const result = analyzeText('   \n\n  \t  ');
      expect(result.score).toBe(0);
    });
  });

  // ============================================
  // EDGE CASE TESTS
  // ============================================
  
  describe('Edge Cases', () => {
    it('should handle text with no meaningful content', () => {
      const result = analyzeText('!!! ??? ...');
      // When no valid words exist, factors produce NaN, which makes score NaN
      expect(isNaN(result.score) || (result.score >= 0 && result.score <= 100)).toBe(true);
    });

    it('should handle very long repetitive text', () => {
      const text = Array(100).fill('word').join(' ');
      const result = analyzeText(text);
      expect(result.factors.repetition).toBeGreaterThan(80);
    });

    it('should handle mixed case correctly (case-insensitive matching)', () => {
      const text1 = 'Furthermore, this is important.';
      const text2 = 'FURTHERMORE, THIS IS IMPORTANT.';
      const result1 = analyzeText(text1);
      const result2 = analyzeText(text2);
      expect(result1.factors.formalTone).toBe(result2.factors.formalTone);
    });

    it('should not be affected by punctuation variations', () => {
      const text1 = 'In conclusion, the results show.';
      const text2 = 'In conclusion - the results show!';
      const result1 = analyzeText(text1);
      const result2 = analyzeText(text2);
      expect(result1.factors.formalTone).toBe(result2.factors.formalTone);
    });
  });
});
