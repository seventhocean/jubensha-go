"use client"

import * as React from "react"
import Link from "@/components/common/link"
import { Trophy } from "lucide-react"

import { UserAvatar } from "@/components/common/avatar"
import { useAppState } from "@/components/app/app-provider"
import { apiFetch } from "@/lib/api/client"
import type { Article, CheckInInfo, GroupItem, PageData, UserSummary } from "@/lib/api/types"
import type { FriendLink } from "@/lib/api/misc"
import type { TFunction } from "@/lib/i18n"
import { useI18n } from "@/lib/i18n/provider"

function displayName(user: UserSummary) {
  return user.nickname || user.username || "User"
}

function WidgetCard({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[var(--rounded-lg)] bg-[var(--color-surface-1)] px-4 py-2 shadow-[var(--shadow-sm)] dark:shadow-none dark:border dark:border-[var(--color-hairline)]">
      {title ? (
        <div className="flex items-center justify-between border-b border-[var(--color-hairline)] py-2 text-base font-medium">
          <span>{title}</span>
        </div>
      ) : null}
      <div className="py-2 break-all">{children}</div>
    </section>
  )
}

function SiteNotice({ title, content }: { title: string; content?: string }) {
  if (!content) {
    return null
  }

  return (
    <WidgetCard title={title}>
      <div
        className="prose prose-sm max-w-none text-sm text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </WidgetCard>
  )
}

function HotArticlesWidget({
  articles,
  t,
}: {
  articles: Article[]
  t: TFunction
}) {
  if (!articles.length) {
    return null
  }

  return (
    <WidgetCard title={t("component.homeAside.hotArticles")}>
      <ul className="space-y-2">
        {articles.slice(0, 5).map((article, index) => (
          <li key={article.id} className="flex items-start gap-2 text-sm">
            <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded bg-[var(--color-primary-muted)] text-xs font-medium text-[var(--color-primary)]">
              {index + 1}
            </span>
            <Link
              href={`/article/${article.id}`}
              className="flex-1 text-foreground hover:text-[var(--color-primary)] transition-colors duration-[var(--motion-duration-fast)] line-clamp-1"
            >
              {article.title.length > 40
                ? article.title.slice(0, 40) + "..."
                : article.title}
            </Link>
            <span className="shrink-0 text-xs text-muted-foreground">
              {article.viewCount ?? 0} {t("component.homeAside.views")}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-end text-sm">
        <Link
          href="/articles"
          className="text-muted-foreground hover:text-primary"
        >
          {t("component.homeAside.viewMore")}
        </Link>
      </div>
    </WidgetCard>
  )
}

function ActiveGroupsWidget({
  groups,
  t,
}: {
  groups: GroupItem[]
  t: TFunction
}) {
  if (!groups.length) {
    return null
  }

  return (
    <WidgetCard title={t("component.homeAside.activeGroups")}>
      <ul className="space-y-3">
        {groups.slice(0, 3).map((group) => (
          <li key={group.id} className="flex items-center gap-2">
            {group.icon ? (
              <img
                src={group.icon}
                alt={group.name}
                className="w-8 h-8 rounded object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-[var(--color-primary-muted)] flex items-center justify-center text-xs font-medium text-[var(--color-primary)] shrink-0">
                {group.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {group.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {group.memberCount} {t("component.homeAside.members")}
              </div>
            </div>
            <Link
              href={`/groups/${group.slug}`}
              className="shrink-0 text-xs px-2 py-1 rounded bg-[var(--color-primary-muted)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              {group.joined
                ? t("component.homeAside.enterGroup")
                : t("component.homeAside.joinGroup")}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-end text-sm">
        <Link
          href="/groups"
          className="text-muted-foreground hover:text-primary"
        >
          {t("component.homeAside.viewMore")}
        </Link>
      </div>
    </WidgetCard>
  )
}

function MyStatusWidget({
  user,
  checkIn,
  t,
}: {
  user: UserSummary
  checkIn: CheckInInfo | null
  t: TFunction
}) {
  const checkedInToday = checkIn?.checkIn ?? false

  return (
    <WidgetCard title={t("component.homeAside.myStatus")}>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            {t("component.homeAside.levelExp")}
          </span>
          <span className="font-medium">
            Lv.{user.level ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            {t("component.homeAside.dailyCheckin")}
          </span>
          <span className={checkedInToday ? "text-green-600" : "text-orange-500"}>
            {checkedInToday
              ? t("component.checkIn.statusCheckedIn")
              : t("component.checkIn.statusNotCheckedIn")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            {t("component.homeAside.taskProgress")}
          </span>
          <Link
            href="/tasks"
            className="text-[var(--color-primary)] hover:underline"
          >
            {t("common.header.tasks")} &gt;
          </Link>
        </div>
      </div>
    </WidgetCard>
  )
}

function ScoreRank({
  title,
  users,
  t,
}: {
  title: string
  users: UserSummary[]
  t: TFunction
}) {
  if (!users.length) {
    return null
  }

  return (
    <WidgetCard title={title}>
      <ul className="score-rank">
        {users.slice(0, 10).map((user) => (
          <li
            key={user.id}
            className="flex list-none items-center border-b py-2.5 text-[13px] last:border-b-0"
          >
            <UserAvatar user={user} size={35} />
            <div className="ml-[9px] w-full text-xs leading-[1.4]">
              <Link
                href={`/user/${user.id}`}
                className="block text-sm leading-5 text-foreground transition-colors duration-[var(--motion-duration-fast)] hover:text-[var(--color-primary)]"
              >
                {displayName(user)}
              </Link>
              <p className="block text-[11px] leading-5 text-muted-foreground">
                {user.topicCount ?? 0} {t("component.scoreRank.topic")}{" "}
                <span>•</span> {user.commentCount ?? 0}{" "}
                {t("component.scoreRank.comment")}
              </p>
            </div>
            <div className="w-[120px]">
              <span className="float-right inline-flex h-[21px] items-center rounded-xl bg-[var(--color-primary-muted)] px-1.5 text-xs leading-[21px] text-[var(--color-primary)]">
                <Trophy className="mr-[3px] size-3" />
                <span>{user.score ?? 0}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}

function FriendLinks({
  title,
  more,
  links,
}: {
  title: string
  more: string
  links: FriendLink[]
}) {
  if (!links.length) {
    return null
  }

  return (
    <WidgetCard title={title}>
      <div className="mb-1 flex justify-end text-sm">
        <Link
          href="/links"
          className="text-muted-foreground hover:text-primary"
        >
          {more}
        </Link>
      </div>
      <ul className="links">
        {links.map((link) => (
          <li key={link.id} className="link">
            <a
              href={link.url || "#"}
              title={link.title}
              className="link-title"
              target="_blank"
              rel="noreferrer"
            >
              {link.title}
            </a>
            {link.summary ? (
              <p className="link-summary">{link.summary}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}

export function HomeAside() {
  const { config, currentUser: user } = useAppState()
  const { t } = useI18n()
  const [scoreRank, setScoreRank] = React.useState<UserSummary[]>([])
  const [checkIn, setCheckIn] = React.useState<CheckInInfo | null>(null)
  const [friendLinks, setFriendLinks] = React.useState<FriendLink[]>([])
  const [hotArticles, setHotArticles] = React.useState<Article[]>([])
  const [activeGroups, setActiveGroups] = React.useState<GroupItem[]>([])

  React.useEffect(() => {
    let mounted = true
    void Promise.all([
      apiFetch<UserSummary[]>("/api/user/score/rank").catch(() => []),
      apiFetch<CheckInInfo | null>("/api/checkin/checkin").catch(() => null),
      apiFetch<FriendLink[]>("/api/link/top_links").catch(() => []),
      apiFetch<PageData<Article>>("/api/article/articles", { params: { sort: "hot" } }).catch(() => ({ results: [], hasMore: false, cursor: "" })),
      apiFetch<GroupItem[]>("/api/group/list").catch(() => []),
    ]).then(([nextScoreRank, nextCheckIn, nextLinks, nextArticles, nextGroups]) => {
      if (!mounted) return
      setScoreRank(Array.isArray(nextScoreRank) ? nextScoreRank : [])
      setCheckIn(nextCheckIn)
      setFriendLinks(Array.isArray(nextLinks) ? nextLinks : [])
      setHotArticles(Array.isArray(nextArticles.results) ? nextArticles.results : [])
      setActiveGroups(Array.isArray(nextGroups) ? nextGroups : [])
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <SiteNotice
        title={t("component.siteNotice.title")}
        content={config?.siteNotification}
      />
      <HotArticlesWidget articles={hotArticles} t={t} />
      <ActiveGroupsWidget groups={activeGroups} t={t} />
      {user ? <MyStatusWidget user={user} checkIn={checkIn} t={t} /> : null}
      <ScoreRank
        title={t("component.scoreRank.title")}
        users={scoreRank}
        t={t}
      />
      <FriendLinks
        title={t("component.friendLinks.title")}
        more={t("component.friendLinks.more")}
        links={friendLinks}
      />
    </>
  )
}
