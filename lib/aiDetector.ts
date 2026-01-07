/**
 * AI Writing Detector based on linguistic and stylistic patterns
 * Inspired by Wikipedia's Signs of AI Writing
 */

interface PatternMatch {
  category: string;
  phrase: string;
  count: number;
  score: number;
}

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
}

export function analyzeText(text: string): DetectionMetrics {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      factors: {
        repetition: 0,
        formalTone: 0,
        sentenceVariety: 0,
        vocabulary: 0,
        structure: 0,
      },
      patterns: [],
    };
  }

  const factors = {
    repetition: checkRepetition(text),
    formalTone: checkFormalTone(text),
    sentenceVariety: checkSentenceVariety(text),
    vocabulary: checkVocabularyComplexity(text),
    structure: checkStructure(text),
  };

  const patterns = detectPatterns(text);

  // Average the factors with weighted scoring
  const score =
    factors.repetition * 0.2 +
    factors.formalTone * 0.2 +
    factors.sentenceVariety * 0.2 +
    factors.vocabulary * 0.2 +
    factors.structure * 0.2;

  return {
    score: Math.min(100, Math.max(0, score)),
    factors,
    patterns,
  };
}

/**
 * Check for repetitive phrases and words (sign of AI)
 */
function checkRepetition(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const wordFreq = new Map<string, number>();

  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  let repetitionScore = 0;
  let totalWords = words.length;

  wordFreq.forEach(count => {
    if (count > 3) {
      // Words repeated 4+ times contribute more
      repetitionScore += (count - 3) * 5;
    }
  });

  return Math.min(100, (repetitionScore / totalWords) * 100);
}

/**
 * Check for overly formal language patterns (common in AI)
 */
function checkFormalTone(text: string): number {
  const formalPatterns = [
    /\b(furthermore|moreover|therefore|however|consequently|thus|hence)\b/gi,
    /\b(it is noteworthy|it is important to note|it should be noted)\b/gi,
    /\b(in conclusion|in summary|to summarize|as mentioned|as previously stated)\b/gi,
    /\b(endeavor|utilize|facilitate|implement|leverage|optimize)\b/gi,
    /\b(on the other hand|in contrast|similarly|likewise)\b/gi,
  ];

  let formalCount = 0;
  const sentences = text.split(/[.!?]+/).length;

  formalPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      formalCount += matches.length;
    }
  });

  return Math.min(100, (formalCount / Math.max(sentences, 1)) * 20);
}

/**
 * Check sentence length variety (AI tends to be more uniform)
 */
function checkSentenceVariety(text: string): number {
  const sentences = text
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 0)
    .map(s => s.trim().split(/\s+/).length);

  if (sentences.length < 2) return 0;

  const avgLength =
    sentences.reduce((a, b) => a + b, 0) / sentences.length;
  const variance =
    sentences.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) /
    sentences.length;
  const stdDev = Math.sqrt(variance);

  // Low variety (low std dev) = higher AI score
  // Human writing has more variety
  return Math.max(0, 50 - stdDev * 5);
}

/**
 * Check vocabulary complexity and diversity
 */
function checkVocabularyComplexity(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(words);

  // Calculate type-token ratio (diversity)
  const typeTokenRatio = uniqueWords.size / words.length;

  // AI often has lower diversity (more repetitive)
  // Human writing typically has 0.4-0.6 ratio
  if (typeTokenRatio > 0.6) return 20; // Diverse = more human-like
  if (typeTokenRatio > 0.5) return 35;
  if (typeTokenRatio > 0.4) return 50;
  if (typeTokenRatio > 0.3) return 70;
  return 85; // Very repetitive = likely AI

}

/**
 * Check structural patterns (paragraphs, lists, etc)
 */
function checkStructure(text: string): number {
  const lines = text.split('\n');
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

  // Count numbered lists, bullet points
  const listPatterns = /^[\s]*([-*•]|\d+[.):])/gm;
  const listItems = text.match(listPatterns) || [];

  // AI often has very consistent paragraph structure
  const avgParagraphLength =
    text.length / Math.max(paragraphs.length, 1);

  let structureScore = 0;

  // Perfect uniform structure suggests AI
  if (paragraphs.length > 3) {
    const lengths = paragraphs.map(p => p.length);
    const variance =
      lengths.reduce((sum, len) => sum + Math.pow(len - avgParagraphLength, 2), 0) /
      lengths.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < avgParagraphLength * 0.2) {
      structureScore += 60; // Very uniform = likely AI
    } else if (stdDev < avgParagraphLength * 0.4) {
      structureScore += 30;
    }
  }

  // Heavy use of lists (structural) suggests AI
  if (listItems.length > 5) {
    structureScore += 20;
  }

  return Math.min(100, structureScore);
}

// Pattern definitions for AI detection categories
const AI_PATTERNS = {
  'AI Vocabulary': [
    'delve', 'showcase', 'underscore', 'intricate', 'embodies', 'testament to',
    'plays a pivotal role', 'crucial juncture', 'paramount', 'facilitate',
    'endeavor', 'harness', 'leverage', 'paradigm', 'seamless', 'robust',
    'holistic', 'synergy', 'imperative', 'elucidate', 'utilize', 'optimize'
  ],
  'Undue Emphasis': [
    'it is important to note', 'it should be noted', 'significantly', 'notably',
    'importantly', 'crucially', 'clearly', 'obviously', 'undoubtedly', 'certainly',
    'notably', 'it is worth noting'
  ],
  'Promotional Language': [
    'nestled in', 'boasts', 'stunning beauty', 'remarkable', 'breathtaking',
    'enchanting', 'picturesque', 'majestic', 'spectacular', 'awe-inspiring',
    'captivating', 'mesmerizing'
  ],
  'Didactic Disclaimers': [
    'as mentioned earlier', 'as discussed', 'as we have seen', 'as shown above',
    'it is argued', 'it has been argued', 'according to experts'
  ],
  'Section Summaries': [
    'in conclusion', 'in summary', 'to summarize', 'in short', 'ultimately',
    'in essence', 'to conclude', 'finally'
  ],
  'Challenge Patterns': [
    'despite challenges', 'despite obstacles', 'despite these difficulties',
    'in spite of challenges', 'overcoming challenges'
  ],
  'Negative Parallelisms': [
    'not just', 'not only', 'not merely'
  ],
  'Rule of Three': [
    ' and ', ' as well as ', ' combined with ', ' along with '
  ]
};

/**
 * Detect pattern-based AI writing markers
 */
function detectPatterns(text: string): PatternMatch[] {
  const lowerText = text.toLowerCase();
  const detected: PatternMatch[] = [];
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  Object.entries(AI_PATTERNS).forEach(([category, phrases]) => {
    let totalCount = 0;

    phrases.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        totalCount += matches.length;
      }
    });

    // Calculate score based on frequency per 1000 words
    const frequencyPer1000 = (totalCount / Math.max(wordCount, 1)) * 1000;
    let score = 0;
    
    // Rule of Three typically appears more frequently
    if (category === 'Rule of Three') {
      score = Math.min(100, frequencyPer1000 * 2);
    } else {
      score = Math.min(100, frequencyPer1000 * 10);
    }

    detected.push({
      category,
      phrase: `${totalCount} instance${totalCount > 1 ? 's' : ''}`,
      count: totalCount,
      score: Math.round(score),
    });
  });

  return detected;
}
