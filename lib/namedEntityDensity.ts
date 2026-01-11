/**
 * Named Entity Density Detection
 * Detects hallucination patterns based on named entity density
 * - High density (>0.08) with vague attributions suggests fabrication
 * - Low density (<0.02) with confident claims suggests lack of specificity
 */

export interface NamedEntityMatch {
  entity: string;
  type: 'high-density' | 'low-density';
  count: number;
  density: number;
  description: string;
}

/**
 * Capitalized words that might be proper nouns/named entities
 * Pattern: Words starting with capital letters that aren't at sentence start
 */
function extractNamedEntities(text: string): string[] {
  const entities: string[] = [];
  
  // Split into sentences to identify sentence-starting words
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const sentenceStarts = new Set<string>();
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase() || '';
    if (firstWord) {
      sentenceStarts.add(firstWord);
    }
  }
  
  // Pattern: Capitalized words (potential proper nouns)
  // Look for sequences of capital letters or Title Case words, also single capital letters (like acronyms)
  const wordPattern = /\b[A-Z][a-z]*(?:\s+[A-Z][a-z]*)*\b/g;
  let match;
  
  while ((match = wordPattern.exec(text)) !== null) {
    const word = match[0];
    const lowerWord = word.toLowerCase();
    const firstWordOfSentence = sentenceStarts.has(lowerWord);
    
    // Skip common words and sentence-starters (only check first word, allow mid-sentence capitals)
    if (!isCommonWord(lowerWord) && !firstWordOfSentence) {
      entities.push(word);
    }
  }
  
  return entities;
}

/**
 * Check if a word is a common non-entity word
 */
function isCommonWord(word: string): boolean {
  const commonWords = new Set([
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
  return commonWords.has(word);
}

/**
 * Check if text contains vague attributions
 */
function hasVagueAttributions(text: string): boolean {
  const vaguePatterns = [
    /\baccording to\s+(research|studies|reports)/gi,
    /\b(some sources|researchers|studies|reports|analysts|experts)\s+(say|suggest|indicate|claim|show|argue)/gi,
    /\b(it is said|it is believed|has been shown|has been cited|research indicates|studies show)\b/gi,
  ];
  
  for (const pattern of vaguePatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if text contains confident claims
 */
function hasConfidentClaims(text: string): boolean {
  const confidentPatterns = [
    /\b(clearly|obviously|undoubtedly|certainly|definitely|absolutely)\b/gi,
    /\b(must be|has to be|is definitely|is clearly|obviously)\b/gi,
  ];
  
  for (const pattern of confidentPatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

/**
 * Count total words in text
 */
function countWords(text: string): number {
  const words = text.match(/\b\w+\b/g);
  return words ? words.length : 0;
}

/**
 * Detect named entity density patterns
 */
export function detectNamedEntityDensity(text: string): NamedEntityMatch[] {
  const matches: NamedEntityMatch[] = [];
  
  // Extract entities and calculate density
  const entities = extractNamedEntities(text);
  const uniqueEntities = new Set(entities);
  const totalWords = countWords(text);
  
  if (totalWords === 0) {
    return matches;
  }
  
  const entityDensity = uniqueEntities.size / totalWords;
  const hasVague = hasVagueAttributions(text);
  const hasConfident = hasConfidentClaims(text);
  
  // High density (>0.08) with vague attributions = hallucination risk
  if (entityDensity > 0.08 && hasVague) {
    matches.push({
      entity: `High entity density (${(entityDensity * 100).toFixed(2)}%)`,
      type: 'high-density',
      count: uniqueEntities.size,
      density: entityDensity,
      description: 'Packed with specific names/places/organizations combined with vague attributions - potential hallucination pattern',
    });
  }
  
  // Low density (<0.05) with confident claims = lack of specificity
  // Use 0.05 instead of 0.02 to catch more cases where entities are sparse
  if (entityDensity < 0.05 && hasConfident) {
    matches.push({
      entity: `Low entity density (${(entityDensity * 100).toFixed(2)}%)`,
      type: 'low-density',
      count: uniqueEntities.size,
      density: entityDensity,
      description: 'Few specific references despite confident claims - suggests avoiding accountability',
    });
  }
  
  return matches;
}

/**
 * Color for named entity density highlights
 */
export const NAMED_ENTITY_DENSITY_COLOR = '#f59e0b'; // amber-500

/**
 * Generate highlights for named entity density matches
 */
export function generateNamedEntityDensityHighlights(
  text: string,
  matches: NamedEntityMatch[]
): Array<{
  start: number;
  end: number;
  factor: string;
  category: string;
  color: string;
}> {
  const highlights: Array<{
    start: number;
    end: number;
    factor: string;
    category: string;
    color: string;
  }> = [];
  
  // For high density: highlight named entities
  // For low density: highlight confident claims without specifics
  if (matches.length === 0) {
    return highlights;
  }
  
  for (const match of matches) {
    if (match.type === 'high-density') {
      // Highlight the named entities themselves
      const wordPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
      let matchResult;
      
      while ((matchResult = wordPattern.exec(text)) !== null) {
        const word = matchResult[0];
        const lowerWord = word.toLowerCase();
        
        if (!isCommonWord(lowerWord)) {
          highlights.push({
            start: matchResult.index,
            end: matchResult.index + matchResult[0].length,
            factor: word,
            category: 'Named Entity Density',
            color: NAMED_ENTITY_DENSITY_COLOR,
          });
        }
      }
    } else if (match.type === 'low-density') {
      // Highlight confident claim phrases
      const confidentPatterns = [
        { pattern: /\b(clearly|obviously|undoubtedly|certainly|definitely|absolutely)\b/gi, name: 'confident claim' },
        { pattern: /\b(must be|has to be|is definitely|is clearly)\b/gi, name: 'confident claim' },
      ];
      
      for (const { pattern } of confidentPatterns) {
        let matchResult;
        while ((matchResult = pattern.exec(text)) !== null) {
          highlights.push({
            start: matchResult.index,
            end: matchResult.index + matchResult[0].length,
            factor: matchResult[0],
            category: 'Named Entity Density',
            color: NAMED_ENTITY_DENSITY_COLOR,
          });
        }
      }
    }
  }
  
  // Remove duplicates and sort
  const uniqueHighlights = Array.from(new Map(
    highlights.map(h => [h.start + ':' + h.end, h])
  ).values());
  
  uniqueHighlights.sort((a, b) => a.start - b.start);
  
  return uniqueHighlights;
}
