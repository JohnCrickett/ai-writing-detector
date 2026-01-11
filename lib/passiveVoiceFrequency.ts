/**
 * Passive Voice Frequency Detection
 * Detects AI writing patterns based on passive voice overuse
 * 
 * AI models are trained on formal datasets where passive voice is common,
 * causing them to default to passive construction more often than natural
 * human writing. While humans use passive voice (~5-10% of sentences),
 * AI frequently uses it at higher rates (15%+), especially when active
 * voice would be more natural.
 */

export interface PassiveVoiceFrequencyResult {
  passiveCount: number;
  totalSentences: number;
  frequency: number;
  isAIPotential: boolean;
  reason: string;
  score: number;
}

/**
 * Extract sentences from text
 * Splits on . ! ? while handling abbreviations somewhat
 */
function extractSentences(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }
  
  // Simple sentence splitting on . ! ? - this will overcount slightly
  // but is better than missing sentences
  const sentencePattern = /[^.!?]*[.!?]+/g;
  const sentences = text.match(sentencePattern) || [];
  
  return sentences
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Check if a sentence is in passive voice
 * Looks for patterns like:
 * - is/are/was/were + past participle (optionally preceded by being/been)
 * - be + past participle
 * - being + past participle
 * - been + past participle
 * - will/would/should/could/may + be + past participle
 */
function isPassiveVoice(sentence: string): boolean {
  const trimmed = sentence.trim();
  
  // Pattern for passive voice constructions:
  // 1. Form: be-verb + past participle
  // 2. Form: be-verb + being + past participle
  // 3. Form: auxiliary + be-verb + past participle
  
  // Patterns to match:
  // - "was conducted", "is created", "are shown"
  // - "is being developed", "was being reviewed"
  // - "has been completed", "have been analyzed"
  // - "will be submitted", "would be approved"
  // - "could be improved", "should be considered"
  
  const passivePatterns = [
    // is/are/was/were + past participle
    /\b(is|are|was|were)\s+\w+ed\b/i,
    
    // is/are/was/were + being + past participle
    /\b(is|are|was|were)\s+being\s+\w+ed\b/i,
    
    // has/have + been + past participle
    /\b(has|have)\s+been\s+\w+ed\b/i,
    
    // had + been + past participle
    /\bhad\s+been\s+\w+ed\b/i,
    
    // will/would/should/could/may/might + be + past participle
    /\b(will|would|should|could|may|might)\s+be\s+\w+ed\b/i,
    
    // will/would/should/could + have + been + past participle
    /\b(will|would|should|could)\s+have\s+been\s+\w+ed\b/i,
    
    // Common irregular past participles following be-verbs
    /\b(is|are|was|were|be|being|been)\s+(made|taken|given|known|found|seen|said|thought|understood|done|written|chosen|drawn)\b/i,
    /\b(has|have|had)\s+been\s+(made|taken|given|known|found|seen|said|thought|understood|done|written|chosen|drawn)\b/i,
    /\b(will|would|should|could|may|might)\s+be\s+(made|taken|given|known|found|seen|said|thought|understood|done|written|chosen|drawn)\b/i,
  ];
  
  for (const pattern of passivePatterns) {
    if (pattern.test(trimmed)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detect passive voice frequency in text
 * Calculates the percentage of sentences using passive voice
 * Flags texts with passive frequency > 0.15 (15%+) as potential AI signals
 */
export function detectPassiveVoiceFrequency(text: string): PassiveVoiceFrequencyResult {
  const sentences = extractSentences(text);
  
  if (sentences.length === 0) {
    return {
      passiveCount: 0,
      totalSentences: 0,
      frequency: 0,
      isAIPotential: false,
      reason: 'No sentences found',
      score: 0,
    };
  }
  
  // Count passive voice sentences
  let passiveCount = 0;
  for (const sentence of sentences) {
    if (isPassiveVoice(sentence)) {
      passiveCount++;
    }
  }
  
  const frequency = passiveCount / sentences.length;
  
  // Flag as AI signal if passive frequency > 15% (0.15)
  const isAIPotential = frequency > 0.15;
  
  // Calculate score contribution (0-35 points)
  // Higher passive frequency = higher AI probability
  let score = 0;
  if (isAIPotential) {
    // Scale from 0-35: each point above 0.15 threshold contributes more
    // At 0.15 = 0 points, at 0.5 = 12.25 points, at 1.0 = 29.75 points
    const excessFrequency = frequency - 0.15;
    score = Math.min(excessFrequency * 50, 35);
  }
  
  // Provide reasoning
  let reason = '';
  if (isAIPotential) {
    const percentage = (frequency * 100).toFixed(1);
    reason = `High passive voice frequency (${percentage}%) exceeds natural human writing (~5-10%), suggesting potential AI composition.`;
  } else {
    const percentage = (frequency * 100).toFixed(1);
    reason = `Passive voice frequency (${percentage}%) is within natural human writing range.`;
  }
  
  return {
    passiveCount,
    totalSentences: sentences.length,
    frequency,
    isAIPotential,
    reason,
    score: Math.round(score),
  };
}

/**
 * Color for passive voice frequency highlights
 */
export const PASSIVE_VOICE_FREQUENCY_COLOR = '#8b5cf6'; // violet-500

/**
 * Generate pattern match for integration with main detector
 */
export function generatePassiveVoiceFrequencyMatch(text: string) {
  const result = detectPassiveVoiceFrequency(text);
  
  if (!result.isAIPotential) {
    return null;
  }
  
  return {
    category: 'Passive Voice Frequency',
    phrase: `${(result.frequency * 100).toFixed(1)}% passive voice (${result.passiveCount} of ${result.totalSentences} sentences)`,
    count: result.passiveCount,
    score: result.score,
  };
}
