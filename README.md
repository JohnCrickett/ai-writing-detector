![image](img/ai-writing-detector.jpg)

# AI Writing Detector

An open-source tool that detects AI-generated text by analyzing linguistic patterns and stylistic characteristics.

## How It Works

The detector combines two complementary analysis approaches:

### Linguistic Factors
- **Vocabulary diversity metrics**: Measures the range and sophistication of vocabulary used
- **Passive voice frequency analysis**: Detects overuse of passive constructions
- **Named entity density**: Analyzes the frequency of proper nouns and entities
- **Paragraph coherence**: Measures semantic consistency between sentences
- **Reading grade level**: Calculates text complexity using Flesch-Kincaid metrics
- **Sentence length variation**: Evaluates uniformity of sentence lengths
- **Transition word density**: Detects excessive use of formal discourse markers
- **Word frequency distribution**: Analyzes deviation from natural word frequency patterns
- **Punctuation patterns**: Identifies formal punctuation overuse (semicolons, em-dashes)
- **Rare word usage**: Detects excessive use of uncommon vocabulary

### Pattern Detection
The tool identifies common patterns found in AI-generated text:
- **AI vocabulary markers**: Specific words and phrases commonly used by AI language models (e.g., "delve into", "navigate", "robust")
- **Undue emphasis patterns**: Excessive use of emphasizing words, superlatives, and emphatic punctuation
- **Superficial analysis**: Vague significance claims and generic attributions lacking specificity
- **Promotional language**: Marketing superlatives and persuasive AI phrasing (e.g., "game-changer", "transformative")
- **Outline conclusion patterns**: Formulaic "Despite challenges... but also positive" structures
- **Negative parallelism**: Rigid structures like "not only... but also" and overly formal parallel constructions
- **Rule of three**: Repetitive triple-adjective/noun/verb patterns and rhetorical tripling
- **Vague attributions**: Appeals to "experts" or "industry reports" without concrete sources
- **Overgeneralization**: Claims that frame limited information as universal or exhaustive
- **Elegant variation**: Repetitive synonym substitution where the same entity has multiple equivalent references
- **False ranges**: "From...to" constructions without coherent scales or logical connections

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
