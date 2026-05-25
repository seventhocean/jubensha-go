import type * as React from "react"
import { FileText, MessageSquare } from "lucide-react"

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

  if (enabledModules?.topic || enabledModules?.qa) {
    items.push({
      command: "topic",
      name: t("common.createBtn.topic"),
      href: "/topic/create",
      icon: MessageSquare,
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
