package migrations

import (
	"bbs-go/internal/models"
	"bbs-go/internal/repositories"

	"github.com/mlogclub/simple/common/dates"
	"github.com/mlogclub/simple/sqls"
)

func migrate_create_default_group() error {
	existing := repositories.GroupRepository.Take(sqls.DB(), "slug = ?", "public")
	if existing != nil {
		return nil
	}
	now := dates.NowTimestamp()
	group := &models.Group{
		Name:        "Public Square",
		Slug:        "public",
		Description: "Public discussion area for all topics",
		Visibility:  0,
		IsDefault:   1,
		OwnerId:     0,
		Status:      0,
		SortNo:      0,
		CreateTime:  now,
		UpdateTime:  now,
	}
	return repositories.GroupRepository.Create(sqls.DB(), group)
}
