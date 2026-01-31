/**
 * Rule of Three Detection
 * Detects overuse of the "rule of three" pattern, common in LLM writing
 * 
 * LLMs overuse structures like:
 * - "adjective, adjective, and adjective"
 * - "noun, noun, and noun"
 * - "short phrase, short phrase, and short phrase"
 * 
 * This makes superficial analyses appear more comprehensive
 */

export interface RuleOfThreeMatch {
  pattern: 'adjective-triple' | 'noun-triple' | 'verb-triple' | 'phrase-triple';
  description: string;
  count: number;
}

/**
 * Patterns for rule of three detection
 */
const ruleOfThreePatterns = [
  {
    name: 'adjective-triple',
    // Matches: "adjective, adjective, and adjective" with various connectors
    // Allows for both comma-and and just "and" patterns
    regex: /\b(?:innovative|strategic|comprehensive|transformative|bold|ambitious|cutting-edge|integrated|integrated|groundbreaking|revolutionary|dynamic|agile|scalable|robust|sophisticated|elegant|efficient|effective|powerful|remarkable|significant|substantial|notable|compelling|striking|impressive|outstanding|exceptional|excellent|superior|prominent|distinct|unique|distinctive|exclusive|advanced|modern|contemporary|proven|established|credible|reliable|trustworthy|dependable|solid|strong|meaningful|pivotal|critical|essential|fundamental|integral|vital|crucial|key|important|influential|impactful)(?:\s*,\s*)(?:innovative|strategic|comprehensive|transformative|bold|ambitious|cutting-edge|integrated|groundbreaking|revolutionary|dynamic|agile|scalable|robust|sophisticated|elegant|efficient|effective|powerful|remarkable|significant|substantial|notable|compelling|striking|impressive|outstanding|exceptional|excellent|superior|prominent|distinct|unique|distinctive|exclusive|advanced|modern|contemporary|proven|established|credible|reliable|trustworthy|dependable|solid|strong|meaningful|pivotal|critical|essential|fundamental|integral|vital|crucial|key|important|influential|impactful)(?:\s+and\s+|\s*,\s*and\s+)(?:innovative|strategic|comprehensive|transformative|bold|ambitious|cutting-edge|integrated|groundbreaking|revolutionary|dynamic|agile|scalable|robust|sophisticated|elegant|efficient|effective|powerful|remarkable|significant|substantial|notable|compelling|striking|impressive|outstanding|exceptional|excellent|superior|prominent|distinct|unique|distinctive|exclusive|advanced|modern|contemporary|proven|established|credible|reliable|trustworthy|dependable|solid|strong|meaningful|pivotal|critical|essential|fundamental|integral|vital|crucial|key|important|influential|impactful)\b/i,
    description: 'Three adjectives in succession (adjective, adjective, and adjective)',
  },
  // Note: phrase-triple pattern disabled due to regex complexity causing false positives
  // {
  //   name: 'phrase-triple',
  //   // Matches: "noun phrase, noun phrase, and noun phrase"
  //   // Only 2-3 word phrases to avoid matching longer structures
  //   regex: /\b\w+(?:\s+\w+)?(?:\s*,\s*)\w+(?:\s+\w+)?(?:\s*,\s*and\s+)\w+(?:\s+\w+)?\b/i,
  //   description: 'Three short phrases in succession (phrase, phrase, and phrase)',
  // },
  // Note: noun-triple pattern disabled - was matching too broadly when applied to lowercase text
  // {
  //   name: 'noun-triple',
  //   // More specific pattern for noun triples
  //   // Looks for capitalized nouns or common noun patterns
  //   regex: /\b[A-Z]\w+(?:\s+[A-Z]?\w+)?(?:\s*,\s*)[A-Z]\w+(?:\s+[A-Z]?\w+)?(?:\s*,\s*and\s+)[A-Z]\w+(?:\s+[A-Z]?\w+)?\b/,
  //   description: 'Three nouns or noun phrases in succession',
  // },
  {
    name: 'verb-triple',
    // Matches verb patterns like "verb, verb, and verb" - base verbs only (no -ing to avoid over-matching)
    regex: /\b(?:analyze|interpret|synthesize|innovate|implement|develop|create|design|build|enhance|improve|optimize|achieve|deliver|provide|offer|ensure|establish|demonstrate|illustrate|explore|examine|assess|evaluate|investigate|research|study|understand|comprehend|address|solve|resolve|handle|manage|organize|coordinate|facilitate|streamline|simplify|accelerate|advance|strengthen|reinforce|integrate|connect|align|evolve|adapt)(?:\s*,\s*)(?:analyze|interpret|synthesize|innovate|implement|develop|create|design|build|enhance|improve|optimize|achieve|deliver|provide|offer|ensure|establish|demonstrate|illustrate|explore|examine|assess|evaluate|investigate|research|study|understand|comprehend|address|solve|resolve|handle|manage|organize|coordinate|facilitate|streamline|simplify|accelerate|advance|strengthen|reinforce|integrate|connect|align|evolve|adapt)(?:\s*,\s*and\s+)(?:analyze|interpret|synthesize|innovate|implement|develop|create|design|build|enhance|improve|optimize|achieve|deliver|provide|offer|ensure|establish|demonstrate|illustrate|explore|examine|assess|evaluate|investigate|research|study|understand|comprehend|address|solve|resolve|handle|manage|organize|coordinate|facilitate|streamline|simplify|accelerate|advance|strengthen|reinforce|integrate|connect|align|evolve|adapt)\b/i,
    description: 'Three verbs in succession (verb, verb, and verb)',
  },
  {
    name: 'verb-ing-triple',
    // Matches -ing verb forms: "identifying, evaluating, and implementing"
    regex: /\b(?:\w+ing)(?:\s*,\s*)(?:\w+ing)(?:\s*,\s*and\s+)(?:\w+ing)\b/i,
    description: 'Three gerunds/participles in succession (verbing, verbing, and verbing)',
  },
];

/**
 * Detect rule of three patterns in text
 */
export function detectRuleOfThree(text: string): RuleOfThreeMatch[] {
  const matches: RuleOfThreeMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const patternDef of ruleOfThreePatterns) {
    try {
      // Create a global version of the regex for finding all matches
      const globalRegex = new RegExp(patternDef.regex.source, 'gi');
      let count = 0;
      let matchResult;
      let lastIndex = -1;

      // Safety limit to prevent infinite loops
      const maxIterations = 1000;
      let iterations = 0;

      while ((matchResult = globalRegex.exec(lowerText)) !== null && iterations < maxIterations) {
        // Prevent infinite loop if match is empty
        if (matchResult.index === lastIndex) {
          globalRegex.lastIndex = lastIndex + 1;
        }
        lastIndex = matchResult.index;
        count++;
        iterations++;
      }

      if (count > 0) {
        matches.push({
          pattern: patternDef.name as RuleOfThreeMatch['pattern'],
          description: patternDef.description,
          count: count,
        });
      }
    } catch {
      // Skip this pattern if it causes an error
      continue;
    }
  }

  return matches;
}

/**
 * Color for rule of three highlights
 */
export const RULE_OF_THREE_COLOR = '#8b5cf6'; // purple-500

/**
 * Generate highlights for rule of three matches in text
 */
export function generateRuleOfThreeHighlights(
  text: string,
  matches: RuleOfThreeMatch[]
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

  for (const match of matches) {
    try {
      const patternDef = ruleOfThreePatterns.find(p => p.name === match.pattern);
      if (!patternDef) continue;

      // Ensure regex has global flag
      const regex = new RegExp(patternDef.regex.source, 'gi');
      let matchResult;
      let lastIndex = -1;

      // Safety limit to prevent infinite loops
      const maxIterations = 1000;
      let iterations = 0;

      while ((matchResult = regex.exec(lowerText)) !== null && iterations < maxIterations) {
        // Prevent infinite loop if match is empty or same position
        if (matchResult.index === lastIndex || matchResult[0].length === 0) {
          regex.lastIndex = matchResult.index + 1;
        }
        lastIndex = matchResult.index;

        // Check if this highlight overlaps with existing ones
        const newStart = matchResult.index;
        const newEnd = matchResult.index + matchResult[0].length;
        
        // Skip if this highlight overlaps with an existing one
        const hasOverlap = highlights.some(existing => 
          (newStart < existing.end && newEnd > existing.start)
        );
        
        if (!hasOverlap) {
          highlights.push({
            start: newStart,
            end: newEnd,
            factor: match.pattern,
            category: 'Rule of Three',
            color: RULE_OF_THREE_COLOR,
          });
        }
        
        iterations++;
      }
    } catch {
      // Skip this pattern if it causes an error
      continue;
    }
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  return highlights;
}
