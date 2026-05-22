export function TopicListSkeleton() {
  return (
    <ul className="divide-y">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="space-y-3">
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
