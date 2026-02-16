# Sentence Length Variation Detection

I now want to add detection using **Sentence Length Variation Analysis**. It should follow the patterns used for Named Entity Density and Reading Grade Level. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details. It should not appear in the Pattern Detection section of the Analysis Details report.

We're trying to detect: AI-generated text often exhibits unnaturally consistent sentence lengths, whereas human writing naturally varies between short punchy sentences and longer complex ones. AI tends to fall into a narrow band of sentence length (commonly 15-25 words per sentence), creating a monotonous rhythm that signals machine generation.

Example of issue:
- AI text: "The technology has transformed the industry. The benefits are substantial. The adoption rates continue to grow. The future looks promising."
- Human text: "The tech industry changed overnight. But the real question is: why? Some think it's revolutionary. Others disagree."

The detector should:
1. Calculate average sentence length
2. Measure the standard deviation of sentence lengths
3. Identify if sentence length variation falls below a human-like threshold (typically std dev < 6 words or coefficient of variation < 0.35)
4. Flag excessively uniform sentence structure as a potential AI signal
