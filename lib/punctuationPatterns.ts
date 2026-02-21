/**
 * Punctuation Patterns Detection
 * Analyzes punctuation habits to detect AI-generated text
 * AI tends to use semicolons and em-dashes more frequently (formal/academic training)
 * Human writing shows more erratic punctuation and uses ellipses conversationally
 */

export interface PatternMatch {
  category: string;
  phrase: string;
  count: number;
  score: number;
}

export interface TextHighlight {
  start: number;
  end: number;
  factor: string;
  category: string;
  color?: string;
}

/**
 * Color for Punctuation Patterns highlights
 */
export const PUNCTUATION_PATTERNS_COLOR = '#ec4899'; // pink-500

/**
 * Detect punctuation patterns in text
 */
export function detectPunctuationPatterns(text: string): PatternMatch[] {
  if (!text || text.length === 0) {
    return [];
  }

  const matches: PatternMatch[] = [];

  // Count sentences (periods, exclamation marks, question marks)
  const sentenceEndings = text.match(/[.!?]/g) || [];
  const sentenceCount = Math.max(sentenceEndings.length, 1);

  // Count punctuation marks
  const semicolons = (text.match(/;/g) || []).length;
  const emDashes = (text.match(/—|–/g) || []).length;
  const ellipses = (text.match(/\.\.\.|…/g) || []).length;
  const exclamations = (text.match(/!/g) || []).length;

  // Calculate densities relative to sentence count
  const semicolonDensity = semicolons / sentenceCount;
  const emDashDensity = emDashes / sentenceCount;
  const ellipsisDensity = ellipses / sentenceCount;

  // Add punctuation count matches
  if (semicolons > 0) {
    matches.push({
      category: 'Punctuation Pattern',
      phrase: `Semicolons: ${semicolons} found`,
      count: semicolons,
      score: 0,
    });
  }

  if (emDashes > 0) {
    matches.push({
      category: 'Punctuation Pattern',
      phrase: `Em-dashes: ${emDashes} found`,
      count: emDashes,
      score: 0,
    });
  }

  if (ellipses > 0) {
    matches.push({
      category: 'Punctuation Pattern',
      phrase: `Ellipses: ${ellipses} found`,
      count: ellipses,
      score: 0,
    });
  }

  if (exclamations > 0) {
    matches.push({
      category: 'Punctuation Pattern',
      phrase: `Exclamation mark: ${exclamations} found`,
      count: exclamations,
      score: 0,
    });
  }

  // AI signals: High semicolon density (>0.05 per sentence)
  if (semicolonDensity > 0.05) {
    matches.push({
      category: 'AI Signal',
      phrase: `High semicolon density (${(semicolonDensity * 100).toFixed(1)}%) - typical of formal/academic AI writing`,
      count: semicolons,
      score: Math.min(Math.round(semicolonDensity * 200), 50),
    });
  }

  // AI signals: High em-dash density (>0.08 per sentence)
  if (emDashDensity > 0.08) {
    matches.push({
      category: 'AI Signal',
      phrase: `High em-dash density (${(emDashDensity * 100).toFixed(1)}%) - indicates formal structure`,
      count: emDashes,
      score: Math.min(Math.round(emDashDensity * 150), 45),
    });
  }

  // AI signals: Very low ellipsis usage despite potential conversational tone
  // Detect conversational tone by counting casual filler words/phrases
  // Require multiple indicators to avoid false positives from normal prose usage
  // (e.g. "sounds like" uses "like" as a preposition, not a filler)
  const conversationalMarkers = [
    /\b(you know)\b/i,
    /\b(I think)\b/i,
    /\b(I mean)\b/i,
    /\b(basically)\b/i,
    /\b(honestly)\b/i,
    /\b(kinda|gonna|wanna|gotta)\b/i,
    /\b(right\?)/i,
    /\b(oh|wow|hmm|huh|yeah|nah|nope|yep)\b/i,
  ];
  const conversationalMatchCount = conversationalMarkers.filter(r => r.test(text)).length;
  if (conversationalMatchCount >= 2 && ellipsisDensity < 0.01) {
    matches.push({
      category: 'AI Signal',
      phrase: `Low ellipsis usage (${(ellipsisDensity * 100).toFixed(2)}%) despite conversational tone - AI avoids casual ellipses`,
      count: ellipses,
      score: 20,
    });
  }

  // Analyze punctuation consistency across paragraphs
  const paragraphs = text.split(/\n\n+/);
  if (paragraphs.length > 1) {
    const paragraphPunctuation = paragraphs.map(para => ({
      semicolons: (para.match(/;/g) || []).length,
      emDashes: (para.match(/—|–/g) || []).length,
      ellipses: (para.match(/\.\.\.|…/g) || []).length,
    }));

    // Calculate consistency (low variation = more AI-like)
    const semicolonCounts = paragraphPunctuation.map(p => p.semicolons);
    const dashCounts = paragraphPunctuation.map(p => p.emDashes);

    const semicolonConsistency = calculateVariance(semicolonCounts);
    const dashConsistency = calculateVariance(dashCounts);

    // Very consistent punctuation across paragraphs is AI-like
    if (semicolonCounts.some(c => c > 0) && semicolonConsistency < 0.3) {
      matches.push({
        category: 'Consistency Pattern',
        phrase: `Consistent semicolon usage across paragraphs - indicates structured, formal writing`,
        count: paragraphs.length,
        score: 20,
      });
    }

    if (dashCounts.some(c => c > 0) && dashConsistency < 0.3) {
      matches.push({
        category: 'Consistency Pattern',
        phrase: `Consistent em-dash usage across paragraphs - indicates systematic approach`,
        count: paragraphs.length,
        score: 20,
      });
    }
  }

  return matches;
}

/**
 * Calculate coefficient of variation for consistency analysis
 */
function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;

  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const coeffVar = stdDev / mean;

  return coeffVar;
}

/**
 * Generate highlights for punctuation pattern matches in text
 */
export function generatePunctuationPatternHighlights(
  text: string,
  matches: PatternMatch[]
): TextHighlight[] {
  const highlights: TextHighlight[] = [];
  
  // Only highlight if we have AI signals detected
  const aiSignals = matches.filter(m => m.score > 0 && (m.phrase.includes('High') || m.phrase.includes('Low') || m.phrase.includes('Consistent')));
  
  if (aiSignals.length === 0) {
    return highlights;
  }

  // Highlight semicolons if high density was detected
  if (aiSignals.some(s => s.phrase.includes('semicolon'))) {
    let startIndex = 0;
    let index;
    while ((index = text.indexOf(';', startIndex)) !== -1) {
      highlights.push({
        start: index,
        end: index + 1,
        factor: 'semicolon',
        category: 'Punctuation Pattern',
        color: PUNCTUATION_PATTERNS_COLOR,
      });
      startIndex = index + 1;
    }
  }

  // Highlight em-dashes if high density was detected
  if (aiSignals.some(s => s.phrase.includes('em-dash'))) {
    let startIndex = 0;
    let index;
    // Match both em-dash and en-dash
    while (startIndex < text.length) {
      const emDashIndex = text.indexOf('—', startIndex);
      const enDashIndex = text.indexOf('–', startIndex);
      
      index = -1;
      if (emDashIndex !== -1 && (enDashIndex === -1 || emDashIndex < enDashIndex)) {
        index = emDashIndex;
      } else if (enDashIndex !== -1) {
        index = enDashIndex;
      }
      
      if (index === -1) break;
      
      highlights.push({
        start: index,
        end: index + 1,
        factor: 'em-dash',
        category: 'Punctuation Pattern',
        color: PUNCTUATION_PATTERNS_COLOR,
      });
      startIndex = index + 1;
    }
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  return highlights;
}
