# Named Entity Density Detection

I now want to add detection using **Named Entity Density Analysis**. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details. It should not appear in the Pattern Detection section of the Analysis Details report.

We're trying to detect: AI models sometimes "hallucinate" or fabricate specific references—names, places, studies, organizations—to sound authoritative. Conversely, genuine human writing about familiar topics often lacks excessive named entities because humans assume shared context. AI may pack paragraphs with named entities to appear credible. Additionally, vague references combined with low named entity density suggests AI avoiding accountability.

Example of issue:
- AI text with hallucination: "According to research from the Institute of Advanced Computing Studies in Cambridge, Dr. James Robertson found in his 2023 paper..."
- Human text: "This is something I read about. Can't remember exactly where. But basically..."

The detector should:
1. Identify named entities (proper nouns: people, places, organizations, works)
2. Calculate named entity density as (named entity count / total words)
3. Flag texts with very high density (>0.08) combined with vague attributions as potential hallucination signals
4. Flag texts with very low density (<0.02) paired with confident claims as lack of specificity signals
