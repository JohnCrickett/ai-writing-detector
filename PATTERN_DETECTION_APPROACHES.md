# Pattern Detection Approaches

This document outlines all pattern detection approaches implemented in the AI Writing Detector. The system uses 11 distinct detection modules to identify characteristics of AI-generated text.

## Overview

The detector orchestrates analysis through the main `analyzeText()` function in `lib/aiDetector.ts`, which aggregates results from all pattern detection modules. Each module returns matches that contribute to the overall AI probability score and are highlighted in the input text.

---

## Detection Modules

### 1. AI Vocabulary Detection
**File:** `lib/aiVocabulary.ts`  
**Function:** `detectAIVocabulary(text)`

Identifies overused words and phrases commonly produced by language models. Detects LLM-specific transition words, hallmark phrases, and terminology that is characteristic of AI-generated content.

- **Score Impact:** Up to 40 points
- **Measurement:** Distinct words found × count of occurrences
- **Example Patterns:** "Delve into", "navigate", "robust", "innovative solutions"

---

### 2. Undue Emphasis Detection
**File:** `lib/undueEmphasis.ts`  
**Function:** `detectUndueEmphasis(text)`

Identifies excessive use of emphasizing words, phrases, and stylistic markers that suggest artificial amplification. Detects patterns like excessive exclamation, superlatives, and rhetorical emphasis.

- **Score Impact:** Up to 30 points
- **Measurement:** Distinct phrases × occurrence count
- **Example Patterns:** Multiple superlatives, intensifiers, emphatic punctuation

---

### 3. Superficial Analysis Detection
**File:** `lib/superficialAnalysis.ts`  
**Function:** `detectSuperficialAnalysis(text)`

Identifies vague significance claims and "RAG-style" attributions that lack specificity. Detects patterns where text makes broad claims without concrete evidence or references.

- **Score Impact:** Up to 30 points
- **Measurement:** Distinct patterns × occurrence count
- **Example Patterns:** "Significant developments", "It is worth noting", "Various sources indicate"

---

### 4. Promotional Language Detection
**File:** `lib/promotionalLanguage.ts`  
**Function:** `detectPromotionalLanguage(text)`

Identifies marketing superlatives and "tourism marketing" style language. Detects persuasive AI phrasing patterns commonly found in promotional or marketing-driven content.

- **Score Impact:** Up to 25 points
- **Measurement:** Distinct phrases × occurrence count
- **Example Patterns:** "Impressive features", "game-changer", "transformative potential"

---

### 5. Outline Conclusions Detection
**File:** `lib/outlineConclusion.ts`  
**Function:** `detectOutlineConclusions(text)`

Detects formulaic conclusion patterns, particularly the "Despite challenges... but also positive" structure. Identifies rigid, AI-generated conclusion templates.

- **Score Impact:** Up to 30 points (8 points per instance)
- **Measurement:** Number of instances detected
- **Example Pattern:** "Despite [challenges], [entity/situation] offers [benefits/opportunities]..."

---

### 6. Negative Parallelism Detection
**File:** `lib/negativeParallelism.ts`  
**Function:** `detectNegativeParallelism(text)`

Identifies rigid structural patterns like "not only... but also" and similar parallel constructions. Detects overly formal linguistic structures that suggest machine generation.

- **Score Impact:** Up to 25 points
- **Measurement:** Distinct patterns × occurrence count
- **Example Patterns:** "not only... but also", parallel comparisons, balanced antitheses

---

### 7. Rule of Three Detection
**File:** `lib/ruleOfThree.ts`  
**Function:** `detectRuleOfThree(text)`

Detects triple-adjective/noun/verb patterns and the rhetorical "rule of three" structure. Identifies overuse of this classical persuasion technique.

- **Score Impact:** Up to 30 points
- **Measurement:** Distinct patterns × occurrence count
- **Detection Method:** Regex pattern matching for three consecutive similar parts of speech

---

### 8. Vague Attributions Detection
**File:** `lib/vagueAttributions.ts`  
**Function:** `detectVagueAttributions(text)`

Searches for appeals to "experts" or "industry reports" without specifics. Identifies patterns where sources are referenced generically without concrete attribution.

- **Score Impact:** Up to 30 points
- **Measurement:** Distinct phrases × occurrence count
- **Example Patterns:** "Experts agree", "Studies show", "Industry insiders report"

---

### 9. Overgeneralization Detection
**File:** `lib/overgeneralization.ts`  
**Function:** `detectOvergeneralization(text)`

Detects patterns that frame limited information as exhaustive or universal. Identifies overreaching claims and false universalization.

- **Score Impact:** Up to 25 points
- **Measurement:** Distinct patterns × occurrence count
- **Example Patterns:** "Everyone knows", "It is well established", "Universal consensus"

---

### 10. Elegant Variation Detection
**File:** `lib/elegantVariation.ts`  
**Function:** `detectElegantVariation(text)`

Detects repetitive synonym substitution for the same entity. Identifies when the same subject is repeatedly referred to by different but equivalent terms.

- **Score Impact:** Up to 25 points
- **Measurement:** Distinct patterns × occurrence count
- **Detection Method:** Entity resolution and synonym tracking across sentences

---

### 11. False Ranges Detection
**File:** `lib/falseRanges.ts`  
**Function:** `detectFalseRanges(text)`

Detects "from...to" constructions that lack coherent scales or meaningful comparison. Identifies mathematically or logically inconsistent range patterns.

- **Score Impact:** Up to 30 points (6 points per instance)
- **Measurement:** Number of instances detected
- **Example Patterns:** "from [metric] to [unrelated metric]" without logical connection

---

## Score Calculation

The final AI probability score is calculated by:

1. **Running all 11 detectors** on the input text
2. **Accumulating scores** from each detector (each with its own maximum threshold)
3. **Clamping the total** to a maximum of 100 points
4. **Normalizing proportionally** if the raw score exceeds 100

Each pattern match is weighted by:
- Number of distinct patterns found
- Total occurrence count
- Detector-specific multipliers (ranging from 3x to 8x)

---

## Highlights System

All detections are converted to text highlights for visual presentation:

- Each detector has a dedicated color (stored as `[DETECTOR_NAME]_COLOR` constant)
- Highlights include position (start/end) and metadata about what was detected
- Overlapping highlights are deduplicated (first occurrence is kept)
- Highlights are sorted by position for presentation order

---

## Summary Table

| Detection Module | File | Max Score | Weighting Method | Primary Signal |
|---|---|---|---|---|
| AI Vocabulary | `aiVocabulary.ts` | 40 | 5x per distinct word | LLM-specific terminology |
| Undue Emphasis | `undueEmphasis.ts` | 30 | 3x per phrase | Excessive emphasis |
| Superficial Analysis | `superficialAnalysis.ts` | 30 | 4x per pattern | Vague claims |
| Promotional Language | `promotionalLanguage.ts` | 25 | 3x per phrase | Marketing language |
| Outline Conclusions | `outlineConclusion.ts` | 30 | 8x per instance | Formula patterns |
| Negative Parallelism | `negativeParallelism.ts` | 25 | 4x per pattern | Rigid structure |
| Rule of Three | `ruleOfThree.ts` | 30 | 5x per pattern | Triple patterns |
| Vague Attributions | `vagueAttributions.ts` | 30 | 4x per phrase | Generic sources |
| Overgeneralization | `overgeneralization.ts` | 25 | 3x per pattern | False universals |
| Elegant Variation | `elegantVariation.ts` | 25 | 4x per pattern | Synonym repetition |
| False Ranges | `falseRanges.ts` | 30 | 6x per instance | Invalid scales |

---

## Testing

Each detection module has comprehensive test coverage:
- `lib/***.test.ts` files contain unit tests for each detector
- Test cases validate correct pattern identification and false positive avoidance
- Integration tests verify the overall scoring and highlighting system

Run tests with: `npm test`

---

## References

This implementation is informed by:
1. [Linguistic Characteristics of AI-Generated Text: A Survey](https://arxiv.org/abs/2510.05136) - Terçon & Dobrovoljc (2025)
2. [Detecting AI-Generated Text: Detection Methods, Datasets, and Applications](https://www.sciencedirect.com/science/article/abs/pii/S1574013725000693) - ScienceDirect Review
3. [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
