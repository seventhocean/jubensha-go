package render

import (
	"bbs-go/internal/models"
	"bbs-go/internal/models/resp"
)

func BuildGroup(group *models.Group, joined bool) *resp.GroupResponse {
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
		OwnerId:     group.OwnerId,
		MemberCount: group.MemberCount,
		TopicCount:  group.TopicCount,
		Joined:      joined,
		CreateTime:  group.CreateTime,
	}
}

func BuildGroups(groups []models.Group, joinedMap map[int64]bool) []resp.GroupResponse {
	if len(groups) == 0 {
		return nil
	}
	var ret []resp.GroupResponse
	for _, g := range groups {
		ret = append(ret, *BuildGroup(&g, joinedMap[g.Id]))
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
		CreateTime: member.CreateTime,
	}
}
