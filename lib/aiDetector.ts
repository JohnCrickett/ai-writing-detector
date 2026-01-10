/**
 * AI Writing Detector - Main aggregation module
 */

import { 
  detectAIVocabulary, 
  generateAIVocabularyHighlights, 
  AI_VOCABULARY_COLOR,
  type PatternMatch, 
  type TextHighlight 
} from './aiVocabulary';
import { 
  detectUndueEmphasis, 
  generateUndueEmphasisHighlights,
  UNDUE_EMPHASIS_COLOR,
} from './undueEmphasis';
import {
  detectSuperficialAnalysis,
  generateSuperficialAnalysisHighlights,
  SUPERFICIAL_ANALYSIS_COLOR,
  type SuperficialAnalysisMatch,
} from './superficialAnalysis';

// Export colors for use in UI
export { AI_VOCABULARY_COLOR, UNDUE_EMPHASIS_COLOR, SUPERFICIAL_ANALYSIS_COLOR };

interface DetectionMetrics {
  score: number;
  factors: {
    repetition: number;
    formalTone: number;
    sentenceVariety: number;
    vocabulary: number;
    structure: number;
  };
  patterns: PatternMatch[];
  highlights: TextHighlight[];
}

export function analyzeText(text: string): DetectionMetrics {
  // Detect AI vocabulary
  const aiVocabularyMatches = detectAIVocabulary(text);
  const aiVocabularyHighlights = generateAIVocabularyHighlights(text, aiVocabularyMatches);
  
  // Detect undue emphasis
  const undueEmphasisMatches = detectUndueEmphasis(text);
  const undueEmphasisHighlights = generateUndueEmphasisHighlights(text, undueEmphasisMatches);
  
  // Detect superficial analysis
  const superficialAnalysisMatches = detectSuperficialAnalysis(text);
  const superficialAnalysisHighlights = generateSuperficialAnalysisHighlights(text, superficialAnalysisMatches);
  
  // Combine all highlights
  const highlights = [...aiVocabularyHighlights, ...undueEmphasisHighlights, ...superficialAnalysisHighlights];
  
  // Calculate score based on all detectors
  let score = 0;
  let aiVocabWordCount = 0;
  let undueEmphasisCount = 0;
  let superficialAnalysisCount = 0;
  
  if (aiVocabularyMatches.length > 0) {
    aiVocabWordCount = aiVocabularyMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(aiVocabularyMatches.length * 5, 40);
  }
  
  if (undueEmphasisMatches.length > 0) {
    undueEmphasisCount = undueEmphasisMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(undueEmphasisMatches.length * 3, 30);
  }
  
  if (superficialAnalysisMatches.length > 0) {
    superficialAnalysisCount = superficialAnalysisMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(superficialAnalysisMatches.length * 4, 30);
  }

  // Build patterns array
  const patterns: PatternMatch[] = [];
  
  if (aiVocabularyMatches.length > 0) {
    patterns.push({
      category: 'AI Vocabulary',
      phrase: `${aiVocabularyMatches.length} distinct words (${aiVocabWordCount} total occurrences)`,
      count: aiVocabWordCount,
      score: Math.min(aiVocabularyMatches.length * 5, 40),
    });
  }
  
  if (undueEmphasisMatches.length > 0) {
    patterns.push({
      category: 'Undue Emphasis',
      phrase: `${undueEmphasisMatches.length} distinct phrases (${undueEmphasisCount} total occurrences)`,
      count: undueEmphasisCount,
      score: Math.min(undueEmphasisMatches.length * 3, 30),
    });
  }
  
  if (superficialAnalysisMatches.length > 0) {
    patterns.push({
      category: 'Superficial Analysis',
      phrase: `${superficialAnalysisMatches.length} distinct patterns (${superficialAnalysisCount} total occurrences)`,
      count: superficialAnalysisCount,
      score: Math.min(superficialAnalysisMatches.length * 4, 30),
    });
  }

  return {
    score: Math.min(score, 100),
    factors: {
      repetition: 0,
      formalTone: 0,
      sentenceVariety: 0,
      vocabulary: score,
      structure: 0,
    },
    patterns,
    highlights,
  };
}

export function checkRepetition(text: string): number {
  return 0;
}

export function checkFormalTone(text: string): number {
  return 0;
}

export function checkSentenceVariety(text: string): number {
  return 0;
}

export function checkVocabularyComplexity(text: string): number {
  return 0;
}

export function checkStructure(text: string): number {
  return 0;
}

export function detectPatterns(text: string): PatternMatch[] {
  return [];
}

export function detectHighlights(text: string): TextHighlight[] {
  return [];
}


