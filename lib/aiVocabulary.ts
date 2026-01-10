/**
 * AI Vocabulary Detection
 * Detects overused AI vocabulary and writing patterns
 */

export interface PatternMatch {
  category: string;
  phrase: string;
  count: number;
  score: number;
}

export interface TextHighlight {
  start: number;
  end: number;
  factor: string;
  category: string;
  color?: string;
}

const AI_VOCABULARY = [
  'additionally',
  'align with',
  'crucial',
  'delve',
  'emphasiz', // catches emphasize, emphasizing, emphasized
  'enduring',
  'enhance',
  'foster', // catches foster, fostering, fostered
  'garner',
  'highlight',
  'interplay',
  'intricat', // catches intricate, intricacies
  'key',
  'landscape',
  'pivotal',
  'showcase',
  'tapestry',
  'testament',
  'underscore',
  'valuable',
  'vibrant',
];

const FULL_WORD_MATCHES = [
  'additionally',
  'align with',
  'crucial',
  'delve',
  'enduring',
  'enhance',
  'garner',
  'highlight',
  'interplay',
  'key',
  'landscape',
  'pivotal',
  'showcase',
  'tapestry',
  'testament',
  'underscore',
  'valuable',
  'vibrant',
];

/**
 * Detect overused AI vocabulary in text
 */
export function detectAIVocabulary(text: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const word of AI_VOCABULARY) {
    // Create a regex pattern
    // For partial word matches (like emphasiz, foster, intricat), match word start boundary
    // For full words, use word boundaries
    // For multi-word phrases, match as-is
    const isPartialMatch = word.length > 0 && !FULL_WORD_MATCHES.includes(word);
    const isMultiWord = word.includes(' ');

    let pattern;
    if (isMultiWord) {
      pattern = new RegExp(word, 'gi');
    } else if (isPartialMatch) {
      // Partial matches like 'emphasiz', 'foster', 'intricat' should match word boundaries at start
      pattern = new RegExp(`\\b${word}`, 'gi');
    } else {
      // Full word matches need both boundaries
      pattern = new RegExp(`\\b${word}\\b`, 'gi');
    }

    const foundMatches = lowerText.match(pattern);

    if (foundMatches) {
      matches.push({
        phrase: word,
        count: foundMatches.length,
        category: 'aiVocabulary',
        score: Math.min(foundMatches.length * 5, 100),
      });
    }
  }

  return matches;
}

/**
 * Color for AI Vocabulary highlights
 */
export const AI_VOCABULARY_COLOR = '#fbbf24'; // amber-400

/**
 * Generate highlights for AI vocabulary matches in text
 */
export function generateAIVocabularyHighlights(
  text: string,
  aiVocabularyMatches: PatternMatch[]
): TextHighlight[] {
  const highlights: TextHighlight[] = [];
  const lowerText = text.toLowerCase();

  for (const match of aiVocabularyMatches) {
    const word = match.phrase;
    const isPartialMatch = !FULL_WORD_MATCHES.includes(word);
    const isMultiWord = word.includes(' ');

    let pattern;
    if (isMultiWord) {
      pattern = new RegExp(word, 'gi');
    } else if (isPartialMatch) {
      pattern = new RegExp(`\\b${word}`, 'gi');
    } else {
      pattern = new RegExp(`\\b${word}\\b`, 'gi');
    }

    // Find all matches and create highlights
    let matchResult;
    while ((matchResult = pattern.exec(lowerText)) !== null) {
      highlights.push({
        start: matchResult.index,
        end: matchResult.index + matchResult[0].length,
        factor: word,
        category: 'AI Vocabulary',
        color: AI_VOCABULARY_COLOR,
      });
    }
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  return highlights;
}
