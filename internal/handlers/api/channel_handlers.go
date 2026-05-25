package api

import (
	"github.com/gin-gonic/gin"

	"bbs-go/internal/cache"
	"bbs-go/internal/pkg/ginx"
)

func ChannelList(ctx *gin.Context) {
	channels := cache.ChannelCache.Get()
	ginx.WriteJSON(ctx, channels)
}
