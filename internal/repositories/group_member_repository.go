package repositories

import (
	"bbs-go/internal/models"

	"bbs-go/internal/pkg/params"

	"github.com/mlogclub/simple/sqls"
	"gorm.io/gorm"
)

var GroupMemberRepository = newGroupMemberRepository()

func newGroupMemberRepository() *groupMemberRepository {
	return &groupMemberRepository{}
}

type groupMemberRepository struct {
}

func (r *groupMemberRepository) Get(db *gorm.DB, id int64) *models.GroupMember {
	ret := &models.GroupMember{}
	if err := db.First(ret, "id = ?", id).Error; err != nil {
		return nil
	}
	return ret
}

func (r *groupMemberRepository) Take(db *gorm.DB, where ...interface{}) *models.GroupMember {
	ret := &models.GroupMember{}
	if err := db.Take(ret, where...).Error; err != nil {
		return nil
	}
	return ret
}

func (r *groupMemberRepository) Find(db *gorm.DB, cnd *sqls.Cnd) (list []models.GroupMember) {
	cnd.Find(db, &list)
	return
}

func (r *groupMemberRepository) FindOne(db *gorm.DB, cnd *sqls.Cnd) *models.GroupMember {
	ret := &models.GroupMember{}
	if err := cnd.FindOne(db, &ret); err != nil {
		return nil
	}
	return ret
}

func (r *groupMemberRepository) FindPageByParams(db *gorm.DB, params *params.QueryParams) (list []models.GroupMember, paging *sqls.Paging) {
	return r.FindPageByCnd(db, &params.Cnd)
}

func (r *groupMemberRepository) FindPageByCnd(db *gorm.DB, cnd *sqls.Cnd) (list []models.GroupMember, paging *sqls.Paging) {
	cnd.Find(db, &list)
	count := cnd.Count(db, &models.GroupMember{})

	paging = &sqls.Paging{
		Page:  cnd.Paging.Page,
		Limit: cnd.Paging.Limit,
		Total: count,
	}
	return
}

func (r *groupMemberRepository) Create(db *gorm.DB, t *models.GroupMember) (err error) {
	err = db.Create(t).Error
	return
}

func (r *groupMemberRepository) Update(db *gorm.DB, t *models.GroupMember) (err error) {
	err = db.Save(t).Error
	return
}

func (r *groupMemberRepository) Updates(db *gorm.DB, id int64, columns map[string]interface{}) (err error) {
	err = db.Model(&models.GroupMember{}).Where("id = ?", id).Updates(columns).Error
	return
}

func (r *groupMemberRepository) UpdateColumn(db *gorm.DB, id int64, name string, value interface{}) (err error) {
	err = db.Model(&models.GroupMember{}).Where("id = ?", id).UpdateColumn(name, value).Error
	return
}

func (r *groupMemberRepository) Delete(db *gorm.DB, id int64) {
	db.Delete(&models.GroupMember{}, "id = ?", id)
}

func (r *groupMemberRepository) GetByGroupAndUser(db *gorm.DB, groupId, userId int64) *models.GroupMember {
	ret := &models.GroupMember{}
	if err := db.Where("group_id = ? and user_id = ?", groupId, userId).First(ret).Error; err != nil {
		return nil
	}
	return ret
}

func (r *groupMemberRepository) Count(db *gorm.DB, groupId int64) int64 {
	var count int64
	db.Model(&models.GroupMember{}).Where("group_id = ?", groupId).Count(&count)
	return count
}

func (r *groupMemberRepository) FindByGroupId(db *gorm.DB, groupId int64, cursor int64, limit int) (list []models.GroupMember) {
	if cursor > 0 {
		db = db.Where("id < ?", cursor)
	}
	db.Where("group_id = ?", groupId).Order("id desc").Limit(limit).Find(&list)
	return
}
