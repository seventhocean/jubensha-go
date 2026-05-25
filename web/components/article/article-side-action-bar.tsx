"use client"

import { ArrowUp, Heart, MessageCircle, Star } from "lucide-react"

import { useArticleActions } from "@/components/article/article-action-context"
import { cn } from "@/lib/utils"

export function ArticleSideActionBar({
  commentCount,
}: {
  commentCount?: number
}) {
  const { liked, likeCount, favorited, toggleLike, toggleFavorite } =
    useArticleActions()

  function scrollToComment() {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="fixed top-75 -ml-14.5 max-[1300px]:hidden">
      <div className="action-list flex flex-col">
        <button
          type="button"
          className={cn("action", liked && "active")}
          aria-label="like"
          onClick={() => void toggleLike()}
        >
          {likeCount > 0 ? <span className="act-num">{likeCount}</span> : null}
          <Heart
            className={cn(
              "size-6",
              liked ? "fill-white text-white" : "text-muted-foreground"
            )}
          />
        </button>
        <button
          type="button"
          className="action"
          aria-label="comment"
          onClick={scrollToComment}
        >
          {commentCount && commentCount > 0 ? (
            <span className="act-num">{commentCount}</span>
          ) : null}
          <MessageCircle className="size-6 text-muted-foreground" />
        </button>
        <button
          type="button"
          className={cn("action", favorited && "active")}
          aria-label="favorite"
          onClick={() => void toggleFavorite()}
        >
          <Star
            className={cn(
              "size-6",
              favorited ? "fill-white text-white" : "text-muted-foreground"
            )}
          />
        </button>
        <button
          type="button"
          className="action"
          aria-label="top"
          onClick={scrollToTop}
        >
          <ArrowUp className="size-6 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
