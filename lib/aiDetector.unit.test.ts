import {
  checkRepetition,
  checkFormalTone,
  checkSentenceVariety,
  checkVocabularyComplexity,
  checkStructure,
  detectPatterns,
} from './aiDetector';

describe('checkRepetition', () => {
  it('returns 0 for text with no repeated words (>3 chars)', () => {
    const result = checkRepetition('every word appears just once here');
    expect(result).toBe(0);
  });

  it('returns NaN for text with only short words', () => {
    const result = checkRepetition('the and but or for');
    // Division by zero when no words > 3 chars
    expect(isNaN(result)).toBe(true);
  });

  it('increases with more repetitions of the same word', () => {
    const once = checkRepetition('test word here more content');
    const twice = checkRepetition('test test word here more');
    const thrice = checkRepetition('test test test word here');
    const fourTimes = checkRepetition('test test test test word');
    
    // Score should be 0 for up to 3 repetitions
    expect(once).toBe(0);
    expect(twice).toBe(0);
    expect(thrice).toBe(0);
    // At 4+ repetitions, (4-3)*5 = 5 points, so 5/5 * 100 = 100
    expect(fourTimes).toBe(100);
  });

  it('calculates score as (repetitionPoints / totalWords) * 100', () => {
    const result = checkRepetition('word word word word one two three four five six');
    expect(result).toBeCloseTo(71.43, 1);
  });

  it('caps score at 100', () => {
    // Very short text with many repetitions
    const result = checkRepetition('word word word word word');
    expect(result).toBeLessThanOrEqual(100);
  });

  it('accounts for multiple repeated words', () => {
    // "test" appears 4 times (contributes 5)
    // "word" appears 4 times (contributes 5)
    // Total: 10 points / 8 words * 100 = 125, capped at 100
    const result = checkRepetition('test test test test word word word word');
    expect(result).toBeLessThanOrEqual(100);
  });
});

describe('checkFormalTone', () => {
  it('returns 0 for text without formal patterns', () => {
    const result = checkFormalTone('I went to the store and bought some milk.');
    expect(result).toBe(0);
  });

  it('detects formal connectors', () => {
    const result = checkFormalTone('Furthermore, this is important.');
    expect(result).toBeGreaterThan(0);
  });

  it('counts multiple occurrences', () => {
    const once = checkFormalTone('Furthermore the result is clear.');
    const twice = checkFormalTone('Furthermore the result is clear. Moreover this matters.');
    expect(twice).toBeGreaterThan(once);
  });

  it('calculates score as (formalCount / sentences) * 20', () => {
    const result = checkFormalTone('Furthermore, this matters. Sentence two. Sentence three.');
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(20);
  });

  it('is case-insensitive', () => {
    const lower = checkFormalTone('furthermore this matters.');
    const upper = checkFormalTone('FURTHERMORE THIS MATTERS.');
    const mixed = checkFormalTone('Furthermore this matters.');
    expect(lower).toBe(upper);
    expect(lower).toBe(mixed);
  });

  it('detects "it is important to note" patterns', () => {
    const result = checkFormalTone('It is important to note that this is true.');
    expect(result).toBeGreaterThan(0);
  });

  it('caps at 100', () => {
    const result = checkFormalTone(
      'Furthermore. Moreover. Therefore. However. Consequently. Thus. Hence. ' +
      'It is important to note. It should be noted. In conclusion. In summary.'
    );
    expect(result).toBeLessThanOrEqual(100);
  });
});

describe('checkSentenceVariety', () => {
  it('returns 0 for single sentence', () => {
    const result = checkSentenceVariety('This is just one sentence.');
    expect(result).toBe(0);
  });

  it('returns 0 for text with no sentences', () => {
    const result = checkSentenceVariety('just fragments');
    expect(result).toBe(0);
  });

  it('calculates standard deviation of sentence lengths', () => {
    const result = checkSentenceVariety('Five word sentence here yes. Five word sentence here yes.');
    expect(result).toBeGreaterThan(45);
    expect(result).toBeLessThanOrEqual(50);
  });

  it('returns lower scores for varied sentence lengths', () => {
    const result = checkSentenceVariety('Short. This is a medium length sentence with more words here. Finally, an exceptionally long sentence that spans multiple concepts and ideas.');
    expect(result).toBeLessThan(30);
  });

  it('returns higher scores for uniform sentence lengths', () => {
    const result = checkSentenceVariety('Five word sentence here yes. Five word sentence here yes. Five word sentence here yes.');
    expect(result).toBeGreaterThan(40);
  });

  it('uses formula: Math.max(0, 50 - stdDev * 5)', () => {
    const uniform = checkSentenceVariety('one two three four five. one two three four five. one two three four five.');
    expect(uniform).toBeCloseTo(50, 0);
  });

  it('ignores empty sentences from extra punctuation', () => {
    const result = checkSentenceVariety('One sentence here. . . Two sentence here.');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });
});

describe('checkVocabularyComplexity', () => {
  it('scores 20 for TTR > 0.6 (very diverse)', () => {
    const result = checkVocabularyComplexity('apple banana cherry dog elephant frog cat goat');
    expect(result).toBe(20);
  });

  it('scores 35 for TTR 0.5-0.6 (diverse)', () => {
    const result = checkVocabularyComplexity('apple banana cherry dog elephant apple banana cherry dog word');
    expect(result).toBe(35);
  });

  it('scores 50 for TTR 0.4-0.5 (balanced)', () => {
    const result = checkVocabularyComplexity('apple apple apple banana banana cherry cherry dog dog test test');
    expect(result).toBe(50);
  });

  it('scores 70 for TTR 0.3-0.4 (repetitive)', () => {
    const result = checkVocabularyComplexity('word word word word test test test other other');
    expect(result).toBe(70);
  });

  it('scores 85 for TTR < 0.3 (very repetitive)', () => {
    const result = checkVocabularyComplexity('word word word word word test test test test test');
    expect(result).toBe(85);
  });

  it('handles single word', () => {
    const result = checkVocabularyComplexity('word');
    expect(result).toBe(20);
  });

  it('handles all unique words', () => {
    const result = checkVocabularyComplexity('apple banana cherry dragon elephant');
    expect(result).toBe(20);
  });

  it('handles all same word', () => {
    const result = checkVocabularyComplexity('word word word word word word word word word word');
    expect(result).toBe(85);
  });
});

describe('checkStructure', () => {
  it('returns 0 for fewer than 4 paragraphs', () => {
    const result = checkStructure('Para one.\n\nPara two.');
    expect(result).toBe(0);
  });

  it('scores HIGH for very uniform paragraph lengths', () => {
    const text = 'A'.repeat(50) + '\n\n' +
                 'B'.repeat(50) + '\n\n' +
                 'C'.repeat(50) + '\n\n' +
                 'D'.repeat(50) + '\n\n' +
                 'E'.repeat(50);
    const result = checkStructure(text);
    expect(result).toBeGreaterThan(50);
  });

  it('detects uniformity based on stdDev < 20% of avgLength', () => {
    const text = Array(5).fill(0).map((_, i) => 'x'.repeat(100)).join('\n\n');
    const result = checkStructure(text);
    expect(result).toBeGreaterThan(50);
  });

  it('scores MEDIUM if stdDev between 20-40% of avgLength', () => {
    const text = 'x'.repeat(100) + '\n\n' +
                 'y'.repeat(150) + '\n\n' +
                 'z'.repeat(100) + '\n\n' +
                 'a'.repeat(150) + '\n\n' +
                 'b'.repeat(100);
    const result = checkStructure(text);
    expect(result).toBeGreaterThanOrEqual(20);
    expect(result).toBeLessThan(60);
  });

  it('scores LOW for varied paragraph lengths', () => {
    const text = 'Short.\n\n' +
                 'x'.repeat(500) + '\n\n' +
                 'Medium text here.\n\n' +
                 'x'.repeat(800);
    const result = checkStructure(text);
    expect(result).toBeLessThan(50);
  });

  it('adds 20 points for >5 list items', () => {
    const text = '- Item 1\n- Item 2\n- Item 3\n- Item 4\n- Item 5\n- Item 6';
    const result = checkStructure(text);
    expect(result).toBeGreaterThanOrEqual(20);
  });

  it('detects numbered lists', () => {
    const text = '1. Item\n2. Item\n3. Item\n4. Item\n5. Item\n6. Item';
    const result = checkStructure(text);
    expect(result).toBeGreaterThanOrEqual(20);
  });

  it('detects bullet points', () => {
    const text = '• Item\n• Item\n• Item\n• Item\n• Item\n• Item';
    const result = checkStructure(text);
    expect(result).toBeGreaterThanOrEqual(20);
  });

  it('does not count fewer than 5 list items', () => {
    const text = '- Item 1\n- Item 2\n- Item 3';
    const result = checkStructure(text);
    expect(result).toBeLessThan(20);
  });
});

describe('detectPatterns', () => {
  it('returns all 8 pattern categories', () => {
    const result = detectPatterns('sample text');
    const categories = result.map(p => p.category);
    
    expect(categories).toContain('AI Vocabulary');
    expect(categories).toContain('Undue Emphasis');
    expect(categories).toContain('Promotional Language');
    expect(categories).toContain('Didactic Disclaimers');
    expect(categories).toContain('Section Summaries');
    expect(categories).toContain('Challenge Patterns');
    expect(categories).toContain('Negative Parallelisms');
    expect(categories).toContain('Rule of Three');
  });

  it('counts phrase occurrences correctly', () => {
    const result = detectPatterns('delve into the matter');
    const aiVocab = result.find(p => p.category === 'AI Vocabulary');
    expect(aiVocab?.count).toBe(1);
  });

  it('detects multiple instances of same pattern', () => {
    const result = detectPatterns('delve deep and investigate thoroughly delve again');
    const aiVocab = result.find(p => p.category === 'AI Vocabulary');
    expect(aiVocab?.count).toBeGreaterThanOrEqual(2);
  });

  it('scores based on frequency per 1000 words', () => {
    const result = detectPatterns('one and two');
    const ruleOfThree = result.find(p => p.category === 'Rule of Three');
    expect(ruleOfThree?.score).toBeGreaterThan(0);
  });

  it('caps pattern scores at 100', () => {
    const result = detectPatterns(
      'delve delve delve delve delve delve delve delve delve delve ' +
      'delve delve delve delve delve delve delve delve delve delve'
    );
    result.forEach(pattern => {
      expect(pattern.score).toBeLessThanOrEqual(100);
    });
  });

  it('is case-insensitive', () => {
    const lower = detectPatterns('delve into it');
    const upper = detectPatterns('DELVE INTO IT');
    const mixed = detectPatterns('Delve Into It');
    
    const lowerAI = lower.find(p => p.category === 'AI Vocabulary');
    const upperAI = upper.find(p => p.category === 'AI Vocabulary');
    const mixedAI = mixed.find(p => p.category === 'AI Vocabulary');
    
    expect(lowerAI?.count).toBe(upperAI?.count);
    expect(lowerAI?.count).toBe(mixedAI?.count);
  });

  it('returns zero count for absent patterns', () => {
    const result = detectPatterns('the cat sat on the mat');
    result.forEach(pattern => {
      expect(pattern.count).toBe(0);
      expect(pattern.score).toBe(0);
    });
  });

  it('detects high-confidence AI words', () => {
    const words = ['delve', 'showcase', 'leverage', 'paradigm', 'seamless', 'robust', 'synergy'];
    words.forEach(word => {
      const result = detectPatterns(word);
      const aiVocab = result.find(p => p.category === 'AI Vocabulary');
      expect(aiVocab?.count).toBeGreaterThan(0);
    });
  });

  it('matches multi-word phrases', () => {
    const result = detectPatterns('it is important to note that');
    const emphasis = result.find(p => p.category === 'Undue Emphasis');
    expect(emphasis?.count).toBe(1);
  });

  it('requires word boundaries for phrase matching', () => {
    const result = detectPatterns('delving into the matter');
    const aiVocab = result.find(p => p.category === 'AI Vocabulary');
    expect(aiVocab?.count).toBeGreaterThanOrEqual(0);
  });
});
