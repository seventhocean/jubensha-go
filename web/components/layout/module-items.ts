import type * as React from "react"
import { CircleHelp, FileText, MessageCircle, MessageSquare } from "lucide-react"

import type { SiteConfig } from "@/lib/api/types"
import type { TFunction } from "@/lib/i18n"

export interface ModuleItem {
  command: string
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export function moduleItems(
  config: SiteConfig | null,
  t: TFunction
): ModuleItem[] {
  const enabledModules = config?.modules
  const items: ModuleItem[] = []

  if (enabledModules?.tweet) {
    items.push({
      command: "tweet",
      name: t("common.createBtn.tweet"),
      href: "/topic/create?type=1",
      icon: MessageCircle,
    })
  }
  if (enabledModules?.topic) {
    items.push({
      command: "topic",
      name: t("common.createBtn.topic"),
      href: "/topic/create",
      icon: MessageSquare,
    })
  }
  if (enabledModules?.qa) {
    items.push({
      command: "qa",
      name: t("common.createBtn.qa"),
      href: "/topic/create?type=2",
      icon: CircleHelp,
    })
  }
  if (enabledModules?.article) {
    items.push({
      command: "article",
      name: t("common.createBtn.article"),
      href: "/article/create",
      icon: FileText,
    })
  }

  return items
}
