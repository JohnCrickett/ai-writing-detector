'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeText } from '@/lib/aiDetector';

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
      const result = analyzeText(text);
      
      // Store results in sessionStorage to pass to analysis page
      sessionStorage.setItem('analysisData', JSON.stringify({
        text,
        wordCount,
        aiScore: Math.round(result.score * 10) / 10,
        factors: result.factors,
        patterns: result.patterns,
        timestamp: new Date().toISOString(),
      }));

      router.push('/analysis');
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            AI Writing Detector
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Detect AI-generated text with advanced analysis
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 mb-8">
          {/* Text Input */}
          <div className="mb-6">
            <label htmlFor="text-input" className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Paste your text here
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to analyze..."
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white resize-none"
            />
          </div>

          {/* Character Count */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {text.length} characters • {text.split(/\s+/).filter(w => w.length > 0).length} words
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>

        {/* Analysis Details Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">How Our Analysis Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Linguistic Factors</h3>
              <ul className="text-slate-600 dark:text-slate-400 space-y-2 text-sm">
                <li>• Word repetition patterns</li>
                <li>• Formal tone detection</li>
                <li>• Sentence variety analysis</li>
                <li>• Vocabulary diversity metrics</li>
                <li>• Structural pattern recognition</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Pattern Detection</h3>
              <ul className="text-slate-600 dark:text-slate-400 space-y-2 text-sm">
                <li>• AI vocabulary markers</li>
                <li>• Undue emphasis patterns</li>
                <li>• Promotional language</li>
                <li>• Didactic disclaimers</li>
                <li>• And 4 more categories</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6 text-center">
            <p className="text-slate-700 dark:text-slate-300">
              Our detector combines linguistic analysis with pattern recognition to identify characteristics commonly found in AI-generated text. Results show a probability score along with detailed breakdowns of detected factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
