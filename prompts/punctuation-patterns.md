# Punctuation Patterns Detection

I now want to add detection using **Punctuation Patterns Analysis**. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details.

We're trying to detect: AI and human writers have distinct punctuation habits. AI tends to use semicolons and em-dashes more frequently (learned from formal/academic training data), rarely uses ellipses casually, and maintains consistent spacing/formatting. Human writing shows more erratic punctuation, uses ellipses conversationally, sometimes omits punctuation in casual contexts, and varies spacing. Analyzing punctuation patterns can reveal machine generation.

Example of issue:
- AI text: "The research indicates three key findings; first, the results demonstrate significance. Additionally, the implications warrant further study—a fact that bears consideration. Finally, conclusions emerge clearly."
- Human text: "So there are three things... first, it works. Second, it matters. And third... well, we'll need more data."

The detector should:
1. Count usage of semicolons, em-dashes, ellipses, exclamation marks
2. Calculate punctuation ratios relative to sentence count
3. Flag texts with semicolon density > 0.05 or em-dash density > 0.08 as potential AI signals
4. Flag texts with very low ellipsis usage (<0.01) despite conversational tone
5. Measure consistency of punctuation usage across paragraphs
