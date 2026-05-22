"use client"

import * as React from "react"
import { useNavigation } from "react-router"

export function PageTransition() {
  const navigation = useNavigation()
  const [progress, setProgress] = React.useState(0)
  const [visible, setVisible] = React.useState(false)
  const [skipTransition, setSkipTransition] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (navigation.state === "loading") {
      // Disable transition for one frame so reset to 0 is instant
      setSkipTransition(true)
      setProgress(0)
      setVisible(true)

      // After one frame, re-enable transition and animate to 80%
      const frame = requestAnimationFrame(() => {
        setSkipTransition(false)
        requestAnimationFrame(() => {
          setProgress(80)
        })
      })

      return () => cancelAnimationFrame(frame)
    }

    if (navigation.state === "idle" && visible) {
      // Complete the bar
      setProgress(100)

      // Fade out after completion
      timerRef.current = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
      }
    }
  }, [navigation.state, visible])

  if (!visible) {
    return null
  }

  return (
    <div
      className="fixed top-0 left-0 h-0.5 bg-primary z-[9999] transition-all"
      style={{
        width: `${progress}%`,
        transitionDuration: skipTransition
          ? "0ms"
          : progress === 100
            ? "200ms"
            : "500ms",
        opacity: progress === 100 ? 0 : 1,
      }}
    />
  )
}
