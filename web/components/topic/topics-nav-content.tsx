"use client"

import Link from "@/components/common/link"
import * as React from "react"
import { useNavigate } from "react-router"
import {
  Bookmark,
  Camera,
  CircleHelp,
  Code,
  Coffee,
  Compass,
  Flame,
  Gamepad2,
  Globe,
  Heart,
  Layout,
  Megaphone,
  MessageSquare,
  Music,
  FileText,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { apiFetch } from "@/lib/api/client"
import { getGroupNavs } from "@/lib/api/groups"
import type { Channel, GroupItem, TopicNode } from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  heart: Heart,
  sparkles: Sparkles,
  flame: Flame,
  star: Star,
  zap: Zap,
  bookmark: Bookmark,
  globe: Globe,
  megaphone: Megaphone,
  trophy: Trophy,
  layout: Layout,
  users: Users,
  "file-text": FileText,
  "message-square": MessageSquare,
  "circle-help": CircleHelp,
  coffee: Coffee,
  gamepad2: Gamepad2,
  camera: Camera,
  music: Music,
  code: Code,
}

let cachedChannels: Channel[] | null = null

function ChannelIcon({ icon }: { icon: string }) {
  // If it's a URL (http or starts with /), render as image
  if (icon.startsWith("http") || icon.startsWith("/")) {
    return <img src={icon} alt="" className="h-4 w-4 shrink-0 rounded-sm object-cover" />
  }
  // Otherwise look up lucide icon
  const IconComponent = iconMap[icon.toLowerCase()]
  if (IconComponent) {
    return <IconComponent className="h-4 w-4 shrink-0" />
  }
  return <Compass className="h-4 w-4 shrink-0" />
}


export function TopicsNavContent({
  initialNodes,
  currentNodeId,
  currentRootNodeId,
}: {
  initialNodes: TopicNode[]
  currentNodeId?: number
  currentRootNodeId?: number
}) {
  const [groups, setGroups] = React.useState<GroupItem[]>([])
  const [channels, setChannels] = React.useState<Channel[]>([])
  const { t } = useI18n()
  const navigate = useNavigate()

  React.useEffect(() => {
    let mounted = true
    getGroupNavs().then((data) => {
      if (mounted && data) {
        setGroups(data)
      }
    }).catch(() => undefined)

    return () => {
      mounted = false
    }
  }, [])

  React.useEffect(() => {
    if (cachedChannels) {
      setChannels(cachedChannels)
      return
    }
    let mounted = true
    apiFetch<Channel[]>("/api/channel/channels")
      .then((data) => {
        if (mounted && data) {
          cachedChannels = data
          setChannels(data)
        }
      })
      .catch(() => undefined)

    return () => {
      mounted = false
    }
  }, [])

  const handleChannelClick = React.useCallback(
    (e: React.MouseEvent, href: string) => {
      if (href.startsWith("/?tab=")) {
        e.preventDefault()
        navigate(href)
      }
    },
    [navigate]
  )

  return (
    <div className="topics-nav">
      <nav className="dock-nav">
        <ScrollArea className="topics-scroll-area">
          {/* Channels section */}
          {channels.length > 0 ? (
            <>
              <div className="section-label">
                {t("pages.home.sidebar.channels")}
              </div>
              <ul>
                {channels.map((channel) => {
                  const isAll = channel.href === "/?tab=all"
                  const isFollowing = channel.href === "/?tab=following"
                  let isActive: boolean
                  if (isAll) {
                    isActive = currentNodeId === undefined && !currentRootNodeId
                  } else if (isFollowing) {
                    isActive = currentNodeId === -2
                  } else {
                    const currentUrl = typeof window !== "undefined"
                      ? window.location.pathname + window.location.search
                      : ""
                    isActive = currentUrl === channel.href
                  }
                  return (
                    <li key={channel.id} className={cn(isActive && "active")}>
                      <a
                        href={channel.href}
                        onClick={(e) => handleChannelClick(e, channel.href)}
                      >
                        <ChannelIcon icon={channel.icon} />
                        <div className="node-name">{channel.nameEn || channel.name}</div>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <>
              <div className="section-label">
                {t("pages.home.sidebar.channels")}
              </div>
              <ul>
                <li className={cn(currentNodeId === undefined && !currentRootNodeId && "active")}>
                  <a
                    href="/?tab=all"
                    onClick={(e) => handleChannelClick(e, "/?tab=all")}
                  >
                    <Compass className="h-4 w-4 shrink-0" />
                    <div className="node-name">{t("pages.home.tabs.all")}</div>
                  </a>
                </li>
                <li className={cn(currentNodeId === -2 && "active")}>
                  <a
                    href="/?tab=following"
                    onClick={(e) => handleChannelClick(e, "/?tab=following")}
                  >
                    <Heart className="h-4 w-4 shrink-0" />
                    <div className="node-name">{t("pages.home.tabs.following")}</div>
                  </a>
                </li>
              </ul>
            </>
          )}

          {/* My Groups section */}
          {groups.length > 0 && (
            <>
              <div className="section-label">
                {t("pages.home.sidebar.myGroups")}
              </div>
              <ul>
                {groups.map((group) => (
                  <li key={group.id} data-node-id={-1000 - group.id}>
                    <Link href={`/groups/${group.slug}`}>
                      <i
                        className="node-logo"
                        style={
                          group.icon
                            ? { backgroundImage: `url(${group.icon})` }
                            : undefined
                        }
                      />
                      <div className="node-name">{group.name}</div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="px-3">
                <Link
                  href="/groups"
                  className="block py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {t("common.nav.viewAll")}
                </Link>
              </div>
            </>
          )}
        </ScrollArea>
      </nav>
    </div>
  )
}
