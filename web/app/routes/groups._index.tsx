"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Loader2, LogOut, Plus, Users } from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/common/empty-state"
import { GroupCardGridSkeleton } from "@/components/common/skeleton-list"
import { MainShell } from "@/components/layout/main-shell"
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
import { getGroupList, joinGroup, leaveGroup } from "@/lib/api/groups"
import type { GroupItem } from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { useDocumentTitle } from "@/lib/use-document-title"

export async function loader() {
  return null
}

export async function clientLoader() {
  return null
}

function GroupCard({
  group,
  onJoin,
  onLeave,
  joiningId,
  t,
}: {
  group: GroupItem
  onJoin: (group: GroupItem) => void
  onLeave: (group: GroupItem) => void
  joiningId: number | null
  t: (key: string) => string
}) {
  const isJoining = joiningId === group.id
  return (
    <div className="relative overflow-hidden rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] shadow-[var(--shadow-sm)] transition-all duration-[var(--motion-duration-normal)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      {group.banner ? (
        <Link to={`/groups/${group.slug}`} prefetch="intent" className="block">
          <div className="h-16 w-full overflow-hidden">
            <img
              src={group.banner}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      ) : (
        <Link to={`/groups/${group.slug}`} prefetch="intent" className="block">
          <div className="h-16 w-full bg-[var(--color-primary-subtle)]" />
        </Link>
      )}

      <div className="p-3">
        <Link to={`/groups/${group.slug}`} prefetch="intent" className="block">
          <div className="flex items-center gap-2 mb-1.5">
            {group.icon ? (
              <img
                src={group.icon}
                alt={group.name}
                loading="lazy"
                decoding="async"
                className="w-8 h-8 rounded-full object-cover border border-[var(--color-hairline)]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--color-surface-3)] flex items-center justify-center text-xs text-muted-foreground">
                {group.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-sm truncate">
                {group.name}
              </h2>
            </div>
          </div>
          {group.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {group.description}
            </p>
          ) : (
            <div className="mb-2" />
          )}
        </Link>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {group.memberCount} · {group.topicCount}
          </span>
          {group.joined ? (
            <button
              type="button"
              onClick={() => onLeave(group)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--color-surface-3)] text-muted-foreground hover:bg-[var(--color-semantic-danger-muted)] hover:text-[var(--color-semantic-danger)]"
            >
              {t("user.groups.leave")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onJoin(group)}
              disabled={isJoining}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary text-primary-foreground hover:opacity-90"
            >
              {isJoining ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                t("user.groups.join")
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function MyGroupCard({
  group,
  onLeave,
  t,
}: {
  group: GroupItem
  onLeave: (group: GroupItem) => void
  t: (key: string) => string
}) {
  return (
    <div className="relative overflow-hidden rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] shadow-[var(--shadow-sm)] transition-all duration-[var(--motion-duration-normal)] hover:shadow-[var(--shadow-md)]">
      {group.banner ? (
        <Link to={`/groups/${group.slug}`} prefetch="intent" className="block">
          <div className="h-16 w-full overflow-hidden">
            <img
              src={group.banner}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      ) : (
        <Link to={`/groups/${group.slug}`} prefetch="intent" className="block">
          <div className="h-16 w-full bg-[var(--color-primary-subtle)]" />
        </Link>
      )}

      <div className="p-3">
        <Link to={`/groups/${group.slug}`} prefetch="intent" className="block">
          <div className="flex items-center gap-2 mb-1.5">
            {group.icon ? (
              <img
                src={group.icon}
                alt={group.name}
                loading="lazy"
                decoding="async"
                className="w-8 h-8 rounded-full object-cover border border-[var(--color-hairline)]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--color-surface-3)] flex items-center justify-center text-xs text-muted-foreground">
                {group.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-sm truncate">
                {group.name}
              </h2>
            </div>
          </div>
          {group.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {group.description}
            </p>
          ) : (
            <div className="mb-2" />
          )}
        </Link>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {group.memberCount} · {group.topicCount}
          </span>
          <div className="flex items-center gap-1.5">
            <Link
              to={`/groups/${group.slug}`}
              prefetch="intent"
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--color-primary-muted)] text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]"
            >
              {t("user.groups.enter")}
            </Link>
            <button
              type="button"
              onClick={() => onLeave(group)}
              className="px-2 py-1 rounded-full text-[11px] font-medium text-muted-foreground hover:bg-[var(--color-semantic-danger-muted)] hover:text-[var(--color-semantic-danger)]"
              title={t("user.groups.leave")}
            >
              <LogOut className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GroupsIndexRoute() {
  const { t } = useI18n()
  useDocumentTitle(t("user.groups.title"))
  const [groups, setGroups] = useState<GroupItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [joiningId, setJoiningId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [leaveTarget, setLeaveTarget] = useState<GroupItem | null>(null)

  useEffect(() => {
    getGroupList()
      .then((data) => setGroups(data || []))
      .finally(() => setLoading(false))
  }, [])

  async function handleJoin(group: GroupItem) {
    if (joiningId !== null) return
    setJoiningId(group.id)
    try {
      await joinGroup(group.id)
      toast.success(t("user.groups.joinSuccess"))
      setGroups((prev) =>
        (prev || []).map((g) =>
          g.id === group.id
            ? { ...g, joined: true, memberCount: g.memberCount + 1 }
            : g,
        ),
      )
    } catch {
      toast.error(t("user.groups.operationFailed"))
    } finally {
      setJoiningId(null)
    }
  }

  function handleLeaveClick(group: GroupItem) {
    setLeaveTarget(group)
  }

  async function handleLeaveConfirm() {
    if (!leaveTarget || joiningId !== null) return
    setJoiningId(leaveTarget.id)
    try {
      await leaveGroup(leaveTarget.id)
      toast.success(t("user.groups.leaveSuccess"))
      setGroups((prev) =>
        (prev || []).map((g) =>
          g.id === leaveTarget.id
            ? { ...g, joined: false, memberCount: g.memberCount - 1 }
            : g,
        ),
      )
    } catch {
      toast.error(t("user.groups.operationFailed"))
    } finally {
      setJoiningId(null)
      setLeaveTarget(null)
    }
  }

  if (loading || groups === null) {
    return (
      <MainShell>
        <div className="container mx-auto p-4">
          <GroupCardGridSkeleton />
        </div>
      </MainShell>
    )
  }

  const filteredGroups = search
    ? groups.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()),
      )
    : groups

  const myGroups = filteredGroups.filter((g) => g.joined)
  const availableGroups = filteredGroups.filter((g) => !g.joined)

  return (
    <MainShell>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("user.groups.title")}</h1>
          <Link
            to="/groups/create"
            prefetch="intent"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            {t("user.groups.createGroup")}
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder={t("user.groups.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {filteredGroups.length === 0 ? (
          <EmptyState title={t("user.groups.empty")} />
        ) : (
          <div className="space-y-8">
            {myGroups.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold mb-3">
                  {t("user.groups.myGroups")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {myGroups.map((group) => (
                    <MyGroupCard
                      key={group.id}
                      group={group}
                      onLeave={handleLeaveClick}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {availableGroups.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold mb-3">
                  {t("user.groups.allGroups")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={handleJoin}
                      onLeave={handleLeaveClick}
                      joiningId={joiningId}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>

      <AlertDialog open={leaveTarget !== null} onOpenChange={(open) => { if (!open) setLeaveTarget(null) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("user.groups.leaveConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("user.groups.leaveConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleLeaveConfirm}>
              {t("user.groups.leave")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainShell>
  )
}
