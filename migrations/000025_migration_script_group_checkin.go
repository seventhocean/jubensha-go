package migrations

import (
	"bbs-go/internal/models"

	"github.com/mlogclub/simple/sqls"
)

func migrate_group_checkin() error {
	return sqls.DB().AutoMigrate(&models.GroupCheckIn{})
}
