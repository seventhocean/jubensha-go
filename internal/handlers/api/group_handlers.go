package api

import (
	"bbs-go/internal/handlers/render"
	"bbs-go/internal/models/resp"
	"bbs-go/internal/pkg/common"
	"bbs-go/internal/pkg/errs"
	"bbs-go/internal/pkg/params"
	"bbs-go/internal/services"
	"regexp"
	"strconv"

	"github.com/gin-gonic/gin"

	"bbs-go/internal/pkg/ginx"
)

// GroupNavs 导航栏群组列表
func GroupNavs(ctx *gin.Context) {
	groups := services.GroupService.GetNavGroups()
	var ret []resp.GroupResponse
	for _, g := range groups {
		ret = append(ret, *render.BuildGroup(&g, false))
	}
	if ret == nil {
		ret = []resp.GroupResponse{}
	}
	ginx.WriteJSON(ctx, ret)
}

// GroupList 公开群组列表
func GroupList(ctx *gin.Context) {
	groups := services.GroupService.GetPublicGroups()
	user := common.GetCurrentUser(ctx)
	joinedMap := make(map[int64]bool)
	if user != nil {
		joinedMap = services.GroupService.GetUserJoinedGroupIds(user.Id)
	}
	ginx.WriteJSON(ctx, render.BuildGroups(groups, joinedMap))
}

// GroupDetail 群组详情
func GroupDetail(ctx *gin.Context) {
	slug := ctx.Param("slug")
	group := services.GroupService.GetBySlug(slug)
	if group == nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("Group not found"))
		return
	}
	user := common.GetCurrentUser(ctx)
	joined := false
	if user != nil {
		joined = services.GroupService.IsMember(group.Id, user.Id)
	}
	ginx.WriteJSON(ctx, render.BuildGroup(group, joined))
}

type groupActionReq struct {
	GroupId int64 `json:"groupId" form:"groupId"`
}

// GroupJoin 加入群组
func GroupJoin(ctx *gin.Context) {
	user := common.GetCurrentUser(ctx)
	if user == nil {
		ginx.WriteJSON(ctx, errs.NotLogin())
		return
	}
	var body groupActionReq
	if err := ginx.Bind(ctx, &body); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	if body.GroupId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	if err := services.GroupService.Join(user.Id, body.GroupId); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage(err.Error()))
		return
	}
	ginx.WriteJSON(ctx, nil)
}

// GroupLeave 退出群组
func GroupLeave(ctx *gin.Context) {
	user := common.GetCurrentUser(ctx)
	if user == nil {
		ginx.WriteJSON(ctx, errs.NotLogin())
		return
	}
	var body groupActionReq
	if err := ginx.Bind(ctx, &body); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	if body.GroupId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	if err := services.GroupService.Leave(user.Id, body.GroupId); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage(err.Error()))
		return
	}
	ginx.WriteJSON(ctx, nil)
}

// GroupMembers 群组成员列表
func GroupMembers(ctx *gin.Context) {
	groupId, _ := params.GetInt64(ctx, "groupId")
	if groupId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	cursor, _ := params.GetInt64(ctx, "cursor")
	members, nextCursor, hasMore := services.GroupService.GetMembers(groupId, cursor)

	var ret []resp.GroupMemberResponse
	for _, m := range members {
		userInfo := render.BuildUserInfoDefaultIfNull(m.UserId)
		if userInfo != nil {
			item := render.BuildGroupMember(&m, userInfo)
			if item != nil {
				ret = append(ret, *item)
			}
		}
	}
	if ret == nil {
		ret = []resp.GroupMemberResponse{}
	}

	ginx.WriteJSON(ctx, ginx.CursorData(ret, strconv.FormatInt(nextCursor, 10), hasMore))
}

// GroupTopics 群组帖子列表
func GroupTopics(ctx *gin.Context) {
	groupId, _ := params.GetInt64(ctx, "groupId")
	if groupId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	cursor, _ := params.GetInt64(ctx, "cursor")
	sort := ctx.Query("sort")

	// For non-ID sorts, use page-based pagination
	page := 0
	if sort == "most_replies" || sort == "most_active" {
		pageStr := ctx.Query("page")
		if pageStr != "" {
			p, err := strconv.Atoi(pageStr)
			if err == nil && p >= 0 {
				page = p
			}
		}
	}

	topics, nextCursor, hasMore := services.GroupService.GetGroupTopics(groupId, cursor, page, sort)

	ginx.WriteJSON(ctx, ginx.CursorData(render.BuildSimpleTopics(ctx, topics), strconv.FormatInt(nextCursor, 10), hasMore))
}

// GroupStickyTopics 群组置顶帖子列表
func GroupStickyTopics(ctx *gin.Context) {
	groupId, _ := params.GetInt64(ctx, "groupId")
	if groupId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	topics := services.GroupService.GetGroupStickyTopics(groupId)
	ginx.WriteJSON(ctx, render.BuildSimpleTopics(ctx, topics))
}

// GroupHotTopics 群组热门帖子列表
func GroupHotTopics(ctx *gin.Context) {
	groupId, _ := params.GetInt64(ctx, "groupId")
	if groupId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	topics := services.GroupService.GetGroupHotTopics(groupId)
	ginx.WriteJSON(ctx, render.BuildSimpleTopics(ctx, topics))
}

type groupUpdateReq struct {
	GroupId     int64  `json:"groupId"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Banner      string `json:"banner"`
	Notice      string `json:"notice"`
	Rules       string `json:"rules"`
}

// GroupUpdate 更新群组设置
func GroupUpdate(ctx *gin.Context) {
	user := common.GetCurrentUser(ctx)
	if user == nil {
		ginx.WriteJSON(ctx, errs.NotLogin())
		return
	}
	var body groupUpdateReq
	if err := ginx.BindJSON(ctx, &body); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("invalid request"))
		return
	}
	if body.GroupId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId is required"))
		return
	}
	group := services.GroupService.Get(body.GroupId)
	if group == nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("group not found"))
		return
	}
	if group.OwnerId != user.Id {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("only the group owner can update settings"))
		return
	}
	columns := map[string]interface{}{
		"description": body.Description,
		"icon":        body.Icon,
		"banner":      body.Banner,
		"notice":      body.Notice,
		"rules":       body.Rules,
	}
	if body.Name != "" {
		columns["name"] = body.Name
	}
	if err := services.GroupService.Updates(body.GroupId, columns); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage(err.Error()))
		return
	}
	updated := services.GroupService.Get(body.GroupId)
	ginx.WriteJSON(ctx, render.BuildGroup(updated, true))
}

type groupCreateReq struct {
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Banner      string `json:"banner"`
}

// GroupCreate 创建群组
func GroupCreate(ctx *gin.Context) {
	user := common.GetCurrentUser(ctx)
	if user == nil {
		ginx.WriteJSON(ctx, errs.NotLogin())
		return
	}
	var body groupCreateReq
	if err := ginx.BindJSON(ctx, &body); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("invalid request"))
		return
	}
	if body.Name == "" {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("name is required"))
		return
	}
	if body.Slug == "" {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("slug is required"))
		return
	}
	// Validate slug format: lowercase alphanumeric with hyphens, 2-64 chars
	slugRegex := regexp.MustCompile(`^[a-z0-9]+(-[a-z0-9]+)*$`)
	if len(body.Slug) < 2 || len(body.Slug) > 64 || !slugRegex.MatchString(body.Slug) {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("slug must be 2-64 characters, lowercase alphanumeric with hyphens only"))
		return
	}
	// Check reserved slugs that would conflict with routes
	reservedSlugs := map[string]bool{
		"create":       true,
		"hot_topics":   true,
		"sticky_topics": true,
		"list":         true,
		"navs":         true,
		"members":      true,
		"topics":       true,
		"join":         true,
		"leave":        true,
	}
	if reservedSlugs[body.Slug] {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("this slug is reserved and cannot be used"))
		return
	}
	group, err := services.GroupService.CreateGroup(user.Id, body.Name, body.Slug, body.Description, body.Icon, body.Banner)
	if err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage(err.Error()))
		return
	}
	ginx.WriteJSON(ctx, render.BuildGroup(group, true))
}

type groupSetMemberRoleReq struct {
	GroupId int64 `json:"groupId"`
	UserId  int64 `json:"userId"`
	Role    int   `json:"role"`
}

// GroupSetMemberRole sets member role (owner only)
func GroupSetMemberRole(ctx *gin.Context) {
	user := common.GetCurrentUser(ctx)
	if user == nil {
		ginx.WriteJSON(ctx, errs.NotLogin())
		return
	}
	var body groupSetMemberRoleReq
	if err := ginx.BindJSON(ctx, &body); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("invalid request"))
		return
	}
	if body.GroupId <= 0 || body.UserId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId and userId are required"))
		return
	}
	if err := services.GroupService.SetMemberRole(user.Id, body.GroupId, body.UserId, body.Role); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage(err.Error()))
		return
	}
	ginx.WriteJSON(ctx, nil)
}

type groupKickMemberReq struct {
	GroupId int64 `json:"groupId"`
	UserId  int64 `json:"userId"`
}

// GroupKickMember removes a member from the group
func GroupKickMember(ctx *gin.Context) {
	user := common.GetCurrentUser(ctx)
	if user == nil {
		ginx.WriteJSON(ctx, errs.NotLogin())
		return
	}
	var body groupKickMemberReq
	if err := ginx.BindJSON(ctx, &body); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("invalid request"))
		return
	}
	if body.GroupId <= 0 || body.UserId <= 0 {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("groupId and userId are required"))
		return
	}
	if err := services.GroupService.KickMember(user.Id, body.GroupId, body.UserId); err != nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage(err.Error()))
		return
	}
	ginx.WriteJSON(ctx, nil)
}
