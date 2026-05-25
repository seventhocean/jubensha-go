const GRADIENTS = [
  "linear-gradient(135deg, #5e6ad2, #8b5cf6)",
  "linear-gradient(135deg, #e8725c, #f0a03c)",
  "linear-gradient(135deg, #f0a03c, #fbbf24)",
  "linear-gradient(135deg, #34d399, #5e6ad2)",
  "linear-gradient(135deg, #3b82f6, #6366f1)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
  "linear-gradient(135deg, #14b8a6, #22c55e)",
  "linear-gradient(135deg, #f97316, #ef4444)",
]

/**
 * Generates a deterministic gradient based on the article title.
 * Uses a simple hash (sum of char codes mod N) to select from predefined gradients.
 */
export function getArticleGradient(title: string): string {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash += title.charCodeAt(i)
  }
  return GRADIENTS[hash % GRADIENTS.length]
}
