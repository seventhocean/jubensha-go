import { serverApiFetch as apiFetch } from "./server"

import type { GroupItem, GroupMember, PageData, Topic } from "./types"

export function getGroupList() {
  return apiFetch<GroupItem[]>("/api/group/list")
}

export function getGroupNavs() {
  return apiFetch<GroupItem[]>("/api/group/navs")
}

export function getGroup(slug: string) {
  return apiFetch<GroupItem>(`/api/group/${slug}`)
}

export function joinGroup(groupId: number) {
  return apiFetch<void>("/api/group/join", {
    method: "POST",
    body: { groupId },
  })
}

export function leaveGroup(groupId: number) {
  return apiFetch<void>("/api/group/leave", {
    method: "POST",
    body: { groupId },
  })
}

export function getGroupMembers(groupId: number, cursor?: string) {
  return apiFetch<PageData<GroupMember>>("/api/group/members", {
    params: { groupId, cursor },
  })
}

export function getGroupTopics(groupId: number, cursor?: string) {
  return apiFetch<PageData<Topic>>("/api/group/topics", {
    params: { groupId, cursor },
  })
}

export function getGroupStickyTopics(groupId: number) {
  return apiFetch<Topic[]>("/api/group/sticky_topics", {
    params: { groupId },
  })
}
