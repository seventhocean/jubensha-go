package repositories

import (
	"bbs-go/internal/models"

	"bbs-go/internal/pkg/params"

	"github.com/mlogclub/simple/sqls"
	"gorm.io/gorm"
)

var GroupRepository = newGroupRepository()

func newGroupRepository() *groupRepository {
	return &groupRepository{}
}

type groupRepository struct {
}

func (r *groupRepository) Get(db *gorm.DB, id int64) *models.Group {
	ret := &models.Group{}
	if err := db.First(ret, "id = ?", id).Error; err != nil {
		return nil
	}
	return ret
}

func (r *groupRepository) Take(db *gorm.DB, where ...interface{}) *models.Group {
	ret := &models.Group{}
	if err := db.Take(ret, where...).Error; err != nil {
		return nil
	}
	return ret
}

func (r *groupRepository) Find(db *gorm.DB, cnd *sqls.Cnd) (list []models.Group) {
	cnd.Find(db, &list)
	return
}

func (r *groupRepository) FindOne(db *gorm.DB, cnd *sqls.Cnd) *models.Group {
	ret := &models.Group{}
	if err := cnd.FindOne(db, &ret); err != nil {
		return nil
	}
	return ret
}

func (r *groupRepository) FindPageByParams(db *gorm.DB, params *params.QueryParams) (list []models.Group, paging *sqls.Paging) {
	return r.FindPageByCnd(db, &params.Cnd)
}

func (r *groupRepository) FindPageByCnd(db *gorm.DB, cnd *sqls.Cnd) (list []models.Group, paging *sqls.Paging) {
	cnd.Find(db, &list)
	count := cnd.Count(db, &models.Group{})

	paging = &sqls.Paging{
		Page:  cnd.Paging.Page,
		Limit: cnd.Paging.Limit,
		Total: count,
	}
	return
}

func (r *groupRepository) Create(db *gorm.DB, t *models.Group) (err error) {
	err = db.Create(t).Error
	return
}

func (r *groupRepository) Update(db *gorm.DB, t *models.Group) (err error) {
	err = db.Save(t).Error
	return
}

func (r *groupRepository) Updates(db *gorm.DB, id int64, columns map[string]interface{}) (err error) {
	err = db.Model(&models.Group{}).Where("id = ?", id).Updates(columns).Error
	return
}

func (r *groupRepository) UpdateColumn(db *gorm.DB, id int64, name string, value interface{}) (err error) {
	err = db.Model(&models.Group{}).Where("id = ?", id).UpdateColumn(name, value).Error
	return
}

func (r *groupRepository) Delete(db *gorm.DB, id int64) {
	db.Delete(&models.Group{}, "id = ?", id)
}
