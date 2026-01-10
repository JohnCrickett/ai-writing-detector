# AI Writing Detection - Color Scheme

## Pattern Detection Colors

Each detected pattern category has a consistent color used throughout the UI:

### AI Vocabulary
- **Color**: Amber (#fbbf24)
- **Where used**:
  - Text highlights in the original text
  - Pattern detection bar
  - Detected factors badge
  - Pattern category label

Words detected: additionally, align with, crucial, delve, emphasize, enduring, enhance, foster, garner, highlight, interplay, intricate, key, landscape, pivotal, showcase, tapestry, testament, underscore, valuable, vibrant

### Undue Emphasis
- **Color**: Pink (#ec4899)
- **Where used**:
  - Text highlights in the original text (both symbolism and media phrases)
  - Pattern detection bar
  - Detected factors badge
  - Pattern category label

Phrases detected:
- **Symbolism/Legacy**: stands as, serves as, is a testament to, plays a vital/significant/crucial/pivotal role, underscores, highlights, impactful, important to social cohesion, reflects broader, symbolizing, key turning point, promotes collaboration, indelible mark, deeply rooted, profound, revolutionary, reinforces, healthy relationship, steadfast dedication
- **Media/Attribution**: independent coverage, local/regional/national media outlets, [country] media outlets, music/business/tech outlets, leading expert, active social media presence

## Visual Consistency

- **Text highlights**: Each category uses its assigned color with dark text (slate-900)
- **Pattern detection bars**: Progress bar background matches the pattern category color
- **Category labels**: Text color matches the category, with appropriate dark mode variants
- **Detected factors**: Badges use the category color with transparent backgrounds
  - Amber - Light: amber-100, Dark: amber-900, Text Light: amber-800, Text Dark: amber-200
  - Pink - Light: pink-100, Dark: pink-900, Text Light: pink-800, Text Dark: pink-200

## Implementation

Colors are defined in:
- `lib/aiVocabulary.ts`: AI_VOCABULARY_COLOR
- `lib/undueEmphasis.ts`: UNDUE_EMPHASIS_COLOR
- `lib/aiDetector.ts`: Exports both color constants
- `app/analysis/page.tsx`: Uses colors in UI components
