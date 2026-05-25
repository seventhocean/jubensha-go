/**
 * Estimate reading time for an HTML content string.
 * Accounts for both Chinese characters and English words separately.
 */
export function estimateReadingTime(htmlContent: string): number {
  // Strip HTML tags
  const text = htmlContent.replace(/<[^>]*>/g, "")

  // Count Chinese characters (CJK Unified Ideographs range)
  const chineseMatches = text.match(/[\u4e00-\u9fff]/g)
  const chineseChars = chineseMatches ? chineseMatches.length : 0

  // Remove Chinese characters and count remaining English words
  const remaining = text.replace(/[\u4e00-\u9fff]/g, " ")
  const englishWords = remaining
    .split(/\s+/)
    .filter((w) => w.length > 0).length

  // Chinese: 400 chars/min, English: 200 words/min
  const minutes = Math.ceil(chineseChars / 400 + englishWords / 200)
  return Math.max(1, minutes)
}
