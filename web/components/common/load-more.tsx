"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import type { PageData } from "@/lib/api/types"

type LoadMoreLabels = {
  loadMore: string
  noMore: string
  loading?: string
  error?: string
}

type LoadMoreRequest = {
  cursor: string
  force: boolean
}

export function LoadMore<T>({
  initialItems = [],
  initialCursor,
  initialHasMore,
  initialLoad = false,
  resetKey,
  labels,
  loadPage,
  renderItems,
  renderEmpty,
  renderSkeleton,
  alwaysShowButton = false,
}: {
  initialItems?: T[] | null
  initialCursor?: string
  initialHasMore: boolean
  initialLoad?: boolean
  resetKey?: string
  labels: LoadMoreLabels
  loadPage: (request: LoadMoreRequest) => Promise<PageData<T>>
  renderItems: (items: T[]) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderSkeleton?: () => React.ReactNode
  alwaysShowButton?: boolean
}) {
  const safeInitialItems = Array.isArray(initialItems) ? initialItems : []
  const contentKey = React.useMemo(
    () =>
      resetKey ||
      JSON.stringify({
        initialCursor: initialCursor || "",
        initialHasMore,
        initialLoad,
        initialItemsLength: safeInitialItems.length,
      }),
    [
      initialCursor,
      initialHasMore,
      initialLoad,
      resetKey,
      safeInitialItems.length,
    ]
  )

  return (
    <LoadMoreContent
      key={contentKey}
      initialItems={safeInitialItems}
      initialCursor={initialCursor}
      initialHasMore={initialHasMore}
      initialLoad={initialLoad}
      labels={labels}
      loadPage={loadPage}
      renderItems={renderItems}
      renderEmpty={renderEmpty}
      renderSkeleton={renderSkeleton}
      alwaysShowButton={alwaysShowButton}
    />
  )
}

function LoadMoreContent<T>({
  initialItems,
  initialCursor,
  initialHasMore,
  initialLoad,
  labels,
  loadPage,
  renderItems,
  renderEmpty,
  renderSkeleton,
  alwaysShowButton,
}: {
  initialItems: T[]
  initialCursor?: string
  initialHasMore: boolean
  initialLoad: boolean
  labels: LoadMoreLabels
  loadPage: (request: LoadMoreRequest) => Promise<PageData<T>>
  renderItems: (items: T[]) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderSkeleton?: () => React.ReactNode
  alwaysShowButton: boolean
}) {
  const [cursor, setCursor] = React.useState(initialCursor || "")
  const [hasMore, setHasMore] = React.useState(
    initialHasMore || (initialLoad && initialItems.length === 0)
  )
  const [items, setItems] = React.useState<T[]>(initialItems)
  const [loaded, setLoaded] = React.useState(
    !initialLoad || initialItems.length > 0
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inFlightRef = React.useRef(false)
  const mountedRef = React.useRef(true)
  const loadPageRef = React.useRef(loadPage)

  React.useEffect(() => {
    loadPageRef.current = loadPage
  }, [loadPage])

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const loadMore = React.useCallback(
    async (force = false) => {
      if (inFlightRef.current || (!force && !hasMore)) {
        return
      }

      inFlightRef.current = true
      setLoading(true)
      setError(null)
      try {
        const data = await loadPageRef.current({
          cursor: force ? "" : cursor,
          force,
        })
        if (!mountedRef.current) {
          return
        }
        setItems((current) =>
          force ? data.results || [] : [...current, ...(data.results || [])]
        )
        setCursor(data.cursor || "")
        setHasMore(Boolean(data.hasMore))
        setLoaded(true)
      } catch (err) {
        if (mountedRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : labels.error || "Couldn't load more items. Try again."
          )
        }
      } finally {
        inFlightRef.current = false
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    },
    [cursor, hasMore, labels.error]
  )

  React.useEffect(() => {
    if (
      !initialLoad ||
      initialItems.length > 0 ||
      loaded ||
      loading ||
      inFlightRef.current
    ) {
      return
    }

    const timer = window.setTimeout(() => {
      void loadMore(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [initialItems.length, initialLoad, loadMore, loaded, loading])

  const onLoadMore = React.useCallback(async () => {
    if (inFlightRef.current || !hasMore) {
      return
    }
    await loadMore()
  }, [hasMore, loadMore])

  const showButton = alwaysShowButton || items.length > 0 || hasMore || loading

  return (
    <>
      {!loaded && items.length === 0 && renderSkeleton
        ? renderSkeleton()
        : null}
      {items.length
        ? renderItems(items)
        : loaded && !loading && !error
          ? renderEmpty?.()
          : null}
      {showButton ? (
        <LoadMoreButton
          loading={loading}
          hasMore={hasMore}
          cursor={cursor}
          loadingLabel={labels.loading}
          labels={labels}
          onClick={onLoadMore}
        />
      ) : null}
      {error ? (
        <p className="-mt-4 pb-5 text-center text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </>
  )
}

export function LoadMoreButton({
  loading,
  hasMore,
  cursor,
  loadingLabel,
  labels,
  onClick,
}: {
  loading: boolean
  hasMore: boolean
  cursor?: string
  loadingLabel?: string
  labels: LoadMoreLabels
  onClick: () => void
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const triggeredRef = React.useRef(false)
  const loadingRef = React.useRef(loading)
  const prevCursorRef = React.useRef<string | undefined>(undefined)

  loadingRef.current = loading

  // Reset triggeredRef when cursor changes (new data was fetched)
  React.useEffect(() => {
    if (prevCursorRef.current !== undefined && prevCursorRef.current !== cursor) {
      triggeredRef.current = false
    }
    prevCursorRef.current = cursor
  }, [cursor])

  React.useEffect(() => {
    if (!hasMore || loading) {
      return
    }

    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (
          entry?.isIntersecting &&
          !triggeredRef.current &&
          !loadingRef.current
        ) {
          triggeredRef.current = true
          onClick()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, onClick])

  return (
    <div ref={containerRef} className="p-5 text-center">
      <Button
        type="button"
        variant="link"
        disabled={loading || !hasMore}
        onClick={onClick}
        className="w-[150px]"
      >
        {loading
          ? loadingLabel || labels.loading || labels.loadMore
          : hasMore
            ? labels.loadMore
            : labels.noMore}
      </Button>
    </div>
  )
}
