/**
 * Superficial Analysis Detection
 * Detects AI chatbot patterns: superficial analysis with vague attributions,
 * present participle phrases suggesting unsubstantiated significance,
 * and watch words indicating unsupported claims
 */

export interface SuperficialAnalysisMatch {
  phrase: string;
  category: 'participle-phrase' | 'vague-attribution' | 'named-attribution' | 'watch-word';
  count: number;
  description: string;
}

/**
 * Watch words that often indicate superficial analysis
 */
const watchWords = [
  { phrase: 'ensuring', root: 'ensur', description: 'Artificial certainty about consequences', partial: true },
  { phrase: 'ensures', root: 'ensur', description: 'Artificial certainty about consequences', partial: true },
  { phrase: 'reflecting', root: 'reflect', description: 'Vague significance attribution', partial: true },
  { phrase: 'reflects', root: 'reflect', description: 'Vague significance attribution', partial: true },
  { phrase: 'conducive to', description: 'Unsupported consequence claim' },
  { phrase: 'tantamount to', description: 'Exaggerated equivalence claim' },
  { phrase: 'contributing to', root: 'contribut', description: 'Unsupported causal claim', partial: true },
  { phrase: 'contributing', root: 'contribut', description: 'Unsupported causal claim', partial: true },
  { phrase: 'cultivating', root: 'cultivat', description: 'Figurative transformation without basis', partial: true },
  { phrase: 'cultivate', root: 'cultivat', description: 'Figurative transformation without basis', partial: true },
  { phrase: 'encompassing', root: 'encompass', description: 'Vague scope claim', partial: true },
  { phrase: 'encompasses', root: 'encompass', description: 'Vague scope claim', partial: true },
  { phrase: 'essentially', root: 'essentiall', description: 'Superficial essence claim', partial: true },
  { phrase: 'fundamentally', description: 'Unsubstantiated fundamental claim' },
  { phrase: 'valuable insights', description: 'Vague positive attribution to research' },
];

/**
 * Vague attributions to undefined sources or groups
 */
const vagueAttributions = [
  { phrase: 'many believe', description: 'Unspecified consensus claim' },
  { phrase: 'some argue', description: 'Undefined argument attribution' },
  { phrase: 'observers note', description: 'Vague third-party attribution' },
  { phrase: 'experts suggest', description: 'Undefined expert attribution' },
  { phrase: 'it is often said', description: 'Completely unattributed claim' },
  { phrase: 'sources say', description: 'Anonymous source attribution' },
  { phrase: 'critics argue', description: 'Undefined critic attribution' },
  { phrase: 'analysts believe', description: 'Undefined analyst attribution' },
  { phrase: 'commentators point out', description: 'Vague commentator attribution' },
  { phrase: 'observers say', description: 'Unspecified observer attribution' },
  { phrase: 'many observe', description: 'Unspecified observer claim' },
  { phrase: 'observers observe', description: 'Tautological vague observation' },
  { phrase: 'according to', description: 'Unspecified source attribution' },
];

/**
 * Patterns for detecting superficial participle phrases
 * These are -ing words/phrases that appear to add significance at sentence ends
 */
const participlePatterns = [
  { phrase: 'ensuring', root: 'ensur', description: 'Participial phrase suggesting artificial certainty', partial: true },
  { phrase: 'building', root: 'build', description: 'Participial phrase suggesting consequence', partial: true },
  { phrase: 'creating', root: 'creat', description: 'Participial phrase suggesting creation of impact', partial: true },
  { phrase: 'fostering', root: 'foster', description: 'Participial phrase suggesting cultivation', partial: true },
  { phrase: 'contributing', root: 'contribut', description: 'Participial phrase suggesting contribution', partial: true },
  { phrase: 'shaping', root: 'shap', description: 'Participial phrase suggesting influence', partial: true },
  { phrase: 'highlighting', root: 'highlight', description: 'Participial phrase suggesting importance', partial: true },
  { phrase: 'cultivating', root: 'cultivat', description: 'Participial phrase suggesting transformation', partial: true },
  { phrase: 'reflecting', root: 'reflect', description: 'Participial phrase suggesting broader significance', partial: true },
  { phrase: 'promoting', root: 'promot', description: 'Participial phrase suggesting causation', partial: true },
  { phrase: 'advancing', root: 'advanc', description: 'Participial phrase suggesting progress', partial: true },
  { phrase: 'enabling', root: 'enabl', description: 'Participial phrase suggesting empowerment', partial: true },
  { phrase: 'benefiting', root: 'benefit', description: 'Participial phrase suggesting advantage', partial: true },
];

/**
 * Pattern for detecting named source attributions (RAG-style)
 * Matches: "[Capitalized Name] [verb] [that/the/this] [significance claims]"
 */
const namedSourcePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(said|noted|suggested|emphasized|revealed|showed|demonstrated|argued|highlighted|explained|claimed|believed|indicated|found|observed|emphasized|stressed|asserted)\s+(?:that\s+)?(?:the\s+)?(?:this\s+|it\s+)?\w+/gi;

/**
 * Detect superficial analysis patterns in text
 */
export function detectSuperficialAnalysis(text: string): SuperficialAnalysisMatch[] {
  const matches: SuperficialAnalysisMatch[] = [];
  const lowerText = text.toLowerCase();

  // Detect watch words
  for (const pattern of watchWords) {
    // Use root for regex matching if available, otherwise use phrase
    const regexPattern = (pattern as any).root || pattern.phrase;
    const regex = createRegexPattern(regexPattern, (pattern as any).partial);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'watch-word',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Detect vague attributions
  for (const pattern of vagueAttributions) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'vague-attribution',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Detect participle phrases at sentence/clause ends
  // Look for patterns like "..., [verb]ing [significance]." or "..., [verb]ing [object]."
  // Only detect if the -ing word appears near sentence end with following content
  // and is not a noun (preceded by determiners like "the")
  for (const pattern of participlePatterns) {
    // Match actual -ing words (the pattern.phrase should end in -ing typically)
    const regexPattern = pattern.phrase; // Use actual phrase like "ensuring", "building"
    // Match with a lookbehind to avoid noun forms (preceded by "the", "a", etc.)
    // Match word at boundary, followed by content until sentence end
    const partialRegex = `(?<![a-z])\\b${regexPattern}\\s+\\w+(?:\\s+\\w+)*?\\s*[.!?]`;
    const regex = new RegExp(partialRegex, 'gi');
    let match;
    let count = 0;

    while ((match = regex.exec(text)) !== null) {
      // Only count if it looks like a participle phrase (has content after the word)
      const phrase = match[0];
      
      // Check if preceded by determiners (indicating noun form): "the building", "a building"
      // Look back from the match position for the determiner pattern (case-insensitive)
      const beforeMatch = text.substring(Math.max(0, match.index - 20), match.index).toLowerCase();
      if (/\b(the|a|an|this|that|these|those)\s+$/.test(beforeMatch)) {
        continue; // Skip, it's a noun not a participle
      }
      
      // Find where the actual word ends
      const wordEndPos = regexPattern.length;
      const afterWord = phrase.substring(wordEndPos).trim();
      // If there's at least some content after the word before punctuation
      // and it's not just a single character or space
      if (afterWord.length > 2 && !afterWord.match(/^[a-z]\.?$/i)) {
        count++;
      }
    }

    if (count > 0) {
      matches.push({
        phrase: pattern.phrase,
        category: 'participle-phrase',
        count: count,
        description: pattern.description,
      });
    }
  }

  // Detect named source attributions (RAG-style false citations)
  // Look for "[Name] [verb] that this [suggests significance]"
  let namedMatch;
  let namedCount = 0;

  while ((namedMatch = namedSourcePattern.exec(text)) !== null) {
    namedCount++;
  }

  if (namedCount > 0) {
    matches.push({
      phrase: 'named source attribution',
      category: 'named-attribution',
      count: namedCount,
      description: 'Specific person/source attributed with vague significance claim',
    });
  }

  return matches;
}

/**
 * Create appropriate regex pattern based on phrase type
 */
function createRegexPattern(phrase: string, isPartial: boolean = false): RegExp {
  const isMultiWord = phrase.includes(' ');

  let pattern: RegExp;

  if (isPartial) {
    // Partial word match - match at word boundary but allow word to continue
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
 * Color for superficial analysis highlights
 */
export const SUPERFICIAL_ANALYSIS_COLOR = '#8b5cf6'; // purple-500

/**
 * Generate highlights for superficial analysis matches in text
 */
export function generateSuperficialAnalysisHighlights(
  text: string,
  matches: SuperficialAnalysisMatch[]
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
    if (match.category === 'named-attribution') {
      // Handle named attributions specially
      const namedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(said|noted|suggested|emphasized|revealed|showed|demonstrated|argued|highlighted|explained|claimed|believed|indicated|found|observed)\s+(?:that\s+)?(?:this|the|it|these)\s+(?:is|was|demonstrates|reveals|shows|exemplifies|represents|indicates)\s+/gi;

      let namedMatch;
      while ((namedMatch = namedPattern.exec(text)) !== null) {
        const newStart = namedMatch.index;
        const newEnd = namedMatch.index + namedMatch[0].length;
        
        // Skip if this highlight overlaps with an existing one
        const hasOverlap = highlights.some(existing => 
          (newStart < existing.end && newEnd > existing.start)
        );
        
        if (!hasOverlap) {
          highlights.push({
            start: newStart,
            end: newEnd,
            factor: match.phrase,
            category: 'Superficial Analysis',
            color: SUPERFICIAL_ANALYSIS_COLOR,
          });
        }
      }
    } else if (match.category === 'participle-phrase') {
      // Detect participle phrases at sentence/clause ends
      const participleRegex = new RegExp(`(?<![a-z])\\b${match.phrase}\\s+\\w+(?:\\s+\\w+)*?\\s*[.!?]`, 'gi');
      let particleMatch;

      while ((particleMatch = participleRegex.exec(text)) !== null) {
        // Verify this looks like a participle phrase (has content after word)
        const phrase = particleMatch[0];
        
        // Check if preceded by determiners (indicating noun form)
        const beforeMatch = text.substring(Math.max(0, particleMatch.index - 20), particleMatch.index).toLowerCase();
        if (/\b(the|a|an|this|that|these|those)\s+$/.test(beforeMatch)) {
          continue; // Skip, it's a noun not a participle
        }
        
        const wordEndPos = match.phrase.length;
        const afterWord = phrase.substring(wordEndPos).trim();
        if (afterWord.length > 2 && !afterWord.match(/^[a-z]\.?$/i)) {
          const newStart = particleMatch.index;
          const newEnd = particleMatch.index + particleMatch[0].length;
          
          // Skip if this highlight overlaps with an existing one
          const hasOverlap = highlights.some(existing => 
            (newStart < existing.end && newEnd > existing.start)
          );
          
          if (!hasOverlap) {
            highlights.push({
              start: newStart,
              end: newEnd,
              factor: match.phrase,
              category: 'Superficial Analysis',
              color: SUPERFICIAL_ANALYSIS_COLOR,
            });
          }
        }
      }
    } else {
      // Handle watch words and vague attributions
      const regex = createRegexPattern(match.phrase);
      let regexMatch;

      while ((regexMatch = regex.exec(lowerText)) !== null) {
        const newStart = regexMatch.index;
        const newEnd = regexMatch.index + regexMatch[0].length;
        
        // Skip if this highlight overlaps with an existing one
        const hasOverlap = highlights.some(existing => 
          (newStart < existing.end && newEnd > existing.start)
        );
        
        if (!hasOverlap) {
          highlights.push({
            start: newStart,
            end: newEnd,
            factor: match.phrase,
            category: 'Superficial Analysis',
            color: SUPERFICIAL_ANALYSIS_COLOR,
          });
        }
      }
    }
  }

  // Sort by start position and remove duplicates
  highlights.sort((a, b) => a.start - b.start);

  // Remove overlapping highlights (keep first occurrence)
  const deduplicated: typeof highlights = [];
  for (const highlight of highlights) {
    const overlaps = deduplicated.some(
      h => (h.start <= highlight.start && highlight.start < h.end) ||
           (highlight.start <= h.start && h.start < highlight.end)
    );
    if (!overlaps) {
      deduplicated.push(highlight);
    }
  }

  return deduplicated;
}
