'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TextHighlight {
  start: number;
  end: number;
  factor: string;
  category: string;
  color?: string;
}

function HighlightedText({
  text,
  highlights,
}: {
  text: string;
  highlights: TextHighlight[];
}) {
  if (!highlights || highlights.length === 0) {
    return (
      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
        {text}
      </p>
    );
  }

  const segments: Array<{
    type: 'text' | 'highlight';
    content: string;
    category?: string;
  }> = [];
  let lastIndex = 0;

  highlights.forEach((highlight, idx) => {
    // Add text before highlight
    if (lastIndex < highlight.start) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, highlight.start),
      });
    }

    // Add highlighted text
    segments.push({
      type: 'highlight',
      content: text.substring(highlight.start, highlight.end),
      category: highlight.category,
    });

    lastIndex = highlight.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return (
    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
      {segments.map((segment, idx) =>
        segment.type === 'highlight' ? (
          <span
            key={idx}
            style={{
              backgroundColor: segment.category?.includes('Vocabulary') ? '#fbbf24' : segment.category?.includes('Superficial') ? '#8b5cf6' : segment.category?.includes('Promotional') ? '#f43f5e' : segment.category?.includes('Outline') ? '#ef4444' : segment.category?.includes('Negative Parallelism') ? '#f97316' : segment.category?.includes('Vague Attribution') ? '#6366f1' : segment.category?.includes('Overgeneralization') ? '#06b6d4' : segment.category?.includes('Elegant Variation') ? '#10b981' : segment.category?.includes('False Ranges') ? '#eab308' : segment.category?.includes('Rare Word') ? '#8b5cf6' : '#ec4899',
              color: '#1e293b',
            }}
            className="font-semibold rounded px-1"
            title={segment.category}
          >
            {segment.content}
          </span>
        ) : (
          <span key={idx}>{segment.content}</span>
        ),
      )}
    </p>
  );
}

interface AnalysisData {
  text: string;
  wordCount: number;
  aiScore: number;
  timestamp: string;
  factors?: {
    vocabulary: number;
    readingGradeLevel: number;
    namedEntityDensity: number;
    paragraphCoherence: number;
    passiveVoiceFrequency: number;
    punctuationPatterns: number;
    rareWordUsage: number;
    sentenceLengthVariation: number;
    transitionWordDensity: number;
    wordFrequencyDistribution: number;
  };
  patterns?: Array<{
    category: string;
    phrase: string;
    count: number;
    score: number;
  }>;
  highlights?: Array<{
    start: number;
    end: number;
    factor: string;
    category: string;
  }>;
}

export default function AnalysisPage() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisData');
    if (stored) {
      setData(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">No Analysis Data</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Please go back and analyze some text first.</p>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getResultColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResultBg = (score: number) => {
    if (score < 30) return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
    if (score < 60) return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
  };

  const getResultLabel = (score: number) => {
    if (score < 30) return 'Likely Human-Written';
    if (score < 60) return 'Possibly AI-Generated';
    return 'Likely AI-Generated';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Analysis Results</h1>
        </div>

        {/* AI Score Card */}
        <div className={`rounded-lg border-2 p-8 mb-8 ${getResultBg(data.aiScore)}`}>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            {getResultLabel(data.aiScore)}
          </h2>
          <div className="flex items-baseline gap-2 mb-6">
            <span className={`text-6xl font-bold ${getResultColor(data.aiScore)}`}>
              {data.aiScore}%
            </span>
            <span className="text-slate-600 dark:text-slate-400">AI probability score</span>
          </div>

          {/* Score Bar */}
          <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                data.aiScore < 30
                  ? 'bg-green-600'
                  : data.aiScore < 60
                  ? 'bg-yellow-600'
                  : 'bg-red-600'
              }`}
              style={{ width: `${data.aiScore}%` }}
            />
          </div>
        </div>

        {/* Text Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2">Word Count</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{data.wordCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2">Character Count</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{data.text.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2">Avg Word Length</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {(data.text.length / data.wordCount).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Original Text with Highlights */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-8 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Original Text</h3>
          <div className="bg-slate-50 dark:bg-slate-800 rounded p-4 max-h-48 overflow-y-auto">
            {data.highlights && data.highlights.length > 0 ? (
              <HighlightedText text={data.text} highlights={data.highlights} />
            ) : (
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                {data.text}
              </p>
            )}
          </div>
          {data.highlights && data.highlights.length > 0 && (
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              <p className="mb-3 font-semibold">Detected factors:</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(data.highlights.map((h) => h.category).filter((c) => c !== 'Named Entity Density'))).map((category) => {
                   const bgColor = category?.includes('Vocabulary') ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' : category?.includes('Superficial') ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : category?.includes('Promotional') ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200' : category?.includes('Outline') ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : category?.includes('Negative Parallelism') ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' : category?.includes('Vague Attribution') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : category?.includes('Overgeneralization') ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200' : category?.includes('Elegant Variation') ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : category?.includes('False Ranges') ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200';
                  return (
                    <span
                      key={category}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}
                    >
                      {category}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Analysis Details */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-8 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Analysis Details</h3>
          <div className="space-y-4">
            {data.factors && (
              <>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 mt-4">Linguistic Factors</h4>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Lexical Diversity</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.vocabulary)}%</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${data.factors.vocabulary}%` }}
                    />
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Deviation from natural vocabulary range suggests artificial writing. Both unusually low and high diversity can indicate AI generation.
                  </div>
                </div>

                <div className="mt-4">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Reading Grade Level</span>
                     <span className="text-slate-900 dark:text-white font-semibold">{data.factors.readingGradeLevel?.toFixed(1) || 'N/A'}</span>
                   </div>
                   <div className="text-sm text-slate-500 dark:text-slate-400">
                     {data.factors.readingGradeLevel > 14 
                       ? '⚠️ College/graduate level suggests artificial complexity' 
                       : data.factors.readingGradeLevel >= 9 
                       ? 'High school level' 
                       : 'Elementary/middle school level'}
                   </div>
                 </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Named Entity Density</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.namedEntityDensity)}%</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-amber-600 rounded-full"
                      style={{ width: `${data.factors.namedEntityDensity}%` }}
                    />
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    High entity density with vague attributions or low density with confident claims may indicate hallucination risk
                  </div>
                </div>

                <div className="mt-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 dark:text-slate-400">Paragraph Coherence (Low = Human)</span>
                     <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.paragraphCoherence)}%</span>
                   </div>
                   <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                     <div
                       className="h-full bg-pink-600 rounded-full"
                       style={{ width: `${data.factors.paragraphCoherence}%` }}
                     />
                   </div>
                   <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                     Overly tight logical coherence between sentences suggests artificial writing
                   </div>
                 </div>

                 <div className="mt-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 dark:text-slate-400">Passive Voice Frequency</span>
                     <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.passiveVoiceFrequency)}%</span>
                   </div>
                   <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                     <div
                       className="h-full bg-violet-600 rounded-full"
                       style={{ width: `${data.factors.passiveVoiceFrequency}%` }}
                     />
                   </div>
                   <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                     Passive voice over 15% frequency suggests AI composition (humans use 5-10%)
                   </div>
                 </div>

                 <div className="mt-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 dark:text-slate-400">Punctuation Patterns</span>
                     <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.punctuationPatterns)}%</span>
                   </div>
                   <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                     <div
                       className="h-full bg-pink-600 rounded-full"
                       style={{ width: `${data.factors.punctuationPatterns}%` }}
                     />
                   </div>
                   <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                     High semicolon/em-dash density and low ellipsis usage suggests formal AI writing
                   </div>
                 </div>

                 <div className="mt-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 dark:text-slate-400">Rare Word Usage</span>
                     <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.rareWordUsage)}%</span>
                   </div>
                   <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                     <div
                       className="h-full bg-violet-600 rounded-full"
                       style={{ width: `${data.factors.rareWordUsage}%` }}
                     />
                   </div>
                   <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                     Excessive rare words (&gt;12% frequency) suggest artificial writing. Humans typically use rare words at 3-8% frequency.
                   </div>
                 </div>

                 <div className="mt-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 dark:text-slate-400">Sentence Length Variation (High = AI Signal)</span>
                     <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.sentenceLengthVariation)}%</span>
                   </div>
                   <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                     <div
                       className="h-full bg-orange-600 rounded-full"
                       style={{ width: `${data.factors.sentenceLengthVariation}%` }}
                     />
                   </div>
                   <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                     AI tends to produce sentences of similar length. Natural human writing varies between short and long sentences.
                   </div>
                 </div>

                 <div className="mt-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 dark:text-slate-400">Transition Word Density</span>
                     <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.transitionWordDensity)}%</span>
                   </div>
                   <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                     <div
                       className="h-full bg-pink-600 rounded-full"
                       style={{ width: `${data.factors.transitionWordDensity}%` }}
                     />
                   </div>
                   <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                     High density of formal discourse markers (furthermore, moreover, consequently) suggests artificial writing. Humans typically use formal transitions in fewer than 20% of sentences.
                   </div>
                 </div>

                 <div className="mt-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 dark:text-slate-400">Word Frequency Distribution</span>
                     <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.wordFrequencyDistribution)}%</span>
                   </div>
                   <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                     <div
                       className="h-full bg-purple-600 rounded-full"
                       style={{ width: `${data.factors.wordFrequencyDistribution}%` }}
                     />
                   </div>
                   <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                     Natural language follows Zipf's Law with varied word frequencies. Deviation from this pattern (unusually uniform or skewed distribution) suggests artificial generation.
                   </div>
                 </div>
                 </>
                 )}

            {data.patterns && data.patterns.length > 0 && (
              <>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">Pattern Detection</h4>
                {data.patterns.map((pattern, idx) => {
                    const barColor = pattern.category === 'AI Vocabulary' ? '#fbbf24' : pattern.category === 'Superficial Analysis' ? '#8b5cf6' : pattern.category === 'Promotional Language' ? '#f43f5e' : pattern.category === 'Outline Conclusion Pattern' ? '#ef4444' : pattern.category === 'Negative Parallelism' ? '#f97316' : pattern.category === 'Vague Attributions' ? '#6366f1' : pattern.category === 'Overgeneralization' ? '#06b6d4' : pattern.category === 'Elegant Variation' ? '#10b981' : pattern.category === 'False Ranges' ? '#eab308' : '#ec4899';
                    
                    const labelColor = pattern.category === 'AI Vocabulary' ? 'text-amber-700 dark:text-amber-300' : pattern.category === 'Superficial Analysis' ? 'text-purple-700 dark:text-purple-300' : pattern.category === 'Promotional Language' ? 'text-rose-700 dark:text-rose-300' : pattern.category === 'Outline Conclusion Pattern' ? 'text-red-700 dark:text-red-300' : pattern.category === 'Negative Parallelism' ? 'text-orange-700 dark:text-orange-300' : pattern.category === 'Vague Attributions' ? 'text-indigo-700 dark:text-indigo-300' : pattern.category === 'Overgeneralization' ? 'text-cyan-700 dark:text-cyan-300' : pattern.category === 'Elegant Variation' ? 'text-green-700 dark:text-green-300' : pattern.category === 'False Ranges' ? 'text-yellow-700 dark:text-yellow-300' : 'text-pink-700 dark:text-pink-300';
                  
                  return (
                    <div key={idx} className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`${labelColor} font-medium`}>{pattern.category}</span>
                        <span className="text-slate-900 dark:text-white font-semibold">{pattern.score}%</span>
                      </div>
                      <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="rounded-full"
                          style={{ 
                            width: `${pattern.score}%`,
                            backgroundColor: barColor,
                            height: '100%'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            <div className="flex justify-between items-center pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
              <span className="text-slate-600 dark:text-slate-400">Analyzed At</span>
              <span className="text-slate-900 dark:text-white font-semibold">
                {new Date(data.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-center transition-colors"
          >
            Analyze Another Text
          </Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`AI Writing Score: ${data.aiScore}%\n${data.text}`);
              alert('Results copied to clipboard!');
            }}
            className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Copy Results
          </button>
        </div>
      </div>
    </div>
  );
}
