# Flesch-Kincaid Grade Level Detection

I now want to add detection using **Flesch-Kincaid Grade Level Analysis**. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details.

We're trying to detect: AI-generated text often maintains an artificially high reading grade level (college/graduate level) even when discussing simple topics. Human writers naturally modulate complexity based on context. AI tends to "sound professional" by default, using complex vocabulary and sentence structures for everyday subjects.

Example of issue:
- AI text: "The implementation of innovative methodologies facilitates the optimization of operational efficiency through systematic integration of technological paradigms."
- Human text: "Using new methods helps us work better and faster."

The detector should:
1. Calculate syllables per word and words per sentence
2. Apply Flesch-Kincaid Grade Level formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
3. Flag texts with grade level > 14 (college+) on simple topics as potential AI signals
4. Compare grade level against expected range for content type
