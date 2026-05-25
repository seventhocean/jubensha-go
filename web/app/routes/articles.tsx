"use client"

import * as React from "react"
import { useLoaderData } from "react-router"
import { LayoutGrid, List } from "lucide-react"

import { ArticleList } from "@/components/article/article-list"
import { EmptyState } from "@/components/common/empty-state"
import { LoadMore } from "@/components/common/load-more"
import { HomeAside } from "@/components/layout/home-aside"
import { MainShell } from "@/components/layout/main-shell"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/lib/api/client"
import type { Article, PageData } from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { localizedTitle, rootDataFromMatches, sitePageMeta } from "@/lib/seo"
import { useDocumentTitle } from "@/lib/use-document-title"

import { loadArticles } from "../route-helpers/loaders"

export { loader } from "../route-helpers/loaders"

export async function clientLoader() {
  return loadArticles({})
}

export function meta({
  location,
  matches,
}: {
  location: { pathname: string }
  matches: Array<{ data?: unknown; loaderData?: unknown }>
}) {
  const rootData = rootDataFromMatches(matches)
  return sitePageMeta(
    rootData?.config,
    localizedTitle(rootData?.locale, "Articles", "文章"),
    { canonicalPath: location.pathname }
  )
}

export default function ArticlesRoute() {
  const articles = useLoaderData() as PageData<Article>
  const { t } = useI18n()
  useDocumentTitle(t("pages.articles.title"))

  const [sortMode, setSortMode] = React.useState<
    "latest" | "hot" | "recommended"
  >("latest")

  const [viewMode, setViewMode] = React.useState<"card" | "list">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("article-view-mode")
      if (saved === "card" || saved === "list") return saved
    }
    return "card"
  })

  const handleViewModeChange = (mode: "card" | "list") => {
    setViewMode(mode)
    localStorage.setItem("article-view-mode", mode)
  }

  const loadPage = React.useCallback(
    ({ cursor }: { cursor: string }) =>
      apiFetch<PageData<Article>>("/api/article/articles", {
        params: { cursor, sort: sortMode },
      }),
    [sortMode]
  )

  return (
    <MainShell aside={<HomeAside />}>
      <div className="overflow-hidden rounded-lg bg-background">
        <div className="flex items-center justify-between border-b border-border/70 px-3 py-2 sm:px-4">
          <Tabs
            value={sortMode}
            onValueChange={(v) =>
              setSortMode(v as "latest" | "hot" | "recommended")
            }
          >
            <TabsList variant="line">
              <TabsTrigger value="latest">
                {t("pages.articles.tabs.latest")}
              </TabsTrigger>
              <TabsTrigger value="hot">
                {t("pages.articles.tabs.hot")}
              </TabsTrigger>
              <TabsTrigger value="recommended">
                {t("pages.articles.tabs.recommended")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleViewModeChange("card")}
              className={`rounded p-1.5 transition-colors ${
                viewMode === "card"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("pages.articles.viewMode.card")}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("list")}
              className={`rounded p-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("pages.articles.viewMode.list")}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        <LoadMore<Article>
          initialItems={sortMode === "latest" ? articles.results : []}
          initialCursor={sortMode === "latest" ? articles.cursor || "" : ""}
          initialHasMore={sortMode === "latest" ? articles.hasMore : true}
          initialLoad={sortMode !== "latest"}
          resetKey={`/api/article/articles?sort=${sortMode}`}
          labels={{
            loadMore: t("common.loadMore.loadMore"),
            noMore: t("common.loadMore.noMore"),
          }}
          loadPage={loadPage}
          renderItems={(items) => (
            <ArticleList articles={items} t={t} viewMode={viewMode} />
          )}
          renderEmpty={() => <EmptyState title={t("common.noData")} />}
        />
      </div>
    </MainShell>
  )
}
