"use client"

import { Bell, Compass, Home, Plus, User } from "lucide-react"
import Link from "@/components/common/link"
import { usePathname } from "@/lib/router/navigation"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/topic/create", icon: Plus, label: "Create", isCreate: true },
    { href: "/user/messages", icon: Bell, label: "Notifications" },
    { href: "/user/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky-header)] flex h-[56px] items-center justify-around border-t border-[var(--color-hairline)] bg-[rgba(255,255,255,0.95)] backdrop-blur-[12px] pb-[env(safe-area-inset-bottom)] dark:bg-[rgba(18,18,26,0.95)] sm:hidden"
      aria-label="Mobile navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/" && pathname.startsWith(tab.href))

        if (tab.isCreate) {
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
