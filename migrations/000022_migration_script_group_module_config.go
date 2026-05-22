package migrations

import (
	"bbs-go/internal/models/constants"
	"bbs-go/internal/repositories"
	"encoding/json"

	"github.com/mlogclub/simple/sqls"
)

func migrate_group_module_config() error {
	config := repositories.SysConfigRepository.GetByKey(sqls.DB(), constants.SysConfigModules)
	if config == nil {
		return nil
	}

	var modules map[string]bool
	if err := json.Unmarshal([]byte(config.Value), &modules); err != nil {
		return nil
	}

	if _, exists := modules["group"]; exists {
		return nil
	}

	modules["group"] = true
	newValue, err := json.Marshal(modules)
	if err != nil {
		return err
	}

	return repositories.SysConfigRepository.UpdateColumn(sqls.DB(), config.Id, "value", string(newValue))
}
