# Word Frequency Distribution Detection

I now want to add detection using **Word Frequency Distribution Analysis**. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details.

We're trying to detect: Natural language follows Zipf's Law—word frequencies follow a power-law distribution where the most common word appears roughly twice as often as the second most common, three times as often as the third, etc. AI text sometimes deviates from this natural distribution, showing either flatter distributions (more uniformly used words) or more skewed distributions (over-reliance on a few common words). Deviations signal potential AI generation.

Example of issue:
- AI text may show: The word "the" at 6%, "and" at 5%, "to" at 4%, "that" at 3%... (too uniform)
- Human text shows: The word "the" at 7-8%, sharp drop-off to "and" at 3-4%, then steeper decline

The detector should:
1. Tokenize text and count word frequencies
2. Calculate expected Zipfian distribution for the text length
3. Compare actual distribution to expected using chi-squared or similar metric
4. Flag texts with distribution deviations > threshold as potential AI signals
5. Ignore stopwords if desired, focus on content words
