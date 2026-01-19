/**
 * Word Frequency Distribution Detection
 * 
 * Detects deviations from Zipf's Law in word frequency distributions.
 * Natural language follows Zipf's Law where the most common word appears roughly
 * twice as often as the second most common, three times as often as the third, etc.
 * AI text often deviates from this distribution.
 */

export interface WordFrequencyResult {
  deviation: number;
  wordCount: number;
  uniqueWordCount: number;
  topWords: Array<{ word: string; frequency: number; expectedFrequency?: number }>;
  isAIPotential: boolean;
  reason: string;
  score: number;
}

// Common English stopwords to ignore if desired
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'could', 'did', 'do', 'does', 'doing',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'might',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
  'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you',
  'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Extract and count word frequencies from text
 */
export function getWordFrequencies(
  text: string,
  ignoreStopwords: boolean = false
): Map<string, number> {
  if (!text || text.trim().length === 0) {
    return new Map();
  }

  // Extract words: sequences of word characters (case-insensitive)
  const words = text.match(/\b\w+\b/g) || [];
  if (words.length === 0) {
    return new Map();
  }

  // Convert to lowercase and filter
  const frequencies = new Map<string, number>();
  
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    
    // Skip stopwords if requested
    if (ignoreStopwords && STOPWORDS.has(lowerWord)) {
      continue;
    }
    
    frequencies.set(lowerWord, (frequencies.get(lowerWord) || 0) + 1);
  }

  return frequencies;
}

/**
 * Calculate the deviation from expected Zipfian distribution
 * Uses multiple metrics:
 * 1. How much does the distribution deviate from the expected 1/rank pattern
 * 2. How uniform is the distribution (are all frequencies similar?)
 */
export function calculateZipfianDeviation(text: string, ignoreStopwords: boolean = false): number {
  const frequencies = getWordFrequencies(text, ignoreStopwords);
  
  if (frequencies.size === 0) {
    return 0;
  }

  // Sort by frequency (descending)
  const sortedFreqs = Array.from(frequencies.values()).sort((a, b) => b - a);
  const totalWords = sortedFreqs.reduce((sum, freq) => sum + freq, 0);
  const numWords = sortedFreqs.length;
  
  // Metric 1: Zipfian deviation - how much does actual distribution differ from C/rank?
  // Use theoretical C based on total words and number of unique words
  const C = totalWords / Math.log(numWords + 1); // Theoretical Zipfian constant
  
  let zipfianDeviation = 0;
  for (let rank = 1; rank <= numWords; rank++) {
    const actualFreq = sortedFreqs[rank - 1];
    const expectedFreq = C / rank;
    const relativeError = Math.abs(actualFreq - expectedFreq) / (expectedFreq || 1);
    zipfianDeviation += relativeError;
  }
  zipfianDeviation = zipfianDeviation / numWords;
  
  // Metric 2: Uniformity - measure how similar all frequencies are
  // Calculate coefficient of variation (std dev / mean)
  const mean = totalWords / numWords;
  let variance = 0;
  for (const freq of sortedFreqs) {
    variance += Math.pow(freq - mean, 2);
  }
  variance = variance / numWords;
  const stdDev = Math.sqrt(variance);
  const uniformity = stdDev / mean; // Lower = more uniform (AI-like)
  
  // Metric 3: Max-Min ratio - ratio of most common to least common word
  const maxFreq = sortedFreqs[0];
  const minFreq = sortedFreqs[numWords - 1];
  const frequencyRatio = maxFreq / (minFreq || 1);
  
  // Natural language typically has:
  // - Natural Zipfian deviation: 0.5-1.5
  // - Uniformity: 0.5-0.8 (higher = more varied)
  // - Max-Min ratio: 5-50 (higher = more skewed towards common words)
  
  // AI text typically has:
  // - Higher Zipfian deviation: 1.5-3+
  // - Lower uniformity: 0.1-0.4 (all words similar frequency)
  // - Lower Max-Min ratio: 1-5 (all words have similar frequency)
  
  // Combined metric: weight the different factors
  // If uniformity is very low (< 0.3) or frequency ratio is very low (< 2), it's likely AI
  const combinedDeviation = 
    (zipfianDeviation * 0.4) +                    // Zipfian deviation contribution
    ((1 - uniformity) * 0.3) +                    // Inverse of uniformity (higher = more uniform/AI)
    ((5 - Math.min(frequencyRatio, 5)) / 5 * 0.3); // Inverse of frequency ratio
  
  return Math.min(combinedDeviation, 1.0);
}

/**
 * Detect word frequency distribution anomalies in text
 */
export function detectWordFrequencyDistribution(
  text: string,
  ignoreStopwords: boolean = false
): WordFrequencyResult {
  if (!text || text.trim().length === 0) {
    return {
      deviation: 0,
      wordCount: 0,
      uniqueWordCount: 0,
      topWords: [],
      isAIPotential: false,
      reason: 'Empty text',
      score: 0,
    };
  }

  const frequencies = getWordFrequencies(text, ignoreStopwords);
  
  if (frequencies.size === 0) {
    return {
      deviation: 0,
      wordCount: 0,
      uniqueWordCount: 0,
      topWords: [],
      isAIPotential: false,
      reason: 'No valid words found',
      score: 0,
    };
  }

  // Get total word count
  const totalWords = Array.from(frequencies.values()).reduce((sum, freq) => sum + freq, 0);
  
  // Sort words by frequency
  const sortedWords = Array.from(frequencies.entries())
    .sort(([, freqA], [, freqB]) => freqB - freqA);
  
  // Get top words for reporting
  const topWords = sortedWords.slice(0, 10).map(([word, frequency]) => ({
    word,
    frequency,
  }));
  
  // Calculate Zipfian deviation
  const deviation = calculateZipfianDeviation(text, ignoreStopwords);
  
  // Determine if distribution is abnormal
  // Threshold: deviation > 0.05 suggests deviation from natural distribution
  // Most natural text: 0.02-0.08, AI text: 0.08-0.25+
  const threshold = 0.05;
  let isAIPotential = false;
  let reason = '';
  let score = 0;
  
  if (totalWords < 20) {
    // Text too short for reliable analysis
    reason = `Text too short (${totalWords} words) for reliable word frequency analysis. Minimum 20 words recommended.`;
  } else if (deviation > threshold) {
    isAIPotential = true;
    
    // Analyze type of deviation
    const sortedFreqs = sortedWords.map(([, freq]) => freq);
    const firstTwoRatio = sortedFreqs[0] / (sortedFreqs[1] || 1);
    
    if (firstTwoRatio < 1.5) {
      // Flatter distribution - too uniform
      reason = `Unnaturally uniform word distribution (deviation: ${deviation.toFixed(3)}). The most common word only appears ${firstTwoRatio.toFixed(1)}x as often as the second. Natural text typically shows at least 2:1 ratio, indicating possible AI generation with artificially balanced vocabulary.`;
    } else {
      // More skewed distribution
      reason = `Unusual word frequency skew (deviation: ${deviation.toFixed(3)}). Distribution shows atypical patterns compared to natural Zipfian law, potentially indicating AI-generated text.`;
    }
    
    score = Math.min(Math.round(Math.min((deviation - threshold) * 100, 25)), 25);
  } else {
    reason = `Natural word frequency distribution (deviation: ${deviation.toFixed(3)}). The distribution follows expected Zipfian patterns found in human-written text.`;
  }

  return {
    deviation,
    wordCount: totalWords,
    uniqueWordCount: frequencies.size,
    topWords,
    isAIPotential,
    reason,
    score,
  };
}

/**
 * Color for Word Frequency Distribution highlights
 */
export const WORD_FREQUENCY_DISTRIBUTION_COLOR = '#8b5cf6'; // purple-500

/**
 * Generate pattern match for integration with main detector
 */
export function generateWordFrequencyDistributionMatch(text: string) {
  const result = detectWordFrequencyDistribution(text);

  if (!result.isAIPotential) {
    return null;
  }

  return {
    category: 'Word Frequency Distribution',
    phrase: `Frequency deviation (${result.deviation.toFixed(3)}) - ${result.topWords[0]?.word || 'unknown'} appears ${result.topWords[0]?.frequency || 0} times`,
    count: 1,
    score: Math.round(result.score),
  };
}
