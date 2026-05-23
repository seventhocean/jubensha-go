package services

import (
	"bbs-go/internal/models"
	"bbs-go/internal/models/constants"
	"bbs-go/internal/pkg/locales"
	"bbs-go/internal/pkg/params"
	"bbs-go/internal/repositories"
	"errors"

	"github.com/mlogclub/simple/common/dates"
	"github.com/mlogclub/simple/sqls"
	"gorm.io/gorm"
)

var GroupService = newGroupService()

func newGroupService() *groupService {
	return &groupService{}
}

type groupService struct {
}

func (s *groupService) Get(id int64) *models.Group {
	return repositories.GroupRepository.Get(sqls.DB(), id)
}

func (s *groupService) Take(where ...interface{}) *models.Group {
	return repositories.GroupRepository.Take(sqls.DB(), where...)
}

func (s *groupService) Find(cnd *sqls.Cnd) []models.Group {
	return repositories.GroupRepository.Find(sqls.DB(), cnd)
}

func (s *groupService) FindOne(cnd *sqls.Cnd) *models.Group {
	return repositories.GroupRepository.FindOne(sqls.DB(), cnd)
}

func (s *groupService) FindPageByParams(params *params.QueryParams) (list []models.Group, paging *sqls.Paging) {
	return repositories.GroupRepository.FindPageByParams(sqls.DB(), params)
}

func (s *groupService) FindPageByCnd(cnd *sqls.Cnd) (list []models.Group, paging *sqls.Paging) {
	return repositories.GroupRepository.FindPageByCnd(sqls.DB(), cnd)
}

func (s *groupService) Create(t *models.Group) error {
	return repositories.GroupRepository.Create(sqls.DB(), t)
}

func (s *groupService) Update(t *models.Group) error {
	return repositories.GroupRepository.Update(sqls.DB(), t)
}

func (s *groupService) Updates(id int64, columns map[string]interface{}) error {
	return repositories.GroupRepository.Updates(sqls.DB(), id, columns)
}

func (s *groupService) Delete(id int64) {
	repositories.GroupRepository.Delete(sqls.DB(), id)
}

func (s *groupService) GetBySlug(slug string) *models.Group {
	return repositories.GroupRepository.Take(sqls.DB(), "slug = ? and status = ?", slug, constants.StatusOk)
}

func (s *groupService) GetNavGroups() []models.Group {
	return repositories.GroupRepository.Find(sqls.DB(), sqls.NewCnd().
		Eq("status", constants.StatusOk).
		Eq("show_in_nav", 1).
		Asc("sort_no"))
}

func (s *groupService) GetPublicGroups() []models.Group {
	return repositories.GroupRepository.Find(sqls.DB(), sqls.NewCnd().
		Eq("status", constants.StatusOk).
		Eq("visibility", 0).
		Asc("sort_no").Desc("id"))
}

func (s *groupService) GetDefaultGroup() *models.Group {
	return repositories.GroupRepository.Take(sqls.DB(), "slug = ? and status = ?", "public", constants.StatusOk)
}

func (s *groupService) Join(userId, groupId int64) error {
	group := s.Get(groupId)
	if group == nil || group.Status != constants.StatusOk {
		return errors.New(locales.Get("group.not_found"))
	}
	if s.IsMember(groupId, userId) {
		return errors.New(locales.Get("group.already_joined"))
	}
	if group.Visibility == 1 {
		return errors.New(locales.Get("group.private_group"))
	}
	member := &models.GroupMember{
		GroupId:    groupId,
		UserId:     userId,
		CreateTime: dates.NowTimestamp(),
	}
	if err := repositories.GroupMemberRepository.Create(sqls.DB(), member); err != nil {
		return err
	}
	return repositories.GroupRepository.Updates(sqls.DB(), groupId, map[string]interface{}{
		"member_count": group.MemberCount + 1,
	})
}

func (s *groupService) Leave(userId, groupId int64) error {
	group := s.Get(groupId)
	if group == nil || group.Status != constants.StatusOk {
		return errors.New(locales.Get("group.not_found"))
	}
	if group.OwnerId == userId {
		return errors.New(locales.Get("group.owner_cannot_leave"))
	}
	member := repositories.GroupMemberRepository.GetByGroupAndUser(sqls.DB(), groupId, userId)
	if member == nil {
		return errors.New(locales.Get("group.not_joined"))
	}
	repositories.GroupMemberRepository.Delete(sqls.DB(), member.Id)
	return repositories.GroupRepository.Updates(sqls.DB(), groupId, map[string]interface{}{
		"member_count": group.MemberCount - 1,
	})
}

func (s *groupService) IsMember(groupId, userId int64) bool {
	return repositories.GroupMemberRepository.GetByGroupAndUser(sqls.DB(), groupId, userId) != nil
}

func (s *groupService) GetMembers(groupId int64, cursor int64) ([]models.GroupMember, int64, bool) {
	const limit = 50
	list := repositories.GroupMemberRepository.FindByGroupId(sqls.DB(), groupId, cursor, limit+1)
	hasMore := len(list) > limit
	if hasMore {
		list = list[:limit]
	}
	var nextCursor int64
	if len(list) > 0 {
		nextCursor = list[len(list)-1].Id
	}
	return list, nextCursor, hasMore
}

func (s *groupService) GetGroupTopics(groupId int64, cursor int64) ([]models.Topic, int64, bool) {
	const limit = 20
	db := sqls.DB().Where("group_id = ? and status = ?", groupId, constants.StatusOk)
	if cursor > 0 {
		db = db.Where("id < ?", cursor)
	}
	var topics []models.Topic
	db.Order("id desc").Limit(limit + 1).Find(&topics)

	hasMore := len(topics) > limit
	if hasMore {
		topics = topics[:limit]
	}
	var nextCursor int64
	if len(topics) > 0 {
		nextCursor = topics[len(topics)-1].Id
	}
	return topics, nextCursor, hasMore
}

func (s *groupService) GetUserJoinedGroupIds(userId int64) map[int64]bool {
	members := repositories.GroupMemberRepository.Find(sqls.DB(), sqls.NewCnd().Eq("user_id", userId))
	result := make(map[int64]bool)
	for _, m := range members {
		result[m.GroupId] = true
	}
	return result
}

func (s *groupService) AddTopicCount(groupId int64) {
	if groupId <= 0 {
		return
	}
	repositories.GroupRepository.UpdateColumn(sqls.DB(), groupId, "topic_count", gorm.Expr("topic_count + 1"))
}

func (s *groupService) ValidateGroup(groupId int64) error {
	if groupId <= 0 {
		return nil
	}
	group := s.Get(groupId)
	if group == nil || group.Status != constants.StatusOk {
		return errors.New(locales.Get("group.not_found"))
	}
	if group.Visibility == 1 {
		return errors.New(locales.Get("group.private_group"))
	}
	return nil
}

func (s *groupService) GetNextSortNo() int {
	var maxSortNo int
	sqls.DB().Model(&models.Group{}).Select("COALESCE(MAX(sort_no), 0)").Scan(&maxSortNo)
	return maxSortNo + 1
}

func (s *groupService) GetGroupStickyTopics(groupId int64) []models.Topic {
	var topics []models.Topic
	sqls.DB().Where("group_id = ? AND sticky = ? AND status = ?", groupId, true, constants.StatusOk).
		Order("sticky_time desc").Limit(50).Find(&topics)
	return topics
}
