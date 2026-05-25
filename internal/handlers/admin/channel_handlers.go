package admin

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"bbs-go/internal/cache"
	"bbs-go/internal/models"
	"bbs-go/internal/pkg/ginx"
	"bbs-go/internal/pkg/params"
	"bbs-go/internal/services"

	"github.com/mlogclub/simple/common/dates"
	"github.com/mlogclub/simple/web"
)

func ChannelDetail(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ginx.WriteJSON(ctx, err)
		return
	}

	t := services.ChannelService.Get(id)
	if t == nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("Not found, id="+strconv.FormatInt(id, 10)))
		return
	}
	ginx.WriteJSON(ctx, t)
}

func ChannelList(ctx *gin.Context) {
	list, paging := services.ChannelService.FindPageByCnd(params.NewPagedSqlCnd(ctx,
		params.QueryFilter{
			ParamName: "name",
			Op:        params.Like,
		},
		params.QueryFilter{
			ParamName: "visible",
			Op:        params.Eq,
		},
	))
	ginx.WriteJSON(ctx, &web.PageResult{Results: list, Page: paging})
}

func ChannelCreate(ctx *gin.Context) {
	t := &models.Channel{}
	err := ginx.Bind(ctx, t)
	if err != nil {
		ginx.WriteJSON(ctx, err)
		return
	}
	t.CreateTime = dates.NowTimestamp()
	t.UpdateTime = dates.NowTimestamp()

	err = services.ChannelService.Create(t)
	if err != nil {
		ginx.WriteJSON(ctx, err)
		return
	}
	cache.ChannelCache.Invalidate()
	ginx.WriteJSON(ctx, t)
}

func ChannelUpdate(ctx *gin.Context) {
	id, err := params.FormValueInt64(ctx, "id")
	if err != nil {
		ginx.WriteJSON(ctx, err)
		return
	}
	t := services.ChannelService.Get(id)
	if t == nil {
		ginx.WriteJSON(ctx, ginx.ErrorMessage("entity not found"))
		return
	}

	err = ginx.Bind(ctx, t)
	if err != nil {
		ginx.WriteJSON(ctx, err)
		return
	}
	t.UpdateTime = dates.NowTimestamp()

	err = services.ChannelService.Update(t)
	if err != nil {
		ginx.WriteJSON(ctx, err)
		return
	}
	cache.ChannelCache.Invalidate()
	ginx.WriteJSON(ctx, t)
}

func ChannelDelete(ctx *gin.Context) {
	id, err := params.FormValueInt64(ctx, "id")
	if err != nil {
		ginx.WriteJSON(ctx, err)
		return
	}
	services.ChannelService.Delete(id)
	cache.ChannelCache.Invalidate()
	ginx.WriteJSON(ctx, nil)
}

type channelSortItem struct {
	Id     int64 `json:"id"`
	SortNo int   `json:"sortNo"`
}

func ChannelUpdateSort(ctx *gin.Context) {
	var items []channelSortItem
	if err := ctx.ShouldBindJSON(&items); err != nil {
		ginx.WriteJSON(ctx, err)
		return
	}
	for _, item := range items {
		_ = services.ChannelService.Updates(item.Id, map[string]interface{}{
			"sort_no":     item.SortNo,
			"update_time": dates.NowTimestamp(),
		})
	}
	cache.ChannelCache.Invalidate()
	ginx.WriteJSON(ctx, nil)
}
