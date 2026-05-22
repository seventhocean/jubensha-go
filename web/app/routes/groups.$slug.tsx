"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"

import { EmptyState } from "@/components/common/empty-state"
import { LoadMore } from "@/components/common/load-more"
import { MainShell } from "@/components/layout/main-shell"
import { TopicListItem } from "@/components/topic/topic-list-item"
import { getGroup, getGroupTopics, joinGroup, leaveGroup } from "@/lib/api/groups"
import type { GroupItem, Topic } from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { useDocumentTitle } from "@/lib/use-document-title"

export async function loader() {
  return null
}

export async function clientLoader() {
  return null
}

export default function GroupDetailRoute() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  const [group, setGroup] = useState<GroupItem | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [cursor, setCursor] = useState<string>("")
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  useDocumentTitle(group?.name)

  useEffect(() => {
    if (!slug) return
    getGroup(slug).then((g) => setGroup(g)).finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!group) return
    getGroupTopics(group.id).then((data) => {
      if (data) {
        setTopics(data.results || [])
        setCursor(data.cursor || "")
        setHasMore(data.hasMore)
      }
    })
  }, [group])

  async function handleJoin() {
    if (!group) return
    if (group.joined) {
      await leaveGroup(group.id)
    } else {
      await joinGroup(group.id)
    }
    setGroup({ ...group, joined: !group.joined, memberCount: group.joined ? group.memberCount - 1 : group.memberCount + 1 })
  }

  if (loading) {
    return (
      <MainShell>
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      </MainShell>
    )
  }

  if (!group) {
    return (
      <MainShell>
        <EmptyState message={t("user.groups.not_found")} />
      </MainShell>
    )
  }

  return (
    <MainShell>
      <div className="container mx-auto p-4">
        <div className="rounded-lg border bg-card p-6 mb-6">
          <div className="flex items-center gap-4">
            {group.icon ? (
              <img src={group.icon} alt={group.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl text-muted-foreground">
                {group.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{group.name}</h1>
              {group.description ? (
                <p className="text-muted-foreground mt-1">{group.description}</p>
              ) : null}
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{group.memberCount} {t("user.groups.members")}</span>
                <span>{group.topicCount} {t("user.groups.topics")}</span>
              </div>
            </div>
            <Link
              to={`/topic/create?groupId=${group.id}&type=0`}
              className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90"
            >
              {t("user.groups.post")}
            </Link>
            <button
              type="button"
              onClick={handleJoin}
              className={`px-4 py-2 rounded-lg font-medium ${
                group.joined
                  ? "bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-600"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {group.joined ? t("user.groups.leave") : t("user.groups.join")}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-background">
          {topics.length === 0 ? (
            <EmptyState message={t("user.groups.no_topics")} />
          ) : (
            <LoadMore<Topic>
              initialItems={topics}
              initialCursor={cursor}
              initialHasMore={hasMore}
              initialLoad={false}
              resetKey={`/api/group/topics?groupId=${group.id}`}
              labels={{
                loadMore: t("common.loadMore.loadMore"),
                noMore: t("common.loadMore.noMore"),
                error: t("common.loadMore.error"),
              }}
              loadPage={async (c) => {
                const data = await getGroupTopics(group.id, c.cursor)
                return {
                  cursor: data?.cursor || "",
                  hasMore: data?.hasMore ?? false,
                  items: data?.results || [],
                }
              }}
              renderItems={(items) =>
                items.map((topic) => <TopicListItem key={topic.id} topic={topic} t={t} />)
              }
              renderEmpty={() => <EmptyState message={t("user.groups.no_topics")} />}
            />
          )}
        </div>
      </div>
    </MainShell>
  )
}
