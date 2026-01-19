/**
 * Transition Word Density Detection
 * Detects excessive use of formal discourse markers as an AI writing signal
 * AI language models rely heavily on explicit discourse markers to create
 * logical connections, while human writers often use transitions more sparingly
 * and employ more conversational connectors.
 */

export interface TransitionWordMatch {
  transitionWords: string[];
  count: number;
  sentenceCount: number;
  density: number;
  isAIPotential: boolean;
  description: string;
  score: number;
  formalCount: number;
  conversationalCount: number;
}

/**
 * Formal discourse markers - indicate AI writing
 * These are explicitly structured connectors that signal logical flow
 */
const FORMAL_TRANSITIONS = new Set([
  'furthermore',
  'moreover',
  'additionally',
  'consequently',
  'therefore',
  'thus',
  'hence',
  'accordingly',
  'in conclusion',
  'in summary',
  'to summarize',
  'to conclude',
  'ultimately',
  'in essence',
  'in particular',
  'specifically',
  'notably',
  'significantly',
  'importantly',
  'interestingly',
  'remarkably',
  'certainly',
  'undoubtedly',
  'inevitably',
  'obviously',
  'clearly',
  'indeed',
  'in fact',
  'as a matter of fact',
  'in any case',
  'in any event',
  'at any rate',
  'all in all',
  'on the whole',
  'in general',
  'generally speaking',
  'by and large',
  'on balance',
  'taking everything into account',
  'with this in mind',
  'bearing in mind',
  'given this',
  'given that',
  'considering',
  'given the fact that',
  'as previously mentioned',
  'as noted',
  'as discussed',
  'as mentioned',
  'as indicated',
  'in light of',
  'because of this',
  'on this basis',
  'for this reason',
  'for these reasons',
  'as a result',
  'as a consequence',
  'in consequence',
  'as such',
  'for that reason',
  'owing to this',
  'due to this',
  'in that case',
  'in that event',
  'under these circumstances',
  'otherwise',
  'alternatively',
  'on the other hand',
  'by contrast',
  'in contrast',
  'conversely',
  'instead',
  'rather',
  'rather than',
  'however',
  'nevertheless',
  'notwithstanding',
  'despite this',
  'in spite of this',
  'all the same',
  'even so',
  'be that as it may',
  'that being said',
  'at the same time',
  'simultaneously',
  'meanwhile',
  'likewise',
  'similarly',
  'in the same way',
  'in like manner',
  'just as',
  'as well',
  'also',
  'besides',
  'what is more',
  'to that end',
  'above all',
  'before all else',
  'first and foremost',
  'fundamentally',
  'essentially',
  'at heart',
  'substantially',
]);

/**
 * Conversational connectors - more natural in human writing
 * These are excluded from formal transition counting
 */
const CONVERSATIONAL_TRANSITIONS = new Set([
  'and',
  'so',
  'but',
  'yet',
  'or',
  'because',
  'when',
  'while',
  'after',
  'before',
  'since',
  'then',
  'now',
  'like',
  'though',
  'actually',
  'really',
  'you know',
  'i mean',
  'kind of',
  'sort of',
  'i think',
  'i guess',
  'you see',
  'look',
  'listen',
  'well',
  'anyway',
  'alright',
  'okay',
  'ok',
  'sure',
  'whatever',
  'maybe',
  'perhaps',
  'probably',
]);

/**
 * Sentence splitting - handles multiple sentence types
 */
function getSentences(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Split on common sentence delimiters
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences;
}

/**
 * Extract the first word of a sentence
 */
function getFirstWord(sentence: string): string | null {
  const trimmed = sentence.trim();
  const match = trimmed.match(/^(\w+)/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Check if a word is a formal transition
 */
function isFormalTransition(word: string): boolean {
  return FORMAL_TRANSITIONS.has(word.toLowerCase());
}

/**
 * Check if a word is a conversational transition
 */
function isConversationalTransition(word: string): boolean {
  return CONVERSATIONAL_TRANSITIONS.has(word.toLowerCase());
}

/**
 * Check if a sentence starts with a transition word
 */
function startsWithTransition(sentence: string): { isTransition: boolean; word: string | null; isFormal: boolean } {
  const firstWord = getFirstWord(sentence);

  if (!firstWord) {
    return { isTransition: false, word: null, isFormal: false };
  }

  const isFormal = isFormalTransition(firstWord);
  const isConv = isConversationalTransition(firstWord);

  return {
    isTransition: isFormal,
    word: isFormal ? firstWord : null,
    isFormal,
  };
}

/**
 * Detect transition word density patterns
 */
export function detectTransitionWordDensity(text: string): TransitionWordMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const sentences = getSentences(text);

  if (sentences.length < 2) {
    return [];
  }

  // Find transitions at sentence start
  const transitionWords: string[] = [];
  let formalCount = 0;
  let conversationalCount = 0;

  for (const sentence of sentences) {
    const { isTransition, word, isFormal } = startsWithTransition(sentence);

    if (isTransition && word) {
      transitionWords.push(word);
      if (isFormal) {
        formalCount++;
      } else {
        conversationalCount++;
      }
    }
  }

  // Calculate formal transition density (exclude conversational)
  // We weight formal transitions more heavily as they're more AI-like
  const formalDensity = formalCount / sentences.length;

  // Flag if density > 0.4 (40% of sentences start with formal transitions)
  const threshold = 0.4;
  const isAIPotential = formalDensity > threshold;

  if (!isAIPotential) {
    return [];
  }

  // Calculate total density including conversational
  const totalDensity = (formalCount + conversationalCount) / sentences.length;

  const match: TransitionWordMatch = {
    transitionWords: Array.from(new Set(transitionWords)).sort(),
    count: formalCount + conversationalCount,
    formalCount,
    conversationalCount,
    sentenceCount: sentences.length,
    density: formalDensity,
    isAIPotential,
    description: `Excessive use of formal discourse markers (${(formalDensity * 100).toFixed(1)}% of sentences) suggests artificial writing. Natural human writers typically use formal transitions in fewer than 20% of sentences.`,
    score: Math.round(Math.min((formalDensity - threshold) * 100, 30)),
  };

  return [match];
}

/**
 * Color for transition word density highlights
 */
export const TRANSITION_WORD_DENSITY_COLOR = '#ec4899'; // pink-500

/**
 * Generate highlights for transition word density matches
 */
export function generateTransitionWordDensityHighlights(
  text: string,
  matches: TransitionWordMatch[]
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

  if (matches.length === 0) {
    return highlights;
  }

  const sentences = text.split(/[.!?]+/);
  let currentPos = 0;

  for (const sentence of sentences) {
    const { isTransition, word, isFormal } = startsWithTransition(sentence);

    if (isTransition && word && isFormal) {
      // Find the position of this word in the original text
      const wordIndex = text.indexOf(word, currentPos);
      if (wordIndex !== -1) {
        highlights.push({
          start: wordIndex,
          end: wordIndex + word.length,
          factor: word,
          category: 'Transition Word Density',
          color: TRANSITION_WORD_DENSITY_COLOR,
        });
      }
    }

    currentPos += sentence.length + 1; // +1 for the delimiter
  }

  return highlights;
}
