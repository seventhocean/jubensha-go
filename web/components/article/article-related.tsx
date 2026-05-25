"use client"

import * as React from "react"

import Link from "@/components/common/link"
import { apiFetch } from "@/lib/api/client"
import type { Article, PageData } from "@/lib/api/types"
import { prettyDate } from "@/lib/format"
import { useI18n } from "@/lib/i18n/provider"

export function ArticleRelated({ article }: { article: Article }) {
  const { t } = useI18n()
  const [related, setRelated] = React.useState<Article[]>([])

  React.useEffect(() => {
    if (!article.tags || article.tags.length === 0) return

    let cancelled = false

    async function fetchRelated() {
      const tagsToFetch = (article.tags || []).slice(0, 3)
      const promises = tagsToFetch.map((tag) =>
        apiFetch<PageData<Article>>("/api/article/tag/articles", {
          params: { tagId: tag.id },
        }).catch(() => ({ results: [], hasMore: false }) as PageData<Article>)
      )

      const results = await Promise.all(promises)
      if (cancelled) return

      const seen = new Set<number>()
      const merged: Article[] = []
      for (const page of results) {
        for (const item of page.results) {
          if (item.id === article.id) continue
          if (seen.has(item.id)) continue
          seen.add(item.id)
          merged.push(item)
          if (merged.length >= 5) break
        }
        if (merged.length >= 5) break
      }

      setRelated(merged)
    }

    void fetchRelated()
    return () => {
      cancelled = true
    }
  }, [article.id, article.tags])

  if (related.length === 0) return null

  return (
    <section className="rounded-lg bg-background p-3">
      <h3 className="mb-3 text-sm font-medium text-foreground">
        {t("pages.article.detail.related") || "Related Articles"}
      </h3>
      <ul className="space-y-2">
        {related.map((item) => (
          <li key={item.id}>
            <Link
              href={`/article/${item.id}`}
              className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
            >
              <span className="min-w-0 truncate text-foreground">
                {item.title}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {item.user?.nickname}
                {item.createTime ? ` · ${prettyDate(item.createTime, t)}` : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
