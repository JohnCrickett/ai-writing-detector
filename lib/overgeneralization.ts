/**
 * Overgeneralization Detection
 * Detects when AI presents limited sources as multiple, or presents specific word lists as non-exhaustive
 * 
 * Key patterns to watch:
 * - "several sources/publications" (when only few sources cited)
 * - "include" (before exhaustive word lists)
 * - "such as" (before exhaustive word lists)
 * - "like" (presenting specific examples as if non-exhaustive)
 */

export interface OvergeneralizationMatch {
  phrase: string;
  category: 'few-sources' | 'exhaustive-list' | 'vague-multiplicity';
  count: number;
  description: string;
}

/**
 * Patterns for presenting few sources as multiple
 */
const fewSourcesPatterns = [
  { phrase: 'several sources', description: 'Implies multiple sources when few are cited', category: 'few-sources' as const },
  { phrase: 'several publications', description: 'Implies multiple publications when few are cited', category: 'few-sources' as const },
  { phrase: 'multiple sources', description: 'Implies multiple sources without evidence', category: 'few-sources' as const },
  { phrase: 'multiple publications', description: 'Implies multiple publications without evidence', category: 'few-sources' as const },
  { phrase: 'many sources', description: 'Implies numerous sources when few are cited', category: 'few-sources' as const },
  { phrase: 'several', description: 'Suggests multiple items when few are actually mentioned', category: 'few-sources' as const },
];

/**
 * Patterns for presenting exhaustive lists as examples
 */
const exhaustiveListPatterns = [
  { phrase: 'includes', description: 'Word "includes" can imply non-exhaustiveness when list is complete', category: 'exhaustive-list' as const },
  { phrase: 'include', description: 'Word "include" can imply non-exhaustiveness when list is complete', category: 'exhaustive-list' as const },
  { phrase: 'such as', description: 'Phrase suggests examples when actually presenting all items', category: 'exhaustive-list' as const },
  { phrase: 'like', description: 'Suggests examples when actually presenting complete enumeration', category: 'exhaustive-list' as const },
  { phrase: 'including', description: 'Implies incomplete list when actually exhaustive', category: 'exhaustive-list' as const },
];

/**
 * Combined patterns that amplify overgeneralization
 */
const amplifingPatterns = [
  { phrase: 'often', description: 'Amplifies overgeneralization about frequency/commonality', category: 'vague-multiplicity' as const },
  { phrase: 'frequently cited', description: 'Suggests repeated citations without support', category: 'vague-multiplicity' as const },
  { phrase: 'frequently', description: 'Implies repeated occurrence when few instances shown', category: 'vague-multiplicity' as const },
];

/**
 * Detect overgeneralization patterns in text
 */
export function detectOvergeneralization(text: string): OvergeneralizationMatch[] {
  const matches: OvergeneralizationMatch[] = [];
  const lowerText = text.toLowerCase();

  // Check few sources patterns
  for (const pattern of fewSourcesPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: pattern.category,
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Check exhaustive list patterns
  for (const pattern of exhaustiveListPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: pattern.category,
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Check amplifying patterns (but flag them separately)
  for (const pattern of amplifingPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      // Only flag if combined with other overgeneralization
      if (matches.length > 0) {
        matches.push({
          phrase: pattern.phrase,
          category: pattern.category,
          count: foundMatches.length,
          description: pattern.description,
        });
      }
    }
  }

  return matches;
}

/**
 * Create appropriate regex pattern based on phrase type
 */
function createRegexPattern(phrase: string): RegExp {
  // For multi-word phrases, match as-is with word boundaries
  const pattern = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
  return pattern;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Color for overgeneralization highlights
 */
export const OVERGENERALIZATION_COLOR = '#06b6d4'; // cyan-500

/**
 * Generate highlights for overgeneralization matches in text
 */
export function generateOvergeneralizationHighlights(
  text: string,
  matches: OvergeneralizationMatch[]
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
          category: 'Overgeneralization',
          color: OVERGENERALIZATION_COLOR,
        });
      }
    }
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  return highlights;
}
