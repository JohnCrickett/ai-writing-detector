/**
 * Outline Conclusion Detection
 * Detects the rigid AI-generated pattern: "Despite its [positive]..." + challenges + positive reframing
 * Common in LLM-generated Wikipedia articles with rigid outline structure
 */

export interface OutlineConclusionMatch {
  pattern: 'despite-challenges-positive' | 'despite-these-challenges-positive' | 'challenges-header' | 'future-outlook-header';
  count: number;
  description: string;
  challengeStartIndex?: number;
  positiveEndingStartIndex?: number;
}

/**
 * Phrases that typically start the despite-challenges-positive pattern
 */
const despitePatterns = [
  'despite its',
  'despite the',
  'despite their',
  'despite',
];

/**
 * Challenge indicators that follow despite phrases
 */
const challengeIndicators = [
  'faces challenges',
  'faces several challenges',
  'face challenges',
  'face several challenges',
  'presents challenges',
  'presents numerous challenges',
  'encounters challenges',
  'encounters several challenges',
  'can be challenging',
  'faces significant',
  'faces considerable',
  'faces numerous',
  'obstacles',
  'drawbacks',
  'limitations',
  'challenges',
];

/**
 * Positive reframing language that typically ends the pattern
 */
const positiveReframingPhrases = [
  'continues to',
  'continues to thrive',
  'continues to serve',
  'continues to provide',
  'continues to evolve',
  'continues to grow',
  'remains',
  'remains well-positioned',
  'remains important',
  'remains critical',
  'positioned for',
  'well-positioned for',
  'positions them',
  'position them',
  'positions themselves',
  'positions itself',
  'could enhance',
  'could improve',
  'could strengthen',
  'could benefit',
  'could advance',
  'is well-suited',
  'is positioned',
  'maintains',
  'demonstrates',
  'has managed to',
  'manages to',
];

/**
 * Section headers that indicate outline-like structure
 */
const sectionHeaders = [
  /^\s*challenges and legacy\b/im,
  /^\s*future outlook\b/im,
  /^\s*challenges and future\b/im,
  /^\s*future prospects\b/im,
];

/**
 * Detect outline-like conclusions with rigid formula patterns
 */
export function detectOutlineConclusions(text: string): OutlineConclusionMatch[] {
  const matches: OutlineConclusionMatch[] = [];
  const lowerText = text.toLowerCase();

  // Pattern 1: Despite... + challenges + positive reframing
  const despiteChallengesMatches = detectDespiteChallengesPattern(lowerText);
  matches.push(...despiteChallengesMatches);

  // Pattern 2: Despite these challenges + positive reframing
  const despiteTheseMatches = detectDespiteTheseChallengesPattern(lowerText);
  matches.push(...despiteTheseMatches);

  // Pattern 3: Challenges + positive evolution (can be challenging... continues to evolve)
  const challengeEvolutionMatches = detectChallengeEvolutionPattern(lowerText);
  matches.push(...challengeEvolutionMatches);

  // Pattern 4: Challenges + vague positive (faces challenges... potential/future developments)
  const vaguePosMatches = detectVaguePositivePattern(lowerText);
  matches.push(...vaguePosMatches);

  // Pattern 5: Standalone positive future language (Future/Potential + could enhance)
  const futurePositiveMatches = detectFuturePositivePattern(lowerText);
  matches.push(...futurePositiveMatches);

  // Pattern 6: Section headers like "Challenges and Legacy", "Future Outlook"
  const headerMatches = detectSectionHeaders(text);
  matches.push(...headerMatches);

  // Remove duplicates and return unique matches
  return deduplicateMatches(matches);
}

/**
 * Detect "Despite its/the/their [positive] ... faces challenges ... [positive reframing]"
 */
function detectDespiteChallengesPattern(lowerText: string): OutlineConclusionMatch[] {
  const matches: OutlineConclusionMatch[] = [];
  const seenIndexes = new Set<number>();

  for (const despitePhrase of despitePatterns) {
    // Find all despite phrases
    const despiteRegex = new RegExp(`\\b${despitePhrase}\\b`, 'gi');
    let despiteMatch;

    while ((despiteMatch = despiteRegex.exec(lowerText)) !== null) {
      const despiteIndex = despiteMatch.index;
      // Look ahead up to 300 characters to find the pattern (reasonable for a paragraph or two)
      // Don't cross certain boundaries that indicate separation
      let endIndex = Math.min(despiteIndex + 300, lowerText.length);
      
      // Stop at [many paragraphs] or similar artificial separators
      const separatorMatch = lowerText.substring(despiteIndex, endIndex).match(/\[\w+ \w+ \w+\]/);
      if (separatorMatch) {
        endIndex = despiteIndex + separatorMatch.index!;
      }
      
      const textAfterDespite = lowerText.substring(despiteIndex, endIndex);

      // Check if challenges phrase appears within this window
      const hasChallenges = challengeIndicators.some(indicator =>
        textAfterDespite.includes(indicator)
      );

      if (hasChallenges) {
        // Check if positive reframing appears after challenges
        const hasPositive = positiveReframingPhrases.some(phrase =>
          textAfterDespite.includes(phrase.toLowerCase())
        );

        if (hasPositive && !seenIndexes.has(despiteIndex)) {
          seenIndexes.add(despiteIndex);
          matches.push({
            pattern: 'despite-challenges-positive',
            count: 1,
            description: 'Rigid outline-like conclusion: acknowledges challenges but reframes positively',
            challengeStartIndex: despiteIndex,
            positiveEndingStartIndex: despiteIndex + 300,
          });
        }
      }
    }
  }

  return matches;
}

/**
 * Detect "Despite these challenges ... [positive reframing]"
 */
function detectDespiteTheseChallengesPattern(lowerText: string): OutlineConclusionMatch[] {
  const matches: OutlineConclusionMatch[] = [];

  const despiteTheseRegex = /despite these challenges([^.!?]{0,300})/gi;
  let match;

  while ((match = despiteTheseRegex.exec(lowerText)) !== null) {
    const textAfterPhrase = match[1];

    // Check if there's positive reframing in the following text
    const hasPositiveReframing = positiveReframingPhrases.some(phrase =>
      textAfterPhrase.toLowerCase().includes(phrase.toLowerCase())
    );

    if (hasPositiveReframing) {
      matches.push({
        pattern: 'despite-these-challenges-positive',
        count: 1,
        description: 'Outline conclusion pattern: acknowledges challenges then provides positive assessment',
        challengeStartIndex: match.index,
        positiveEndingStartIndex: match.index + match[0].length - textAfterPhrase.length,
      });
    }
  }

  return matches;
}

/**
 * Detect challenges with positive evolution pattern (can be challenging... continues to evolve)
 */
function detectChallengeEvolutionPattern(lowerText: string): OutlineConclusionMatch[] {
  const matches: OutlineConclusionMatch[] = [];

  const challengeEvolutionRegex = /(?:can be challenging|challenging)[^.!?]*?(?:[.!?])[^.!?]*?(?:continues to|continues to evolve|continues to adapt|in response to)/gi;

  let match;
  while ((match = challengeEvolutionRegex.exec(lowerText)) !== null) {
    matches.push({
      pattern: 'despite-challenges-positive',
      count: 1,
      description: 'Challenge-evolution pattern: acknowledges limitations and positive adaptation',
      challengeStartIndex: match.index,
      positiveEndingStartIndex: match.index + match[0].length,
    });
  }

  return matches;
}

/**
 * Detect vague positive patterns (faces challenges... potential/future developments)
 */
function detectVaguePositivePattern(lowerText: string): OutlineConclusionMatch[] {
  const matches: OutlineConclusionMatch[] = [];

  const vaguePositiveRegex = /faces (?:several )?challenges[^.!?]*?(?:[.!?])[^.!?]*?(?:potential|future|speculate|developments|landscape|scenario)/gi;

  let match;
  while ((match = vaguePositiveRegex.exec(lowerText)) !== null) {
    matches.push({
      pattern: 'despite-challenges-positive',
      count: 1,
      description: 'Vague positive pattern: acknowledges challenges with speculative future language',
      challengeStartIndex: match.index,
      positiveEndingStartIndex: match.index + match[0].length,
    });
  }

  return matches;
}

/**
 * Detect standalone future positive patterns (Future investments could enhance...)
 */
function detectFuturePositivePattern(lowerText: string): OutlineConclusionMatch[] {
  const matches: OutlineConclusionMatch[] = [];

  const futureKeywords = ['future', 'potential', 'upcoming', 'next'];
  const futurePositiveRegex = /(?:future|potential|upcoming|next)[^.!?]{0,100}(?:could|might|may|can)\s+(?:enhance|improve|strengthen|benefit|advance|help)/gi;

  let match;
  while ((match = futurePositiveRegex.exec(lowerText)) !== null) {
    matches.push({
      pattern: 'despite-challenges-positive',
      count: 1,
      description: 'Speculative positive outlook pattern',
      challengeStartIndex: match.index,
      positiveEndingStartIndex: match.index + match[0].length,
    });
  }

  return matches;
}

/**
 * Detect section headers indicating outline structure
 */
function detectSectionHeaders(text: string): OutlineConclusionMatch[] {
  const matches: OutlineConclusionMatch[] = [];

  for (const headerRegex of sectionHeaders) {
    if (headerRegex.test(text)) {
      matches.push({
        pattern: headerRegex.source.includes('future') ? 'future-outlook-header' : 'challenges-header',
        count: 1,
        description: 'Outline section header detected',
      });
    }
  }

  return matches;
}

/**
 * Remove duplicate matches and prefer more specific patterns
 */
function deduplicateMatches(matches: OutlineConclusionMatch[]): OutlineConclusionMatch[] {
  const unique = new Map<number, OutlineConclusionMatch>();
  
  // Pattern priority: more specific patterns are preferred
  const patternPriority: Record<string, number> = {
    'despite-these-challenges-positive': 3,
    'despite-challenges-positive': 2,
    'challenges-header': 1,
    'future-outlook-header': 1,
  };

  for (const match of matches) {
    const startIndex = match.challengeStartIndex || 0;
    const existing = unique.get(startIndex);
    
    if (!existing) {
      unique.set(startIndex, match);
    } else {
      // Keep the match with higher priority pattern
      const newPriority = patternPriority[match.pattern] || 0;
      const existingPriority = patternPriority[existing.pattern] || 0;
      if (newPriority > existingPriority) {
        unique.set(startIndex, match);
      }
    }
  }

  return Array.from(unique.values());
}

/**
 * Color for outline conclusion highlights
 */
export const OUTLINE_CONCLUSION_COLOR = '#ef4444'; // red-500

/**
 * Generate highlights for outline conclusion matches
 */
export function generateOutlineConclusionHighlights(
  text: string,
  matches: OutlineConclusionMatch[]
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

  for (const match of matches) {
    if (match.challengeStartIndex !== undefined) {
      // Highlight the entire rigid pattern
      const startIndex = match.challengeStartIndex;
      const endIndex = match.positiveEndingStartIndex
        ? match.positiveEndingStartIndex + 100
        : Math.min(startIndex + 500, text.length);

      highlights.push({
        start: startIndex,
        end: Math.min(endIndex, text.length),
        factor: match.pattern,
        category: 'Outline Conclusion',
        color: OUTLINE_CONCLUSION_COLOR,
      });
    }
  }

  // Sort by start position and remove overlaps
  highlights.sort((a, b) => a.start - b.start);

  const deduplicated: typeof highlights = [];
  for (const highlight of highlights) {
    if (deduplicated.length === 0 || deduplicated[deduplicated.length - 1].end <= highlight.start) {
      deduplicated.push(highlight);
    }
  }

  return deduplicated;
}
