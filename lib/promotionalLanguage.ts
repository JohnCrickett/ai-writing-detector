/**
 * Promotional Language Detection
 * Detects advertising-like and marketing language that suggests bias or lack of neutrality
 */

export interface PromotionalLanguageMatch {
  phrase: string;
  category: 'tourism' | 'marketing' | 'product' | 'superlative';
  count: number;
  description: string;
}

/**
 * Patterns for cultural heritage and tourism marketing language
 */
const tourismPatterns = [
  { phrase: 'nestled', description: 'Picturesque tourism framing' },
  { phrase: 'in the heart of', description: 'Tourism marketing localization' },
  { phrase: 'continues to captivate', description: 'Promotional appeal language' },
  { phrase: 'groundbreaking', description: 'Figurative superlative for achievements' },
  { phrase: 'stunning', description: 'Emotionally evocative adjective' },
  { phrase: 'natural beauty', description: 'Tourism marketing phrase' },
  { phrase: 'enduring', description: 'Emphasized longevity of legacy' },
  { phrase: 'lasting', description: 'Emphasized permanence of impact' },
  { phrase: 'legacy', description: 'Importance emphasis in heritage context' },
  { phrase: 'breathtaking', description: 'Emotionally charged tourism language' },
  { phrase: 'scenic', description: 'Tourism marketing descriptor' },
  { phrase: 'boasts', description: 'Marketing presentation of features' },
  { phrase: 'vibrant', description: 'Positively charged tourism descriptor' },
  { phrase: 'rich cultural heritage', description: 'Tourism industry language' },
  { phrase: 'diverse tapestry', description: 'Flowery tourism marketing phrase' },
  { phrase: 'fascinating', description: 'Emotionally appealing tourism language' },
  { phrase: 'worth visiting', description: 'Direct tourism recommendation' },
];

/**
 * Patterns for corporate and business marketing language
 */
const marketingPatterns = [
  { phrase: 'gateway', description: 'Corporate positioning language' },
  { phrase: 'seamlessly', description: 'Marketing claim of integration' },
  { phrase: 'dependable', description: 'Corporate trust-building descriptor' },
  { phrase: 'value-driven', description: 'Corporate values marketing' },
  { phrase: 'commitment', description: 'Corporate responsibility positioning' },
  { phrase: 'tangible', description: 'Marketing emphasis on concrete results' },
  { phrase: 'align', description: 'Corporate strategy marketing speak' },
  { phrase: 'foster', description: 'Positive impact marketing language' },
  { phrase: 'dual commitment', description: 'Corporate positioning of multiple priorities' },
  { phrase: 'responsible corporate', description: 'ESG marketing language' },
];

/**
 * Patterns for product and design marketing language
 */
const productPatterns = [
  { phrase: 'communicates', description: 'Design marketing language (verbalizing design intent)' },
  { phrase: 'signature', description: 'Brand distinction marketing' },
  { phrase: 'bold', description: 'Product design superlative' },
  { phrase: 'enhanced', description: 'Product improvement marketing' },
  { phrase: 'enhances', description: 'Product improvement marketing' },
  { phrase: 'sleek', description: 'Design aesthetic marketing' },
  { phrase: 'refined', description: 'Luxury product marketing' },
  { phrase: 'timeless', description: 'Product longevity marketing' },
  { phrase: 'heritage', description: 'Brand legacy marketing' },
  { phrase: 'carefully', description: 'Craft/attention marketing language' },
  { phrase: 'thoughtfully', description: 'Craft/attention marketing language' },
  { phrase: 'artisan', description: 'Craft/luxury positioning' },
  { phrase: 'dedication', description: 'Brand values marketing' },
];

/**
 * Common promotional superlatives
 */
const superlativePatterns = [
  { phrase: 'exceptional', description: 'Promotional superlative' },
  { phrase: 'remarkable', description: 'Promotional superlative' },
  { phrase: 'extraordinary', description: 'Promotional superlative' },
  { phrase: 'unparalleled', description: 'Promotional superlative' },
  { phrase: 'premier', description: 'Promotional ranking' },
];

/**
 * Detect promotional language patterns in text
 */
export function detectPromotionalLanguage(text: string): PromotionalLanguageMatch[] {
  const matches: PromotionalLanguageMatch[] = [];
  const lowerText = text.toLowerCase();

  // Check tourism patterns
  for (const pattern of tourismPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'tourism',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Check marketing patterns
  for (const pattern of marketingPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'marketing',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Check product patterns
  for (const pattern of productPatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'product',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  // Check superlatives
  for (const pattern of superlativePatterns) {
    const regex = createRegexPattern(pattern.phrase);
    const foundMatches = lowerText.match(regex);

    if (foundMatches) {
      matches.push({
        phrase: pattern.phrase,
        category: 'superlative',
        count: foundMatches.length,
        description: pattern.description,
      });
    }
  }

  return matches;
}

/**
 * Create appropriate regex pattern based on phrase type
 */
function createRegexPattern(phrase: string): RegExp {
  const isMultiWord = phrase.includes(' ');
  const pluralizeableWords = ['artisan'];
  const rootWords = ['commitment', 'foster', 'tangible'];
  const shouldMatchPlural = pluralizeableWords.includes(phrase);
  const shouldMatchDerived = rootWords.includes(phrase);

  let pattern: RegExp;

  if (isMultiWord) {
    // Multi-word phrases match as-is with word boundaries
    pattern = new RegExp(`\\b${phrase}\\b`, 'gi');
  } else if (shouldMatchPlural) {
    // Words that should match both singular and plural
    pattern = new RegExp(`\\b${phrase}s?\\b`, 'gi');
  } else if (shouldMatchDerived) {
    // Words with common suffixes: commitment/committed, foster/fostering, tangible (already works)
    if (phrase === 'commitment') {
      pattern = new RegExp(`\\b(commitment|committed)\\b`, 'gi');
    } else if (phrase === 'foster') {
      pattern = new RegExp(`\\bfoster(ing)?\\b`, 'gi');
    } else if (phrase === 'tangible') {
      pattern = new RegExp(`\\btangible\\b`, 'gi');
    } else {
      pattern = new RegExp(`\\b${phrase}\\b`, 'gi');
    }
  } else {
    // Single words use full word boundaries
    pattern = new RegExp(`\\b${phrase}\\b`, 'gi');
  }

  return pattern;
}

/**
 * Color for promotional language highlights
 */
export const PROMOTIONAL_LANGUAGE_COLOR = '#14b8a6'; // teal-500

/**
 * Generate highlights for promotional language matches in text
 */
export function generatePromotionalLanguageHighlights(
  text: string,
  matches: PromotionalLanguageMatch[]
): Array<{
  start: number;
  end: number;
  phrase: string;
  category: string;
  color: string;
}> {
  const highlights: Array<{
    start: number;
    end: number;
    phrase: string;
    category: string;
    color: string;
  }> = [];
  const lowerText = text.toLowerCase();

  for (const match of matches) {
    const regex = createRegexPattern(match.phrase);
    let matchResult;

    while ((matchResult = regex.exec(lowerText)) !== null) {
      highlights.push({
        start: matchResult.index,
        end: matchResult.index + matchResult[0].length,
        phrase: match.phrase,
        category: 'Promotional Language',
        color: PROMOTIONAL_LANGUAGE_COLOR,
      });
    }
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  return highlights;
}
