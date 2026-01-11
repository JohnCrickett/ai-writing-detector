/**
 * Paragraph Coherence Detection
 * Detects overly tight logical coherence within paragraphs
 * - AI-generated text has predictable sentence-to-sentence progression
 * - Human writing has natural "breathing room" with tangential thoughts
 */

export interface ParagraphCoherenceMatch {
  type: 'overly-coherent';
  avgSimilarity: number;
  sentenceCount: number;
  description: string;
}

/**
 * Extract sentences from text
 */
function extractSentences(text: string): string[] {
  // Split on sentence boundaries: . ! ? followed by space and capital letter
  const sentencePattern = /[^.!?]*[.!?]+/g;
  const matches = text.match(sentencePattern) || [];
  
  return matches
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Split text into paragraphs
 */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Extract key words from a sentence (normalized)
 */
function extractKeyWords(sentence: string): Set<string> {
  // Remove punctuation and convert to lowercase
  const cleaned = sentence.toLowerCase().replace(/[.!?,;:'"—–-]/g, ' ');
  
  // Split into words
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  
  // Filter out common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'is', 'are', 'was', 'were', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'can', 'from', 'by', 'as', 'that', 'this', 'these', 'those', 'which',
    'who', 'whom', 'what', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'any', 'some', 'such', 'no', 'not', 'also', 'been',
    'being', 'it', 'its', 'more', 'most', 'very', 'than', 'then', 'just',
    'only', 'even', 'if', 'because', 'while', 'after', 'before', 'during',
    'through', 'about', 'out', 'up', 'down', 'over', 'under', 'between',
  ]);
  
  return new Set(words.filter(w => !stopWords.has(w)));
}

/**
 * Calculate word overlap similarity between two sentences
 * Uses overlap coefficient: intersection / min(set sizes)
 * This is more sensitive to shared content than Jaccard similarity
 * Returns 0-1 where 1 is one set is a subset of the other
 */
function calculateSimilarity(sentence1: string, sentence2: string): number {
  const words1 = extractKeyWords(sentence1);
  const words2 = extractKeyWords(sentence2);
  
  if (words1.size === 0 || words2.size === 0) {
    return 0;
  }
  
  // Calculate intersection
  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      intersection++;
    }
  }
  
  // Use overlap coefficient: intersection / min(set sizes)
  // This measures how much of the smaller set overlaps with the larger
  const minSize = Math.min(words1.size, words2.size);
  return minSize > 0 ? intersection / minSize : 0;
}

/**
 * Analyze coherence within a single paragraph
 */
function analyzeParagraphCoherence(paragraph: string): { avgSimilarity: number; sentenceCount: number } {
  const sentences = extractSentences(paragraph);
  
  // Need at least 2 sentences to measure transitions
  if (sentences.length < 2) {
    return { avgSimilarity: 0, sentenceCount: sentences.length };
  }
  
  // Calculate similarity between consecutive sentences
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (let i = 0; i < sentences.length - 1; i++) {
    const similarity = calculateSimilarity(sentences[i], sentences[i + 1]);
    totalSimilarity += similarity;
    comparisons++;
  }
  
  const avgSimilarity = comparisons > 0 ? totalSimilarity / comparisons : 0;
  
  return { avgSimilarity, sentenceCount: sentences.length };
}

/**
 * Detect paragraph coherence patterns
 */
export function detectParagraphCoherence(text: string): ParagraphCoherenceMatch[] {
  const matches: ParagraphCoherenceMatch[] = [];
  
  if (!text || text.trim().length === 0) {
    return matches;
  }
  
  const paragraphs = splitParagraphs(text);
  
  for (const paragraph of paragraphs) {
    const { avgSimilarity, sentenceCount } = analyzeParagraphCoherence(paragraph);
    
    // Flag paragraphs with high average similarity (>0.45) and at least 3 sentences
    // The minimum of 3 sentences helps distinguish between natural short passages
    // and forced rigid progression patterns
    // Threshold of 0.45 captures tight coherence while avoiding false positives
    if (sentenceCount >= 3 && avgSimilarity > 0.45) {
      matches.push({
        type: 'overly-coherent',
        avgSimilarity: parseFloat(avgSimilarity.toFixed(3)),
        sentenceCount,
        description: `Overly tight coherence detected (${(avgSimilarity * 100).toFixed(1)}% average similarity) - sentences progress too predictably`,
      });
    }
  }
  
  return matches;
}

/**
 * Color for paragraph coherence highlights (not used for UI highlights, only in analysis)
 */
export const PARAGRAPH_COHERENCE_COLOR = '#ec4899'; // pink-500
