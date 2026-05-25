import * as React from "react"
import { useLoaderData, useSearchParams } from "react-router"
import type { ShouldRevalidateFunctionArgs } from "react-router"
import { ChevronDown } from "lucide-react"

import { useAppState } from "@/components/app/app-provider"
import { ArticleList, ArticleListItem } from "@/components/article/article-list"
import { EmptyState } from "@/components/common/empty-state"
import Link from "@/components/common/link"
import { LoadMore } from "@/components/common/load-more"
import { TopicListSkeleton } from "@/components/common/skeleton-list"
import { HomeAside } from "@/components/layout/home-aside"
import { MainShell } from "@/components/layout/main-shell"
import { TopicListItem } from "@/components/topic/topic-list-item"
import { TopicsNavContent } from "@/components/topic/topics-nav-content"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/lib/api/client"
import type { Article, GroupItem, PageData, Topic } from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { rootDataFromMatches, siteHomeMeta } from "@/lib/seo"
import { useDocumentTitle } from "@/lib/use-document-title"

import {
  loadTopicListRouteData,
  type TopicListRouteData,
} from "../route-helpers/loaders"

export { loader } from "../route-helpers/loaders"

export function shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
  if (currentUrl.pathname === nextUrl.pathname && currentUrl.search === nextUrl.search) {
    return false
  }
  return defaultShouldRevalidate
}

export async function clientLoader() {
  return loadTopicListRouteData()
}

export function meta({
  matches,
}: {
  matches: Array<{ data?: unknown; loaderData?: unknown }>
}) {
  return siteHomeMeta(rootDataFromMatches(matches)?.config)
}

type TabValue = "all" | "following" | "groups" | "articles"
type SortMode = "latest" | "hottest"

// Mixed feed types
type FeedItem = (Topic & { feedType: "topic" }) | (Article & { feedType: "article" })

interface MixedCursor {
  tc: string
  ac: string
}

function parseMixedCursor(cursor: string): MixedCursor {
  if (!cursor) return { tc: "", ac: "" }
  try {
    return JSON.parse(cursor) as MixedCursor
  } catch {
    return { tc: "", ac: "" }
  }
}

function GroupsTabContent({
  sortMode,
  t,
}: {
  sortMode: SortMode
  t: ReturnType<typeof useI18n>["t"]
}) {
  const [groups, setGroups] = React.useState<GroupItem[]>([])
  const [activeGroupId, setActiveGroupId] = React.useState<number | null>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    apiFetch<GroupItem[]>("/api/group/navs")
      .then((data) => {
        if (mounted) {
          setGroups(data)
          if (data.length > 0) {
            setActiveGroupId(data[0].id)
          }
          setLoaded(true)
        }
      })
      .catch(() => {
        if (mounted) setLoaded(true)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (!loaded) {
    return <TopicListSkeleton />
  }

  if (groups.length === 0) {
    return <EmptyState title={t("common.noData")} />
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto border-b border-border/50 px-3 py-2">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveGroupId(group.id)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm transition-colors ${
              activeGroupId === group.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>
      {activeGroupId != null && (
        <LoadMore<Topic>
          key={activeGroupId}
          initialItems={[]}
          initialCursor=""
          initialHasMore={true}
          initialLoad={true}
          resetKey={`/api/group/topics?groupId=${activeGroupId}&sort=${sortMode}`}
          labels={{
            loadMore: t("common.loadMore.loadMore"),
            noMore: t("common.loadMore.noMore"),
          }}
          loadPage={({ cursor }) =>
            apiFetch<PageData<Topic>>("/api/group/topics", {
              params: { groupId: activeGroupId, cursor, sort: sortMode },
            })
          }
          renderItems={(items) => (
            <ul className="divide-y divide-border">
              {items.map((topic) => (
                <TopicListItem key={topic.id} topic={topic} showSticky t={t} />
              ))}
            </ul>
          )}
          renderEmpty={() => <EmptyState title={t("common.noData")} />}
        />
      )}
    </div>
  )
}

// Creates a load-page function for the mixed feed (All tab).
// Fires two parallel requests (topics + articles) intentionally to merge both
// content types into a single chronological feed.
function createMixedFeedLoadPage(sortMode: SortMode, topicParams?: Record<string, unknown>) {
  return async ({ cursor }: { cursor: string }): Promise<PageData<FeedItem>> => {
    const { tc, ac } = parseMixedCursor(cursor)

    const [topicData, articleData] = await Promise.all([
      apiFetch<PageData<Topic>>("/api/topic/topics", {
        params: { cursor: tc, sort: sortMode, ...topicParams },
      }).catch((): PageData<Topic> => ({ results: [], hasMore: false, cursor: "" })),
      apiFetch<PageData<Article>>("/api/article/articles", {
        params: { cursor: ac, sort: sortMode },
      }).catch((): PageData<Article> => ({ results: [], hasMore: false, cursor: "" })),
    ])

    const taggedTopics: FeedItem[] = (topicData.results || []).map((t) => ({
      ...t,
      feedType: "topic" as const,
    }))
    const taggedArticles: FeedItem[] = (articleData.results || []).map((a) => ({
      ...a,
      feedType: "article" as const,
    }))

    const merged = [...taggedTopics, ...taggedArticles].sort((a, b) => {
      const timeA = a.createTime ?? 0
      const timeB = b.createTime ?? 0
      return timeB - timeA
    })

    const newCursor = JSON.stringify({
      tc: topicData.cursor || "",
      ac: articleData.cursor || "",
    })

    return {
      results: merged,
      hasMore: Boolean(topicData.hasMore) || Boolean(articleData.hasMore),
      cursor: newCursor,
    }
  }
}

function MixedFeedItems({ items, t }: { items: FeedItem[]; t: ReturnType<typeof useI18n>["t"] }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        if (item.feedType === "topic") {
          return <TopicListItem key={`topic-${item.id}`} topic={item} showSticky t={t} />
        }
        return <ArticleListItem key={`article-${item.id}`} article={item} t={t} />
      })}
    </ul>
  )
}

export function TopicListRoute({ title }: { title?: string }) {
  const { nodes } = useLoaderData() as TopicListRouteData
  const { t } = useI18n()
  const { currentUser } = useAppState()
  useDocumentTitle(title)

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get("tab") || "all") as TabValue
  const sortMode = (searchParams.get("sort") || "latest") as SortMode
  const typeParam = searchParams.get("type")

  const handleTabChange = React.useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set("tab", value)
        if (value === "groups") {
          next.delete("sort")
        }
        return next
      })
    },
    [setSearchParams]
  )

  const handleSortChange = React.useCallback(
    (value: SortMode) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set("sort", value)
        return next
      })
    },
    [setSearchParams]
  )

  const showSort = activeTab === "all" || activeTab === "articles"

  const allFeedLoadPage = React.useMemo(
    () => createMixedFeedLoadPage(sortMode, typeParam ? { type: typeParam } : undefined),
    [sortMode, typeParam]
  )

  return (
    <MainShell aside={<HomeAside />}>
      <div className="topics-wrapper">
        <TopicsNavContent initialNodes={nodes} />
        <div className="topics-main">
          <div className="rounded-[var(--rounded-lg)] bg-[var(--color-surface-1)] shadow-[var(--shadow-sm)] dark:shadow-none dark:border dark:border-[var(--color-hairline)]">
            <div className="flex items-center justify-between border-b border-border/70 px-3 py-2 sm:px-4">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
              >
                <TabsList variant="line">
                  <TabsTrigger value="all">
                    {t("pages.home.tabs.all")}
                  </TabsTrigger>
                  <TabsTrigger value="following">
                    {t("pages.home.tabs.following")}
                  </TabsTrigger>
                  <TabsTrigger value="groups">
                    {t("pages.home.tabs.groups")}
                  </TabsTrigger>
                  <TabsTrigger value="articles">
                    {t("pages.home.tabs.articles")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {showSort && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-sm">
                      {sortMode === "latest"
                        ? t("pages.home.sort.latest")
                        : t("pages.home.sort.hottest")}
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSortChange("latest")}>
                      {t("pages.home.sort.latest")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("hottest")}>
                      {t("pages.home.sort.hottest")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {activeTab === "all" && (
              <LoadMore<FeedItem>
                initialItems={[]}
                initialCursor=""
                initialHasMore={true}
                initialLoad={true}
                resetKey={`mixed-feed-all?sort=${sortMode}`}
                labels={{
                  loadMore: t("common.loadMore.loadMore"),
                  noMore: t("common.loadMore.noMore"),
                }}
                loadPage={allFeedLoadPage}
                renderItems={(items) => <MixedFeedItems items={items} t={t} />}
                renderEmpty={() => <EmptyState title={t("common.noData")} />}
              />
            )}

            {/* NOTE: The "Following" tab currently only shows followed topics (nodeId=-2).
               The backend API does not support filtering articles by followed users.
               To include followed users' articles here, a dedicated backend endpoint
               (e.g., /api/article/articles?followed=true) would need to be implemented. */}
            {activeTab === "following" && (
              currentUser ? (
                <LoadMore<Topic>
                  initialItems={[]}
                  initialCursor=""
                  initialHasMore={true}
                  initialLoad={true}
                  resetKey={`/api/topic/topics?nodeId=-2&sort=${sortMode}`}
                  labels={{
                    loadMore: t("common.loadMore.loadMore"),
                    noMore: t("common.loadMore.noMore"),
                  }}
                  loadPage={({ cursor }) =>
                    apiFetch<PageData<Topic>>("/api/topic/topics", {
                      params: { cursor, nodeId: -2, sort: sortMode },
                    })
                  }
                  renderItems={(items) => (
                    <ul className="divide-y divide-border">
                      {items.map((topic) => (
                        <TopicListItem
                          key={topic.id}
                          topic={topic}
                          showSticky
                          t={t}
                        />
                      ))}
                    </ul>
                  )}
                  renderEmpty={() => <EmptyState title={t("common.noData")} />}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <p className="text-muted-foreground">{t("common.pleaseSignIn")}</p>
                  <Link
                    href="/user/signin?redirect=%2F%3Ftab%3Dfollowing"
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {t("common.header.login")}
                  </Link>
                </div>
              )
            )}

            {activeTab === "groups" && (
              <GroupsTabContent sortMode={sortMode} t={t} />
            )}

            {activeTab === "articles" && (
              <LoadMore<Article>
                initialItems={[]}
                initialCursor=""
                initialHasMore={true}
                initialLoad={true}
                resetKey={`/api/article/articles?sort=${sortMode}`}
                labels={{
                  loadMore: t("common.loadMore.loadMore"),
                  noMore: t("common.loadMore.noMore"),
                }}
                loadPage={({ cursor }) =>
                  apiFetch<PageData<Article>>("/api/article/articles", {
                    params: { cursor, sort: sortMode },
                  })
                }
                renderItems={(items) => (
                  <ArticleList articles={items} t={t} />
                )}
                renderEmpty={() => <EmptyState title={t("common.noData")} />}
              />
            )}
          </div>
        </div>
      </div>
    </MainShell>
  )
}

export default function IndexRoute() {
  return <TopicListRoute />
}
