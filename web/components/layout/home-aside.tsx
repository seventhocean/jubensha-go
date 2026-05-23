"use client"

import * as React from "react"
import Link from "@/components/common/link"
import { Trophy } from "lucide-react"

import { UserAvatar } from "@/components/common/avatar"
import { CheckInCard, TasksUserCard } from "@/components/tasks/task-widgets"
import { useAppState } from "@/components/app/app-provider"
import { apiFetch } from "@/lib/api/client"
import type { Badge, CheckInInfo, UserSummary } from "@/lib/api/types"
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
  const [checkInRank, setCheckInRank] = React.useState<CheckInInfo[]>([])
  const [friendLinks, setFriendLinks] = React.useState<FriendLink[]>([])
  const [badges, setBadges] = React.useState<Badge[]>([])

  React.useEffect(() => {
    let mounted = true
    void Promise.all([
      apiFetch<UserSummary[]>("/api/user/score/rank").catch(() => []),
      apiFetch<CheckInInfo | null>("/api/checkin/checkin").catch(() => null),
      apiFetch<CheckInInfo[]>("/api/checkin/rank").catch(() => []),
      apiFetch<FriendLink[]>("/api/link/top_links").catch(() => []),
    ]).then(([nextScoreRank, nextCheckIn, nextCheckInRank, nextLinks]) => {
      if (!mounted) return
      setScoreRank(Array.isArray(nextScoreRank) ? nextScoreRank : [])
      setCheckIn(nextCheckIn)
      setCheckInRank(Array.isArray(nextCheckInRank) ? nextCheckInRank : [])
      setFriendLinks(Array.isArray(nextLinks) ? nextLinks : [])
    })

    return () => {
      mounted = false
    }
  }, [])

  React.useEffect(() => {
    if (!user) {
      setBadges([])
      return
    }
    let mounted = true
    void apiFetch<Badge[]>("/api/badge/badges", {
      params: { userId: user.id },
    })
      .then((nextBadges) => {
        if (mounted) setBadges(nextBadges || [])
      })
      .catch(() => {
        if (mounted) setBadges([])
      })

    return () => {
      mounted = false
    }
  }, [user])

  return (
    <>
      <SiteNotice
        title={t("component.siteNotice.title")}
        content={config?.siteNotification}
      />
      <TasksUserCard user={user} badges={badges} />
      <CheckInCard initialCheckIn={checkIn} initialRank={checkInRank} />
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
