import Link from "@/components/common/link"

import type { Article } from "@/lib/api/types"

export function ArticleTags({ article }: { article: Article }) {
  const tags = article.tags || []
  if (!tags.length) return null

  return (
    <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/articles/tag/${tag.id}`}
          className="inline-flex items-center justify-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  )
}
