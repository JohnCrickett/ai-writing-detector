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
              backgroundColor: segment.category?.includes('Vocabulary') ? '#fbbf24' : segment.category?.includes('Superficial') ? '#8b5cf6' : segment.category?.includes('Promotional') ? '#14b8a6' : segment.category?.includes('Outline') ? '#ef4444' : '#ec4899',
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
    repetition: number;
    formalTone: number;
    sentenceVariety: number;
    vocabulary: number;
    structure: number;
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
                {Array.from(new Set(data.highlights.map((h) => h.category))).map((category) => {
                    const bgColor = category?.includes('Vocabulary') ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' : category?.includes('Superficial') ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : category?.includes('Promotional') ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200' : category?.includes('Outline') ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200';
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
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Word Repetition</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.repetition)}%</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${data.factors.repetition}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Formal Tone</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.formalTone)}%</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${data.factors.formalTone}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Sentence Variety (Low = AI)</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.sentenceVariety)}%</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${data.factors.sentenceVariety}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Vocabulary Diversity</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.vocabulary)}%</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${data.factors.vocabulary}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Structural Patterns</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{Math.round(data.factors.structure)}%</span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${data.factors.structure}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {data.patterns && data.patterns.length > 0 && (
              <>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">Pattern Detection</h4>
                {data.patterns.map((pattern, idx) => {
                    const barColor = pattern.category === 'AI Vocabulary' ? '#fbbf24' : pattern.category === 'Superficial Analysis' ? '#8b5cf6' : pattern.category === 'Promotional Language' ? '#14b8a6' : pattern.category === 'Outline Conclusion Pattern' ? '#ef4444' : '#ec4899';
                    
                    const labelColor = pattern.category === 'AI Vocabulary' ? 'text-amber-700 dark:text-amber-300' : pattern.category === 'Superficial Analysis' ? 'text-purple-700 dark:text-purple-300' : pattern.category === 'Promotional Language' ? 'text-teal-700 dark:text-teal-300' : pattern.category === 'Outline Conclusion Pattern' ? 'text-red-700 dark:text-red-300' : 'text-pink-700 dark:text-pink-300';
                  
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
