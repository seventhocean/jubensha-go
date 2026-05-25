"use client"

import * as React from "react"

import { useI18n } from "@/lib/i18n/provider"

/**
 * Enhances all <pre><code> blocks within a container element by adding:
 * - A language label (top-left)
 * - A copy button (top-right)
 * - Line numbers (left gutter)
 */
export function useCodeBlockEnhancer(
  containerRef: React.RefObject<HTMLElement | null>,
  html?: string
) {
  const { t } = useI18n()

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const preElements = container.querySelectorAll("pre")

    const cleanups: (() => void)[] = []

    preElements.forEach((pre) => {
      const code = pre.querySelector("code")
      if (!code) return

      // Skip if already enhanced
      if (pre.querySelector(".code-block-header")) return

      // Extract language from class="language-xxx"
      const langClass = Array.from(code.classList).find((cls) =>
        cls.startsWith("language-")
      )
      const language = langClass ? langClass.replace("language-", "") : ""

      // Create header with language label and copy button
      const header = document.createElement("div")
      header.className = "code-block-header"

      const langLabel = document.createElement("span")
      langLabel.className = "code-block-lang"
      langLabel.textContent = language || ""

      const copyBtn = document.createElement("button")
      copyBtn.className = "code-block-copy-btn"
      copyBtn.textContent = t("component.codeBlock.copy")
      copyBtn.type = "button"

      const handleCopy = () => {
        const text = code.textContent || ""
        void navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = t("component.codeBlock.copied")
          copyBtn.classList.add("copied")
          setTimeout(() => {
            copyBtn.textContent = t("component.codeBlock.copy")
            copyBtn.classList.remove("copied")
          }, 2000)
        })
      }

      copyBtn.addEventListener("click", handleCopy)
      cleanups.push(() => copyBtn.removeEventListener("click", handleCopy))

      header.appendChild(langLabel)
      header.appendChild(copyBtn)
      pre.insertBefore(header, pre.firstChild)

      // Add line numbers
      const codeText = code.textContent || ""
      const lines = codeText.split("\n")
      // Remove trailing empty line if present (common in code blocks)
      if (lines.length > 1 && lines[lines.length - 1] === "") {
        lines.pop()
      }

      if (lines.length > 1) {
        const lineNumbers = document.createElement("div")
        lineNumbers.className = "code-block-line-numbers"
        lineNumbers.setAttribute("aria-hidden", "true")
        lineNumbers.innerHTML = lines
          .map((_, i) => `<span>${i + 1}</span>`)
          .join("")
        pre.classList.add("has-line-numbers")
        pre.insertBefore(lineNumbers, code)
      }
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [containerRef, t, html])
}
