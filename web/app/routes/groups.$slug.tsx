"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { Megaphone, Pin, ScrollText, Users } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"
import { UserAvatar } from "@/components/common/avatar"
import { LoadMore } from "@/components/common/load-more"
import { MainShell } from "@/components/layout/main-shell"
import { TopicListItem } from "@/components/topic/topic-list-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getGroup,
  getGroupMembers,
  getGroupStickyTopics,
  getGroupTopics,
  joinGroup,
  leaveGroup,
} from "@/lib/api/groups"
import type { GroupItem, GroupMember, Topic } from "@/lib/api/types"
import { prettyDate } from "@/lib/format"
import { useI18n } from "@/lib/i18n/provider"
import { useDocumentTitle } from "@/lib/use-document-title"

export async function loader() {
  return null
}

export async function clientLoader() {
  return null
}

function GroupSidebar({
  group,
  members,
  t,
}: {
  group: GroupItem
  members: GroupMember[]
  t: (key: string) => string
}) {
  return (
    <>
      {group.notice ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              {t("user.groups.announcement")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {group.notice}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {group.rules ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              {t("user.groups.rules")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {group.rules}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {members.length > 0 ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("user.groups.activeMembers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {members.slice(0, 10).map((member) => (
                <UserAvatar
                  key={member.id}
                  user={member.user}
                  size={32}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  )
}

export default function GroupDetailRoute() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  const [group, setGroup] = useState<GroupItem | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [cursor, setCursor] = useState<string>("")
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [stickyTopics, setStickyTopics] = useState<Topic[]>([])
  const [stickyLoaded, setStickyLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useDocumentTitle(group?.name)

  useEffect(() => {
    if (!slug) return
    getGroup(slug)
      .then((g) => setGroup(g))
      .finally(() => setLoading(false))
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
    getGroupMembers(group.id).then((data) => {
      if (data) {
        setMembers(data.results || [])
      }
    })
  }, [group])

  useEffect(() => {
    if (activeTab !== "pinned" || stickyLoaded || !group) return
    getGroupStickyTopics(group.id)
      .then((data) => {
        setStickyTopics(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setStickyTopics([])
      })
      .finally(() => setStickyLoaded(true))
  }, [activeTab, stickyLoaded, group])

  async function handleJoin() {
    if (!group) return
    if (group.joined) {
      await leaveGroup(group.id)
    } else {
      await joinGroup(group.id)
    }
    setGroup({
      ...group,
      joined: !group.joined,
      memberCount: group.joined
        ? group.memberCount - 1
        : group.memberCount + 1,
    })
  }

  if (loading) {
    return (
      <MainShell>
        <div className="p-8 text-center text-muted-foreground">
          Loading...
        </div>
      </MainShell>
    )
  }

  if (!group) {
    return (
      <MainShell>
        <EmptyState title={t("user.groups.not_found")} />
      </MainShell>
    )
  }

  const sidebar = (
    <GroupSidebar group={group} members={members} t={t} />
  )

  return (
    <MainShell aside={sidebar}>
      {/* Banner / Header */}
      <div className="relative mb-6 overflow-hidden rounded-lg">
        {group.banner ? (
          <div className="relative h-40 md:h-48">
            <img
              src={group.banner}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        ) : (
          <div className="h-40 md:h-48 bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex items-end gap-4">
            {group.icon ? (
              <img
                src={group.icon}
                alt={group.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-background shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted border-2 border-background shadow-lg flex items-center justify-center text-2xl text-muted-foreground">
                {group.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm truncate">
                {group.name}
              </h1>
              {group.description ? (
                <p className="text-sm text-white/80 line-clamp-1 mt-0.5">
                  {group.description}
                </p>
              ) : null}
              <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
                <span>
                  {group.memberCount} {t("user.groups.members")}
                </span>
                <span>
                  {group.topicCount} {t("user.groups.topics")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          to={`/topic/create?groupId=${group.id}&type=0`}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
        >
          <Pin className="h-4 w-4" />
          {t("user.groups.createPost")}
        </Link>
        <button
          type="button"
          onClick={handleJoin}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            group.joined
              ? "bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-600"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {group.joined ? t("user.groups.leave") : t("user.groups.join")}
        </button>
      </div>

      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="all">{t("user.groups.allPosts")}</TabsTrigger>
          <TabsTrigger value="pinned">{t("user.groups.pinned")}</TabsTrigger>
          <TabsTrigger value="about">{t("user.groups.about")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="rounded-lg bg-background">
            {topics.length === 0 ? (
              <EmptyState title={t("user.groups.no_topics")} />
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
                    results: data?.results || [],
                  }
                }}
                renderItems={(items) => (
                  <ul className="divide-y divide-border">
                    {items.map((topic) => (
                      <TopicListItem
                        key={topic.id}
                        topic={topic}
                        t={t}
                      />
                    ))}
                  </ul>
                )}
                renderEmpty={() => (
                  <EmptyState title={t("user.groups.no_topics")} />
                )}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="pinned">
          <div className="rounded-lg bg-background">
            {!stickyLoaded ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading...
              </div>
            ) : stickyTopics.length === 0 ? (
              <EmptyState title={t("user.groups.noPinnedTopics")} />
            ) : (
              <ul className="divide-y divide-border">
                {stickyTopics.map((topic) => (
                  <TopicListItem
                    key={topic.id}
                    topic={topic}
                    showSticky
                    t={t}
                  />
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="space-y-4">
            {/* Group Info */}
            <Card size="sm">
              <CardHeader>
                <CardTitle>{t("user.groups.groupInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t("user.groups.members")}
                    </dt>
                    <dd>{group.memberCount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t("user.groups.topics")}
                    </dt>
                    <dd>{group.topicCount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t("user.groups.createdAt")}
                    </dt>
                    <dd>{prettyDate(group.createTime, t)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainShell>
  )
}
