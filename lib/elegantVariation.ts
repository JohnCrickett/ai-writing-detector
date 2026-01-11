/**
 * Elegant Variation Detection
 * Detects when AI uses different synonyms or related terms to refer to the same entity
 * to avoid word repetition (a feature of LLM output with repetition penalties).
 * 
 * Examples:
 * - "Vierny" → "Dina Vierny" → "Vierny" (name variations)
 * - "artists" → "non-conformist artists" → "creative individuals"
 * - "constraints" → "obstacles" → "confines"
 */

export interface ElegantVariationMatch {
  pattern: 'name-variation' | 'synonym-substitution' | 'concept-variation';
  description: string;
  count: number;
  examples?: string[];
}

/**
 * Synonym groups for common concepts
 */
const synonymGroups: Record<string, string[]> = {
  // Artist/Creator synonyms
  'artist': ['artist', 'creator', 'maker', 'creative', 'creative individual', 'creative person', 'talented person', 'innovator', 'designer', 'visionary'],
  'artists': ['artists', 'creators', 'makers', 'creative individuals', 'creative people', 'talented people', 'innovators', 'designers', 'visionaries'],
  
  // Constraint/Obstacle synonyms
  'constraint': ['constraint', 'obstacle', 'limitation', 'restriction', 'hindrance', 'confine', 'barrier', 'challenge'],
  'constraints': ['constraints', 'obstacles', 'limitations', 'restrictions', 'hindrances', 'confines', 'barriers', 'challenges'],
  
  // Non-conformist synonyms
  'non-conformist': ['non-conformist', 'nonconformist', 'dissident', 'rebel', 'maverick', 'non-conforming'],
  'non-conformists': ['non-conformists', 'nonconformists', 'dissidents', 'rebels', 'mavericks'],
  
  // Support/Aid synonyms
  'support': ['support', 'aid', 'assist', 'help', 'facilitate', 'enable', 'backing', 'sponsorship'],
  'supported': ['supported', 'aided', 'assisted', 'helped', 'facilitated', 'enabled'],
  
  // Change/Transformation synonyms
  'change': ['change', 'transform', 'alter', 'shift', 'evolution', 'development', 'revolution', 'paradigm shift'],
  'changes': ['changes', 'transformations', 'alterations', 'shifts', 'evolutions', 'developments', 'revolutions'],
  
  // Work/Creation synonyms
  'work': ['work', 'creation', 'piece', 'composition', 'output', 'production', 'art', 'effort'],
  'works': ['works', 'creations', 'pieces', 'compositions', 'outputs', 'productions', 'artworks'],
  
  // Director/Filmmaker synonyms
  'director': ['director', 'filmmaker', 'creator', 'producer', 'auteur'],
  'directors': ['directors', 'filmmakers', 'creators', 'producers'],
  
  // Movement/Revolution synonyms
  'movement': ['movement', 'revolution', 'paradigm shift', 'shift', 'trend', 'wave'],
  'movements': ['movements', 'revolutions', 'shifts', 'trends', 'waves'],
};

/**
 * Name variation patterns - for detecting different forms of the same name
 */
interface NameVariation {
  variants: string[]; // Different forms of the same name
  baseForm: string; // The most basic form
}

/**
 * Extract potential entity names from text (capitalized sequences)
 */
function extractNames(text: string): Map<string, string[]> {
  const nameMap = new Map<string, string[]>();
  const allNames = new Set<string>();
  
  // Match capitalized words and phrases (potential proper names), including all-caps names
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]{2,})\b/g;
  let match;
  const names: Array<{ full: string; normalized: string }> = [];
  
  while ((match = namePattern.exec(text)) !== null) {
    const name = match[1];
    const normalized = name.toLowerCase();
    names.push({ full: name, normalized });
    allNames.add(normalized);
  }
  
  // Group names that are related (share components)
  for (const { full, normalized } of names) {
    // Find related names - ones that share significant parts
    const parts = normalized.split(/\s+/);
    
    // First, exact match
    if (!nameMap.has(normalized)) {
      nameMap.set(normalized, []);
    }
    nameMap.get(normalized)?.push(full);
    
    // Also link partial matches (e.g., "Vierny" and "Dina Vierny")
    for (const part of parts) {
      if (part.length > 2) {
        // Look for other names that contain this part
        for (const { full: otherFull, normalized: otherNorm } of names) {
          if (otherNorm !== normalized && otherNorm.includes(part)) {
            // Link them under the common part
            const key = part;
            if (!nameMap.has(key)) {
              nameMap.set(key, []);
            }
            const mapSet = new Set(nameMap.get(key) || []);
            mapSet.add(full);
            mapSet.add(otherFull);
            nameMap.set(key, Array.from(mapSet));
          }
        }
      }
    }
  }
  
  return nameMap;
}

/**
 * Find similar name variants (e.g., "Vierny", "Dina Vierny")
 */
function findNameVariations(names: Map<string, string[]>): NameVariation[] {
  const variations: NameVariation[] = [];
  
  for (const [normalized, variants] of names.entries()) {
    // Remove duplicates and keep unique variants
    const uniqueVariants = Array.from(new Set(variants));
    
    // If there are multiple forms of the same name (different case/length combinations)
    if (uniqueVariants.length > 1 || uniqueVariants.some(v => v.includes(' '))) {
      // Sort by length to find the base form (usually shorter)
      const sorted = [...uniqueVariants].sort((a, b) => a.length - b.length);
      
      variations.push({
        baseForm: sorted[0],
        variants: sorted,
      });
    }
    
    // Also check for names that share a common root (e.g., "Vierny" and "VIERNY")
    // Only add if the name appears more than once
    if (uniqueVariants.length === 1 && variants.length > 1) {
      variations.push({
        baseForm: uniqueVariants[0],
        variants: uniqueVariants,
      });
    }
  }
  
  return variations;
}

/**
 * Detect elegant variation in text
 */
export function detectElegantVariation(text: string): ElegantVariationMatch[] {
  const matches: ElegantVariationMatch[] = [];
  const lowerText = text.toLowerCase();
  const maxIterations = 10000; // Safety limit
  let iterations = 0;
  
  // 1. Detect name variations
  const names = extractNames(text);
  const nameVariations = findNameVariations(names);
  
  if (nameVariations.length > 0) {
    for (const variation of nameVariations) {
      // Count how many times we see different variants in close proximity
      const variantCounts: Record<string, number> = {};
      
      for (const variant of variation.variants) {
        let count = 0;
        const regex = new RegExp(`\\b${escapeRegExp(variant.toLowerCase())}\\b`, 'g');
        let matchResult;
        
        iterations = 0;
        while ((matchResult = regex.exec(lowerText)) !== null && iterations < maxIterations) {
          count++;
          iterations++;
        }
        
        if (count > 0) {
          variantCounts[variant] = count;
        }
      }
      
      // If we see the same name in multiple different forms, it's elegant variation
      const distinctForms = Object.keys(variantCounts).length;
      const totalCount = Object.values(variantCounts).reduce((a, b) => a + b, 0);
      
      // More lenient threshold: if we see the name more than once in any form, and there are variations
      if (distinctForms >= 2 && totalCount >= 2) {
        matches.push({
          pattern: 'name-variation',
          description: `Name "${variation.baseForm}" appears in ${distinctForms} different forms (${Object.keys(variantCounts).slice(0, 3).join(', ')})`,
          count: totalCount,
          examples: Object.keys(variantCounts).slice(0, 3),
        });
      }
    }
  }
  
  // 2. Detect synonym substitutions
  for (const [baseWord, synonyms] of Object.entries(synonymGroups)) {
    const counts: Record<string, number> = {};
    
    for (const synonym of synonyms) {
      let count = 0;
      const regex = new RegExp(`\\b${escapeRegExp(synonym.toLowerCase())}\\b`, 'gi');
      let matchResult;
      
      iterations = 0;
      while ((matchResult = regex.exec(lowerText)) !== null && iterations < maxIterations) {
        count++;
        iterations++;
      }
      
      if (count > 0) {
        counts[synonym] = count;
      }
    }
    
    // If multiple synonyms are used for the same concept, it's elegant variation
    const distinctSynonyms = Object.keys(counts).length;
    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
    
    // Detect elegant variation with more lenient thresholds
    // Need at least 2 distinct synonyms appearing at least 2 times total
    if (distinctSynonyms >= 2 && totalCount >= 2) {
      // Avoid duplicate matches
      const isAlreadyMatched = matches.some(m => 
        m.description.includes(baseWord) || 
        Object.keys(counts).some(s => m.description?.includes(s))
      );
      
      if (!isAlreadyMatched && Object.keys(counts).length > 0) {
        matches.push({
          pattern: 'synonym-substitution',
          description: `Multiple synonyms used for "${baseWord}": ${Object.keys(counts).slice(0, 3).join(', ')}${distinctSynonyms > 3 ? '...' : ''}`,
          count: totalCount,
          examples: Object.keys(counts).slice(0, 3),
        });
      }
    }
  }
  
  return matches;
}

/**
 * Color for elegant variation highlights
 */
export const ELEGANT_VARIATION_COLOR = '#10b981'; // green-500

/**
 * Generate highlights for elegant variation matches
 */
export function generateElegantVariationHighlights(
  text: string,
  matches: ElegantVariationMatch[]
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
  
  const lowerText = text.toLowerCase();
  const maxIterations = 10000; // Safety limit
  let iterations = 0;
  
  // For each match, find and highlight all instances
  for (const match of matches) {
    if (match.pattern === 'name-variation' && match.examples) {
      // Highlight all variants of the name
      for (const example of match.examples) {
        const regex = new RegExp(`\\b${escapeRegExp(example.toLowerCase())}\\b`, 'gi');
        let matchResult;
        
        iterations = 0;
        while ((matchResult = regex.exec(lowerText)) !== null && iterations < maxIterations) {
          const start = matchResult.index;
          const end = start + matchResult[0].length;
          
          // Check for overlap with existing highlights
          const hasOverlap = highlights.some(existing => 
            (start < existing.end && end > existing.start)
          );
          
          if (!hasOverlap) {
            highlights.push({
              start,
              end,
              factor: match.pattern,
              category: 'Elegant Variation',
              color: ELEGANT_VARIATION_COLOR,
            });
          }
          
          iterations++;
        }
      }
    } else if (match.pattern === 'synonym-substitution' && match.examples) {
      // Highlight synonym instances
      for (const example of match.examples) {
        const regex = new RegExp(`\\b${escapeRegExp(example.toLowerCase())}\\b`, 'gi');
        let matchResult;
        
        iterations = 0;
        while ((matchResult = regex.exec(lowerText)) !== null && iterations < maxIterations) {
          const start = matchResult.index;
          const end = start + matchResult[0].length;
          
          // Check for overlap
          const hasOverlap = highlights.some(existing => 
            (start < existing.end && end > existing.start)
          );
          
          if (!hasOverlap) {
            highlights.push({
              start,
              end,
              factor: match.pattern,
              category: 'Elegant Variation',
              color: ELEGANT_VARIATION_COLOR,
            });
          }
          
          iterations++;
        }
      }
    }
  }
  
  // Sort by start position and limit to prevent huge arrays
  highlights.sort((a, b) => a.start - b.start);
  return highlights.slice(0, 1000); // Limit to 1000 highlights
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
