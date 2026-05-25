"use client"

import type { Article } from "@/lib/api/types"

export function ArticleCoverHero({ article }: { article: Article }) {
  if (!article.cover?.url) return null

  return (
    <div className="aspect-[16/7] w-full overflow-hidden rounded-t-lg">
      <img
        src={article.cover.url}
        alt={article.title}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
