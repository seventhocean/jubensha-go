import { serverApiFetch as apiFetch } from "./server"

import type { GroupCheckInRankItem, GroupCheckInStatus, GroupItem, GroupMember, PageData, Topic } from "./types"

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

export function getGroupTopics(groupId: number, cursor?: string, sort?: string, page?: number) {
  return apiFetch<PageData<Topic>>("/api/group/topics", {
    params: { groupId, cursor, sort, page },
  })
}

export function getGroupStickyTopics(groupId: number) {
  return apiFetch<Topic[]>("/api/group/sticky_topics", {
    params: { groupId },
  })
}

export function getGroupHotTopics(groupId: number) {
  return apiFetch<Topic[]>("/api/group/hot_topics", {
    params: { groupId },
  })
}

export function createGroup(data: {
  name: string
  slug: string
  description?: string
  icon?: string
  banner?: string
}) {
  return apiFetch<GroupItem>("/api/group/create", {
    method: "POST",
    body: data,
  })
}

export function updateGroup(data: {
  groupId: number
  name?: string
  description?: string
  icon?: string
  banner?: string
  notice?: string
  rules?: string
}) {
  return apiFetch<GroupItem>("/api/group/update", {
    method: "POST",
    body: data,
  })
}

export function setMemberRole(groupId: number, userId: string, role: number) {
  return apiFetch<void>("/api/group/set_member_role", {
    method: "POST",
    body: { groupId, userId: Number(userId), role },
  })
}

export function kickMember(groupId: number, userId: string) {
  return apiFetch<void>("/api/group/kick_member", {
    method: "POST",
    body: { groupId, userId: Number(userId) },
  })
}

export function groupCheckIn(groupId: number) {
  return apiFetch<GroupCheckInStatus>("/api/group/checkin", {
    method: "POST",
    body: { groupId },
  })
}

export function getGroupCheckInStatus(groupId: number) {
  return apiFetch<GroupCheckInStatus>("/api/group/checkin_status", {
    params: { groupId },
  })
}

export function getGroupCheckInRank(groupId: number) {
  return apiFetch<GroupCheckInRankItem[]>("/api/group/checkin_rank", {
    params: { groupId },
  })
}

export interface GroupPageData {
  group: GroupItem
  topics: PageData<Topic>
  stickyTopics: Topic[]
  members: PageData<GroupMember>
  checkinStatus?: GroupCheckInStatus
  checkinRank: GroupCheckInRankItem[]
}

export function getGroupPage(slug: string) {
  return apiFetch<GroupPageData>(`/api/group/${slug}/page`)
}
