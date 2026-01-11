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
import {
  detectPromotionalLanguage,
  generatePromotionalLanguageHighlights,
  PROMOTIONAL_LANGUAGE_COLOR,
  type PromotionalLanguageMatch,
} from './promotionalLanguage';
import {
  detectOutlineConclusions,
  generateOutlineConclusionHighlights,
  OUTLINE_CONCLUSION_COLOR,
  type OutlineConclusionMatch,
} from './outlineConclusion';
import {
  detectNegativeParallelism,
  generateNegativeParallelismHighlights,
  NEGATIVE_PARALLELISM_COLOR,
  type NegativeParallelismMatch,
} from './negativeParallelism';
import {
  detectRuleOfThree,
  generateRuleOfThreeHighlights,
  RULE_OF_THREE_COLOR,
  type RuleOfThreeMatch,
} from './ruleOfThree';
import {
  detectVagueAttributions,
  generateVagueAttributionHighlights,
  VAGUE_ATTRIBUTION_COLOR,
  type VagueAttributionMatch,
} from './vagueAttributions';
import {
  detectOvergeneralization,
  generateOvergeneralizationHighlights,
  OVERGENERALIZATION_COLOR,
  type OvergeneralizationMatch,
} from './overgeneralization';
import {
  detectElegantVariation,
  generateElegantVariationHighlights,
  ELEGANT_VARIATION_COLOR,
  type ElegantVariationMatch,
} from './elegantVariation';
import {
  detectFalseRanges,
  generateFalseRangesHighlights,
  FALSE_RANGES_COLOR,
  type FalseRangeMatch,
} from './falseRanges';
import {
  detectFleschKincaidGradeLevel,
  FLESCH_KINCAID_COLOR,
  type FleschKincaidResult,
} from './fleschKincaid';

// Export colors for use in UI
export { AI_VOCABULARY_COLOR, UNDUE_EMPHASIS_COLOR, SUPERFICIAL_ANALYSIS_COLOR, PROMOTIONAL_LANGUAGE_COLOR, OUTLINE_CONCLUSION_COLOR, NEGATIVE_PARALLELISM_COLOR, RULE_OF_THREE_COLOR, VAGUE_ATTRIBUTION_COLOR, OVERGENERALIZATION_COLOR, ELEGANT_VARIATION_COLOR, FALSE_RANGES_COLOR, FLESCH_KINCAID_COLOR };

interface DetectionMetrics {
  score: number;
  factors: {
    repetition: number;
    formalTone: number;
    sentenceVariety: number;
    vocabulary: number;
    structure: number;
    readingGradeLevel: number;
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
  
  // Detect promotional language
  const promotionalLanguageMatches = detectPromotionalLanguage(text);
  const promotionalLanguageHighlights = generatePromotionalLanguageHighlights(text, promotionalLanguageMatches);
  
  // Detect outline conclusions
  const outlineConclusionMatches = detectOutlineConclusions(text);
  const outlineConclusionHighlights = generateOutlineConclusionHighlights(text, outlineConclusionMatches);
  
  // Detect negative parallelism
  const negativeParallelismMatches = detectNegativeParallelism(text);
  const negativeParallelismHighlights = generateNegativeParallelismHighlights(text, negativeParallelismMatches);
  
  // Detect rule of three
  const ruleOfThreeMatches = detectRuleOfThree(text);
  const ruleOfThreeHighlights = generateRuleOfThreeHighlights(text, ruleOfThreeMatches);
  
  // Detect vague attributions
  const vagueAttributionMatches = detectVagueAttributions(text);
  const vagueAttributionHighlights = generateVagueAttributionHighlights(text, vagueAttributionMatches);
  
  // Detect overgeneralization
  const overgeneralizationMatches = detectOvergeneralization(text);
  const overgeneralizationHighlights = generateOvergeneralizationHighlights(text, overgeneralizationMatches);
  
  // Detect elegant variation
  const elegantVariationMatches = detectElegantVariation(text);
  const elegantVariationHighlights = generateElegantVariationHighlights(text, elegantVariationMatches);
  
  // Detect false ranges
  const falseRangesMatches = detectFalseRanges(text);
  const falseRangesHighlights = generateFalseRangesHighlights(text, falseRangesMatches);
  
  // Detect Flesch-Kincaid grade level
  const fleschKincaidResult = detectFleschKincaidGradeLevel(text);
  
  // Combine all highlights
  const allHighlights = [...aiVocabularyHighlights, ...undueEmphasisHighlights, ...superficialAnalysisHighlights, ...promotionalLanguageHighlights, ...outlineConclusionHighlights, ...negativeParallelismHighlights, ...ruleOfThreeHighlights, ...vagueAttributionHighlights, ...overgeneralizationHighlights, ...elegantVariationHighlights, ...falseRangesHighlights];
  
  // Sort by start position
  allHighlights.sort((a, b) => a.start - b.start);
  
  // Remove overlapping highlights across detectors (keep first occurrence)
  const highlights: typeof allHighlights = [];
  for (const highlight of allHighlights) {
    const hasOverlap = highlights.some(existing => 
      (highlight.start < existing.end && highlight.end > existing.start)
    );
    if (!hasOverlap) {
      highlights.push(highlight);
    }
  }
  
  // Calculate score based on all detectors
  let score = 0;
  let aiVocabWordCount = 0;
  let undueEmphasisCount = 0;
  let superficialAnalysisCount = 0;
  let promotionalLanguageCount = 0;
  let outlineConclusionCount = 0;
  let negativeParallelismCount = 0;
  let ruleOfThreeCount = 0;
  let vagueAttributionCount = 0;
  let overgeneralizationCount = 0;
  let elegantVariationCount = 0;
  let falseRangesCount = 0;
  let fleschKincaidScore = 0;
  
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
  
  if (promotionalLanguageMatches.length > 0) {
    promotionalLanguageCount = promotionalLanguageMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(promotionalLanguageMatches.length * 3, 25);
  }
  
  if (outlineConclusionMatches.length > 0) {
    outlineConclusionCount = outlineConclusionMatches.length;
    score += Math.min(outlineConclusionMatches.length * 8, 30);
  }

  if (negativeParallelismMatches.length > 0) {
    negativeParallelismCount = negativeParallelismMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(negativeParallelismMatches.length * 4, 25);
  }

  if (ruleOfThreeMatches.length > 0) {
    ruleOfThreeCount = ruleOfThreeMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(ruleOfThreeMatches.length * 5, 30);
  }

  if (vagueAttributionMatches.length > 0) {
    vagueAttributionCount = vagueAttributionMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(vagueAttributionMatches.length * 4, 30);
  }

  if (overgeneralizationMatches.length > 0) {
    overgeneralizationCount = overgeneralizationMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(overgeneralizationMatches.length * 3, 25);
  }

  if (elegantVariationMatches.length > 0) {
    elegantVariationCount = elegantVariationMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(elegantVariationMatches.length * 4, 25);
  }

  if (falseRangesMatches.length > 0) {
    falseRangesCount = falseRangesMatches.length;
    score += Math.min(falseRangesMatches.length * 6, 30);
  }

  if (fleschKincaidResult.isAIPotential) {
    fleschKincaidScore = Math.round(fleschKincaidResult.score);
    score += fleschKincaidScore;
  }

  // Clamp final score to 100
  const finalScore = Math.min(score, 100);
  
  // Normalize pattern scores proportionally if total exceeds 100
  const scoreFactor = score > 0 ? finalScore / score : 1;

  // Build patterns array
  const patterns: PatternMatch[] = [];
  
  if (aiVocabularyMatches.length > 0) {
    patterns.push({
      category: 'AI Vocabulary',
      phrase: `${aiVocabularyMatches.length} distinct words (${aiVocabWordCount} total occurrences)`,
      count: aiVocabWordCount,
      score: Math.round(Math.min(aiVocabularyMatches.length * 5, 40) * scoreFactor),
    });
  }
  
  if (undueEmphasisMatches.length > 0) {
    patterns.push({
      category: 'Undue Emphasis',
      phrase: `${undueEmphasisMatches.length} distinct phrases (${undueEmphasisCount} total occurrences)`,
      count: undueEmphasisCount,
      score: Math.round(Math.min(undueEmphasisMatches.length * 3, 30) * scoreFactor),
    });
  }
  
  if (superficialAnalysisMatches.length > 0) {
    patterns.push({
      category: 'Superficial Analysis',
      phrase: `${superficialAnalysisMatches.length} distinct patterns (${superficialAnalysisCount} total occurrences)`,
      count: superficialAnalysisCount,
      score: Math.round(Math.min(superficialAnalysisMatches.length * 4, 30) * scoreFactor),
    });
  }

  if (promotionalLanguageMatches.length > 0) {
    patterns.push({
      category: 'Promotional Language',
      phrase: `${promotionalLanguageMatches.length} distinct phrases (${promotionalLanguageCount} total occurrences)`,
      count: promotionalLanguageCount,
      score: Math.round(Math.min(promotionalLanguageMatches.length * 3, 25) * scoreFactor),
    });
  }

  if (outlineConclusionMatches.length > 0) {
    patterns.push({
      category: 'Outline Conclusion Pattern',
      phrase: `${outlineConclusionMatches.length} instance(s) of rigid "despite-challenges-positive" formula`,
      count: outlineConclusionCount,
      score: Math.round(Math.min(outlineConclusionMatches.length * 8, 30) * scoreFactor),
    });
  }

  if (negativeParallelismMatches.length > 0) {
    patterns.push({
      category: 'Negative Parallelism',
      phrase: `${negativeParallelismMatches.length} distinct pattern(s) (${negativeParallelismCount} total occurrences)`,
      count: negativeParallelismCount,
      score: Math.round(Math.min(negativeParallelismMatches.length * 4, 25) * scoreFactor),
    });
  }

  if (ruleOfThreeMatches.length > 0) {
    patterns.push({
      category: 'Rule of Three',
      phrase: `${ruleOfThreeMatches.length} distinct pattern(s) (${ruleOfThreeCount} total occurrences)`,
      count: ruleOfThreeCount,
      score: Math.round(Math.min(ruleOfThreeMatches.length * 5, 30) * scoreFactor),
    });
  }

  if (vagueAttributionMatches.length > 0) {
    patterns.push({
      category: 'Vague Attributions',
      phrase: `${vagueAttributionMatches.length} distinct phrase(s) (${vagueAttributionCount} total occurrences)`,
      count: vagueAttributionCount,
      score: Math.round(Math.min(vagueAttributionMatches.length * 4, 30) * scoreFactor),
    });
  }

  if (overgeneralizationMatches.length > 0) {
    patterns.push({
      category: 'Overgeneralization',
      phrase: `${overgeneralizationMatches.length} distinct pattern(s) (${overgeneralizationCount} total occurrences)`,
      count: overgeneralizationCount,
      score: Math.round(Math.min(overgeneralizationMatches.length * 3, 25) * scoreFactor),
    });
  }

  if (elegantVariationMatches.length > 0) {
    patterns.push({
      category: 'Elegant Variation',
      phrase: `${elegantVariationMatches.length} distinct pattern(s) (${elegantVariationCount} total occurrences)`,
      count: elegantVariationCount,
      score: Math.round(Math.min(elegantVariationMatches.length * 4, 25) * scoreFactor),
    });
  }

  if (falseRangesMatches.length > 0) {
    patterns.push({
      category: 'False Ranges',
      phrase: `${falseRangesMatches.length} instance(s) of "from...to" constructions without coherent scales`,
      count: falseRangesCount,
      score: Math.round(Math.min(falseRangesMatches.length * 6, 30) * scoreFactor),
    });
  }

  return {
    score: finalScore,
    factors: {
      repetition: 0,
      formalTone: 0,
      sentenceVariety: 0,
      vocabulary: finalScore,
      structure: 0,
      readingGradeLevel: fleschKincaidResult.gradeLevel,
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


