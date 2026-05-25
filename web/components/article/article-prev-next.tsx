import Link from "@/components/common/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ArticleBrief {
  id: number
  title: string
}

export function ArticlePrevNext({
  prev,
  next,
  t,
}: {
  prev: ArticleBrief | null
  next: ArticleBrief | null
  t: (key: string) => string
}) {
  if (!prev && !next) return null

  return (
    <div className="flex gap-3 border-t border-border px-4 py-3">
      {prev ? (
        <Link
          href={`/article/${prev.id}`}
          className="group flex min-w-0 flex-1 items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span className="min-w-0 truncate">{prev.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/article/${next.id}`}
          className="group flex min-w-0 flex-1 items-center justify-end gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <span className="min-w-0 truncate">{next.title}</span>
          <ChevronRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}
