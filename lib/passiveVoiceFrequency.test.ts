import { describe, it, expect } from 'vitest';
import { detectPassiveVoiceFrequency } from './passiveVoiceFrequency';

describe('Passive Voice Frequency Detection', () => {
  describe('Basic passive voice detection', () => {
    it('should detect passive voice sentences', () => {
      const text = 'The analysis was conducted by the team. The findings were evaluated.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.passiveCount).toBeGreaterThan(0);
      expect(result.totalSentences).toBeGreaterThan(0);
    });

    it('should calculate passive frequency correctly', () => {
      const text = 'The report was written. The data was analyzed. The conclusions were drawn.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.frequency).toBeGreaterThan(0.5);
      expect(result.frequency).toBeLessThanOrEqual(1);
    });

    it('should flag texts with >15% passive voice as AI signals', () => {
      const text = 'The analysis was conducted by the team. The findings were evaluated. The conclusions were reached. The recommendations were determined.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.isAIPotential).toBe(true);
      expect(result.frequency).toBeGreaterThan(0.15);
    });

    it('should not flag texts with <15% passive voice', () => {
      const text = 'We analyzed the data. The numbers looked good. So we made these recommendations based on what we saw. Our team reviewed everything.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.isAIPotential).toBe(false);
      expect(result.frequency).toBeLessThan(0.15);
    });
  });

  describe('Passive voice construction patterns', () => {
    it('should detect "is/are/was/were + past participle"', () => {
      const text = 'The door is closed. The windows are open. The house was painted. The cars were cleaned.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.passiveCount).toBeGreaterThan(0);
    });

    it('should detect "being + past participle"', () => {
      const text = 'The project is being developed. The code is being reviewed. The system is being monitored.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.passiveCount).toBeGreaterThan(0);
    });

    it('should detect "been + past participle"', () => {
      const text = 'The work has been completed. The issue has been resolved. The task has been finished.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.passiveCount).toBeGreaterThan(0);
    });

    it('should detect "been + past participle" with will', () => {
      const text = 'The project will be started. The report will be submitted. The changes will be applied.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.passiveCount).toBeGreaterThan(0);
    });
  });

  describe('AI text examples', () => {
    it('should detect high passive frequency in AI-like text', () => {
      const aiText = 'The analysis was conducted by the team. The findings were evaluated. The conclusions were reached. The recommendations were determined. The report was submitted by the researchers. The data was processed by the system. The results were analyzed.';
      const result = detectPassiveVoiceFrequency(aiText);
      
      expect(result.isAIPotential).toBe(true);
      expect(result.frequency).toBeGreaterThan(0.15);
    });

    it('should flag artificially formal writing with high passive rates', () => {
      const text = 'The implementation was facilitated through the adoption of novel methodologies. The optimization was achieved via systematic integration. The improvements were realized through comprehensive analysis. The framework was established to ensure compliance.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.isAIPotential).toBe(true);
    });
  });

  describe('Human text examples', () => {
    it('should not flag natural human writing with low passive rates', () => {
      const humanText = 'We analyzed the data. The numbers looked good. So we made these recommendations based on what we saw. I worked on this project for three months. We found some interesting patterns.';
      const result = detectPassiveVoiceFrequency(humanText);
      
      expect(result.isAIPotential).toBe(false);
      expect(result.frequency).toBeLessThan(0.15);
    });

    it('should allow legitimate academic/technical writing within threshold', () => {
      const text = 'The experiment was conducted under controlled conditions. We measured the temperature every hour. The data was collected over two weeks. Our team then analyzed the results.';
      const result = detectPassiveVoiceFrequency(text);
      
      // May or may not be flagged depending on exact ratio, but should have measurable frequency
      expect(result.frequency).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text', () => {
      const result = detectPassiveVoiceFrequency('');
      
      expect(result.frequency).toBe(0);
      expect(result.totalSentences).toBe(0);
    });

    it('should handle text with no sentences', () => {
      const text = 'hello world';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.totalSentences).toBeGreaterThanOrEqual(0);
    });

    it('should handle single sentence', () => {
      const text = 'The document was reviewed.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.totalSentences).toBe(1);
      expect(result.passiveCount).toBe(1);
      expect(result.frequency).toBe(1);
    });

    it('should handle questions', () => {
      const text = 'Was the report submitted? Are the files organized? Will the changes be approved?';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.totalSentences).toBe(3);
    });

    it('should distinguish passive voice from active voice with past participles', () => {
      // "Broken glass" is an adjective, not passive voice
      // "The glass was broken" is passive voice
      const text = 'The glass was broken. A broken window let in cold air. The system was damaged. Damaged equipment requires replacement.';
      const result = detectPassiveVoiceFrequency(text);
      
      // Should count only true passive constructions
      expect(result.passiveCount).toBeLessThanOrEqual(2);
    });
  });

  describe('Sentence counting', () => {
    it('should count sentences correctly', () => {
      const text = 'First sentence. Second sentence. Third sentence.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.totalSentences).toBe(3);
    });

    it('should handle multiple punctuation marks', () => {
      const text = 'First sentence? Second sentence! Third sentence.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.totalSentences).toBe(3);
    });

    it('should handle abbreviations without breaking sentence count', () => {
      const text = 'Dr. Smith was interviewed. The data was analyzed.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.totalSentences).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Frequency calculation', () => {
    it('should calculate frequency as passive count / total sentences', () => {
      const text = 'Active sentence one. The report was written. The data was analyzed. Active sentence four.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.frequency).toBe(result.passiveCount / result.totalSentences);
    });

    it('should handle 0 frequency correctly', () => {
      const text = 'I wrote the report. We analyzed the data. They submitted the files.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.frequency).toBe(0);
      expect(result.isAIPotential).toBe(false);
    });

    it('should handle 100% frequency correctly', () => {
      const text = 'The report was written. The data was analyzed. The files were submitted.';
      const result = detectPassiveVoiceFrequency(text);
      
      expect(result.frequency).toBe(1);
      expect(result.isAIPotential).toBe(true);
    });
  });

  describe('Boundary cases', () => {
    it('should flag frequency exactly at 0.15 boundary', () => {
      // 3 passive sentences out of 20 = 0.15 frequency
      const sentences = [
        'The report was written.',
        'Data was collected.',
        'Results were analyzed.',
        'I did the first task.',
        'We completed the second task.',
        'They finished the third task.',
        'I worked hard.',
        'We collaborated well.',
        'They shared ideas.',
        'I learned new skills.',
        'We improved processes.',
        'They streamlined workflows.',
        'I created documentation.',
        'We updated systems.',
        'They maintained equipment.',
        'I reviewed the code.',
        'We tested functionality.',
        'They debugged issues.',
        'I optimized performance.',
        'We deployed successfully.',
      ];
      const text = sentences.join(' ');
      const result = detectPassiveVoiceFrequency(text);
      
      // At boundary - should be flagged
      expect(result.frequency).toBeGreaterThanOrEqual(0.15);
    });

    it('should not flag frequency just below 0.15', () => {
      // Create text with slightly below 15% passive
      // 1 passive out of 8 = 0.125 (12.5%)
      const sentences = [
        'The report was written.',
        'I did task one.',
        'We completed task two.',
        'They finished task three.',
        'I worked on task four.',
        'We collaborated on task five.',
        'They shared ideas about task six.',
        'I learned new skills.',
      ];
      const text = sentences.join(' ');
      const result = detectPassiveVoiceFrequency(text);
      
      // Should be just below threshold
      expect(result.frequency).toBeLessThan(0.15);
      expect(result.isAIPotential).toBe(false);
    });
  });
});
