"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Shield, Users } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"
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
  t,
}: {
  group: GroupItem
  onJoin: (group: GroupItem) => void
  t: (key: string) => string
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-shadow">
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
          <div className="h-24 w-full bg-gradient-to-br from-primary/10 to-primary/5" />
        </Link>
      )}

      <div className="p-4">
        <Link to={`/groups/${group.slug}`} className="block">
          <div className="flex items-center gap-3 mb-2">
            {group.icon ? (
              <img
                src={group.icon}
                alt={group.name}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                {group.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-semibold text-base truncate">
                  {group.name}
                </h2>
                {group.isDefault === 1 ? (
                  <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                ) : null}
              </div>
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
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              group.joined
                ? "bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-600"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {group.joined ? t("user.groups.leave") : t("user.groups.join")}
          </button>
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

  useEffect(() => {
    getGroupList()
      .then((data) => setGroups(data || []))
      .finally(() => setLoading(false))
  }, [])

  async function handleJoin(group: GroupItem) {
    if (group.joined) {
      await leaveGroup(group.id)
    } else {
      await joinGroup(group.id)
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
  }

  if (loading || groups === null) {
    return (
      <MainShell>
        <div className="p-8 text-center text-muted-foreground">
          Loading...
        </div>
      </MainShell>
    )
  }

  const myGroups = groups.filter((g) => g.joined)
  const publicGroups = groups.filter((g) => g.isDefault === 1)
  const communityGroups = groups.filter((g) => g.isDefault !== 1)

  return (
    <MainShell>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{t("user.groups.title")}</h1>

        {groups.length === 0 ? (
          <EmptyState title={t("user.groups.empty")} />
        ) : (
          <div className="space-y-8">
            {/* My Groups */}
            {myGroups.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold mb-3">
                  {t("user.groups.myGroups")}
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {myGroups.map((group) => (
                    <Link
                      key={group.id}
                      to={`/groups/${group.slug}`}
                      className="flex shrink-0 items-center gap-2.5 rounded-lg border bg-card px-3 py-2 hover:shadow-sm transition-shadow"
                    >
                      {group.icon ? (
                        <img
                          src={group.icon}
                          alt={group.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                          {group.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium whitespace-nowrap">
                        {group.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Public Groups */}
            {publicGroups.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold mb-3">
                  {t("user.groups.publicGroups")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publicGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={handleJoin}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {/* Community Groups */}
            {communityGroups.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold mb-3">
                  {t("user.groups.userCreatedGroups")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {communityGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={handleJoin}
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
