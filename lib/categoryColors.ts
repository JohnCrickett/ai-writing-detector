/**
 * Category color mapping utility for consistent styling across the application
 */

interface CategoryStyle {
  bg: string;
  text: string;
  textDark: string;
  bar: string;
  badge: string;
  badgeDark: string;
}

export const CATEGORY_COLORS: Record<string, CategoryStyle> = {
  'AI Vocabulary': {
    bg: '#fbbf24',
    text: 'text-amber-700',
    textDark: 'text-amber-300',
    bar: '#fbbf24',
    badge: 'bg-amber-100 text-amber-800',
    badgeDark: 'dark:bg-amber-900 dark:text-amber-200',
  },
  'Superficial Analysis': {
    bg: '#8b5cf6',
    text: 'text-purple-700',
    textDark: 'text-purple-300',
    bar: '#8b5cf6',
    badge: 'bg-purple-100 text-purple-800',
    badgeDark: 'dark:bg-purple-900 dark:text-purple-200',
  },
  'Promotional Language': {
    bg: '#f43f5e',
    text: 'text-rose-700',
    textDark: 'text-rose-300',
    bar: '#f43f5e',
    badge: 'bg-rose-100 text-rose-800',
    badgeDark: 'dark:bg-rose-900 dark:text-rose-200',
  },
  'Outline Conclusion Pattern': {
    bg: '#ef4444',
    text: 'text-red-700',
    textDark: 'text-red-300',
    bar: '#ef4444',
    badge: 'bg-red-100 text-red-800',
    badgeDark: 'dark:bg-red-900 dark:text-red-200',
  },
  'Negative Parallelism': {
    bg: '#f97316',
    text: 'text-orange-700',
    textDark: 'text-orange-300',
    bar: '#f97316',
    badge: 'bg-orange-100 text-orange-800',
    badgeDark: 'dark:bg-orange-900 dark:text-orange-200',
  },
  'Vague Attributions': {
    bg: '#6366f1',
    text: 'text-indigo-700',
    textDark: 'text-indigo-300',
    bar: '#6366f1',
    badge: 'bg-indigo-100 text-indigo-800',
    badgeDark: 'dark:bg-indigo-900 dark:text-indigo-200',
  },
  'Overgeneralization': {
    bg: '#06b6d4',
    text: 'text-cyan-700',
    textDark: 'text-cyan-300',
    bar: '#06b6d4',
    badge: 'bg-cyan-100 text-cyan-800',
    badgeDark: 'dark:bg-cyan-900 dark:text-cyan-200',
  },
  'Elegant Variation': {
    bg: '#10b981',
    text: 'text-green-700',
    textDark: 'text-green-300',
    bar: '#10b981',
    badge: 'bg-green-100 text-green-800',
    badgeDark: 'dark:bg-green-900 dark:text-green-200',
  },
  'False Ranges': {
    bg: '#eab308',
    text: 'text-yellow-700',
    textDark: 'text-yellow-300',
    bar: '#eab308',
    badge: 'bg-yellow-100 text-yellow-800',
    badgeDark: 'dark:bg-yellow-900 dark:text-yellow-200',
  },
  'Undue Emphasis': {
    bg: '#ec4899',
    text: 'text-pink-700',
    textDark: 'text-pink-300',
    bar: '#ec4899',
    badge: 'bg-pink-100 text-pink-800',
    badgeDark: 'dark:bg-pink-900 dark:text-pink-200',
  },
  'Rule of Three': {
    bg: '#ec4899',
    text: 'text-pink-700',
    textDark: 'text-pink-300',
    bar: '#ec4899',
    badge: 'bg-pink-100 text-pink-800',
    badgeDark: 'dark:bg-pink-900 dark:text-pink-200',
  },
  'Rare Word Usage': {
    bg: '#8b5cf6',
    text: 'text-purple-700',
    textDark: 'text-purple-300',
    bar: '#8b5cf6',
    badge: 'bg-purple-100 text-purple-800',
    badgeDark: 'dark:bg-purple-900 dark:text-purple-200',
  },
};

const DEFAULT_STYLE: CategoryStyle = {
  bg: '#ec4899',
  text: 'text-pink-700',
  textDark: 'text-pink-300',
  bar: '#ec4899',
  badge: 'bg-pink-100 text-pink-800',
  badgeDark: 'dark:bg-pink-900 dark:text-pink-200',
};

export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_COLORS[category] ?? DEFAULT_STYLE;
}

export function getCategoryBgColor(category: string): string {
  return getCategoryStyle(category).bg;
}

export function getCategoryBarColor(category: string): string {
  return getCategoryStyle(category).bar;
}

export function getCategoryTextClass(category: string): string {
  const style = getCategoryStyle(category);
  return `${style.text} dark:${style.textDark}`;
}

export function getCategoryBadgeClass(category: string): string {
  const style = getCategoryStyle(category);
  return `${style.badge} ${style.badgeDark}`;
}

export function getHighlightBgColor(category: string): string {
  if (category.includes('Vocabulary')) return '#fbbf24';
  if (category.includes('Superficial')) return '#8b5cf6';
  if (category.includes('Promotional')) return '#f43f5e';
  if (category.includes('Outline')) return '#ef4444';
  if (category.includes('Negative Parallelism')) return '#f97316';
  if (category.includes('Vague Attribution')) return '#6366f1';
  if (category.includes('Overgeneralization')) return '#06b6d4';
  if (category.includes('Elegant Variation')) return '#10b981';
  if (category.includes('False Ranges')) return '#eab308';
  if (category.includes('Rare Word')) return '#8b5cf6';
  return '#ec4899';
}
