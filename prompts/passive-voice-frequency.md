# Passive Voice Frequency Detection

I now want to add detection using **Passive Voice Frequency Analysis**. It should follow the patterns used for Named Entity Density and Reading Grade Level. We should add some tests first.

When detected it should be reported in the Linguistic Factors section of the Analysis details. It should not appear in the Pattern Detection section of the Analysis Details report.

When detected it should be reported in the Linguistic Factors section of the Analysis details.

We're trying to detect: AI models are often trained on formal, academic, and professional datasets where passive voice is common. This causes AI to default to passive construction more often than natural human writing. While humans use passive voice (~5-10% of sentences), AI frequently uses it at higher rates (15%+), especially when active voice would be more natural.

Example of issue:
- AI text: "The analysis was conducted by the team. The findings were evaluated. The conclusions were reached. The recommendations were determined."
- Human text: "We analyzed the data. The numbers looked good. So we made these recommendations based on what we saw."

The detector should:
1. Identify passive voice constructions (auxiliary verb + past participle)
2. Calculate passive voice frequency as (passive sentences / total sentences)
3. Flag texts with passive frequency > 0.15 (15%+) as potential AI signals
4. Consider context—academic writing may legitimately have higher passive rates
