package cache

import (
	"time"

	"github.com/goburrow/cache"
	"github.com/mlogclub/simple/sqls"

	"bbs-go/internal/models"
	"bbs-go/internal/repositories"
)

type channelCache struct {
	cache cache.LoadingCache
}

var ChannelCache = newChannelCache()

const channelCacheKey = "channels"

func newChannelCache() *channelCache {
	return &channelCache{
		cache: cache.NewLoadingCache(
			func(key cache.Key) (value cache.Value, e error) {
				list := repositories.ChannelRepository.Find(sqls.DB(),
					sqls.NewCnd().Eq("visible", true).Asc("sort_no"))
				value = list
				return
			},
			cache.WithMaximumSize(1),
			cache.WithExpireAfterAccess(30*time.Minute),
		),
	}
}

func (c *channelCache) Get() []models.Channel {
	val, err := c.cache.Get(channelCacheKey)
	if err != nil {
		return []models.Channel{}
	}
	if val != nil {
		return val.([]models.Channel)
	}
	return []models.Channel{}
}

func (c *channelCache) Invalidate() {
	c.cache.Invalidate(channelCacheKey)
}
