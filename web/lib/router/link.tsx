import type * as React from "react"
import { Link as RouterLink } from "react-router"

type PrefetchBehavior = "intent" | "render" | "viewport" | "none"

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string
  prefetch?: PrefetchBehavior | boolean
}

export default function Link({ href, prefetch, ...props }: LinkProps) {
  if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:")) {
    return <a href={href} {...props} />
  }

  const resolvedPrefetch: PrefetchBehavior | undefined =
    typeof prefetch === "boolean"
      ? prefetch
        ? "intent"
        : undefined
      : prefetch

  return <RouterLink to={href} prefetch={resolvedPrefetch} {...props} />
}
