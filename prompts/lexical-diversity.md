# Lexical Diversity Detection (Type-Token Ratio)

I now want to add detection using **Lexical Diversity Analysis**. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details.

We're trying to detect: AI models are trained on vast diverse corpora, which can result in texts that use more varied vocabulary than natural human writing. Conversely, some AI systems repetitively use the same mid-frequency words. The Type-Token Ratio (unique words / total words) can reveal whether vocabulary use is unnaturally consistent or sparse.

Example of issue:
- AI text: "The innovation paradigm offers transformative opportunities. The methodology facilitates comprehensive solutions. The framework enables strategic initiatives."
- Human text: "This new approach rocks. It works well. But honestly? It's nothing we haven't seen before."

The detector should:
1. Count unique words (types) vs. total words (tokens)
2. Calculate TTR = unique words / total words
3. Identify if TTR is unnaturally high (>0.65) or unnaturally low (<0.35)
4. Flag extreme values as potential AI signals
