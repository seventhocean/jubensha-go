"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router"

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

export default function GroupsIndexRoute() {
  const { t } = useI18n()
  useDocumentTitle(t("user.groups.title"))
  const [groups, setGroups] = useState<GroupItem[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGroupList().then((data) => setGroups(data || [])).finally(() => setLoading(false))
  }, [])

  async function handleJoin(group: GroupItem) {
    if (group.joined) {
      await leaveGroup(group.id)
    } else {
      await joinGroup(group.id)
    }
    setGroups((prev) =>
      (prev || []).map((g) =>
        g.id === group.id ? { ...g, joined: !g.joined, memberCount: g.joined ? g.memberCount - 1 : g.memberCount + 1 } : g
      )
    )
  }

  if (loading || groups === null) {
    return (
      <MainShell>
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      </MainShell>
    )
  }

  return (
    <MainShell>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{t("user.groups.title")}</h1>
        {groups.length === 0 ? (
          <EmptyState message={t("user.groups.empty")} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <Link to={`/groups/${group.slug}`} className="block">
                  <div className="flex items-center gap-3 mb-2">
                    {group.icon ? (
                      <img
                        src={group.icon}
                        alt={group.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        {group.name.charAt(0)}
                      </div>
                    )}
                    <h2 className="font-semibold text-lg">{group.name}</h2>
                  </div>
                  {group.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {group.description}
                    </p>
                  ) : null}
                </Link>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {group.memberCount} {t("user.groups.members")} · {group.topicCount}{" "}
                    {t("user.groups.topics")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleJoin(group)}
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
            ))}
          </div>
        )}
      </div>
    </MainShell>
  )
}
