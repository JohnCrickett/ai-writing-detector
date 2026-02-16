# Paragraph Coherence Detection

I now want to add detection using **Paragraph Coherence Analysis** to the Linguistic Factors detection. It should follow the patterns used for Named Entity Density and Reading Grade Level. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details. It should not appear in the Pattern Detection section of the Analysis Details report.

We're trying to detect: AI-generated text often exhibits overly tight logical coherence within paragraphs, with each sentence building very predictably on the previous one. Human writing has more natural "breathing room" with tangential thoughts, asides, and non-linear progression. AI creates almost procedural coherence that reads as forced or unnatural.

Example of issue:
- AI text: "The first factor is crucial. This first factor leads to the second consideration. The second consideration enables the third outcome. The third outcome creates the overall result."
- Human text: "The first factor matters. Well, actually, sometimes. The second thing? Also important, but maybe not always. It depends on context."

The detector should:
1. Analyze sentence-to-sentence transitions within paragraphs
2. Measure semantic similarity between consecutive sentences using word overlap
3. Flag paragraphs with excessively high average similarity (>0.65) as overly coherent
4. Identify rigid progression patterns (A→B→C→D) that lack human-like digression
