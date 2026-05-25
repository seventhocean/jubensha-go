"use client"

import * as React from "react"

export function ArticleReadingProgress() {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      const scrolled = Math.min(100, (scrollTop / docHeight) * 100)
      setProgress(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (progress <= 0) return null

  return (
    <div
      className="fixed top-0 left-0 z-50 h-[3px] w-full"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(135deg, #5e6ad2, #8b5cf6)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  )
}
