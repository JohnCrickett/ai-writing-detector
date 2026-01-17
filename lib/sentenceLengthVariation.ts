/**
 * Sentence Length Variation Detection
 * Detects unnaturally consistent sentence lengths as an AI writing signal
 */

export interface SentenceLengthVariationResult {
  sentenceCount: number;
  sentenceLengths: number[];
  averageLength: number;
  standardDeviation: number;
  coefficientOfVariation: number;
  isAIPotential: boolean;
  reason: string;
  score: number;
}

/**
 * Split text into sentences using common delimiters
 */
export function splitIntoSentences(text: string): string[] {
  // Split on . ! ? but preserve the delimiters temporarily
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.filter(s => s.trim().length > 0);
}

/**
 * Count words in a sentence
 */
export function countWords(sentence: string): number {
  const words = sentence.match(/\b\w+\b/g) || [];
  return words.length;
}

/**
 * Calculate standard deviation from an array of numbers
 */
export function calculateStandardDeviation(numbers: number[]): number {
  if (numbers.length <= 1) return 0;
  
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  
  return Math.sqrt(variance);
}

/**
 * Detect sentence length variation in text
 * AI text typically has low variation (std dev < 6 or coefficient of variation < 0.35)
 */
export function detectSentenceLengthVariation(text: string): SentenceLengthVariationResult {
  if (!text || text.trim().length === 0) {
    return {
      sentenceCount: 0,
      sentenceLengths: [],
      averageLength: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      isAIPotential: false,
      reason: 'Empty text',
      score: 0,
    };
  }

  const sentences = splitIntoSentences(text);
  
  if (sentences.length < 3) {
    return {
      sentenceCount: sentences.length,
      sentenceLengths: [],
      averageLength: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      isAIPotential: false,
      reason: 'Insufficient sentences for variation analysis (minimum 3 required)',
      score: 0,
    };
  }

  // Get word counts for each sentence
  const sentenceLengths = sentences.map(sentence => countWords(sentence));

  // Calculate statistics
  const averageLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const standardDeviation = calculateStandardDeviation(sentenceLengths);
  const coefficientOfVariation = averageLength > 0 ? standardDeviation / averageLength : 0;

  // Detect AI signal: low variation indicates unnaturally consistent sentence structure
  // Threshold: std dev < 4 words AND coefficient of variation < 0.30 (both must be true)
  const isAIPotential = standardDeviation < 4 && coefficientOfVariation < 0.30;

  // Calculate score contribution (0-25 points)
  let score = 0;
  if (isAIPotential) {
    // Score based on how low the variation is
    // Lower variation = higher AI probability
    const variationScore = coefficientOfVariation < 0.2 ? 25 : 
                          coefficientOfVariation < 0.3 ? 20 :
                          coefficientOfVariation < 0.35 ? 15 : 0;
    score = variationScore;
  }

  // Provide reasoning
  let reason = '';
  if (isAIPotential) {
    reason = `Unnaturally consistent sentence structure detected. Average sentence: ${averageLength.toFixed(1)} words, Standard deviation: ${standardDeviation.toFixed(2)} (CV: ${coefficientOfVariation.toFixed(3)}). Human writing varies more naturally between short and long sentences.`;
  } else {
    reason = `Natural sentence length variation detected. Average sentence: ${averageLength.toFixed(1)} words, Standard deviation: ${standardDeviation.toFixed(2)} (CV: ${coefficientOfVariation.toFixed(3)}).`;
  }

  return {
    sentenceCount: sentences.length,
    sentenceLengths,
    averageLength,
    standardDeviation,
    coefficientOfVariation,
    isAIPotential,
    reason,
    score,
  };
}

/**
 * Color for sentence length variation highlights
 */
export const SENTENCE_LENGTH_VARIATION_COLOR = '#f97316'; // orange-500

/**
 * Generate pattern match for integration with main detector
 */
export function generateSentenceLengthVariationMatch(text: string) {
  const result = detectSentenceLengthVariation(text);

  if (!result.isAIPotential) {
    return null;
  }

  return {
    category: 'Sentence Length Variation',
    phrase: `CV: ${result.coefficientOfVariation.toFixed(3)} (std dev: ${result.standardDeviation.toFixed(2)})`,
    count: 1,
    score: result.score,
  };
}
