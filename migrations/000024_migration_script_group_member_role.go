package migrations

import (
	"bbs-go/internal/models"

	"github.com/mlogclub/simple/sqls"
)

func migrate_group_member_role() error {
	return sqls.DB().AutoMigrate(&models.GroupMember{})
}
