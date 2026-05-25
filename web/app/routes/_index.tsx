import * as React from "react"
import { useLoaderData } from "react-router"
import type { ShouldRevalidateFunctionArgs } from "react-router"
import { ChevronDown } from "lucide-react"

import { ArticleList } from "@/components/article/article-list"
import { EmptyState } from "@/components/common/empty-state"
import { LoadMore } from "@/components/common/load-more"
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
    return null
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
              params: { groupId: activeGroupId, cursor },
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

export function TopicListRoute({ title }: { title?: string }) {
  const { topics, nodes } = useLoaderData() as TopicListRouteData
  const { t } = useI18n()
  useDocumentTitle(title)

  const [activeTab, setActiveTab] = React.useState<TabValue>("all")
  const [sortMode, setSortMode] = React.useState<SortMode>("latest")

  const showSort = activeTab === "all" || activeTab === "articles"

  return (
    <MainShell aside={<HomeAside />}>
      <div className="topics-wrapper">
        <TopicsNavContent initialNodes={nodes} />
        <div className="topics-main">
          <div className="rounded-[var(--rounded-lg)] bg-[var(--color-surface-1)] shadow-[var(--shadow-sm)] dark:shadow-none dark:border dark:border-[var(--color-hairline)]">
            <div className="flex items-center justify-between border-b border-border/70 px-3 py-2 sm:px-4">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as TabValue)}
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
                    <DropdownMenuItem onClick={() => setSortMode("latest")}>
                      {t("pages.home.sort.latest")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortMode("hottest")}>
                      {t("pages.home.sort.hottest")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {activeTab === "all" && (
              <LoadMore<Topic>
                initialItems={sortMode === "latest" ? topics.results : []}
                initialCursor={
                  sortMode === "latest" ? topics.cursor || "" : ""
                }
                initialHasMore={
                  sortMode === "latest" ? topics.hasMore : true
                }
                initialLoad={sortMode !== "latest"}
                resetKey={`/api/topic/topics?sort=${sortMode}`}
                labels={{
                  loadMore: t("common.loadMore.loadMore"),
                  noMore: t("common.loadMore.noMore"),
                }}
                loadPage={({ cursor }) =>
                  apiFetch<PageData<Topic>>("/api/topic/topics", {
                    params: { cursor },
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
            )}

            {activeTab === "following" && (
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
                    params: { cursor, nodeId: -2 },
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
