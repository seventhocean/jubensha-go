package repositories

import (
	"bbs-go/internal/models"

	"gorm.io/gorm"
)

var GroupCheckInRepository = newGroupCheckInRepository()

func newGroupCheckInRepository() *groupCheckInRepository {
	return &groupCheckInRepository{}
}

type groupCheckInRepository struct{}

func (r *groupCheckInRepository) Create(db *gorm.DB, t *models.GroupCheckIn) error {
	return db.Create(t).Error
}

func (r *groupCheckInRepository) GetByGroupUserDate(db *gorm.DB, groupId, userId int64, date int) *models.GroupCheckIn {
	ret := &models.GroupCheckIn{}
	if err := db.Where("group_id = ? AND user_id = ? AND check_in_date = ?", groupId, userId, date).First(ret).Error; err != nil {
		return nil
	}
	return ret
}

func (r *groupCheckInRepository) GetLatestByGroupUser(db *gorm.DB, groupId, userId int64) *models.GroupCheckIn {
	ret := &models.GroupCheckIn{}
	if err := db.Where("group_id = ? AND user_id = ?", groupId, userId).Order("check_in_date desc").First(ret).Error; err != nil {
		return nil
	}
	return ret
}

func (r *groupCheckInRepository) GetTopByConsecutiveDays(db *gorm.DB, groupId int64, limit int) []models.GroupCheckIn {
	var results []models.GroupCheckIn
	db.Raw(`SELECT gc.* FROM group_check_in gc
		INNER JOIN (
			SELECT user_id, MAX(check_in_date) as max_date
			FROM group_check_in
			WHERE group_id = ?
			GROUP BY user_id
		) latest ON gc.user_id = latest.user_id AND gc.check_in_date = latest.max_date AND gc.group_id = ?
		ORDER BY gc.consecutive_days DESC
		LIMIT ?`, groupId, groupId, limit).Scan(&results)
	return results
}
