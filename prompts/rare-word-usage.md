# Rare Word Usage Detection

I now want to add detection using **Rare Word Usage Analysis**. It should follow the patterns used for Named Entity Density and Reading Grade Level. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details. It should not appear in the Pattern Detection section of the Analysis Details report.

When detected it should be reported in the Linguistic Factors section of the Analysis details.

When detected it should be reported in the Linguistic Factors section of the Analysis details.

We're trying to detect: AI models have access to vast training datasets including academic papers, specialized texts, and technical documentation. This results in AI text using rare/obscure words (outside the top 5000 most common English words) at significantly higher rates than natural human writing. Humans tend to use common vocabulary with occasional specialty terms; AI "sounds smart" by default.

Example of issue:
- AI text: "The implementation of quantum encryption mechanisms necessitates unprecedented computational architecture augmentation."
- Human text: "You need better computers to make quantum encryption work."

The detector should:
1. Identify words outside the top 5000 most common English words
2. Calculate rare word frequency as (rare words / total words)
3. Flag texts with rare word frequency > 0.12 (12%+) as potential AI signals
4. Filter out legitimate specialty terms based on domain (e.g., medical terms in medical text)
