const shimmerClass =
  "animate-[shimmer_1.5s_ease-in-out_infinite] bg-[length:200%_100%] bg-[linear-gradient(90deg,var(--color-surface-2),var(--color-surface-1),var(--color-surface-2))]"

export function TopicListSkeleton() {
  return (
    <ul className="divide-y divide-[var(--color-hairline)]">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="px-4 py-4">
          <div className="flex items-center gap-2">
            <div className={`h-6 w-6 shrink-0 rounded-full ${shimmerClass}`} />
            <div className={`h-3 w-24 rounded ${shimmerClass}`} />
            <div className={`h-3 w-16 rounded ${shimmerClass}`} />
          </div>
          <div className="mt-3 space-y-2">
            <div className={`h-4 w-3/4 rounded ${shimmerClass}`} />
            <div className={`h-3 w-full rounded ${shimmerClass}`} />
            <div className={`h-3 w-2/3 rounded ${shimmerClass}`} />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className={`h-3 w-12 rounded ${shimmerClass}`} />
            <div className={`h-3 w-12 rounded ${shimmerClass}`} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] p-4">
      <div className="space-y-3">
        <div className={`h-4 w-1/2 rounded ${shimmerClass}`} />
        <div className={`h-3 w-full rounded ${shimmerClass}`} />
        <div className={`h-3 w-3/4 rounded ${shimmerClass}`} />
      </div>
    </div>
  )
}

export function GroupDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className={`h-40 rounded-[var(--rounded-lg)] ${shimmerClass}`} />
      <div className="flex items-center gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`h-8 w-20 rounded ${shimmerClass}`} />
        ))}
      </div>
      <TopicListSkeleton />
    </div>
  )
}

export function GroupCardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-surface-1)] overflow-hidden">
          <div className={`h-16 ${shimmerClass}`} />
          <div className="p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`h-8 w-8 shrink-0 rounded-full ${shimmerClass}`} />
              <div className="space-y-1.5 flex-1">
                <div className={`h-3.5 w-2/3 rounded ${shimmerClass}`} />
                <div className={`h-3 w-1/2 rounded ${shimmerClass}`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
