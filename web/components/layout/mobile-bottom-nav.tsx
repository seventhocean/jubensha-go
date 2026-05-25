"use client"

import { FileText, Home, Plus, User, Users } from "lucide-react"
import Link from "@/components/common/link"
import { usePathname } from "@/lib/router/navigation"
import { cn } from "@/lib/utils"
import { useAppConfig, useCurrentUser } from "@/components/app/app-provider"
import { useI18n } from "@/lib/i18n/provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { moduleItems } from "./module-items"

export function MobileBottomNav() {
  const pathname = usePathname()
  const config = useAppConfig()
  const currentUser = useCurrentUser()
  const { t } = useI18n()
  const items = moduleItems(config, t)

  const meHref = currentUser ? `/user/${currentUser.id}` : "/user/signin"

  const tabs = [
    { href: "/", icon: Home, label: t("common.nav.home") },
    { href: "/articles", icon: FileText, label: t("common.nav.articles") },
    { href: "/topic/create", icon: Plus, label: t("common.createBtn.create"), isCreate: true },
    { href: "/groups", icon: Users, label: t("common.nav.groups") },
    { href: meHref, icon: User, label: t("common.nav.me"), isMe: true },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky-header)] flex h-[56px] items-center justify-around border-t border-[var(--color-hairline)] bg-[rgba(255,255,255,0.95)] backdrop-blur-[12px] pb-[env(safe-area-inset-bottom)] dark:bg-[rgba(18,18,26,0.95)] sm:hidden"
      aria-label="Mobile navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.isMe
          ? pathname === meHref || pathname.startsWith(meHref + "/")
          : tab.href === "/"
            ? pathname === "/"
            : pathname === tab.href || pathname.startsWith(tab.href)

        if (tab.isCreate) {
          if (items.length === 0) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[var(--shadow-sm)]"
                aria-label={tab.label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            )
          }

          return (
            <DropdownMenu key={tab.href} modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[var(--shadow-sm)]"
                  aria-label={tab.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="center" sideOffset={12}>
                {items.map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <DropdownMenuItem key={item.command} asChild>
                      <Link href={item.href}>
                        <ItemIcon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[11px]",
              isActive
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-ink-muted)]"
            )}
            aria-label={tab.label}
          >
            <Icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
