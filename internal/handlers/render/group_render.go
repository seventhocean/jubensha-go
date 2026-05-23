package render

import (
	"bbs-go/internal/models"
	"bbs-go/internal/models/resp"
	"bbs-go/internal/services"
)

func BuildGroup(group *models.Group, joined bool) *resp.GroupResponse {
	return buildGroup(group, joined, false)
}

func BuildGroupWithPermission(group *models.Group, joined bool, userId int64) *resp.GroupResponse {
	canManage := userId > 0 && (group.OwnerId == userId || services.PermissionService.HasPermission(
		&models.User{Model: models.Model{Id: userId}}, "dashboard.group.update"))
	return buildGroup(group, joined, canManage)
}

func buildGroup(group *models.Group, joined, canManage bool) *resp.GroupResponse {
	if group == nil {
		return nil
	}
	return &resp.GroupResponse{
		Id:          group.Id,
		Name:        group.Name,
		Slug:        group.Slug,
		Description: group.Description,
		Icon:        group.Icon,
		Banner:      group.Banner,
		Notice:      group.Notice,
		Rules:       group.Rules,
		Visibility:  group.Visibility,
		IsDefault:   group.IsDefault,
		ShowInNav:   group.ShowInNav,
		OwnerId:     group.OwnerId,
		MemberCount: group.MemberCount,
		TopicCount:  group.TopicCount,
		Joined:      joined,
		CanManage:   canManage,
		CreateTime:  group.CreateTime,
	}
}

func BuildGroups(groups []models.Group, joinedMap map[int64]bool) []resp.GroupResponse {
	if len(groups) == 0 {
		return nil
	}
	var ret []resp.GroupResponse
	for _, g := range groups {
		ret = append(ret, *buildGroup(&g, joinedMap[g.Id], false))
	}
	return ret
}

func BuildGroupsWithPermission(groups []models.Group, joinedMap map[int64]bool, userId int64) []resp.GroupResponse {
	if len(groups) == 0 {
		return nil
	}
	canManage := userId > 0 && services.PermissionService.HasPermission(
		&models.User{Model: models.Model{Id: userId}}, "dashboard.group.update")
	var ret []resp.GroupResponse
	for _, g := range groups {
		cm := canManage || g.OwnerId == userId
		ret = append(ret, *buildGroup(&g, joinedMap[g.Id], cm))
	}
	return ret
}

func BuildGroupMember(member *models.GroupMember, userInfo *resp.UserInfo) *resp.GroupMemberResponse {
	if member == nil {
		return nil
	}
	return &resp.GroupMemberResponse{
		Id:         member.Id,
		GroupId:    member.GroupId,
		User:       userInfo,
		Role:       member.Role,
		CreateTime: member.CreateTime,
	}
}

func BuildGroupCheckInRank(records []models.GroupCheckIn) []resp.GroupCheckInRankItem {
	var items []resp.GroupCheckInRankItem
	for _, r := range records {
		userInfo := BuildUserInfoDefaultIfNull(r.UserId)
		if userInfo != nil {
			items = append(items, resp.GroupCheckInRankItem{
				User:            userInfo,
				ConsecutiveDays: r.ConsecutiveDays,
			})
		}
	}
	if items == nil {
		items = []resp.GroupCheckInRankItem{}
	}
	return items
}
