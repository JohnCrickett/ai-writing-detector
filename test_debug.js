import { detectSuperficialAnalysis } from './lib/superficialAnalysis.ts';

const text = 'The policy ensures greater equality in society.';
const matches = detectSuperficialAnalysis(text);
console.log('Input:', text);
console.log('Matches found:', matches.length);
console.log('Matches:', matches);
const ensurMatch = matches.find(m => m.phrase.includes('ensur'));
console.log('Ensuring match:', ensurMatch);
