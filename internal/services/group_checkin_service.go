package services

import (
	"bbs-go/internal/models"
	"bbs-go/internal/repositories"
	"errors"
	"time"

	"github.com/mlogclub/simple/common/dates"
	"github.com/mlogclub/simple/sqls"
)

var GroupCheckInService = newGroupCheckInService()

func newGroupCheckInService() *groupCheckInService {
	return &groupCheckInService{}
}

type groupCheckInService struct{}

func groupCheckInTodayDate() int {
	now := time.Now()
	return now.Year()*10000 + int(now.Month())*100 + now.Day()
}

func groupCheckInYesterdayDate() int {
	yesterday := time.Now().AddDate(0, 0, -1)
	return yesterday.Year()*10000 + int(yesterday.Month())*100 + yesterday.Day()
}

func (s *groupCheckInService) CheckIn(userId, groupId int64) error {
	today := groupCheckInTodayDate()
	// Check if already checked in today
	existing := repositories.GroupCheckInRepository.GetByGroupUserDate(sqls.DB(), groupId, userId, today)
	if existing != nil {
		return errors.New("already checked in today")
	}
	// Calculate consecutive days
	consecutiveDays := 1
	yesterday := groupCheckInYesterdayDate()
	yesterdayRecord := repositories.GroupCheckInRepository.GetByGroupUserDate(sqls.DB(), groupId, userId, yesterday)
	if yesterdayRecord != nil {
		consecutiveDays = yesterdayRecord.ConsecutiveDays + 1
	}
	record := &models.GroupCheckIn{
		GroupId:         groupId,
		UserId:          userId,
		CheckInDate:     today,
		ConsecutiveDays: consecutiveDays,
		CreateTime:      dates.NowTimestamp(),
	}
	return repositories.GroupCheckInRepository.Create(sqls.DB(), record)
}

func (s *groupCheckInService) GetStatus(userId, groupId int64) (bool, int) {
	today := groupCheckInTodayDate()
	record := repositories.GroupCheckInRepository.GetByGroupUserDate(sqls.DB(), groupId, userId, today)
	if record != nil {
		return true, record.ConsecutiveDays
	}
	return false, 0
}

func (s *groupCheckInService) GetRank(groupId int64) []models.GroupCheckIn {
	return repositories.GroupCheckInRepository.GetTopByConsecutiveDays(sqls.DB(), groupId, 10)
}
