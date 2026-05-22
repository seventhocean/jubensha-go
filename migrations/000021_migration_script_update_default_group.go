package migrations

import (
	"bbs-go/internal/repositories"

	"github.com/mlogclub/simple/sqls"
)

func migrate_update_default_group() error {
	group := repositories.GroupRepository.Take(sqls.DB(), "slug = ?", "public")
	if group == nil {
		return nil
	}
	return repositories.GroupRepository.Updates(sqls.DB(), group.Id, map[string]interface{}{
		"is_default": 1,
	})
}
