/**
 * Negative Parallelism Detection
 * Detects parallel constructions involving "not", "but", or "however" that are common in LLM writing
 * These patterns are used to appear balanced and thoughtful but are characteristic of AI generation
 */

export interface NegativeParallelismMatch {
  pattern: 'not-only-but' | 'not-just-its' | 'however-contrast' | 'not-but-negation' | 'no-no-just' | 'not-rather-negation' | 'not-its';
  description: string;
  count: number;
}

/**
 * Patterns for negative parallelism detection
 */
const negativeParallelismPatterns = [
  {
    name: 'not-only-but',
    regex: /not\s+only\s+[^;]*?(?:,?\s+but|;)/i,
    description: 'Not only ... but construction (appears balanced and thoughtful)',
  },
  {
    name: 'not-just-its',
    regex: /not\s+just\s+[^.]*?it\s+(?:is|'s)/i,
    description: 'Not just ... it\'s construction (false dichotomy)',
  },
  {
    name: 'however-contrast',
    regex: /[.,;]\s+however|^\s*however/im,
    description: 'However introducing negation of previous statement',
  },
  {
    name: 'not-but-negation',
    regex: /not\s+\w+[^.;]*?\s+but\s+/i,
    description: 'Not ... but construction (negating primary properties)',
  },
  {
    name: 'not-rather-negation',
    regex: /not\s+\w+[^.;]*?(?:\.\s+)?rather/i,
    description: 'Not ... rather construction (correction/clarification)',
  },
  {
    name: 'no-no-just',
    regex: /(?:not\s+\w+[^,.;—–]*?(?:,|;|—|–)\s*(?:not|no)\s+\w+[^,.;—–]*?(?:,|;|—|–)[^.;]*?just\s+)/i,
    description: 'No ... no ... just anaphoric negation pattern',
  },
  {
    name: 'not-its',
    regex: /not\s+(?:who|what|which|where|when|why)\s+[^.;]*?it\s+(?:is|'s)/i,
    description: 'Not [question word] ... it\'s construction',
  },
];

/**
 * Detect negative parallelism patterns in text
 */
export function detectNegativeParallelism(text: string): NegativeParallelismMatch[] {
  const matches: NegativeParallelismMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const patternDef of negativeParallelismPatterns) {
    try {
      // Create a global version of the regex for finding all matches
      const globalRegex = new RegExp(patternDef.regex.source, 'gi');
      let count = 0;
      let matchResult;
      let lastIndex = -1;

      // Safety limit to prevent infinite loops
      const maxIterations = 1000;
      let iterations = 0;

      while ((matchResult = globalRegex.exec(lowerText)) !== null && iterations < maxIterations) {
        // Prevent infinite loop if match is empty
        if (matchResult.index === lastIndex) {
          globalRegex.lastIndex = lastIndex + 1;
        }
        lastIndex = matchResult.index;
        count++;
        iterations++;
      }

      if (count > 0) {
        matches.push({
          pattern: patternDef.name as NegativeParallelismMatch['pattern'],
          description: patternDef.description,
          count: count,
        });
      }
    } catch (e) {
      // Skip this pattern if it causes an error
      continue;
    }
  }

  return matches;
}

/**
 * Color for negative parallelism highlights
 */
export const NEGATIVE_PARALLELISM_COLOR = '#f97316'; // orange-500

/**
 * Generate highlights for negative parallelism matches in text
 */
export function generateNegativeParallelismHighlights(
  text: string,
  matches: NegativeParallelismMatch[]
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
    try {
      const patternDef = negativeParallelismPatterns.find(p => p.name === match.pattern);
      if (!patternDef) continue;

      // Ensure regex has global flag
      const regex = new RegExp(patternDef.regex.source, 'gi');
      let matchResult;
      let lastIndex = -1;

      // Safety limit to prevent infinite loops
      const maxIterations = 1000;
      let iterations = 0;

      while ((matchResult = regex.exec(lowerText)) !== null && iterations < maxIterations) {
        // Prevent infinite loop if match is empty or same position
        if (matchResult.index === lastIndex || matchResult[0].length === 0) {
          regex.lastIndex = matchResult.index + 1;
        }
        lastIndex = matchResult.index;

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
            factor: match.pattern,
            category: 'Negative Parallelism',
            color: NEGATIVE_PARALLELISM_COLOR,
          });
        }
        
        iterations++;
      }
    } catch (e) {
      // Skip this pattern if it causes an error
      continue;
    }
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  return highlights;
}
