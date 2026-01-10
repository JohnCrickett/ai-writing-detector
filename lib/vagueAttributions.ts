/**
 * Vague Attribution Detection (Weasel Wording)
 * Detects vague appeals to authority and overgeneralization that AI often produces
 */

export interface VagueAttributionMatch {
  phrase: string;
  category: 'vague-authority' | 'overgeneralization';
  count: number;
  description: string;
}

/**
 * Patterns for vague authority appeals
 */
const vagueAuthorityPatterns = [
  { phrase: 'industry reports', description: 'Vague reference to unnamed industry reports' },
  { phrase: 'observers have cited', description: 'Unnamed observers as source' },
  { phrase: 'critics argue', description: 'Vague critics without attribution' },
  { phrase: 'experts argue', description: 'Unnamed experts as authority' },
  { phrase: 'it is said', description: 'Passive vague attribution' },
  { phrase: 'scholars believe', description: 'Unspecified scholars cited as source' },
  { phrase: 'many believe', description: 'Vague "many" as authority' },
  { phrase: 'some sources say', description: 'Unspecified "sources" claim' },
  { phrase: 'analysts suggest', description: 'Anonymous analysts' },
  { phrase: 'research indicates', description: 'Unspecified research' },
  { phrase: 'studies show', description: 'Unattributed studies' },
  { phrase: 'reports claim', description: 'Unspecified reports' },
  { phrase: 'described', description: 'Passive voice hides attribution source' },
  { phrase: 'is considered', description: 'Vague attribution without specifying by whom' },
  { phrase: 'is believed', description: 'Vague belief attribution' },
  { phrase: 'it is believed', description: 'Vague passive belief' },
  { phrase: 'has been shown', description: 'Vague unattributed demonstration' },
  { phrase: 'has been cited', description: 'Vague citation without source' },
];

/**
 * Patterns for overgeneralization
 */
const overgeneralizationPatterns = [
  { phrase: 'academic consensus', description: 'Claimed consensus without evidence' },
  { phrase: 'consensus', description: 'Claimed consensus' },
  { phrase: 'widespread agreement', description: 'Overgeneralized agreement claim' },
  { phrase: 'most scholars', description: 'Sweeping generalization about scholars' },
  { phrase: 'most experts', description: 'Sweeping generalization about experts' },
  { phrase: 'the general view', description: 'Claimed general agreement without citation' },
  { phrase: 'commonly argued', description: 'Claimed commonality without evidence' },
  { phrase: 'widely accepted', description: 'Claimed wide acceptance without evidence' },
  { phrase: 'commonly accepted', description: 'Overstated acceptance' },
  { phrase: 'universally acknowledged', description: 'Overstated universal agreement' },
];

/**
 * Detect vague attribution patterns in text
 */
export function detectVagueAttributions(text: string): VagueAttributionMatch[] {
  const matches: VagueAttributionMatch[] = [];
  const lowerText = text.toLowerCase();

  // Check vague authority patterns
  for (const pattern of vagueAuthorityPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'vague-authority',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Check overgeneralization patterns
  for (const pattern of overgeneralizationPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'overgeneralization',
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
 * Color for vague attribution highlights
 */
export const VAGUE_ATTRIBUTION_COLOR = '#6366f1'; // indigo-500

/**
 * Generate highlights for vague attribution matches in text
 */
export function generateVagueAttributionHighlights(
  text: string,
  matches: VagueAttributionMatch[]
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
          category: 'Vague Attribution',
          color: VAGUE_ATTRIBUTION_COLOR,
        });
      }
    }
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  return highlights;
}
