"use client"

import Link from "@/components/common/link"
import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { apiFetch } from "@/lib/api/client"
import { getGroupNavs } from "@/lib/api/groups"
import type { GroupItem, TopicNode } from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"

function nodeHref(node: TopicNode) {
  return `/topics/node/${node.id}`
}

function isActiveNode(
  node: TopicNode,
  currentRootNodeId?: number
) {
  return currentRootNodeId === node.id
}

function NodeLogo({ node }: { node: TopicNode }) {
  if (node.logo) {
    return (
      <i
        className="node-logo"
        style={{ backgroundImage: `url(${node.logo})` }}
      />
    )
  }

  return <i className="node-logo" />
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
  const [nodes, setNodes] = React.useState(initialNodes)
  const [groups, setGroups] = React.useState<GroupItem[]>([])
  const { t } = useI18n()

  React.useEffect(() => {
    if (initialNodes.length > 0) return

    let mounted = true
    const timer = window.setTimeout(() => {
      void apiFetch<TopicNode[]>("/api/topic/node_navs")
        .then((data) => {
          if (mounted) {
            setNodes(data)
          }
        })
        .catch(() => undefined)
    }, 0)

    return () => {
      mounted = false
      window.clearTimeout(timer)
    }
  }, [initialNodes.length])

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

  const userNodes = nodes.filter((node) => node.id > 0)

  return (
    <div className="topics-nav">
      <nav className="dock-nav">
        <ScrollArea className="topics-scroll-area">
          {/* Channels section */}
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("pages.home.sidebar.channels")}
          </div>
          <ul>
            <li className={cn(currentNodeId === undefined && !currentRootNodeId && "active")}>
              <Link href="/">
                <div className="node-name">{t("pages.home.tabs.all")}</div>
              </Link>
            </li>
            <li className={cn(currentNodeId === -2 && "active")}>
              <Link href="/topics/node/feed">
                <div className="node-name">{t("pages.home.tabs.following")}</div>
              </Link>
            </li>
          </ul>

          {/* My Groups section */}
          {groups.length > 0 && (
            <React.Fragment>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
            </React.Fragment>
          )}

          {/* Nodes section */}
          {userNodes.length > 0 && (
            <React.Fragment>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("pages.home.sidebar.nodes")}
              </div>
              <ul>
                {userNodes.map((node) => {
                  const active = isActiveNode(node, currentRootNodeId)
                  return (
                    <li
                      key={node.id}
                      className={cn(active && "active")}
                      data-node-id={node.id}
                    >
                      <Link href={nodeHref(node)}>
                        <NodeLogo node={node} />
                        <div className="node-name">{node.name}</div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </React.Fragment>
          )}
        </ScrollArea>
      </nav>
    </div>
  )
}
