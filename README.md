![image](img/ai-writing-detector.jpg)

# AI Writing Detector

An open-source tool that detects AI-generated text by analyzing linguistic patterns and stylistic characteristics.

## How It Works

The detector combines two complementary analysis approaches:

### Linguistic Factors
- **Word repetition patterns**: Detects unusual frequency patterns in word usage
- **Formal tone detection**: Identifies overly formal or stilted language structure
- **Sentence variety analysis**: Evaluates the diversity of sentence lengths and structures
- **Vocabulary diversity metrics**: Measures the range and sophistication of vocabulary used
- **Structural pattern recognition**: Analyzes paragraph and content organization patterns

### Pattern Detection
The tool identifies common patterns found in AI-generated text:
- **AI vocabulary markers**: Specific words and phrases commonly used by AI language models
- **Undue emphasis patterns**: Excessive use of emphasizing words or phrases
- **Promotional language**: Patterns typical of marketing or persuasive AI outputs
- **Didactic disclaimers**: Common disclaimer phrases often found in AI responses
- **And 4 more detection categories**

Results are presented as a probability score along with detailed breakdowns of detected factors, helping users understand which characteristics suggest AI generation.

## References

1. [Linguistic Characteristics of AI-Generated Text: A Survey](https://arxiv.org/abs/2510.05136) - Terčon & Dobrovoljc (2025) - Comprehensive survey on linguistic features of AI-generated text, including analysis of formal style, vocabulary diversity, and repetitive patterns.

2. [Detecting AI-Generated Text: Detection Methods, Datasets, and Applications](https://www.sciencedirect.com/science/article/abs/pii/S1574013725000693) - ScienceDirect Review - Comprehensive examination of detection techniques, datasets, and evaluation frameworks for distinguishing human and machine-authored content.

3. [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) - Community-curated guide documenting observable characteristics commonly found in AI-generated text.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
