"use client"

import * as React from "react"

const MarkdownEditor = React.lazy(() =>
  import("@/components/editor/markdown-editor").then((mod) => ({
    default: mod.MarkdownEditor,
  }))
)

const RichTextEditor = React.lazy(() =>
  import("@/components/editor/rich-text-editor").then((mod) => ({
    default: mod.RichTextEditor,
  }))
)

export type ContentEditorType = "html" | "markdown"

export function ContentEditor({
  contentType,
  value,
  placeholder,
  height = "400px",
  onChange,
}: {
  contentType: ContentEditorType
  value: string
  placeholder?: string
  height?: string
  onChange: (value: string) => void
}) {
  const fallback = (
    <div
      className="animate-pulse bg-muted rounded-md"
      style={{ minHeight: height }}
    />
  )

  if (contentType === "markdown") {
    return (
      <React.Suspense fallback={fallback}>
        <MarkdownEditor
          value={value}
          placeholder={placeholder}
          height={height}
          onChange={onChange}
        />
      </React.Suspense>
    )
  }

  return (
    <React.Suspense fallback={fallback}>
      <RichTextEditor
        value={value}
        placeholder={placeholder}
        height={height}
        onChange={onChange}
      />
    </React.Suspense>
  )
}
