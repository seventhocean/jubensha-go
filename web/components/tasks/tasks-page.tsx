"use client"

import * as React from "react"
import Link from "@/components/common/link"
import {
  ArrowRight,
  CheckSquare,
  ListChecks,
  Medal,
  Target,
  Zap,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/lib/api/client"
import type { TaskGroupInfo, TaskInfo } from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { useCurrentUser } from "@/components/app/app-provider"
import { useToastActions } from "@/lib/toast"
import { cn } from "@/lib/utils"

function isCompleted(task: TaskInfo) {
  const progress = task.userProgress
  if (!progress) return false
  if (
    (progress.maxFinishCount || 0) > 0 &&
    (progress.finishedCount || 0) >= (progress.maxFinishCount || 0)
  ) {
    return true
  }
  return Boolean(
    progress.eventTarget &&
    (progress.eventProgress || 0) >= progress.eventTarget &&
    (progress.maxFinishCount || 0) <= 1
  )
}

function statusKind(task: TaskInfo) {
  if (isCompleted(task)) return "done"
  if (task.userProgress && (task.userProgress.eventProgress || 0) > 0) {
    return "progress"
  }
  return "idle"
}

function progressPercent(task: TaskInfo) {
  if (isCompleted(task)) return 100
  const progress = task.userProgress
  const target = progress?.eventTarget || task.eventCount || 1
  const done = Math.min(progress?.eventProgress || 0, target)
  return Math.min(100, Math.round((done / target) * 100))
}

function tasksForGroup(tasks: TaskInfo[], group: string) {
  if (!group || group === "all") return tasks
  return tasks.filter((item) => item.groupName === group)
}

export function TasksPageContent({
  groups,
  tasks,
}: {
  groups: TaskGroupInfo[]
  tasks: TaskInfo[]
}) {
  const { t } = useI18n()
  const [currentGroups, setCurrentGroups] = React.useState(groups)
  const [currentTasks, setCurrentTasks] = React.useState(tasks)
  const [activeGroup, setActiveGroup] = React.useState(groups[0]?.key || "all")
  const displayGroups = currentGroups.length
    ? currentGroups
    : [{ key: "all", name: t("user.tasks.groups.all") }]
  const stats = {
    total: currentTasks.length,
    completed: currentTasks.filter((task) => isCompleted(task)).length,
  }

  React.useEffect(() => {
    let mounted = true
    void Promise.all([
      apiFetch<TaskGroupInfo[]>("/api/task/groups").catch(() => []),
      apiFetch<TaskInfo[]>("/api/task/tasks").catch(() => []),
    ]).then(([nextGroups, nextTasks]) => {
      if (!mounted) {
        return
      }

      setCurrentGroups(nextGroups || [])
      setCurrentTasks(nextTasks || [])
      if (nextGroups?.[0]?.key) {
        setActiveGroup(nextGroups[0].key)
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="rounded-lg bg-background px-3 py-2">
      <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-ink)]">
            {t("user.tasks.title")}
          </h1>
          <p className="text-sm text-[var(--color-ink-muted)]">
            {t("user.tasks.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-3)] px-2.5 py-1 font-semibold text-[var(--color-ink-secondary)]">
            <ListChecks className="h-3.5 w-3.5" />
            {t("user.tasks.hero.total")} {stats.total}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-semantic-success-muted)] px-2.5 py-1 font-semibold text-[var(--color-semantic-success)]">
            <CheckSquare className="h-3.5 w-3.5" />
            {t("user.tasks.hero.completed")} {stats.completed}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Tabs value={activeGroup} onValueChange={setActiveGroup}>
          <TabsList aria-label="task groups">
            {displayGroups.map((group) => (
              <TabsTrigger key={group.key} value={group.key}>
                <span>{group.name || group.key}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {displayGroups.map((group) => (
            <TabsContent
              key={group.key}
              value={group.key}
              className="space-y-3"
            >
              <TaskGrid tasks={tasksForGroup(currentTasks, group.key)} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function TaskGrid({ tasks }: { tasks: TaskInfo[] }) {
  const { t } = useI18n()

  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-hairline)] bg-[var(--color-surface-2)] p-8 text-center text-[var(--color-ink-secondary)]">
        <div className="mb-2 text-3xl">🪁</div>
        <div className="mb-2 font-semibold">{t("user.tasks.emptyTitle")}</div>
        <Link
          className="inline-flex items-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-on-primary)] transition hover:opacity-90"
          href="/"
        >
          {t("user.tasks.emptyAction")}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}

function TaskCard({ task }: { task: TaskInfo }) {
  const { t } = useI18n()
  const user = useCurrentUser()
  const { msgSignIn } = useToastActions()
  const kind = statusKind(task)

  function statusLabel() {
    if (kind === "done") return t("user.tasks.status.completed")
    if (kind === "progress") return t("user.tasks.status.inProgress")
    return t("user.tasks.status.ready")
  }

  function progressLabel() {
    const progress = task.userProgress
    if (!progress) return t("user.tasks.progress.notStarted")
    const target = progress.eventTarget || task.eventCount || 1
    const done = isCompleted(task)
      ? target
      : Math.min(progress.eventProgress || 0, target)
    return t("user.tasks.progress.counter", { progress: done, target })
  }

  function finishLabel() {
    const progress = task.userProgress
    if (!progress) return ""
    if ((progress.maxFinishCount || 0) > 0) {
      return t("user.tasks.progress.finishedCount", {
        count: Math.min(
          progress.finishedCount || 0,
          progress.maxFinishCount || 0
        ),
        max: progress.maxFinishCount || 0,
      })
    }
    return t("user.tasks.progress.unlimited")
  }

  const action = task.actionUrl ? (
    user ? (
      <Link
        className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-on-primary)] shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
        href={task.actionUrl}
      >
        <ArrowRight className="h-3.5 w-3.5" />
        {task.btnName || t("user.tasks.actions.go")}
      </Link>
    ) : (
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-on-primary)] shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
        onClick={() => msgSignIn()}
      >
        <ArrowRight className="h-3.5 w-3.5" />
        {task.btnName || t("user.tasks.actions.go")}
      </button>
    )
  ) : (
    <span
      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold opacity-0"
      aria-hidden="true"
    >
      <ArrowRight className="h-3.5 w-3.5" />
      {t("user.tasks.actions.go")}
    </span>
  )

  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-3.5 shadow-[var(--shadow-sm)] ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] hover:ring-[var(--color-primary)]/20">
      <div className="relative flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
              {task.title}
            </h3>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur",
            kind === "done" &&
              "border-[var(--color-semantic-success)]/30 bg-[var(--color-semantic-success-muted)] text-[var(--color-semantic-success)]",
            kind === "progress" &&
              "border-blue-300/70 bg-blue-50/90 text-blue-800 dark:border-blue-700/80 dark:bg-blue-900/40 dark:text-blue-100",
            kind === "idle" &&
              "border-[var(--color-hairline)] bg-[var(--color-surface-3)] text-[var(--color-ink-secondary)]"
          )}
        >
          {statusLabel()}
        </span>
      </div>
      <p className="relative line-clamp-2 min-h-[42px] text-[13px] leading-relaxed text-[var(--color-ink-secondary)]">
        {task.description}
      </p>
      <div className="relative flex flex-wrap gap-1.5 text-[11px] text-[var(--color-ink-secondary)]">
        {task.score ? (
          <RewardPill icon={<Target className="h-3.5 w-3.5" />}>
            {t("user.tasks.reward.score", { score: task.score })}
          </RewardPill>
        ) : null}
        {task.exp ? (
          <RewardPill icon={<Zap className="h-3.5 w-3.5" />}>
            {t("user.tasks.reward.exp", { exp: task.exp })}
          </RewardPill>
        ) : null}
        {task.badgeId ? (
          <RewardPill icon={<Medal className="h-3.5 w-3.5" />}>
            {t("user.tasks.reward.badge")}
          </RewardPill>
        ) : null}
      </div>
      <div className="relative mt-auto space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-[var(--color-ink-secondary)]">
          <span>{progressLabel()}</span>
          <span className="flex items-center gap-1 font-semibold text-[var(--color-ink)]">
            {progressPercent(task)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-exp-bar-track)]">
          <div
            className="h-full rounded-full bg-[var(--color-exp-bar-fill)]"
            style={{ width: `${progressPercent(task)}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-3 text-[11px] text-[var(--color-ink-muted)]">
          <span className="truncate">{finishLabel()}</span>
          <div className="flex min-h-[26px] items-center justify-end">
            {action}
          </div>
        </div>
      </div>
    </div>
  )
}

function RewardPill({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface-1)] px-2 py-0.5 font-semibold text-[var(--color-ink-secondary)] shadow-sm backdrop-blur">
      {icon}
      {children}
    </span>
  )
}
