/**
 * Flesch-Kincaid Grade Level Detection
 * Detects artificially high reading grade level as an AI writing signal
 */

export interface FleschKincaidResult {
  gradeLevel: number;
  sentenceCount: number;
  wordCount: number;
  syllableCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  isAIPotential: boolean;
  reason: string;
  score: number;
}

/**
 * Calculate the number of syllables in a word using common English phonetic rules
 */
export function calculateSyllables(word: string): number {
  if (!word || word.length === 0) return 0;

  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (cleanWord.length === 0) return 1;

  let syllableCount = 0;
  let vowelGroup = false;

  // Count vowel groups (each vowel group = one syllable)
  for (let i = 0; i < cleanWord.length; i++) {
    const char = cleanWord[i];
    const isVowel = 'aeiouy'.includes(char);

    if (isVowel && !vowelGroup) {
      syllableCount++;
      vowelGroup = true;
    } else if (!isVowel) {
      vowelGroup = false;
    }
  }

  // Adjust for silent 'e'
  if (cleanWord.endsWith('e')) {
    syllableCount--;
  }

  // Adjust for 'le' at the end (usually adds a syllable: "table" = 2)
  if (cleanWord.endsWith('le') && cleanWord.length > 2) {
    const beforeLe = cleanWord[cleanWord.length - 3];
    if (!'aeiou'.includes(beforeLe)) {
      syllableCount++;
    }
  }

  // Handle '-ed' and '-es' endings (usually don't add syllables unless letter before is 't' or 'd')
  if ((cleanWord.endsWith('ed') || cleanWord.endsWith('es')) && cleanWord.length > 3) {
    const beforeEnding = cleanWord[cleanWord.length - 3];
    if (cleanWord.endsWith('ed') && beforeEnding !== 't' && beforeEnding !== 'd') {
      // -ed after consonant doesn't add syllable
    } else if (cleanWord.endsWith('es') && !'sxz'.includes(beforeEnding)) {
      // -es after consonant usually doesn't add syllable
    }
  }

  // Minimum of 1 syllable per word
  return Math.max(1, syllableCount);
}

/**
 * Detect Flesch-Kincaid grade level in text
 * Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
 */
export function detectFleschKincaidGradeLevel(text: string): FleschKincaidResult {
  if (!text || text.trim().length === 0) {
    return {
      gradeLevel: 0,
      sentenceCount: 0,
      wordCount: 0,
      syllableCount: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
      isAIPotential: false,
      reason: 'Empty text',
      score: 0,
    };
  }

  // Count sentences (. ! ? as delimiters)
  const sentenceCount = (text.match(/[.!?]+/g) || []).length || 1;

  // Count words (sequences of word characters)
  const words = text.match(/\b\w+\b/g) || [];
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      gradeLevel: 0,
      sentenceCount,
      wordCount: 0,
      syllableCount: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
      isAIPotential: false,
      reason: 'No words found',
      score: 0,
    };
  }

  // Calculate total syllables
  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += calculateSyllables(word);
  }

  // Calculate averages
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / wordCount;

  // Apply Flesch-Kincaid Grade Level formula
  const gradeLevel = 
    0.39 * avgWordsPerSentence + 
    11.8 * avgSyllablesPerWord - 
    15.59;

  // Clamp grade level to reasonable range (0-18 for college graduate)
  const clampedGradeLevel = Math.max(0, Math.min(gradeLevel, 18));

  // Detect AI signal: grade level > 14 (college+) indicates potential AI
  const isAIPotential = clampedGradeLevel > 14;

  // Calculate score contribution (0-25 points)
  // Higher grade level = higher AI probability
  const gradeScore = isAIPotential ? Math.min((clampedGradeLevel - 14) * 5, 25) : 0;

  // Provide reasoning
  let reason = '';
  if (isAIPotential) {
    reason = `Artificially high grade level (${clampedGradeLevel.toFixed(1)}) suggests overly complex vocabulary and sentence structure for the topic.`;
  } else {
    reason = `Grade level (${clampedGradeLevel.toFixed(1)}) is appropriate for content complexity.`;
  }

  return {
    gradeLevel: clampedGradeLevel,
    sentenceCount,
    wordCount,
    syllableCount: totalSyllables,
    avgWordsPerSentence,
    avgSyllablesPerWord,
    isAIPotential,
    reason,
    score: gradeScore,
  };
}

/**
 * Color for Flesch-Kincaid highlights
 */
export const FLESCH_KINCAID_COLOR = '#ef4444'; // red-500

/**
 * Generate pattern match for integration with main detector
 */
export function generateFleschKincaidMatch(text: string) {
  const result = detectFleschKincaidGradeLevel(text);

  if (!result.isAIPotential) {
    return null;
  }

  return {
    category: 'Flesch-Kincaid Grade Level',
    phrase: `Grade level ${result.gradeLevel.toFixed(1)} (college/graduate level)`,
    count: 1,
    score: Math.round(result.score),
  };
}
