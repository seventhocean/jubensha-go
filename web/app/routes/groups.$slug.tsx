"use client"

import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router"
import { Crown, Loader2, Megaphone, Pin, ScrollText, Settings, Shield, Users, CalendarCheck } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

import { useAppConfig, useCurrentUser } from "@/components/app/app-provider"
import { EmptyState } from "@/components/common/empty-state"
import { UserAvatar } from "@/components/common/avatar"
import { LoadMore } from "@/components/common/load-more"
import { GroupDetailSkeleton } from "@/components/common/skeleton-list"
import { MainShell } from "@/components/layout/main-shell"
import { TopicListItem } from "@/components/topic/topic-list-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getGroupCheckInRank,
  getGroupHotTopics,
  getGroupMembers,
  getGroupTopics,
  getGroupPage,
  groupCheckIn,
  joinGroup,
  kickMember,
  leaveGroup,
  setMemberRole,
} from "@/lib/api/groups"
import type { GroupCheckInRankItem, GroupCheckInStatus, GroupItem, GroupMember, Topic } from "@/lib/api/types"
import { prettyDate } from "@/lib/format"
import { useI18n } from "@/lib/i18n/provider"
import { buildSigninHref } from "@/lib/toast"
import { useDocumentTitle } from "@/lib/use-document-title"

export async function loader() {
  return null
}

export async function clientLoader() {
  return null
}

function RoleBadge({ role, t }: { role?: number; t: (key: string) => string }) {
  if (role === 2) {
    return (
      <span title={t("user.groups.owner")}>
        <Crown className="h-3 w-3 text-amber-500" />
      </span>
    )
  }
  if (role === 1) {
    return (
      <span title={t("user.groups.adminRole")}>
        <Shield className="h-3 w-3 text-[var(--color-primary)]" />
      </span>
    )
  }
  return null
}

function GroupSidebar({
  group,
  members,
  t,
  canManage,
  onManageMembers,
  checkInRank,
}: {
  group: GroupItem
  members: GroupMember[]
  t: (key: string) => string
  canManage: boolean
  onManageMembers: () => void
  checkInRank: GroupCheckInRankItem[]
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
                <div key={member.id} className="relative">
                  <UserAvatar
                    user={member.user}
                    size={32}
                  />
                  {(member.role === 2 || member.role === 1) ? (
                    <span className="absolute -top-1 -right-1">
                      <RoleBadge role={member.role} t={t} />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            {canManage ? (
              <button
                type="button"
                onClick={onManageMembers}
                className="mt-3 text-xs text-primary hover:underline"
              >
                {t("user.groups.manageMembers")}
              </button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {checkInRank.length > 0 ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              {t("user.groups.checkInRank")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {checkInRank.map((item, index) => (
                <div key={item.user.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                  <UserAvatar user={item.user} size={24} />
                  <span className="text-sm truncate flex-1">
                    {item.user.nickname || item.user.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.consecutiveDays} {t("user.groups.days")}
                  </span>
                </div>
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
  const currentUser = useCurrentUser()
  const config = useAppConfig()
  const navigate = useNavigate()
  const [group, setGroup] = useState<GroupItem | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [cursor, setCursor] = useState<string>("")
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [stickyTopics, setStickyTopics] = useState<Topic[]>([])
  const [stickyLoaded, setStickyLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isJoining, setIsJoining] = useState(false)
  const [sort, setSort] = useState("latest")
  const [hotTopics, setHotTopics] = useState<Topic[]>([])
  const [hotLoaded, setHotLoaded] = useState(false)
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [allMembers, setAllMembers] = useState<GroupMember[]>([])
  const [membersCursor, setMembersCursor] = useState<string>("")
  const [membersHasMore, setMembersHasMore] = useState(false)
  const [membersLoading, setMembersLoading] = useState(false)
  const [checkInStatus, setCheckInStatus] = useState<GroupCheckInStatus | null>(null)
  const [checkInRank, setCheckInRank] = useState<GroupCheckInRankItem[]>([])
  const [checkingIn, setCheckingIn] = useState(false)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)

  const canManage = !!(group?.canManage)

  useDocumentTitle(group?.name)

  useEffect(() => {
    if (!slug) return
    getGroupPage(slug)
      .then((data) => {
        if (data) {
          setGroup(data.group)
          setTopics(data.topics.results || [])
          setCursor(data.topics.cursor || "")
          setHasMore(data.topics.hasMore)
          setStickyTopics(Array.isArray(data.stickyTopics) ? data.stickyTopics : [])
          setStickyLoaded(true)
          setMembers(data.members.results || [])
          setCheckInRank(Array.isArray(data.checkinRank) ? data.checkinRank : [])
          if (data.checkinStatus) {
            setCheckInStatus(data.checkinStatus)
          }
        }
      })
      .catch(() => {
        setGroup(null)
      })
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!group || sort === "latest") return
    getGroupTopics(group.id, undefined, sort).then((data) => {
      if (data) {
        setTopics(data.results || [])
        // For non-ID sorts, cursor represents next page number (starting at 1)
        if (sort === "most_replies" || sort === "most_active") {
          setCursor("1")
        } else {
          setCursor(data.cursor || "")
        }
        setHasMore(data.hasMore)
      }
    })
  }, [group, sort])

  // hotLoaded prevents re-fetching the hot topics list on every tab switch within a session.
  // This is intentional: hot topics are a ranked snapshot and do not need real-time updates
  // during a single page visit. Users can reload the page to get fresh rankings.
  useEffect(() => {
    if (activeTab !== "hot" || hotLoaded || !group) return
    getGroupHotTopics(group.id)
      .then((data) => {
        setHotTopics(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setHotTopics([])
      })
      .finally(() => setHotLoaded(true))
  }, [activeTab, hotLoaded, group])

  function handleManageMembers() {
    if (!group) return
    setShowManageMembers(true)
    setMembersLoading(true)
    getGroupMembers(group.id).then((data) => {
      if (data) {
        setAllMembers(data.results || [])
        setMembersCursor(data.cursor || "")
        setMembersHasMore(data.hasMore)
      }
    }).finally(() => setMembersLoading(false))
  }

  async function handleLoadMoreMembers() {
    if (!group || !membersHasMore || membersLoading) return
    setMembersLoading(true)
    try {
      const data = await getGroupMembers(group.id, membersCursor)
      if (data) {
        setAllMembers((prev) => [...prev, ...(data.results || [])])
        setMembersCursor(data.cursor || "")
        setMembersHasMore(data.hasMore)
      }
    } finally {
      setMembersLoading(false)
    }
  }

  async function handleSetRole(userId: string, role: number) {
    if (!group) return
    try {
      await setMemberRole(group.id, userId, role)
      toast.success(t("user.groups.roleUpdated"))
      setAllMembers((prev) =>
        prev.map((m) =>
          m.user.id === userId ? { ...m, role } : m
        )
      )
      setMembers((prev) =>
        prev.map((m) =>
          m.user.id === userId ? { ...m, role } : m
        )
      )
    } catch {
      toast.error(t("user.groups.operationFailed"))
    }
  }

  async function handleKickMember(userId: string) {
    if (!group) return
    if (!confirm(t("user.groups.kickConfirm"))) return
    try {
      await kickMember(group.id, userId)
      toast.success(t("user.groups.memberKicked"))
      setAllMembers((prev) => prev.filter((m) => m.user.id !== userId))
      setMembers((prev) => prev.filter((m) => m.user.id !== userId))
      setGroup({ ...group, memberCount: group.memberCount - 1 })
    } catch {
      toast.error(t("user.groups.operationFailed"))
    }
  }

  async function handleCheckIn() {
    if (!currentUser) {
      navigate(buildSigninHref(`/groups/${slug}`))
      return
    }
    if (!group || checkingIn) return
    if (!group.joined) {
      toast.error(t("user.groups.checkInNotMember"))
      return
    }
    setCheckingIn(true)
    try {
      const result = await groupCheckIn(group.id)
      if (result) {
        setCheckInStatus(result)
        toast.success(t("user.groups.checkInSuccess"))
        // Refresh rank
        getGroupCheckInRank(group.id)
          .then((data) => setCheckInRank(Array.isArray(data) ? data : []))
          .catch(() => {})
      }
    } catch {
      toast.error(t("user.groups.alreadyCheckedIn"))
    } finally {
      setCheckingIn(false)
    }
  }

  function handleJoinClick() {
    if (!currentUser) {
      navigate(buildSigninHref(`/groups/${slug}`))
      return
    }
    if (!group || isJoining) return
    if (group.joined) {
      setLeaveDialogOpen(true)
      return
    }
    handleJoin()
  }

  async function handleJoin() {
    if (!currentUser) {
      navigate(buildSigninHref(`/groups/${slug}`))
      return
    }
    if (!group || isJoining) return
    setIsJoining(true)
    try {
      if (group.joined) {
        await leaveGroup(group.id)
        toast.success(t("user.groups.leaveSuccess"))
      } else {
        await joinGroup(group.id)
        toast.success(t("user.groups.joinSuccess"))
      }
      setGroup({
        ...group,
        joined: !group.joined,
        memberCount: group.joined
          ? group.memberCount - 1
          : group.memberCount + 1,
      })
    } catch {
      toast.error(t("user.groups.operationFailed"))
    } finally {
      setIsJoining(false)
      setLeaveDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <MainShell>
        <GroupDetailSkeleton />
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

  // If a child route (e.g. settings) is active, render it instead of group content
  const { pathname } = useLocation()
  const basePath = `/groups/${slug}`
  const isChildRoute = pathname !== basePath && pathname !== `${basePath}/` && pathname.startsWith(`${basePath}/`)

  if (isChildRoute) {
    return (
      <MainShell>
        <Outlet />
      </MainShell>
    )
  }

  const sidebar = (
    <GroupSidebar group={group} members={members} t={t} canManage={canManage} onManageMembers={handleManageMembers} checkInRank={checkInRank} />
  )

  return (
    <>
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
          <div className="h-40 md:h-48 bg-gradient-to-br from-slate-800 to-slate-900" />
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
        {!currentUser ? (
          <Link
            to={buildSigninHref(`/groups/${slug}`)}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
          >
            <Pin className="h-4 w-4" />
            {t("user.groups.createPost")}
          </Link>
        ) : !group.joined ? (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
            onClick={() => toast.error(t("user.groups.createPostNotMember"))}
          >
            <Pin className="h-4 w-4" />
            {t("user.groups.createPost")}
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
              >
                <Pin className="h-4 w-4" />
                {t("user.groups.createPost")}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {(config?.modules?.topic || config?.modules?.qa) ? (
                <DropdownMenuItem asChild>
                  <Link to={`/topic/create?groupId=${group.id}&groupSlug=${group.slug}`}>
                    {t("common.createBtn.topic")}
                  </Link>
                </DropdownMenuItem>
              ) : null}
              {config?.modules?.article ? (
                <DropdownMenuItem asChild>
                  <Link to={`/article/create?groupId=${group.id}`}>
                    {t("common.createBtn.article")}
                  </Link>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {currentUser ? (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={checkingIn || (checkInStatus?.checkedIn === true)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-transform active:scale-95 ${
              checkInStatus?.checkedIn
                ? "bg-[var(--color-semantic-success-bg)] text-[var(--color-semantic-success)] cursor-default"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {checkingIn ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarCheck className="h-4 w-4" />
            )}
            {checkInStatus?.checkedIn ? t("user.groups.checkedIn") : t("user.groups.checkIn")}
            {checkInStatus?.checkedIn && checkInStatus.consecutiveDays > 0 ? (
              <span className="ml-1 rounded-full bg-[var(--color-semantic-success-muted)] px-1.5 py-0.5 text-xs text-[var(--color-semantic-success)]">
                {checkInStatus.consecutiveDays} {t("user.groups.days")}
              </span>
            ) : null}
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleJoinClick}
          disabled={isJoining}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-transform active:scale-95 ${
            group.joined
              ? "bg-muted text-muted-foreground hover:bg-[var(--color-semantic-danger-bg)] hover:text-[var(--color-semantic-danger)]"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {isJoining ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : group.joined ? (
            t("user.groups.leave")
          ) : (
            t("user.groups.join")
          )}
        </button>
        {canManage ? (
          <Link
            to={`/groups/${slug}/settings`}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            title={t("user.groups.settings")}
          >
            <Settings className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="all">{t("user.groups.allPosts")}</TabsTrigger>
          <TabsTrigger value="hot">{t("user.groups.hot")}</TabsTrigger>
          <TabsTrigger value="pinned">{t("user.groups.pinned")}</TabsTrigger>
          <TabsTrigger value="about">{t("user.groups.about")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="animate-in fade-in-0 duration-200 rounded-lg bg-background">
            {/* Sort dropdown */}
            <div className="flex items-center justify-end px-4 py-2 border-b">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded border bg-background px-2 py-1 text-xs"
              >
                <option value="latest">{t("user.groups.sortLatest")}</option>
                <option value="most_replies">{t("user.groups.sortMostReplies")}</option>
                <option value="most_active">{t("user.groups.sortMostActive")}</option>
              </select>
            </div>

            {/* Sticky topics at the top */}
            {stickyLoaded && stickyTopics.length > 0 ? (
              <ul className="divide-y divide-border border-l-4 border-[var(--color-sticky-accent)] bg-[var(--color-highlight-muted)]">
                {stickyTopics.map((topic) => (
                  <TopicListItem
                    key={topic.id}
                    topic={topic}
                    showSticky
                    t={t}
                  />
                ))}
              </ul>
            ) : null}

            {topics.length === 0 && stickyTopics.length === 0 ? (
              <EmptyState title={t("user.groups.no_topics")} />
            ) : (
              <LoadMore<Topic>
                initialItems={topics}
                initialCursor={cursor}
                initialHasMore={hasMore}
                initialLoad={false}
                resetKey={`/api/group/topics?groupId=${group.id}&sort=${sort}`}
                labels={{
                  loadMore: t("common.loadMore.loadMore"),
                  noMore: t("common.loadMore.noMore"),
                  error: t("common.loadMore.error"),
                }}
                loadPage={async (c) => {
                  if (sort === "most_replies" || sort === "most_active") {
                    // Offset-based pagination: cursor stores the page number
                    const page = c.cursor ? parseInt(c.cursor, 10) : 1
                    const data = await getGroupTopics(group.id, undefined, sort, page)
                    return {
                      cursor: String(page + 1),
                      hasMore: data?.hasMore ?? false,
                      results: data?.results || [],
                    }
                  }
                  // Cursor-based pagination for "latest"
                  const data = await getGroupTopics(group.id, c.cursor, sort)
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

        <TabsContent value="hot">
          <div className="animate-in fade-in-0 duration-200 rounded-lg bg-background">
            {!hotLoaded ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              </div>
            ) : hotTopics.length === 0 ? (
              <EmptyState title={t("user.groups.noHotTopics")} />
            ) : (
              <ul className="divide-y divide-border">
                {hotTopics.map((topic) => (
                  <TopicListItem
                    key={topic.id}
                    topic={topic}
                    t={t}
                  />
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pinned">
          <div className="animate-in fade-in-0 duration-200 rounded-lg bg-background">
            {!stickyLoaded ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
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
          <div className="animate-in fade-in-0 duration-200 space-y-4">
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

            {/* Announcement (mobile sidebar info) */}
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

            {/* Rules (mobile sidebar info) */}
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
          </div>
        </TabsContent>
      </Tabs>

      {/* Member Management Panel */}
      {showManageMembers && canManage ? (
        <div className="mt-6">
          <Card size="sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t("user.groups.manageMembers")}
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setShowManageMembers(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  &times;
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {membersLoading && allMembers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : (
                <div className="space-y-2">
                  {allMembers.map((member) => {
                    const isSelf = currentUser && member.user.id === currentUser.id
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 py-2 border-b last:border-b-0"
                      >
                        <UserAvatar user={member.user} size={32} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">
                            {member.user.nickname || member.user.username}
                          </span>
                        </div>
                        <RoleBadge role={member.role} t={t} />
                        {!isSelf && member.role !== 2 ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={member.role ?? 0}
                              onChange={(e) =>
                                handleSetRole(member.user.id, Number(e.target.value))
                              }
                              className="rounded border bg-background px-2 py-1 text-xs"
                            >
                              <option value={0}>{t("user.groups.memberRole")}</option>
                              <option value={1}>{t("user.groups.adminRole")}</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleKickMember(member.user.id)}
                              className="rounded px-2 py-1 text-xs text-[var(--color-semantic-danger)] hover:bg-[var(--color-semantic-danger-bg)]"
                            >
                              {t("user.groups.kickMember")}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                  {membersHasMore ? (
                    <button
                      type="button"
                      onClick={handleLoadMoreMembers}
                      disabled={membersLoading}
                      className="w-full text-center text-xs text-primary hover:underline py-2"
                    >
                      {membersLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                      ) : (
                        t("common.loadMore.loadMore")
                      )}
                    </button>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </MainShell>

      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("user.groups.leaveConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("user.groups.leaveConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleJoin}>
              {t("user.groups.leave")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
