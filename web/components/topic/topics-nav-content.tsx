"use client"

import Link from "@/components/common/link"
import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { apiFetch } from "@/lib/api/client"
import { getGroupNavs } from "@/lib/api/groups"
import type { GroupItem, TopicNode } from "@/lib/api/types"
import { cn } from "@/lib/utils"

function isBuiltInNode(node: TopicNode) {
  return node.id <= 0
}

function nodeHref(node: TopicNode) {
  if (node.id > 0) {
    return `/topics/node/${node.id}`
  }
  if (node.id === 0) {
    return "/topics/node/newest"
  }
  if (node.id === -1) {
    return "/topics/node/recommend"
  }
  return "/topics/node/feed"
}

function isActiveNode(
  node: TopicNode,
  currentNodeId?: number,
  currentRootNodeId?: number
) {
  if (isBuiltInNode(node)) {
    return currentNodeId === node.id
  }
  return currentRootNodeId === node.id
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

  return (
    <div className="topics-nav">
      <nav className="dock-nav">
        <ScrollArea className="topics-scroll-area">
          <ul>
            {nodes.map((node, index) => {
              const previousNode = nodes[index - 1]
              const showDivider =
                index > 0 &&
                previousNode &&
                isBuiltInNode(previousNode) &&
                !isBuiltInNode(node)
              const active = isActiveNode(
                node,
                currentNodeId,
                currentRootNodeId
              )

              return (
                <React.Fragment key={node.id}>
                  {showDivider ? (
                    <li className="nodes-divider" aria-hidden="true" />
                  ) : null}
                  <li className={cn(active && "active")} data-node-id={node.id}>
                    <Link href={nodeHref(node)}>
                      <i
                        className="node-logo"
                        style={
                          node.logo
                            ? { backgroundImage: `url(${node.logo})` }
                            : undefined
                        }
                      />
                      <div className="node-name">{node.name}</div>
                    </Link>
                  </li>
                </React.Fragment>
              )
            })}
          </ul>
          {groups.length > 0 ? (
            <div className="px-3 pb-2">
              <div className="nodes-divider" aria-hidden="true" />
              <div className="text-xs text-muted-foreground/60 px-2 py-1">
                Groups
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
            </div>
          ) : null}
        </ScrollArea>
      </nav>
    </div>
  )
}
