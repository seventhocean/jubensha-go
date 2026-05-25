"use client"

import { Eye, Heart, MessageCircle, Star } from "lucide-react"

import { useArticleActions } from "@/components/article/article-action-context"
import type { Article } from "@/lib/api/types"
import { cn } from "@/lib/utils"

function countLabel(value?: number) {
  return value && value > 0 ? `(${value})` : ""
}

export function ArticleDetailActions({
  article,
  labels,
}: {
  article: Article
  labels: {
    view: string
    like: string
    comment: string
    favorite: string
  }
}) {
  const {
    liked,
    favorited,
    likeCount,
    commentCount,
    toggleLike,
    toggleFavorite,
  } = useArticleActions()

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
      <div className="flex flex-1 cursor-not-allowed items-center justify-center text-sm text-muted-foreground">
        <Eye className="size-[18px] stroke-2 text-muted-foreground" />
        <div className="ml-[5px] text-foreground">
          <span>{labels.view}</span>
          <span>{countLabel(article.viewCount)}</span>
        </div>
      </div>
      <button
        type="button"
        className="group flex flex-1 items-center justify-center text-sm text-muted-foreground hover:text-primary"
        onClick={() => void toggleLike()}
      >
        <Heart
          className={cn(
            "size-[18px] stroke-2 transition-all duration-200 group-hover:text-primary",
            liked
              ? "text-destructive group-hover:text-destructive"
              : "text-muted-foreground"
          )}
          fill={liked ? "currentColor" : "none"}
        />
        <div className="ml-[5px] text-foreground">
          <span>{labels.like}</span>
          <span>{countLabel(likeCount)}</span>
        </div>
      </button>
      <a
        href="#comments"
        className="group flex flex-1 items-center justify-center text-sm text-muted-foreground hover:text-primary"
      >
        <MessageCircle className="size-[18px] stroke-2 text-muted-foreground transition-all duration-200 group-hover:text-primary" />
        <div className="ml-[5px] text-foreground">
          <span>{labels.comment}</span>
          <span>{countLabel(article.commentCount)}</span>
        </div>
      </a>
      <button
        type="button"
        className="group flex flex-1 items-center justify-center text-sm text-muted-foreground hover:text-primary"
        onClick={() => void toggleFavorite()}
      >
        <Star
          className={cn(
            "size-[18px] stroke-2 transition-all duration-200 group-hover:text-primary",
            favorited
              ? "text-destructive group-hover:text-destructive"
              : "text-muted-foreground"
          )}
          fill={favorited ? "currentColor" : "none"}
        />
        <div className="ml-[5px] text-foreground">
          <span>{labels.favorite}</span>
        </div>
      </button>
    </div>
  )
}
