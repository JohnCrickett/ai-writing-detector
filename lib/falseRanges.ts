/**
 * False Ranges Detection
 * 
 * Detects misuse of "from...to..." constructions that don't represent a coherent scale.
 * 
 * True ranges have identifiable scales:
 * - Quantitative: numerical ranges (1990-2000, 15-20 ounces, winter to autumn)
 * - Qualitative: categorical bounds (seed to tree, mild to severe, white belt to black belt)
 * - Merisms: figurative whole (head to toe, soup to nuts)
 * 
 * False ranges are rhetorical and lack coherent middle ground:
 * - Abstract/unrelated endpoints with no meaningful scale
 * - Items from a set listed as if they define bounds
 * - Scale switching between endpoints
 * - Persuasive language attempting to impress rather than inform
 */

export interface FalseRangeMatch {
  text: string;
  reason: string;
  isRhetorical: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Detect false ranges in text
 */
export function detectFalseRanges(text: string): FalseRangeMatch[] {
  const matches: FalseRangeMatch[] = [];
  
  // Two pattern approaches:
  // 1. "from [words] to [words]" where we capture until sentence boundary
  // 2. More aggressive: capture everything between "from" and "to" up to next punctuation/newline
  
  // First, handle comma-separated "from...to" constructions
  const fromToPattern = /from\s+([^,\.;:\n]+)\s+to\s+([^,\.;:\n]+)(?=[,\.;:\n]|$)/gi;
  
  let match: RegExpExecArray | null;
  while ((match = fromToPattern.exec(text)) !== null) {
    const fullMatch = match[0];
    const startPhrase = match[1].trim();
    const endPhrase = match[2].trim();
    
    // Check if this is a false range
    const falseRangeResult = isFalseRange(startPhrase, endPhrase, fullMatch);
    
    if (falseRangeResult) {
      matches.push({
        text: fullMatch,
        reason: falseRangeResult.reason,
        isRhetorical: falseRangeResult.isRhetorical,
        startIndex: match.index,
        endIndex: match.index + fullMatch.length,
      });
    }
  }
  
  // Also try "ranging from...to" pattern
  const rangePattern = /ranging\s+from\s+([^,\.;:\n]+)\s+to\s+([^,\.;:\n]+)(?=[,\.;:\n]|$)/gi;
  
  let match2: RegExpExecArray | null;
  while ((match2 = rangePattern.exec(text)) !== null) {
    const m = match2 as RegExpExecArray;
    const fullMatch = m[0];
    const startPhrase = m[1].trim();
    const endPhrase = m[2].trim();
    
    // Skip if we already detected this
    const isDuplicate = matches.some(existing => existing.startIndex === m.index);
    if (isDuplicate) continue;
    
    // Check if this is a false range
    const falseRangeResult = isFalseRange(startPhrase, endPhrase, fullMatch);
    
    if (falseRangeResult) {
      matches.push({
        text: fullMatch,
        reason: falseRangeResult.reason,
        isRhetorical: falseRangeResult.isRhetorical,
        startIndex: m.index,
        endIndex: m.index + fullMatch.length,
      });
    }
  }
  
  return matches;
}

/**
 * Determine if a from...to construction is a false range
 */
function isFalseRange(
  startPhrase: string,
  endPhrase: string,
  fullText: string
): { reason: string; isRhetorical: boolean } | null {
  const start = startPhrase.toLowerCase();
  const end = endPhrase.toLowerCase();
  
  // True range patterns to exclude
  
  // Numerical ranges (dates, measurements, etc.)
  if (/^\d+/.test(start) && /^\d+/.test(end)) {
    return null; // True quantitative range
  }
  
  // Time ranges (specific times)
  if ((/\d+(?:am|pm|am|:\d+)/.test(start) || /[0-9]{1,2}/.test(start)) && 
      (/\d+(?:am|pm|:\d+)/.test(end) || /[0-9]{1,2}/.test(end))) {
    return null; // True time range
  }
  
  // Temporal ranges
  const temporalKeywords = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
    'winter', 'spring', 'summer', 'autumn', 'fall', 'monday',
    'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  ];
  
  if (temporalKeywords.some(k => start.includes(k)) && 
      temporalKeywords.some(k => end.includes(k))) {
    return null; // True temporal range
  }
  
  // Geographic ranges
  const geoIndicators = ['new york', 'los angeles', 'city', 'north', 'south', 'east', 'west'];
  if (geoIndicators.some(g => start.includes(g)) && 
      geoIndicators.some(g => end.includes(g))) {
    return null; // True geographic range
  }
  
  // Known true merisms
  const merisms = [
    { start: 'head', end: 'toe' },
    { start: 'soup', end: 'nuts' },
    { start: 'seed', end: 'tree' },
    { start: 'white', end: 'black' }, // belt implied
  ];
  
  if (merisms.some(m => start.includes(m.start) && end.includes(m.end))) {
    return null;
  }
  
  // Known qualitative ranges
  const qualitativeRanges = [
    { start: 'mild', end: 'severe' },
    { start: 'low', end: 'high' },
    { start: 'small', end: 'large' },
    { start: 'cheap', end: 'expensive' },
    { start: 'basic', end: 'advanced' },
    { start: 'simple', end: 'complex' },
    { start: 'beginner', end: 'expert' },
    { start: 'fast', end: 'slow' },
    { start: 'hot', end: 'cold' },
    { start: 'young', end: 'old' },
  ];
  
  if (qualitativeRanges.some(r => start.includes(r.start) && end.includes(r.end))) {
    return null;
  }
  
  // Detection rules for false ranges
  
  // Rule 1: Multiple items in one or both endpoints (indicates listing, not ranging)
  const hasStartAnd = start.includes(' and ');
  const hasEndAnd = end.includes(' and ');
  
  if ((hasStartAnd || hasEndAnd) && !isValidCompoundRange(start, end)) {
    return {
      reason: 'Endpoints contain multiple items suggesting a list rather than bounds',
      isRhetorical: true
    };
  }
  
  // Rule 2: Abstract/cosmic concepts with no middle ground
  const abstractPatterns = [
    'singularity', 'big bang', 'cosmic web', 'dark matter', 'dark energy',
    'particle', 'galaxy', 'universe', 'black hole', 'quasar', 'stars'
  ];
  
  const startAbstract = abstractPatterns.filter(p => start.includes(p)).length;
  const endAbstract = abstractPatterns.filter(p => end.includes(p)).length;
  
  if (startAbstract > 0 && endAbstract > 0) {
    return {
      reason: 'Unrelated abstract concepts with no coherent scale',
      isRhetorical: true
    };
  }
  
  // Rule 3: Rhetorical/persuasive vocabulary indicating false range
  const rhetoricalVocab = [
    'cutting-edge', 'innovative', 'transformative', 'comprehensive',
    'strategic', 'seamless', 'groundbreaking', 'revolutionary',
    'paradigm', 'synergy', 'leverage', 'empower', 'drive', 'ecosystem',
    'scalable', 'robust', 'elegant', 'sophisticated'
  ];
  
  const startRhetorical = rhetoricalVocab.filter(v => start.includes(v)).length;
  const endRhetorical = rhetoricalVocab.filter(v => end.includes(v)).length;
  
  // If both endpoints contain rhetorical vocabulary but describe different domains
  if ((startRhetorical > 0 || endRhetorical > 0) && !isRelatedDomain(start, end)) {
    return {
      reason: 'Rhetorical language masking disparate items rather than defining a scale',
      isRhetorical: true
    };
  }
  
  // Rule 4: Problem/action vocabulary indicating list items not range
  const actionVerbs = ['solving', 'making', 'tool-making', 'discovery', 'expression', 'innovation', 'implementation', 'deployment'];
  const abstractNouns = ['concept', 'physics', 'medicine', 'neuroscience', 'chemistry', 'biology'];
  
  const hasAction = actionVerbs.some(v => start.includes(v) || end.includes(v));
  const hasAbstract = abstractNouns.some(n => start.includes(n) || end.includes(n));
  
  if (hasAction && hasAbstract && start !== end) {
    return {
      reason: 'Different domains or activities listed as if defining a range',
      isRhetorical: true
    };
  }
  
  // Rule 5: Unrelated knowledge domains
  if (isUnrelatedDomains(start, end)) {
    return {
      reason: 'Unrelated knowledge domains listed as false range',
      isRhetorical: true
    };
  }
  
  // Rule 6: Abstract descriptions unlikely to form a scale
  const abstractDescriptors = ['everything', 'process', 'stage', 'aspect', 'factor'];
  const isAbstractStart = abstractDescriptors.some(d => startPhrase.toLowerCase().includes(d));
  const isAbstractEnd = abstractDescriptors.some(d => endPhrase.toLowerCase().includes(d));
  
  if ((isAbstractStart || isAbstractEnd) && hasStartAnd) {
    return {
      reason: 'Enumeration of items disguised as range',
      isRhetorical: true
    };
  }
  
  return null;
}

/**
 * Check if two concepts are in related domains
 */
function isRelatedDomain(start: string, end: string): boolean {
  const domains = {
    science: ['physics', 'chemistry', 'biology', 'neuroscience', 'quantum', 'particle', 'matter', 'energy'],
    technology: ['technology', 'computing', 'software', 'hardware', 'digital', 'innovation', 'platform'],
    arts: ['art', 'music', 'expression', 'creative', 'design', 'visual'],
    intellectual: ['discovery', 'learning', 'knowledge', 'understanding', 'research'],
    scale: ['small', 'large', 'basic', 'advanced', 'simple', 'complex'],
  };
  
  for (const [_, keywords] of Object.entries(domains)) {
    const startInDomain = keywords.some(k => start.includes(k));
    const endInDomain = keywords.some(k => end.includes(k));
    if (startInDomain && endInDomain) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if endpoints refer to unrelated knowledge domains
 */
function isUnrelatedDomains(start: string, end: string): boolean {
  // Map domains to keywords
  const domainKeywords = {
    'physics': ['physics', 'quantum', 'particle', 'singularity', 'matter', 'energy', 'relativity'],
    'astronomy': ['stars', 'cosmic', 'galaxy', 'universe', 'quasar', 'black hole', 'big bang'],
    'medicine': ['medicine', 'doctor', 'patient', 'health', 'disease', 'treatment'],
    'neuroscience': ['neuroscience', 'brain', 'neural', 'consciousness', 'mind'],
  };
  
  // Determine which domain(s) each endpoint belongs to
  const startDomains = Object.entries(domainKeywords)
    .filter(([_, keywords]) => keywords.some(k => start.includes(k)))
    .map(([domain, _]) => domain);
  
  const endDomains = Object.entries(domainKeywords)
    .filter(([_, keywords]) => keywords.some(k => end.includes(k)))
    .map(([domain, _]) => domain);
  
  // If they have no domains in common, they're unrelated
  if (startDomains.length > 0 && endDomains.length > 0) {
    const hasCommonDomain = startDomains.some(d => endDomains.includes(d));
    return !hasCommonDomain;
  }
  
  return false;
}

/**
 * Check if compound ranges (with "and") are valid
 */
function isValidCompoundRange(start: string, end: string): boolean {
  // Phrases like "birth and death" or "physics and chemistry"
  // that legitimately compound concepts for a range are rare
  // Most are false
  
  const validCompounds = [
    'birth and death',
    'alpha and omega',
    'beginning and end'
  ];
  
  return validCompounds.some(vc => 
    start.includes(vc) || end.includes(vc)
  );
}

/**
 * Color for false ranges highlights
 */
export const FALSE_RANGES_COLOR = '#eab308'; // yellow-500

/**
 * Generate highlights for false range matches in text
 */
export function generateFalseRangesHighlights(
  text: string,
  matches: FalseRangeMatch[]
): Array<{
  start: number;
  end: number;
  factor: string;
  category: string;
  color: string;
}> {
  return matches.map(match => ({
    start: match.startIndex,
    end: match.endIndex,
    factor: match.isRhetorical ? 'rhetorical-false-range' : 'false-range',
    category: 'False Ranges',
    color: FALSE_RANGES_COLOR,
  }));
}
