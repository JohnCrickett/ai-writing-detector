/**
 * Undue Emphasis Detection
 * Detects phrases that artificially inflate importance or create superficial analysis
 */

export interface UndueEmphasisMatch {
  phrase: string;
  category: 'symbolism' | 'media';
  count: number;
  description: string;
}

/**
 * Patterns for undue emphasis on symbolism, legacy, and importance
 */
const symbolismPatterns = [
  { phrase: 'stands as', description: 'Artificial symbolism attribution' },
  { phrase: 'serves as', description: 'Superficial symbolic meaning' },
  { phrase: 'is a testament to', description: 'Overemphasis on legacy' },
  { phrase: 'is a reminder of', description: 'Artificial importance elevation' },
  { phrase: 'plays a vital role', description: 'Overemphasis on importance' },
  { phrase: 'plays a significant role', description: 'Undue significance attribution' },
  { phrase: 'plays a crucial role', description: 'Inflated importance claim' },
  { phrase: 'plays a pivotal role', description: 'Exaggerated pivotal claim' },
  { phrase: 'underscores', description: 'Superficial emphasis of importance' },
  { phrase: 'highlights', description: 'Artificial highlighting of significance' },
  { phrase: 'impactful', description: 'Vague impact assertion' },
  { phrase: 'important to social cohesion', description: 'Overreaching social significance' },
  { phrase: 'reflects broader', description: 'Unsupported generalization' },
  { phrase: 'symboliz', description: 'Artificial symbolism' }, // catches symbolize, symbolizes, symbolizing, symbolic
  { phrase: 'key turning point', description: 'Inflated historical importance' },
  { phrase: 'promotes collaboration', description: 'Unsupported positive attribution' },
  { phrase: 'indelible mark', description: 'Exaggerated lasting impact' },
  { phrase: 'deeply rooted', description: 'Unsupported depth claim' },
  { phrase: 'profound', description: 'Unsubstantiated profundity' },
  { phrase: 'revolutionary', description: 'Inflated scope of change' },
  { phrase: 'reinforces', description: 'Overstated causal relationship' },
  { phrase: 'healthy relationship', description: 'Vague positive attribution' },
  { phrase: 'steadfast dedication', description: 'Flowery personal attribution' },
];

/**
 * Patterns for undue emphasis on notability, attribution, and media coverage
 */
const mediaPatterns = [
  { phrase: 'independent coverage', description: 'Overemphasis on media attention' },
  { phrase: 'local media', description: 'Emphasis on limited media coverage' },
  { phrase: 'regional media', description: 'Emphasis on regional coverage' },
  { phrase: 'national media', description: 'Emphasis on national coverage' },
  { phrase: 'media outlets', description: 'Generic media coverage reference' },
  { phrase: 'music outlets', description: 'Emphasis on industry coverage' },
  { phrase: 'business outlets', description: 'Emphasis on industry coverage' },
  { phrase: 'tech outlets', description: 'Emphasis on industry coverage' },
  { phrase: 'leading expert', description: 'Attribution to undefined authority' },
  { phrase: 'active social media presence', description: 'Emphasis on social media activity' },
];

/**
 * Detect undue emphasis patterns in text
 */
export function detectUndueEmphasis(text: string): UndueEmphasisMatch[] {
  const matches: UndueEmphasisMatch[] = [];
  const lowerText = text.toLowerCase();

  // Check symbolism patterns
  for (const pattern of symbolismPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'symbolism',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Check media patterns
  for (const pattern of mediaPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'media',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  return matches;
}

/**
 * Create appropriate regex pattern based on phrase type
 */
function createRegexPattern(phrase: string): RegExp {
  const isPartialMatch = phrase.endsWith('*') || phrase === 'symboliz' || phrase === 'reinforces' || phrase === 'highlights' || phrase === 'underscores';
  const isMultiWord = phrase.includes(' ');

  let pattern: RegExp;

  if (isPartialMatch) {
    // Partial matches like 'symboliz' should match word boundaries at start
    pattern = new RegExp(`\\b${phrase}`, 'gi');
  } else if (isMultiWord) {
    // Multi-word phrases match as-is with word boundaries
    pattern = new RegExp(`\\b${phrase}\\b`, 'gi');
  } else {
    // Single words use full word boundaries
    pattern = new RegExp(`\\b${phrase}\\b`, 'gi');
  }

  return pattern;
}

/**
 * Color for undue emphasis highlights
 */
export const UNDUE_EMPHASIS_COLOR = '#ec4899'; // pink-500

/**
 * Generate highlights for undue emphasis matches in text
 */
export function generateUndueEmphasisHighlights(
  text: string,
  matches: UndueEmphasisMatch[]
): Array<{
  start: number;
  end: number;
  factor: string;
  category: string;
  color: string;
}> {
  const highlights: Array<{
    start: number;
    end: number;
    factor: string;
    category: string;
    color: string;
  }> = [];
  const lowerText = text.toLowerCase();

  for (const match of matches) {
    const regex = createRegexPattern(match.phrase);
    let matchResult;

    while ((matchResult = regex.exec(lowerText)) !== null) {
      const newStart = matchResult.index;
      const newEnd = matchResult.index + matchResult[0].length;
      
      // Skip if this highlight overlaps with an existing one
      const hasOverlap = highlights.some(existing => 
        (newStart < existing.end && newEnd > existing.start)
      );
      
      if (!hasOverlap) {
        highlights.push({
          start: newStart,
          end: newEnd,
          factor: match.phrase,
          category: 'Undue Emphasis',
          color: UNDUE_EMPHASIS_COLOR,
        });
      }
    }
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  return highlights;
}
