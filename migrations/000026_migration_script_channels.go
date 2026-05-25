package migrations

import (
	"bbs-go/internal/models"

	"github.com/mlogclub/simple/common/dates"
	"github.com/mlogclub/simple/sqls"
)

func migrate_channels() error {
	if err := sqls.DB().AutoMigrate(&models.Channel{}); err != nil {
		return err
	}

	now := dates.NowTimestamp()

	channel1 := &models.Channel{
		Name:       "全部",
		NameEn:     "All",
		Icon:       "compass",
		Href:       "/?tab=all",
		SortNo:     0,
		Visible:    true,
		CreateTime: now,
		UpdateTime: now,
	}
	sqls.DB().Where("href = ?", channel1.Href).FirstOrCreate(channel1)

	channel2 := &models.Channel{
		Name:       "关注",
		NameEn:     "Following",
		Icon:       "heart",
		Href:       "/?tab=following",
		SortNo:     1,
		Visible:    true,
		CreateTime: now,
		UpdateTime: now,
	}
	sqls.DB().Where("href = ?", channel2.Href).FirstOrCreate(channel2)

	return nil
}
