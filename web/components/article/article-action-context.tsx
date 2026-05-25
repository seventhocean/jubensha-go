"use client"

import * as React from "react"

import { apiFetch, toFormData } from "@/lib/api/client"
import { useI18n } from "@/lib/i18n/provider"
import { toast, useToastActions } from "@/lib/toast"

type ArticleActionContextValue = {
  articleId: number
  liked: boolean
  favorited: boolean
  likeCount: number
  toggleLike: () => Promise<void>
  toggleFavorite: () => Promise<void>
}

const ArticleActionContext = React.createContext<ArticleActionContextValue | null>(
  null
)

export function ArticleActionProvider({
  articleId,
  initialLiked,
  initialFavorited,
  initialLikeCount,
  children,
}: {
  articleId: number
  initialLiked?: boolean
  initialFavorited?: boolean
  initialLikeCount?: number
  children: React.ReactNode
}) {
  const { t } = useI18n()
  const { catchError } = useToastActions()
  const [liked, setLiked] = React.useState(Boolean(initialLiked))
  const [favorited, setFavorited] = React.useState(Boolean(initialFavorited))
  const [likeCount, setLikeCount] = React.useState(initialLikeCount || 0)
  const [likePending, setLikePending] = React.useState(false)
  const [favoritePending, setFavoritePending] = React.useState(false)

  const toggleLike = React.useCallback(async () => {
    if (likePending) return
    const nextLiked = !liked
    const previousLiked = liked
    const previousCount = likeCount
    setLikePending(true)
    setLiked(nextLiked)
    setLikeCount((current) => (nextLiked ? current + 1 : Math.max(0, current - 1)))

    try {
      await apiFetch(nextLiked ? "/api/like/like" : "/api/like/unlike", {
        method: "POST",
        body: toFormData({ entityType: "article", entityId: articleId }),
      })
      toast.success(
        t(nextLiked ? "component.sideActionBar.likeSuccess" : "component.sideActionBar.likeCancel")
      )
    } catch (error) {
      setLiked(previousLiked)
      setLikeCount(previousCount)
      catchError(error)
    } finally {
      setLikePending(false)
    }
  }, [catchError, likeCount, likePending, liked, t, articleId])

  const toggleFavorite = React.useCallback(async () => {
    if (favoritePending) return
    const nextFavorited = !favorited
    const previousFavorited = favorited
    setFavoritePending(true)
    setFavorited(nextFavorited)

    try {
      await apiFetch(
        nextFavorited ? "/api/favorite/add" : "/api/favorite/delete",
        {
          method: "POST",
          body: toFormData({ entityType: "article", entityId: articleId }),
        }
      )
      toast.success(
        t(nextFavorited ? "component.sideActionBar.favoriteSuccess" : "component.sideActionBar.favoriteCancel")
      )
    } catch (error) {
      setFavorited(previousFavorited)
      catchError(error)
    } finally {
      setFavoritePending(false)
    }
  }, [catchError, favoritePending, favorited, t, articleId])

  const value = React.useMemo<ArticleActionContextValue>(
    () => ({
      articleId,
      liked,
      favorited,
      likeCount,
      toggleLike,
      toggleFavorite,
    }),
    [articleId, favorited, likeCount, liked, toggleFavorite, toggleLike]
  )

  return (
    <ArticleActionContext.Provider value={value}>
      {children}
    </ArticleActionContext.Provider>
  )
}

export function useArticleActions() {
  const value = React.useContext(ArticleActionContext)
  if (!value) {
    throw new Error("useArticleActions must be used within ArticleActionProvider")
  }
  return value
}
