# Transition Word Density Detection

I now want to add detection using **Transition Word Density Analysis**. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details.

We're trying to detect: AI language models are trained to produce coherent, well-structured text and rely heavily on discourse markers (transition words) to create explicit logical connections. Human writers use transitions more sparingly—we often let ideas flow implicitly or use more conversational connectors. High density of formal transitions signals AI writing.

Example of issue:
- AI text: "Furthermore, this approach has merit. Additionally, the results demonstrate effectiveness. Moreover, the implications are significant. Consequently, further research is warranted."
- Human text: "This works. And the numbers back it up. So what now? Hard to say. Maybe more testing."

The detector should:
1. Identify transition words (furthermore, moreover, additionally, consequently, however, therefore, etc.)
2. Calculate transition density as (transition count / sentence count)
3. Flag texts with transition density > 0.4 (40% of sentences start with transitions) as potential AI signals
4. Distinguish between formal discourse markers and conversational connectors
