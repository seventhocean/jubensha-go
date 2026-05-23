"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Loader2, Plus, Users } from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/common/empty-state"
import { GroupCardGridSkeleton } from "@/components/common/skeleton-list"
import { MainShell } from "@/components/layout/main-shell"
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
  joiningId,
  t,
}: {
  group: GroupItem
  onJoin: (group: GroupItem) => void
  joiningId: number | null
  t: (key: string) => string
}) {
  const isJoining = joiningId === group.id
  return (
    <div className="relative overflow-hidden rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] shadow-[var(--shadow-sm)] transition-all duration-[var(--motion-duration-normal)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      {/* Banner header */}
      {group.banner ? (
        <Link to={`/groups/${group.slug}`} className="block">
          <div className="h-24 w-full overflow-hidden">
            <img
              src={group.banner}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      ) : (
        <Link to={`/groups/${group.slug}`} className="block">
          <div className="h-24 w-full bg-[var(--color-primary-subtle)]" />
        </Link>
      )}

      <div className="p-4">
        <Link to={`/groups/${group.slug}`} className="block">
          <div className="flex items-center gap-3 mb-2">
            {group.icon ? (
              <img
                src={group.icon}
                alt={group.name}
                className="w-10 h-10 rounded-full object-cover border border-[var(--color-hairline)]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-3)] flex items-center justify-center text-muted-foreground">
                {group.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base truncate">
                {group.name}
              </h2>
            </div>
          </div>
          {group.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {group.description}
            </p>
          ) : (
            <div className="mb-3" />
          )}
        </Link>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {group.memberCount} {t("user.groups.members")} ·{" "}
            {group.topicCount} {t("user.groups.topics")}
          </span>
          <button
            type="button"
            onClick={() => onJoin(group)}
            disabled={isJoining}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              group.joined
                ? "bg-[var(--color-surface-3)] text-muted-foreground hover:bg-[var(--color-semantic-danger-muted)] hover:text-[var(--color-semantic-danger)]"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {isJoining ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : group.joined ? (
              t("user.groups.leave")
            ) : (
              t("user.groups.join")
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function MyGroupCard({
  group,
  t,
}: {
  group: GroupItem
  t: (key: string) => string
}) {
  return (
    <div className="relative overflow-hidden rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] shadow-[var(--shadow-sm)] transition-all duration-[var(--motion-duration-normal)] hover:shadow-[var(--shadow-md)]">
      {/* Banner header */}
      {group.banner ? (
        <Link to={`/groups/${group.slug}`} className="block">
          <div className="h-24 w-full overflow-hidden">
            <img
              src={group.banner}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      ) : (
        <Link to={`/groups/${group.slug}`} className="block">
          <div className="h-24 w-full bg-[var(--color-primary-subtle)]" />
        </Link>
      )}

      <div className="p-4">
        <Link to={`/groups/${group.slug}`} className="block">
          <div className="flex items-center gap-3 mb-2">
            {group.icon ? (
              <img
                src={group.icon}
                alt={group.name}
                className="w-10 h-10 rounded-full object-cover border border-[var(--color-hairline)]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-3)] flex items-center justify-center text-muted-foreground">
                {group.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base truncate">
                {group.name}
              </h2>
            </div>
          </div>
          {group.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {group.description}
            </p>
          ) : (
            <div className="mb-3" />
          )}
        </Link>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {group.memberCount} {t("user.groups.members")} ·{" "}
            {group.topicCount} {t("user.groups.topics")}
          </span>
          <Link
            to={`/groups/${group.slug}`}
            className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-3)] text-muted-foreground hover:bg-[var(--color-primary-muted)] hover:text-[var(--color-primary)]"
          >
            {t("user.groups.enter")}
          </Link>
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

  useEffect(() => {
    getGroupList()
      .then((data) => setGroups(data || []))
      .finally(() => setLoading(false))
  }, [])

  async function handleJoin(group: GroupItem) {
    if (joiningId !== null) return
    setJoiningId(group.id)
    try {
      if (group.joined) {
        await leaveGroup(group.id)
        toast.success(t("user.groups.leaveSuccess"))
      } else {
        await joinGroup(group.id)
        toast.success(t("user.groups.joinSuccess"))
      }
      setGroups((prev) =>
        (prev || []).map((g) =>
          g.id === group.id
            ? {
                ...g,
                joined: !g.joined,
                memberCount: g.joined
                  ? g.memberCount - 1
                  : g.memberCount + 1,
              }
            : g,
        ),
      )
    } catch {
      toast.error(t("user.groups.operationFailed"))
    } finally {
      setJoiningId(null)
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
            {/* My Groups */}
            {myGroups.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold mb-3">
                  {t("user.groups.myGroups")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myGroups.map((group) => (
                    <MyGroupCard
                      key={group.id}
                      group={group}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {/* All Groups */}
            {availableGroups.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold mb-3">
                  {t("user.groups.allGroups")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={handleJoin}
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
    </MainShell>
  )
}
