/**
 * Lexical Diversity Detection (Type-Token Ratio)
 * Detects unnaturally high or low vocabulary diversity as an AI writing signal
 */

export interface LexicalDiversityResult {
  typeTokenRatio: number;
  wordCount: number;
  uniqueWordCount: number;
  isAIPotential: boolean;
  reason: string;
  score: number;
}

/**
 * Calculate the Type-Token Ratio (TTR) = unique words / total words
 * TTR > 0.65 suggests unnaturally diverse vocabulary (high variance - possible AI)
 * TTR < 0.35 suggests unnaturally repetitive vocabulary (low variance - possible AI)
 * TTR 0.35-0.65 is natural human writing range
 */
export function calculateTypeTokenRatio(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  // Extract words: sequences of word characters (case-insensitive)
  const words = text.match(/\b\w+\b/g) || [];
  if (words.length === 0) {
    return 0;
  }

  // Convert to lowercase for comparison
  const lowerWords = words.map(w => w.toLowerCase());
  
  // Get unique words using Set
  const uniqueWords = new Set(lowerWords);
  
  // Calculate TTR
  const ttr = uniqueWords.size / lowerWords.length;
  
  return ttr;
}

/**
 * Detect lexical diversity (Type-Token Ratio) in text
 */
export function detectLexicalDiversity(text: string): LexicalDiversityResult {
  if (!text || text.trim().length === 0) {
    return {
      typeTokenRatio: 0,
      wordCount: 0,
      uniqueWordCount: 0,
      isAIPotential: false,
      reason: 'Empty text',
      score: 0,
    };
  }

  // Extract words
  const words = text.match(/\b\w+\b/g) || [];
  if (words.length === 0) {
    return {
      typeTokenRatio: 0,
      wordCount: 0,
      uniqueWordCount: 0,
      isAIPotential: false,
      reason: 'No words found',
      score: 0,
    };
  }

  // Convert to lowercase for analysis
  const lowerWords = words.map(w => w.toLowerCase());
  const uniqueWords = new Set(lowerWords);

  // Calculate metrics
  const wordCount = lowerWords.length;
  const uniqueWordCount = uniqueWords.size;
  const typeTokenRatio = uniqueWordCount / wordCount;

  // Determine if TTR is abnormal
  let isAIPotential = false;
  let reason = '';
  let score = 0;

  if (wordCount < 500) {
    // Text too short for reliable TTR analysis — short texts naturally have high TTR
    reason = `Text too short (${wordCount} words) for reliable lexical diversity analysis. Minimum 500 words recommended.`;
  } else if (typeTokenRatio > 0.65) {
    // Unnaturally high diversity - many different words used with equal frequency
    isAIPotential = true;
    reason = `Unnaturally diverse vocabulary (TTR: ${typeTokenRatio.toFixed(3)}). Using ${uniqueWordCount} unique words in ${wordCount} total words suggests artificially varied word choices, characteristic of some AI systems trained on diverse corpora.`;
    // Score based on how extreme the TTR is
    const exceedance = typeTokenRatio - 0.65;
    score = Math.min(Math.round(exceedance * 25), 25);
  } else if (typeTokenRatio < 0.35) {
    // Unnaturally low diversity - vocabulary is repetitive
    isAIPotential = true;
    reason = `Limited vocabulary diversity (TTR: ${typeTokenRatio.toFixed(3)}). Using only ${uniqueWordCount} unique words in ${wordCount} total words suggests repetitive vocabulary use, sometimes characteristic of certain AI systems.`;
    // Score based on how extreme the TTR is
    const deficit = 0.35 - typeTokenRatio;
    score = Math.min(Math.round(deficit * 25), 25);
  } else {
    reason = `Natural vocabulary diversity (TTR: ${typeTokenRatio.toFixed(3)}). The balance of ${uniqueWordCount} unique words in ${wordCount} total words falls within typical human writing patterns.`;
  }

  return {
    typeTokenRatio,
    wordCount,
    uniqueWordCount,
    isAIPotential,
    reason,
    score,
  };
}

/**
 * Color for Lexical Diversity highlights
 */
export const LEXICAL_DIVERSITY_COLOR = '#f97316'; // orange-500

/**
 * Generate pattern match for integration with main detector
 */
export function generateLexicalDiversityMatch(text: string) {
  const result = detectLexicalDiversity(text);

  if (!result.isAIPotential) {
    return null;
  }

  const label = result.typeTokenRatio > 0.65 ? 'unnaturally diverse' : 'unusually repetitive';

  return {
    category: 'Lexical Diversity',
    phrase: `Vocabulary diversity (TTR: ${result.typeTokenRatio.toFixed(3)}) - ${label}`,
    count: 1,
    score: Math.round(result.score),
  };
}
