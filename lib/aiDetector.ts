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
} from './superficialAnalysis';
import {
  detectPromotionalLanguage,
  generatePromotionalLanguageHighlights,
  PROMOTIONAL_LANGUAGE_COLOR,
} from './promotionalLanguage';
import {
  detectOutlineConclusions,
  generateOutlineConclusionHighlights,
  OUTLINE_CONCLUSION_COLOR,
} from './outlineConclusion';
import {
  detectNegativeParallelism,
  generateNegativeParallelismHighlights,
  NEGATIVE_PARALLELISM_COLOR,
} from './negativeParallelism';
import {
  detectRuleOfThree,
  generateRuleOfThreeHighlights,
  RULE_OF_THREE_COLOR,
} from './ruleOfThree';
import {
  detectVagueAttributions,
  generateVagueAttributionHighlights,
  VAGUE_ATTRIBUTION_COLOR,
} from './vagueAttributions';
import {
  detectOvergeneralization,
  generateOvergeneralizationHighlights,
  OVERGENERALIZATION_COLOR,
} from './overgeneralization';
import {
  detectElegantVariation,
  generateElegantVariationHighlights,
  ELEGANT_VARIATION_COLOR,
} from './elegantVariation';
import {
  detectFalseRanges,
  generateFalseRangesHighlights,
  FALSE_RANGES_COLOR,
} from './falseRanges';
import {
  detectFleschKincaidGradeLevel,
  FLESCH_KINCAID_COLOR,
} from './fleschKincaid';
import {
  detectLexicalDiversity,
  LEXICAL_DIVERSITY_COLOR,
} from './lexicalDiversity';
import {
  detectNamedEntityDensity,
  NAMED_ENTITY_DENSITY_COLOR,
} from './namedEntityDensity';
import {
  detectParagraphCoherence,
  PARAGRAPH_COHERENCE_COLOR,
} from './paragraphCoherence';
import {
  detectPassiveVoiceFrequency,
  PASSIVE_VOICE_FREQUENCY_COLOR,
} from './passiveVoiceFrequency';
import {
  detectPunctuationPatterns,
  PUNCTUATION_PATTERNS_COLOR,
} from './punctuationPatterns';
import {
  detectRareWordUsage,
  RARE_WORD_USAGE_COLOR,
} from './rareWordUsage';
import {
  detectSentenceLengthVariation,
  SENTENCE_LENGTH_VARIATION_COLOR,
} from './sentenceLengthVariation';
import {
  detectTransitionWordDensity,
  TRANSITION_WORD_DENSITY_COLOR,
} from './transitionWordDensity';
import {
  detectWordFrequencyDistribution,
  WORD_FREQUENCY_DISTRIBUTION_COLOR,
} from './wordFrequencyDistribution';

// Export colors for use in UI
export { AI_VOCABULARY_COLOR, UNDUE_EMPHASIS_COLOR, SUPERFICIAL_ANALYSIS_COLOR, PROMOTIONAL_LANGUAGE_COLOR, OUTLINE_CONCLUSION_COLOR, NEGATIVE_PARALLELISM_COLOR, RULE_OF_THREE_COLOR, VAGUE_ATTRIBUTION_COLOR, OVERGENERALIZATION_COLOR, ELEGANT_VARIATION_COLOR, FALSE_RANGES_COLOR, FLESCH_KINCAID_COLOR, LEXICAL_DIVERSITY_COLOR, NAMED_ENTITY_DENSITY_COLOR, PARAGRAPH_COHERENCE_COLOR, PASSIVE_VOICE_FREQUENCY_COLOR, PUNCTUATION_PATTERNS_COLOR, RARE_WORD_USAGE_COLOR, SENTENCE_LENGTH_VARIATION_COLOR, TRANSITION_WORD_DENSITY_COLOR, WORD_FREQUENCY_DISTRIBUTION_COLOR };

interface DetectionMetrics {
  score: number;
  factors: {
    vocabulary: number;
    readingGradeLevel: number;
    namedEntityDensity: number;
    paragraphCoherence: number;
    passiveVoiceFrequency: number;
    punctuationPatterns: number;
    rareWordUsage: number;
    sentenceLengthVariation: number;
    transitionWordDensity: number;
    wordFrequencyDistribution: number;
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
  
  // Detect lexical diversity
  const lexicalDiversityResult = detectLexicalDiversity(text);
  
  // Detect named entity density
  const namedEntityDensityMatches = detectNamedEntityDensity(text);
  
  // Detect paragraph coherence
  const paragraphCoherenceMatches = detectParagraphCoherence(text);
  
  // Detect passive voice frequency
  const passiveVoiceFrequencyResult = detectPassiveVoiceFrequency(text);
  
  // Detect punctuation patterns
  const punctuationPatternMatches = detectPunctuationPatterns(text);

  // Detect rare word usage
  const rareWordUsageMatches = detectRareWordUsage(text);

  // Detect sentence length variation
  const sentenceLengthVariationResult = detectSentenceLengthVariation(text);

  // Detect transition word density
  const transitionWordDensityMatches = detectTransitionWordDensity(text);

  // Detect word frequency distribution
  const wordFrequencyDistributionResult = detectWordFrequencyDistribution(text);
  
  // Combine all highlights (note: namedEntityDensityMatches, paragraphCoherenceMatches, passiveVoiceFrequencyResult, punctuationPatternMatches, rareWordUsageMatches, sentenceLengthVariationResult, transitionWordDensityMatches, and wordFrequencyDistributionResult are used for scoring/factors only, not for text highlights)
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
  
  const counts = {
    aiVocab: 0,
    undueEmphasis: 0,
    superficialAnalysis: 0,
    promotionalLanguage: 0,
    outlineConclusion: 0,
    negativeParallelism: 0,
    ruleOfThree: 0,
    vagueAttribution: 0,
    overgeneralization: 0,
    elegantVariation: 0,
    falseRanges: 0,
  };
  
  const scores = {
    passiveVoiceFrequency: 0,
    punctuationPattern: 0,
    rareWordUsage: 0,
    sentenceLengthVariation: 0,
    transitionWordDensity: 0,
    wordFrequencyDistribution: 0,
  };
  
  if (aiVocabularyMatches.length > 0) {
    counts.aiVocab = aiVocabularyMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(aiVocabularyMatches.length * 5, 40);
  }
  
  if (undueEmphasisMatches.length > 0) {
    counts.undueEmphasis = undueEmphasisMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(undueEmphasisMatches.length * 3, 30);
  }
  
  if (superficialAnalysisMatches.length > 0) {
    counts.superficialAnalysis = superficialAnalysisMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(superficialAnalysisMatches.length * 4, 30);
  }
  
  if (promotionalLanguageMatches.length > 0) {
    counts.promotionalLanguage = promotionalLanguageMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(promotionalLanguageMatches.length * 3, 25);
  }
  
  if (outlineConclusionMatches.length > 0) {
    counts.outlineConclusion = outlineConclusionMatches.length;
    score += Math.min(outlineConclusionMatches.length * 8, 30);
  }

  if (negativeParallelismMatches.length > 0) {
    counts.negativeParallelism = negativeParallelismMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(negativeParallelismMatches.length * 4, 25);
  }

  if (ruleOfThreeMatches.length > 0) {
    counts.ruleOfThree = ruleOfThreeMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(ruleOfThreeMatches.length * 5, 30);
  }

  if (vagueAttributionMatches.length > 0) {
    counts.vagueAttribution = vagueAttributionMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(vagueAttributionMatches.length * 4, 30);
  }

  if (overgeneralizationMatches.length > 0) {
    counts.overgeneralization = overgeneralizationMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(overgeneralizationMatches.length * 3, 25);
  }

  if (elegantVariationMatches.length > 0) {
    counts.elegantVariation = elegantVariationMatches.reduce((sum, match) => sum + match.count, 0);
    score += Math.min(elegantVariationMatches.length * 4, 25);
  }

  if (falseRangesMatches.length > 0) {
    counts.falseRanges = falseRangesMatches.length;
    score += Math.min(falseRangesMatches.length * 6, 30);
  }

  if (fleschKincaidResult.isAIPotential) {
    score += Math.round(fleschKincaidResult.score);
  }

  if (lexicalDiversityResult.isAIPotential) {
    score += Math.round(lexicalDiversityResult.score);
  }

  if (namedEntityDensityMatches.length > 0) {
    score += Math.min(namedEntityDensityMatches.length * 6, 35);
  }

  if (paragraphCoherenceMatches.length > 0) {
    score += Math.min(paragraphCoherenceMatches.length * 5, 30);
  }

  if (passiveVoiceFrequencyResult.isAIPotential) {
    scores.passiveVoiceFrequency = passiveVoiceFrequencyResult.score;
    score += scores.passiveVoiceFrequency;
  }

  if (punctuationPatternMatches.length > 0) {
    const aiSignals = punctuationPatternMatches.filter(m => m.score > 0);
    scores.punctuationPattern = Math.min(aiSignals.reduce((sum, match) => sum + match.score, 0), 40);
    score += scores.punctuationPattern;
  }

  if (rareWordUsageMatches.length > 0) {
    scores.rareWordUsage = Math.round(rareWordUsageMatches[0].score);
    score += scores.rareWordUsage;
  }

  if (sentenceLengthVariationResult.isAIPotential) {
    scores.sentenceLengthVariation = sentenceLengthVariationResult.score;
    score += scores.sentenceLengthVariation;
  }

  if (transitionWordDensityMatches.length > 0) {
    scores.transitionWordDensity = Math.round(transitionWordDensityMatches[0].score);
    score += scores.transitionWordDensity;
  }

  if (wordFrequencyDistributionResult.isAIPotential) {
    scores.wordFrequencyDistribution = wordFrequencyDistributionResult.score;
    score += scores.wordFrequencyDistribution;
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
      phrase: `${aiVocabularyMatches.length} distinct words (${counts.aiVocab} total occurrences)`,
      count: counts.aiVocab,
      score: Math.round(Math.min(aiVocabularyMatches.length * 5, 40) * scoreFactor),
    });
  }
  
  if (undueEmphasisMatches.length > 0) {
    patterns.push({
      category: 'Undue Emphasis',
      phrase: `${undueEmphasisMatches.length} distinct phrases (${counts.undueEmphasis} total occurrences)`,
      count: counts.undueEmphasis,
      score: Math.round(Math.min(undueEmphasisMatches.length * 3, 30) * scoreFactor),
    });
  }
  
  if (superficialAnalysisMatches.length > 0) {
    patterns.push({
      category: 'Superficial Analysis',
      phrase: `${superficialAnalysisMatches.length} distinct patterns (${counts.superficialAnalysis} total occurrences)`,
      count: counts.superficialAnalysis,
      score: Math.round(Math.min(superficialAnalysisMatches.length * 4, 30) * scoreFactor),
    });
  }

  if (promotionalLanguageMatches.length > 0) {
    patterns.push({
      category: 'Promotional Language',
      phrase: `${promotionalLanguageMatches.length} distinct phrases (${counts.promotionalLanguage} total occurrences)`,
      count: counts.promotionalLanguage,
      score: Math.round(Math.min(promotionalLanguageMatches.length * 3, 25) * scoreFactor),
    });
  }

  if (outlineConclusionMatches.length > 0) {
    patterns.push({
      category: 'Outline Conclusion Pattern',
      phrase: `${outlineConclusionMatches.length} instance(s) of rigid "despite-challenges-positive" formula`,
      count: counts.outlineConclusion,
      score: Math.round(Math.min(outlineConclusionMatches.length * 8, 30) * scoreFactor),
    });
  }

  if (negativeParallelismMatches.length > 0) {
    patterns.push({
      category: 'Negative Parallelism',
      phrase: `${negativeParallelismMatches.length} distinct pattern(s) (${counts.negativeParallelism} total occurrences)`,
      count: counts.negativeParallelism,
      score: Math.round(Math.min(negativeParallelismMatches.length * 4, 25) * scoreFactor),
    });
  }

  if (ruleOfThreeMatches.length > 0) {
    patterns.push({
      category: 'Rule of Three',
      phrase: `${ruleOfThreeMatches.length} distinct pattern(s) (${counts.ruleOfThree} total occurrences)`,
      count: counts.ruleOfThree,
      score: Math.round(Math.min(ruleOfThreeMatches.length * 5, 30) * scoreFactor),
    });
  }

  if (vagueAttributionMatches.length > 0) {
    patterns.push({
      category: 'Vague Attributions',
      phrase: `${vagueAttributionMatches.length} distinct phrase(s) (${counts.vagueAttribution} total occurrences)`,
      count: counts.vagueAttribution,
      score: Math.round(Math.min(vagueAttributionMatches.length * 4, 30) * scoreFactor),
    });
  }

  if (overgeneralizationMatches.length > 0) {
    patterns.push({
      category: 'Overgeneralization',
      phrase: `${overgeneralizationMatches.length} distinct pattern(s) (${counts.overgeneralization} total occurrences)`,
      count: counts.overgeneralization,
      score: Math.round(Math.min(overgeneralizationMatches.length * 3, 25) * scoreFactor),
    });
  }

  if (elegantVariationMatches.length > 0) {
    patterns.push({
      category: 'Elegant Variation',
      phrase: `${elegantVariationMatches.length} distinct pattern(s) (${counts.elegantVariation} total occurrences)`,
      count: counts.elegantVariation,
      score: Math.round(Math.min(elegantVariationMatches.length * 4, 25) * scoreFactor),
    });
  }

  if (falseRangesMatches.length > 0) {
    patterns.push({
      category: 'False Ranges',
      phrase: `${falseRangesMatches.length} instance(s) of "from...to" constructions without coherent scales`,
      count: counts.falseRanges,
      score: Math.round(Math.min(falseRangesMatches.length * 6, 30) * scoreFactor),
    });
  }

  // Note: paragraphCoherenceMatches, punctuationPatternMatches, rareWordUsageMatches, sentenceLengthVariationResult, transitionWordDensityMatches, and wordFrequencyDistributionResult are used for scoring/factors only, not for pattern detection (like namedEntityDensity)

  // Calculate vocabulary diversity percentage (0-100)
  // TTR ranges from 0 to 1, with 0.35-0.65 being normal, so we scale it as:
  // - TTR < 0.35 gets high score (low diversity = AI)
  // - TTR 0.35-0.65 gets low score (normal = human)
  // - TTR > 0.65 gets high score (high diversity = AI)
  let vocabularyDiversityFactor = 0;
  if (lexicalDiversityResult.typeTokenRatio < 0.35) {
    // Low diversity: scale deficit from 0.35
    vocabularyDiversityFactor = Math.round(((0.35 - lexicalDiversityResult.typeTokenRatio) / 0.35) * 100);
  } else if (lexicalDiversityResult.typeTokenRatio > 0.65) {
    // High diversity: scale exceedance from 0.65
    vocabularyDiversityFactor = Math.round(((lexicalDiversityResult.typeTokenRatio - 0.65) / 0.35) * 100);
  }
  // Normal range (0.35-0.65) gets 0

  // Calculate named entity density factor (0-100)
  let namedEntityDensityFactor = 0;
  if (namedEntityDensityMatches.length > 0) {
    // Scale named entity density contribution to 0-100
    namedEntityDensityFactor = Math.round(Math.min(namedEntityDensityMatches.length * 6, 35) * scoreFactor);
  }

  // Calculate paragraph coherence factor (0-100)
  let paragraphCoherenceFactor = 0;
  if (paragraphCoherenceMatches.length > 0) {
    // Scale paragraph coherence contribution to 0-100
    paragraphCoherenceFactor = Math.round(Math.min(paragraphCoherenceMatches.length * 5, 30) * scoreFactor);
  }

  // Calculate passive voice frequency factor (0-100)
  let passiveVoiceFrequencyFactor = 0;
  if (passiveVoiceFrequencyResult.isAIPotential) {
    // Scale passive voice frequency contribution to 0-100
    passiveVoiceFrequencyFactor = Math.round(passiveVoiceFrequencyResult.score * scoreFactor);
  }

  // Calculate punctuation patterns factor (0-100)
  let punctuationPatternsFactor = 0;
  if (punctuationPatternMatches.length > 0) {
    const aiSignals = punctuationPatternMatches.filter(m => m.score > 0);
    if (aiSignals.length > 0) {
      // Scale punctuation patterns contribution to 0-100
      punctuationPatternsFactor = Math.round(Math.min(aiSignals.reduce((sum, m) => sum + m.score, 0), 40) * scoreFactor);
    }
  }

  // Calculate rare word usage factor (0-100)
  let rareWordUsageFactor = 0;
  if (rareWordUsageMatches.length > 0) {
    // Scale rare word usage contribution to 0-100
    rareWordUsageFactor = Math.round(rareWordUsageMatches[0].score * scoreFactor);
  }

  // Calculate sentence length variation factor (0-100)
  let sentenceLengthVariationFactor = 0;
  if (sentenceLengthVariationResult.isAIPotential) {
    // Scale sentence length variation contribution to 0-100
    sentenceLengthVariationFactor = Math.round(sentenceLengthVariationResult.score * scoreFactor);
  }

  // Calculate transition word density factor (0-100)
  let transitionWordDensityFactor = 0;
  if (transitionWordDensityMatches.length > 0) {
    // Scale transition word density contribution to 0-100
    transitionWordDensityFactor = Math.round(transitionWordDensityMatches[0].score * scoreFactor);
  }

  // Calculate word frequency distribution factor (0-100)
  // Scale deviation to percentage (0-100)
  let wordFrequencyDistributionFactor = 0;
  if (wordFrequencyDistributionResult.wordCount >= 5000) {
    // Scale deviation from 0.05 (threshold) to 0.3 (max realistic) as 0-100%
    const threshold = 0.05;
    const maxDeviation = 0.3;
    if (wordFrequencyDistributionResult.deviation >= threshold) {
      wordFrequencyDistributionFactor = Math.round(
        ((wordFrequencyDistributionResult.deviation - threshold) / (maxDeviation - threshold)) * 100
      );
      wordFrequencyDistributionFactor = Math.min(wordFrequencyDistributionFactor, 100);
    }
  }

  return {
    score: finalScore,
    factors: {
      vocabulary: vocabularyDiversityFactor,
      readingGradeLevel: fleschKincaidResult.gradeLevel,
      namedEntityDensity: namedEntityDensityFactor,
      paragraphCoherence: paragraphCoherenceFactor,
      passiveVoiceFrequency: passiveVoiceFrequencyFactor,
      punctuationPatterns: punctuationPatternsFactor,
      rareWordUsage: rareWordUsageFactor,
      sentenceLengthVariation: sentenceLengthVariationFactor,
      transitionWordDensity: transitionWordDensityFactor,
      wordFrequencyDistribution: wordFrequencyDistributionFactor,
    },
    patterns,
    highlights,
  };
}


