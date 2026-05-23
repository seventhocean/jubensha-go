"use client"

import * as React from "react"
import Link from "@/components/common/link"
import { usePathname, useSearchParams } from "@/lib/router/navigation"
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  CircleCheck,
  Medal,
} from "lucide-react"

import { UserAvatar } from "@/components/common/avatar"
import { apiFetch } from "@/lib/api/client"
import { useCurrentUser } from "@/components/app/app-provider"
import type { Badge, CheckInInfo, UserSummary } from "@/lib/api/types"
import { prettyDate } from "@/lib/format"
import { useI18n } from "@/lib/i18n/provider"
import { buildSigninHref, toast, useToastActions } from "@/lib/toast"

function displayName(user: UserSummary) {
  return user.nickname || user.username || String(user.id)
}

export function TasksUserCard({
  user,
  badges,
}: {
  user?: UserSummary | null
  badges?: Badge[]
}) {
  return (
    <React.Suspense fallback={<div className="rounded-md bg-background p-4" />}>
      <TasksUserCardContent user={user} badges={badges} />
    </React.Suspense>
  )
}

function TasksUserCardContent({
  user,
  badges,
}: {
  user?: UserSummary | null
  badges?: Badge[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useI18n()
  const currentUser = useCurrentUser()
  const effectiveUser = currentUser || user || null
  const [currentBadges, setCurrentBadges] = React.useState<Badge[]>(
    badges || []
  )
  const ownedBadges = currentBadges.filter((badge) => badge.owned === true)
  const displayBadges = ownedBadges.slice(0, 6)
  const queryString = searchParams.toString()
  const fullPath = `${pathname || "/"}${queryString ? `?${queryString}` : ""}`

  React.useEffect(() => {
    if (!effectiveUser) {
      return
    }

    let mounted = true
    void apiFetch<Badge[]>("/api/badge/badges", {
      params: { userId: effectiveUser.id },
    })
      .then((data) => {
        if (mounted) {
          setCurrentBadges(data || [])
        }
      })
      .catch(() => undefined)

    return () => {
      mounted = false
    }
  }, [effectiveUser])

  if (!effectiveUser) {
    return (
      <Link
        href={buildSigninHref(
          pathname?.startsWith("/user/signin") ? "/" : fullPath
        )}
        className="relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-4 text-left shadow-[var(--shadow-sm)]"
      >
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-3)] text-base font-semibold text-[var(--color-ink-muted)]">
            ?
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-[var(--color-ink)]">
              {t("user.tasks.userCard.guestTitle")}
            </div>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              {t("user.tasks.userCard.guestHint")}
            </p>
          </div>
        </div>
        <span className="relative inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-3 py-2 text-[11px] font-semibold text-[var(--color-on-primary)] shadow-sm transition hover:opacity-90">
          {t("user.tasks.userCard.signInAction")}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    )
  }

  return (
    <div className="rounded-md bg-background p-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={effectiveUser} size={56} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/user/${effectiveUser.id}`}
            className="block truncate text-base font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary)]"
          >
            {displayName(effectiveUser)}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-[var(--color-ink-muted)]">
            {effectiveUser.description ||
              t("user.tasks.userCard.noDescription")}
          </p>
        </div>
      </div>
      {effectiveUser.levelTitle || ownedBadges.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          {effectiveUser.levelTitle ? (
            <span className="inline-flex items-center rounded-full bg-[var(--color-highlight-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-highlight)]">
              {effectiveUser.levelTitle}
            </span>
          ) : null}
          {ownedBadges.length > 0 ? (
            <Link
              href={`/user/${effectiveUser.id}/badges`}
              className="flex flex-wrap items-center transition hover:opacity-90"
            >
              {displayBadges.map((badge) => (
                <span key={badge.id} title={badge.title}>
                  {badge.icon ? (
                    <img
                      src={badge.icon}
                      alt={badge.title || ""}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <Medal className="h-3.5 w-3.5 text-[var(--color-highlight)]" />
                  )}
                </span>
              ))}
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)]" />
            </Link>
          ) : null}
        </div>
      ) : null}

      {effectiveUser.expProgress ? (
        <div className="relative mt-4">
          <div className="flex items-center justify-between text-[11px] text-[var(--color-ink-muted)]">
            <span>{t("user.tasks.userCard.expProgress")}</span>
            <span className="font-semibold text-[var(--color-ink)]">
              {effectiveUser.expProgress.isMaxLevel
                ? t("user.tasks.userCard.expProgressMaxLevel")
                : `${effectiveUser.expProgress.expInCurrentLevel || 0} / ${effectiveUser.expProgress.expNeedForNextLevel || 0}`}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-exp-bar-track)]">
            <div
              className="h-full rounded-full bg-[var(--color-exp-bar-fill)]"
              style={{
                width: `${effectiveUser.expProgress.expProgressPercent || 0}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      <div className="relative mt-4 grid grid-cols-4 gap-2 text-center">
        <TaskUserStat
          label={t("component.userInfo.score")}
          value={effectiveUser.score || 0}
        />
        <TaskUserStat
          label={t("user.tasks.userCard.exp")}
          value={effectiveUser.exp || 0}
        />
        <TaskUserStat
          label={t("component.userInfo.topicCount")}
          value={effectiveUser.topicCount || 0}
        />
        <TaskUserStat
          label={t("component.userInfo.commentCount")}
          value={effectiveUser.commentCount || 0}
        />
      </div>
    </div>
  )
}

function TaskUserStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface-1)] px-2 py-2 text-xs shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-hairline)]">
      <div className="text-[11px] text-[var(--color-ink-muted)]">
        {label}
      </div>
      <div className="text-sm font-semibold text-[var(--color-ink)]">
        {value}
      </div>
    </div>
  )
}

export function CheckInCard({
  initialCheckIn,
  initialRank,
}: {
  initialCheckIn?: CheckInInfo | null
  initialRank?: CheckInInfo[]
}) {
  const { t } = useI18n()
  const { catchError } = useToastActions()
  const [checkIn, setCheckIn] = React.useState<CheckInInfo | null>(
    initialCheckIn || null
  )
  const [rank, setRank] = React.useState<CheckInInfo[]>(initialRank || [])
  const [pending, setPending] = React.useState(false)
  const isCheckedIn = Boolean(checkIn?.checkIn)

  async function refresh() {
    const [nextCheckIn, nextRank] = await Promise.all([
      apiFetch<CheckInInfo | null>("/api/checkin/checkin"),
      apiFetch<CheckInInfo[]>("/api/checkin/rank"),
    ])
    setCheckIn(nextCheckIn)
    setRank(nextRank || [])
  }

  async function doCheckIn() {
    if (pending) {
      return
    }
    setPending(true)
    try {
      await apiFetch<null>("/api/checkin/checkin", { method: "POST" })
      toast.success(t("component.checkIn.checkInSuccess"))
      await refresh()
    } catch (error) {
      catchError(error)
    } finally {
      setPending(false)
    }
  }

  React.useEffect(() => {
    let mounted = true
    void Promise.all([
      apiFetch<CheckInInfo | null>("/api/checkin/checkin").catch(() => null),
      apiFetch<CheckInInfo[]>("/api/checkin/rank").catch(() => []),
    ]).then(([nextCheckIn, nextRank]) => {
      if (mounted) {
        setCheckIn(nextCheckIn)
        setRank(nextRank || [])
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="rounded-md bg-background p-4">
      <div className="flex flex-col gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm font-semibold text-foreground">
                {t("component.checkIn.headline")}
              </span>
              <span className="w-fit rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {isCheckedIn
                  ? t("component.checkIn.statusCheckedIn")
                  : t("component.checkIn.statusNotCheckedIn")}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {isCheckedIn
                ? t("component.checkIn.checkedInTip")
                : t("component.checkIn.checkInTip")}
            </p>
          </div>
        </div>
        <div>
          <div className="min-h-9">
            {!isCheckedIn ? (
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-[var(--color-on-primary)] shadow-sm transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/60 focus-visible:outline-none disabled:opacity-60"
                type="button"
                disabled={pending}
                onClick={() => void doCheckIn()}
              >
                <Calendar className="size-4" />
                {t("component.checkIn.checkInNow")}
              </button>
            ) : (
              <div className="flex w-full items-center gap-3 rounded-lg border border-[var(--color-semantic-success)]/30 bg-[var(--color-semantic-success-muted)] px-4 py-3 text-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-semantic-success-muted)]">
                  <CircleCheck className="h-5 w-5 text-[var(--color-semantic-success)]" />
                </div>
                <p className="min-w-0 text-[var(--color-ink-secondary)]">
                  {t("component.checkIn.consecutiveDays", {
                    days: checkIn?.consecutiveDays || 0,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {rank.length ? (
        <div className="relative mt-4">
          <div className="text-sm font-semibold text-[var(--color-ink)]">
            {t("component.checkIn.todayRanking")}
          </div>
          <ul className="mt-3 space-y-2">
            {rank.map((item) =>
              item.user ? (
                <li
                  key={item.id || `${item.user.id}-${item.updateTime || ""}`}
                  className="flex items-center gap-3 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-3 py-2 text-sm transition hover:bg-[var(--color-surface-2)]"
                >
                  <UserAvatar user={item.user} size={30} />
                  <div className="min-w-0 flex-1">
                    <Link
                      className="truncate font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary)]"
                      href={`/user/${item.user.id}`}
                    >
                      {displayName(item.user)}
                    </Link>
                    {item.updateTime ? (
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        @{prettyDate(item.updateTime, t)}
                      </p>
                    ) : null}
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
