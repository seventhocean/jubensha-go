---
version: 2.0
name: bbs-go-forum-design-system
description: "A vibrant hobby/interest forum design system balancing warmth with precision. Supports both light and dark modes with a lavender-blue primary (#5e6ad2), warm coral secondary (#e8725c), and amber highlight (#f0a03c). Designed for high-density topic lists, threaded discussions, gamification elements, and long-form reading. Mobile-first responsive layout with Inter typography optimized for community engagement."

# =============================================================================
# LIGHT MODE TOKENS
# =============================================================================
light:
  colors:
    # --- Brand ---
    primary: "#5e6ad2"
    primary-hover: "#4f59c4"
    primary-active: "#434db0"
    primary-muted: "rgba(94, 106, 210, 0.12)"
    primary-subtle: "rgba(94, 106, 210, 0.06)"
    on-primary: "#ffffff"

    secondary: "#e8725c"
    secondary-hover: "#d5614c"
    secondary-active: "#c35242"
    secondary-muted: "rgba(232, 114, 92, 0.12)"
    secondary-subtle: "rgba(232, 114, 92, 0.06)"
    on-secondary: "#ffffff"

    highlight: "#f0a03c"
    highlight-hover: "#e09030"
    highlight-muted: "rgba(240, 160, 60, 0.12)"
    on-highlight: "#1a1a2e"

    # --- Gradients ---
    gradient-featured: "linear-gradient(135deg, #5e6ad2, #8b5cf6)"
    gradient-trending: "linear-gradient(135deg, #e8725c, #f0a03c)"
    gradient-premium: "linear-gradient(135deg, #f0a03c, #fbbf24)"
    gradient-achievement: "linear-gradient(135deg, #34d399, #5e6ad2)"

    # --- Canvas & Surfaces ---
    canvas: "#fafaf8"
    canvas-inset: "#f4f3f0"
    surface-1: "#ffffff"
    surface-2: "#f8f7f5"
    surface-3: "#f0efec"
    surface-4: "#e8e7e4"

    # --- Ink ---
    ink: "#1a1a2e"
    ink-secondary: "#4a4a5e"
    ink-muted: "#7a7a8e"
    ink-tertiary: "#9a9aae"
    ink-disabled: "#c0c0cc"
    ink-inverse: "#ffffff"

    # --- Borders ---
    hairline: "#e8e7e4"
    hairline-strong: "#d8d7d4"
    hairline-focus: "#5e6ad2"

    # --- Shadows ---
    shadow-sm: "0 1px 2px rgba(26, 26, 46, 0.06)"
    shadow-md: "0 4px 12px rgba(26, 26, 46, 0.08)"
    shadow-lg: "0 8px 24px rgba(26, 26, 46, 0.10)"
    shadow-xl: "0 16px 48px rgba(26, 26, 46, 0.12)"

    # --- Overlay ---
    overlay: "rgba(26, 26, 46, 0.50)"

    # --- Semantic ---
    semantic-success: "#16a34a"
    semantic-success-bg: "#f0fdf4"
    semantic-success-muted: "rgba(22, 163, 74, 0.12)"
    semantic-warning: "#d97706"
    semantic-warning-bg: "#fffbeb"
    semantic-warning-muted: "rgba(217, 119, 6, 0.12)"
    semantic-danger: "#dc2626"
    semantic-danger-bg: "#fef2f2"
    semantic-danger-muted: "rgba(220, 38, 38, 0.12)"
    semantic-info: "#2563eb"
    semantic-info-bg: "#eff6ff"
    semantic-info-muted: "rgba(37, 99, 235, 0.12)"

    # --- Forum-Specific ---
    unread-dot: "#e8725c"
    online-indicator: "#16a34a"
    exp-bar-fill: "#5e6ad2"
    exp-bar-track: "#e8e7e4"
    bounty-gold: "#d97706"
    vote-active: "#5e6ad2"
    vote-inactive: "#9a9aae"
    trending-accent: "#e8725c"
    sticky-accent: "#f0a03c"

    # --- Node/Category Colors ---
    node-blue: "#3b82f6"
    node-purple: "#8b5cf6"
    node-pink: "#ec4899"
    node-red: "#ef4444"
    node-orange: "#f97316"
    node-amber: "#f59e0b"
    node-green: "#22c55e"
    node-teal: "#14b8a6"
    node-cyan: "#06b6d4"
    node-indigo: "#6366f1"

# =============================================================================
# DARK MODE TOKENS
# =============================================================================
dark:
  colors:
    # --- Brand ---
    primary: "#5e6ad2"
    primary-hover: "#7b85e0"
    primary-active: "#4f59b8"
    primary-muted: "rgba(94, 106, 210, 0.15)"
    primary-subtle: "rgba(94, 106, 210, 0.08)"
    on-primary: "#ffffff"

    secondary: "#e8725c"
    secondary-hover: "#f0856f"
    secondary-active: "#d5614c"
    secondary-muted: "rgba(232, 114, 92, 0.15)"
    secondary-subtle: "rgba(232, 114, 92, 0.08)"
    on-secondary: "#ffffff"

    highlight: "#f0a03c"
    highlight-hover: "#f5b054"
    highlight-muted: "rgba(240, 160, 60, 0.15)"
    on-highlight: "#0a0a0f"

    # --- Gradients ---
    gradient-featured: "linear-gradient(135deg, #5e6ad2, #8b5cf6)"
    gradient-trending: "linear-gradient(135deg, #e8725c, #f0a03c)"
    gradient-premium: "linear-gradient(135deg, #f0a03c, #fbbf24)"
    gradient-achievement: "linear-gradient(135deg, #34d399, #5e6ad2)"

    # --- Canvas & Surfaces ---
    canvas: "#0a0a0f"
    canvas-inset: "#06060a"
    surface-1: "#12121a"
    surface-2: "#1a1a24"
    surface-3: "#22222e"
    surface-4: "#2a2a38"

    # --- Ink ---
    ink: "#e8e6e3"
    ink-secondary: "#b4b1ad"
    ink-muted: "#8c8a85"
    ink-tertiary: "#5c5a56"
    ink-disabled: "#3d3b38"
    ink-inverse: "#0a0a0f"

    # --- Borders ---
    hairline: "#1e1e2a"
    hairline-strong: "#2e2e3c"
    hairline-focus: "#5e6ad2"

    # --- Shadows ---
    shadow-sm: "0 1px 2px rgba(0, 0, 0, 0.20)"
    shadow-md: "0 4px 12px rgba(0, 0, 0, 0.30)"
    shadow-lg: "0 8px 32px rgba(0, 0, 0, 0.40)"
    shadow-xl: "0 16px 64px rgba(0, 0, 0, 0.50)"

    # --- Overlay ---
    overlay: "rgba(0, 0, 0, 0.70)"

    # --- Semantic ---
    semantic-success: "#34d399"
    semantic-success-bg: "rgba(52, 211, 153, 0.10)"
    semantic-success-muted: "rgba(52, 211, 153, 0.15)"
    semantic-warning: "#fbbf24"
    semantic-warning-bg: "rgba(251, 191, 36, 0.10)"
    semantic-warning-muted: "rgba(251, 191, 36, 0.15)"
    semantic-danger: "#f87171"
    semantic-danger-bg: "rgba(248, 113, 113, 0.10)"
    semantic-danger-muted: "rgba(248, 113, 113, 0.15)"
    semantic-info: "#60a5fa"
    semantic-info-bg: "rgba(96, 165, 250, 0.10)"
    semantic-info-muted: "rgba(96, 165, 250, 0.15)"

    # --- Forum-Specific ---
    unread-dot: "#e8725c"
    online-indicator: "#34d399"
    exp-bar-fill: "#5e6ad2"
    exp-bar-track: "#1e1e2a"
    bounty-gold: "#f59e0b"
    vote-active: "#5e6ad2"
    vote-inactive: "#5c5a56"
    trending-accent: "#e8725c"
    sticky-accent: "#f0a03c"

    # --- Node/Category Colors ---
    node-blue: "#60a5fa"
    node-purple: "#a78bfa"
    node-pink: "#f472b6"
    node-red: "#f87171"
    node-orange: "#fb923c"
    node-amber: "#fbbf24"
    node-green: "#4ade80"
    node-teal: "#2dd4bf"
    node-cyan: "#22d3ee"
    node-indigo: "#818cf8"

# =============================================================================
# TYPOGRAPHY
# =============================================================================
typography:
  font-family:
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    mono: "JetBrains Mono, ui-monospace, 'SF Mono', Menlo, monospace"
  display-lg:
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.20
    letterSpacing: -0.8px
  display-md:
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.5px
  headline:
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: -0.3px
  title:
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: -0.1px
  title-sm:
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 0
  body-lg:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.60
    letterSpacing: 0
  body:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  caption-sm:
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.2px
  prose:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  prose-sm:
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.70
    letterSpacing: 0
  button:
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  button-sm:
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0.1px
  label:
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.3px
  mono:
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  tab:
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0

# =============================================================================
# SPACING & LAYOUT
# =============================================================================
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 20px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  section: 64px

breakpoints:
  mobile: 0px
  tablet: 640px
  desktop: 1024px
  desktop-xl: 1280px

layout:
  sidebar-width: 240px
  sidebar-collapsed-width: 56px
  content-max-width: 720px
  content-wide-max-width: 960px
  right-panel-width: 300px
  header-height: 52px
  mobile-bottom-nav-height: 56px
  topic-row-min-height: 64px
  touch-target-min: 44px

# =============================================================================
# MOTION & ANIMATION
# =============================================================================
motion:
  duration-instant: 50ms
  duration-fast: 100ms
  duration-normal: 150ms
  duration-slow: 250ms
  duration-page: 200ms
  duration-enter: 200ms
  duration-exit: 150ms
  easing-default: "cubic-bezier(0.4, 0, 0.2, 1)"
  easing-enter: "cubic-bezier(0, 0, 0.2, 1)"
  easing-exit: "cubic-bezier(0.4, 0, 1, 1)"
  easing-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  easing-bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)"

# =============================================================================
# Z-INDEX SCALE
# =============================================================================
z-index:
  base: 0
  dropdown: 100
  sticky-header: 200
  sidebar-overlay: 300
  modal-backdrop: 400
  modal: 500
  toast: 600
  tooltip: 700
  loading-overlay: 800

# =============================================================================
# COMPONENTS (mode-agnostic structure, uses token references)
# =============================================================================
components:
  # --- Topic List ---
  topic-list-item:
    padding: "12px 16px"
    minHeight: "{layout.topic-row-min-height}"
    borderBottom: "1px solid {colors.hairline}"
    rounded: "{rounded.xs}"
    transition: "background {motion.duration-fast} {motion.easing-default}"
  topic-list-item-hover:
    backgroundColor: "{colors.surface-1}"
    borderLeft: "2px solid {colors.primary}"
  topic-list-item-unread:
    fontWeight: 600
  topic-list-item-sticky:
    borderLeft: "2px solid {colors.sticky-accent}"
  topic-list-item-expanded:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.md}"
    padding: 16px
    marginBottom: 8px
    shadow: "{colors.shadow-sm}"

  # --- Comment/Reply Thread ---
  comment-thread:
    padding: "16px 0"
    borderBottom: "1px solid {colors.hairline}"
  comment-thread-nested:
    padding: "12px 0 12px 24px"
    borderLeft: "2px solid {colors.hairline}"
    marginLeft: 16px
  comment-reply-highlight:
    backgroundColor: "{colors.primary-subtle}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"

  # --- User Avatar & Badges ---
  user-avatar:
    rounded: "{rounded.full}"
    sizes: "24px | 32px | 40px | 48px | 64px"
    border: "2px solid {colors.surface-2}"
  user-avatar-online:
    position: "absolute bottom-right"
    size: 12px
    backgroundColor: "{colors.online-indicator}"
    rounded: "{rounded.full}"
    border: "2px solid {colors.canvas}"
  user-level-badge:
    backgroundColor: "{colors.primary-muted}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"

  # --- Node/Tag Chips ---
  node-tag-chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  node-tag-chip-colored:
    backgroundColor: "var(--node-color-muted)"
    textColor: "var(--node-color)"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  node-tag-chip-active:
    backgroundColor: "{colors.primary-muted}"
    textColor: "{colors.primary}"

  # --- Editor Toolbar ---
  editor-toolbar:
    backgroundColor: "{colors.surface-1}"
    borderBottom: "1px solid {colors.hairline}"
    rounded: "{rounded.md} {rounded.md} 0 0"
    padding: "6px 8px"
  editor-toolbar-button:
    size: 32px
    rounded: "{rounded.sm}"
    hover-bg: "{colors.surface-2}"
    active-bg: "{colors.primary-muted}"
    active-color: "{colors.primary}"

  # --- Notification Badge ---
  notification-badge:
    backgroundColor: "{colors.semantic-danger}"
    textColor: "#ffffff"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.pill}"
    padding: "0px 5px"
    minWidth: 18px
    height: 18px

  # --- Vote/Like Button ---
  vote-button:
    backgroundColor: "transparent"
    textColor: "{colors.vote-inactive}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    minHeight: 32px
    transition: "all {motion.duration-fast} {motion.easing-spring}"
  vote-button-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.vote-active}"
    transform: "scale(1.1)"
  vote-button-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-secondary}"

  # --- User Card Popup ---
  user-card-popup:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.lg}"
    padding: 16px
    shadow: "{colors.shadow-xl}"
    border: "1px solid {colors.hairline-strong}"
    width: 280px

  # --- Sidebar Navigation ---
  sidebar-nav:
    backgroundColor: "{colors.surface-1}"
    width: "{layout.sidebar-width}"
    padding: "12px 0"
  sidebar-nav-item:
    padding: "8px 16px"
    rounded: "{rounded.sm}"
    hover-bg: "{colors.surface-2}"
    transition: "background {motion.duration-fast} {motion.easing-default}"
  sidebar-nav-item-active:
    backgroundColor: "{colors.primary-muted}"
    textColor: "{colors.primary}"
    fontWeight: 500

  # --- Mobile Bottom Tab Bar ---
  mobile-bottom-tab-bar:
    backgroundColor: "{colors.surface-1}"
    height: "{layout.mobile-bottom-nav-height}"
    borderTop: "1px solid {colors.hairline}"
    padding: "4px 0"
    backdropFilter: "blur(12px)"
  mobile-bottom-tab-item:
    minWidth: 64px
    padding: "4px 12px"
    active-color: "{colors.primary}"
    inactive-color: "{colors.ink-muted}"

  # --- Group Card ---
  group-card:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.lg}"
    padding: 16px
    border: "1px solid {colors.hairline}"
    shadow: "{colors.shadow-sm}"
    transition: "all {motion.duration-normal} {motion.easing-default}"
  group-card-hover:
    shadow: "{colors.shadow-md}"
    borderColor: "{colors.hairline-strong}"
    transform: "translateY(-2px)"

  # --- Check-in Button ---
  checkin-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    shadow: "{colors.shadow-sm}"
    transition: "all {motion.duration-normal} {motion.easing-spring}"
  checkin-button-hover:
    transform: "scale(1.02)"
    shadow: "{colors.shadow-md}"
  checkin-button-checked:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    border: "1px solid {colors.hairline}"
    shadow: "none"
  checkin-button-animation:
    keyframes: "checkin-pop 0.4s {motion.easing-spring}"

  # --- Level/EXP Progress Bar ---
  level-progress-bar:
    trackColor: "{colors.exp-bar-track}"
    fillColor: "{colors.exp-bar-fill}"
    height: 6px
    rounded: "{rounded.pill}"
    transition: "width 0.6s {motion.easing-default}"
  level-progress-bar-animated:
    fillGradient: "{colors.gradient-achievement}"

  # --- Q&A Status ---
  qa-status-solved:
    backgroundColor: "{colors.semantic-success-muted}"
    textColor: "{colors.semantic-success}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  qa-status-unsolved:
    backgroundColor: "{colors.semantic-warning-muted}"
    textColor: "{colors.semantic-warning}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  qa-status-bounty:
    backgroundColor: "{colors.highlight-muted}"
    textColor: "{colors.bounty-gold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    border: "1px solid rgba(240, 160, 60, 0.3)"

  # --- Sticky Header ---
  sticky-header:
    height: "{layout.header-height}"
    backdropFilter: "blur(12px) saturate(1.2)"
    borderBottom: "1px solid {colors.hairline}"
    zIndex: "{z-index.sticky-header}"
    transition: "background {motion.duration-normal} {motion.easing-default}"
  sticky-header-light:
    backgroundColor: "rgba(250, 250, 248, 0.88)"
  sticky-header-dark:
    backgroundColor: "rgba(10, 10, 15, 0.85)"

  # --- Toast Notifications ---
  toast-notification:
    backgroundColor: "{colors.surface-3}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
    shadow: "{colors.shadow-lg}"
    border: "1px solid {colors.hairline-strong}"
    animation: "slide-up {motion.duration-slow} {motion.easing-enter}"
  toast-success:
    borderLeft: "3px solid {colors.semantic-success}"
  toast-error:
    borderLeft: "3px solid {colors.semantic-danger}"
  toast-warning:
    borderLeft: "3px solid {colors.semantic-warning}"

  # --- Modal / Dropdown ---
  modal:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.xl}"
    padding: 24px
    shadow: "{colors.shadow-xl}"
    border: "1px solid {colors.hairline-strong}"
    maxWidth: 520px
    animation: "modal-enter {motion.duration-slow} {motion.easing-enter}"
  modal-backdrop:
    backgroundColor: "{colors.overlay}"
    zIndex: "{z-index.modal-backdrop}"
    animation: "fade-in {motion.duration-normal} {motion.easing-default}"
  dropdown-menu:
    backgroundColor: "{colors.surface-3}"
    rounded: "{rounded.lg}"
    padding: 4px
    shadow: "{colors.shadow-lg}"
    border: "1px solid {colors.hairline-strong}"
    animation: "dropdown-enter {motion.duration-fast} {motion.easing-enter}"
  dropdown-menu-item:
    padding: "8px 12px"
    rounded: "{rounded.sm}"
    hover-bg: "{colors.surface-4}"
    transition: "background {motion.duration-fast} {motion.easing-default}"

  # --- Tab Bar ---
  tab-bar:
    borderBottom: "1px solid {colors.hairline}"
  tab-bar-item:
    padding: "10px 16px"
    textColor: "{colors.ink-muted}"
    typography: "{typography.tab}"
    transition: "color {motion.duration-fast} {motion.easing-default}"
  tab-bar-item-active:
    textColor: "{colors.ink}"
    borderBottom: "2px solid {colors.primary}"

  # --- Article/Prose Reading Area ---
  article-prose:
    maxWidth: "{layout.content-max-width}"
    typography: "{typography.prose}"
    padding: "32px 0"
  article-prose-heading:
    marginTop: 32px
    marginBottom: 16px
  article-prose-blockquote:
    borderLeft: "3px solid {colors.primary-muted}"
    padding: "8px 16px"
    backgroundColor: "{colors.surface-1}"
    rounded: "0 {rounded.sm} {rounded.sm} 0"

  # --- Trending/Hot Topic Highlight ---
  trending-highlight:
    borderLeft: "3px solid {colors.trending-accent}"
    backgroundColor: "{colors.secondary-subtle}"
    padding: "12px 16px"
    rounded: "0 {rounded.md} {rounded.md} 0"
  trending-badge:
    background: "{colors.gradient-trending}"
    textColor: "#ffffff"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"

  # --- Badge/Achievement Display ---
  badge-achievement:
    background: "{colors.gradient-achievement}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "4px 10px"
    shadow: "{colors.shadow-sm}"
  badge-tier-bronze:
    background: "linear-gradient(135deg, #cd7f32, #a0522d)"
  badge-tier-silver:
    background: "linear-gradient(135deg, #c0c0c0, #808080)"
  badge-tier-gold:
    background: "linear-gradient(135deg, #ffd700, #daa520)"
  badge-tier-diamond:
    background: "linear-gradient(135deg, #b9f2ff, #5e6ad2)"

  # --- Buttons ---
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    minHeight: 36px
    shadow: "{colors.shadow-sm}"
    transition: "all {motion.duration-fast} {motion.easing-default}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    shadow: "{colors.shadow-md}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    transform: "scale(0.98)"
  button-primary-disabled:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink-disabled}"
    cursor: "not-allowed"
    shadow: "none"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    border: "1px solid {colors.hairline-strong}"
    minHeight: 36px
  button-secondary-hover:
    backgroundColor: "{colors.surface-3}"
    borderColor: "{colors.hairline-focus}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
  button-danger:
    backgroundColor: "{colors.semantic-danger}"
    textColor: "#ffffff"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"

  # --- Form Inputs ---
  text-input:
    backgroundColor: "{colors.surface-1}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    border: "1px solid {colors.hairline}"
    minHeight: 40px
    transition: "border-color {motion.duration-fast} {motion.easing-default}, box-shadow {motion.duration-fast} {motion.easing-default}"
  text-input-focused:
    borderColor: "{colors.primary}"
    boxShadow: "0 0 0 3px {colors.primary-muted}"
  text-input-error:
    borderColor: "{colors.semantic-danger}"
    boxShadow: "0 0 0 3px {colors.semantic-danger-muted}"

  # --- Search Bar ---
  search-bar:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.md}"
    padding: "8px 12px 8px 36px"
    border: "1px solid {colors.hairline}"

  # --- Skeleton Loader ---
  skeleton-loader:
    backgroundColor: "{colors.surface-1}"
    shimmerColor: "{colors.surface-2}"
    rounded: "{rounded.sm}"
    animation: "shimmer 1.5s ease-in-out infinite"
---

# BBS-Go Forum Design System

## Overview

This design system serves as the single source of truth for the BBS-Go hobby/interest forum platform. It defines every visual and interactive decision needed to build a consistent, delightful experience across all screen sizes and color modes.

### Design Philosophy

The BBS-Go design system lives at the intersection of **Discord's colorfulness** and **Linear's precision**. We want users to feel the warmth of a living community while never feeling overwhelmed by visual noise.

**Core Principles:**

1. **Warm & Inviting** - This is a hobby community, not a corporate tool. Colors are slightly warm, surfaces feel approachable, and the overall tone says "welcome home."
2. **Information Dense but Breathable** - Forums need density (topic lists, nested threads), but we use whitespace, typography hierarchy, and subtle color shifts to keep things scannable.
3. **Dual-Mode First** - Light and dark modes are both first-class citizens, not afterthoughts. Light mode is warm and lively; dark mode is deep and comfortable for extended reading.
4. **Playfully Restrained** - Micro-interactions, gradients on achievements, and pops of color add personality without crossing into childish territory.
5. **Mobile-First, Desktop-Enhanced** - The mobile experience is complete and primary. Desktop adds luxury (sidebars, panels) but never gates core functionality.

### When to Use This Document

- Starting a new page or component: check the component tokens first
- Choosing a color: reference the semantic palette, never hardcode hex values
- Adding motion: use the motion tokens for consistent timing
- Responsive decisions: follow the breakpoint and layout tokens
- Accessibility questions: see the Accessibility section below

---

## Colors

### Philosophy

Our palette centers on **lavender-blue (#5e6ad2)** as the primary action color - distinctive yet comfortable for extended use. The **warm coral secondary (#e8725c)** adds energy for notifications, trending content, and calls to action. **Amber (#f0a03c)** serves as a highlight for special states like bounties, sticky posts, and premium features.

### Light Mode

Light mode uses a **warm off-white canvas (#fafaf8)** rather than clinical pure white. This subtle warmth reduces eye strain and makes the interface feel more human.

| Layer | Token | Value | Usage |
|-------|-------|-------|-------|
| Canvas | `canvas` | #fafaf8 | Page background, main scroll area |
| Canvas Inset | `canvas-inset` | #f4f3f0 | Inset areas, code blocks, sub-sections |
| Surface 1 | `surface-1` | #ffffff | Cards, elevated content, modals |
| Surface 2 | `surface-2` | #f8f7f5 | Secondary cards, sidebar background |
| Surface 3 | `surface-3` | #f0efec | Hover states, input backgrounds |
| Surface 4 | `surface-4` | #e8e7e4 | Active states, pressed buttons |

**Light mode text** uses deep warm dark (#1a1a2e) for maximum readability without the harshness of pure black. Secondary and muted text levels provide clear hierarchy.

**Shadows** replace borders as the primary elevation cue in light mode. Cards float above the canvas with soft, warm-tinted shadows instead of relying solely on border lines.

### Dark Mode

Dark mode uses a **blue-tinted dark canvas (#0a0a0f)** that feels deep and luxurious rather than flat black. The blue-purple undertone in surface layers creates visual depth.

| Layer | Token | Value | Usage |
|-------|-------|-------|-------|
| Canvas | `canvas` | #0a0a0f | Page background |
| Canvas Inset | `canvas-inset` | #06060a | Deeper inset areas |
| Surface 1 | `surface-1` | #12121a | Cards, sidebar |
| Surface 2 | `surface-2` | #1a1a24 | Elevated cards, modals |
| Surface 3 | `surface-3` | #22222e | Hover states, dropdowns |
| Surface 4 | `surface-4` | #2a2a38 | Active states |

**Dark mode text** uses warm off-white (#e8e6e3) to avoid the blue-cold feeling of pure white on dark backgrounds. This warmth matches the community feel.

**Borders (hairlines)** are the primary separation tool in dark mode, since shadows are less visible on dark surfaces.

### Node/Category Colors

Each forum node (category/subcategory) can define its own accent color from the 10-color node palette. These appear in tag chips, category headers, and sidebar indicators.

```
Blue    #3b82f6 / #60a5fa (dark)   - Technology, Programming
Purple  #8b5cf6 / #a78bfa (dark)   - Creative, Art
Pink    #ec4899 / #f472b6 (dark)   - Lifestyle, Fashion
Red     #ef4444 / #f87171 (dark)   - News, Urgent
Orange  #f97316 / #fb923c (dark)   - Gaming, Entertainment
Amber   #f59e0b / #fbbf24 (dark)   - Finance, Trading
Green   #22c55e / #4ade80 (dark)   - Nature, Health
Teal    #14b8a6 / #2dd4bf (dark)   - Science, Education
Cyan    #06b6d4 / #22d3ee (dark)   - Travel, Photography
Indigo  #6366f1 / #818cf8 (dark)   - Music, Audio
```

Each node color has a muted variant (12-15% opacity) for backgrounds and a full variant for text/icons.

### Gradients

Gradients are reserved for **special, celebratory elements** - never for everyday UI:

- **Featured**: `primary -> purple` - Featured posts, editor's picks
- **Trending**: `coral -> amber` - Hot topics, trending tags
- **Premium**: `amber -> gold` - Premium badges, supporter status
- **Achievement**: `green -> primary` - Unlocked achievements, level-ups

### Semantic Colors

Semantic colors communicate status and should never be used decoratively:

- **Success (green)**: Solved questions, successful actions, online status
- **Warning (amber)**: Pending moderation, expiring content, rate limits
- **Danger (red)**: Errors, destructive actions, bans, report flags
- **Info (blue)**: Tips, informational notices, update announcements

---

## Typography

### Font Stack

**Primary**: Inter - chosen for its excellent legibility at small sizes, wide character set supporting CJK alongside Latin, and variable font support for precise weight control.

**Monospace**: JetBrains Mono - for code blocks, inline code, and technical content.

### Scale & Usage

| Token | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| `display-lg` | 32px | 700 | 1.20 | Page titles, hero sections |
| `display-md` | 24px | 700 | 1.25 | Section headers, group names |
| `headline` | 20px | 600 | 1.30 | Topic titles in expanded view |
| `title` | 16px | 600 | 1.40 | Card headers, sidebar section labels |
| `title-sm` | 14px | 600 | 1.40 | Compact topic titles, sub-headers |
| `body-lg` | 16px | 400 | 1.60 | Article body, important descriptions |
| `body` | 14px | 400 | 1.55 | Default UI text, comments, descriptions |
| `body-sm` | 13px | 400 | 1.50 | Secondary info, metadata, timestamps |
| `caption` | 12px | 400 | 1.40 | Tags, badges, helper text |
| `caption-sm` | 11px | 500 | 1.30 | Notification counts, micro-labels |
| `prose` | 16px | 400 | 1.75 | Long-form article reading |
| `prose-sm` | 15px | 400 | 1.70 | Comment bodies, shorter reading |
| `button` | 14px | 500 | 1.20 | Button labels |
| `button-sm` | 12px | 500 | 1.20 | Small buttons, compact actions |
| `label` | 12px | 500 | 1.30 | Form labels, section labels |
| `mono` | 13px | 400 | 1.55 | Code blocks, technical content |
| `tab` | 13px | 500 | 1.20 | Tab labels, navigation items |

### Reading Optimization

**High-density views** (topic lists, notification lists): Use `body` or `body-sm` with their default line heights (1.50-1.55). These are optimized for scanning - you want to see as many items as possible.

**Long-form reading** (articles, detailed comments): Use `prose` (1.75 line height) or `prose-sm` (1.70). The generous line height reduces reading fatigue for content longer than 3 paragraphs.

**Headings in prose**: Always use negative letter-spacing (built into display/headline tokens) to make headings feel tight and intentional against the looser body text.

### CJK Considerations

For Chinese/Japanese content:
- Line height should increase by 0.1-0.15 compared to Latin text
- Letter-spacing should be 0 or slightly positive (never negative)
- Font size minimums: 14px for body, 12px for captions (CJK characters need more pixels for legibility)

---

## Layout

### Responsive Breakpoints

The layout system is mobile-first with four breakpoints:

```
Mobile:      0 - 639px     Single column, bottom navigation
Tablet:      640 - 1023px  Optional sidebar (collapsible), top navigation
Desktop:     1024 - 1279px Persistent sidebar + content area
Desktop-XL:  1280px+       Sidebar + content + right panel (trending, related)
```

### Mobile (0-639px)

- Single column layout, full-width content
- Bottom tab bar for primary navigation (Home, Explore, Create, Notifications, Profile)
- Sticky header with title, search icon, and avatar
- Topic list items are full-width with generous touch targets (min 44px)
- Swipe gestures: left to bookmark, right to vote
- Pull-to-refresh at the top
- Floating action button (FAB) for new post on content pages

### Tablet (640-1023px)

- Top navigation bar replaces bottom tabs
- Optional left sidebar (triggered by hamburger icon or swipe from left edge)
- Content area uses max-width of 720px, centered
- Two-column grid for group cards
- Modals remain full-width but with horizontal padding

### Desktop (1024-1279px)

- Persistent left sidebar (240px) with navigation and node list
- Content area (720px max-width) with proper margins
- Sidebar can be collapsed to 56px (icon-only mode)
- Hover states become active (topic hover highlights, button hover effects)
- Keyboard shortcuts become available

### Desktop-XL (1280px+)

- Left sidebar (240px) + Content (720px) + Right panel (300px)
- Right panel shows: trending topics, online users, site stats, related content
- Content area can expand to 960px on "wide" pages (admin, settings)
- Three-column grid for group cards

### Content Widths

| Context | Max Width | Notes |
|---------|-----------|-------|
| Topic list | 720px | Standard content width |
| Article reading | 720px | Optimized for 65-75 chars per line |
| Wide content | 960px | Settings, admin panels, galleries |
| Full bleed | 100% | Images, code blocks (with scroll) |

---

## Components

### Topic List Item

Two display modes: **compact** (default in list view) and **expanded** (when clicked or in detail view).

**Compact mode**: Single row showing avatar (24px), title, node tag, reply count, last activity time. On mobile, the title gets two lines max with ellipsis. On hover (desktop), a subtle left border appears in primary color and the background shifts one surface level up.

**Expanded mode**: Full card treatment with shadow, generous padding, excerpt text, and action row (vote, comment, bookmark, share).

**States**: Default, Hover, Unread (bold title + unread dot), Sticky (amber left border), Trending (coral left border + fire icon).

### Comment/Reply Thread

Threads use **left-border nesting** rather than full indentation to save horizontal space on mobile. Each nesting level adds a 2px left border in hairline color, indented 24px from its parent.

Maximum visual nesting: 4 levels. After that, replies flatten with an "@username" reference to show lineage.

Comment bodies use `prose-sm` typography for comfortable reading. Action row below each comment: vote arrows, reply button, more menu.

### User Avatar & Badges

Avatars come in 5 sizes: 24px (inline), 32px (list), 40px (card), 48px (profile header), 64px (full profile).

**Online indicator**: A 12px green dot at the bottom-right corner of the avatar, with a 2px canvas-color border to create separation.

**Level badge**: Small pill below or beside the avatar showing the user's level number. Uses `caption-sm` typography with primary-muted background.

### Node/Tag Chips

Small pills that identify which forum node a topic belongs to. Each chip uses its node's designated color (from the 10-color palette) with a muted background variant.

**Default**: Muted background + full color text
**Active/Selected**: Full color background + white text
**Removable**: Includes a small X icon on the right

### Editor Toolbar

Sticky toolbar above the editor textarea. Contains formatting buttons (bold, italic, list, link, image, code, emoji) in a horizontal scrollable row on mobile.

Each button is 32px square with rounded-sm corners. Active formatting shows with primary-muted background.

### Notification Badge

Red dot/pill on navigation icons. Shows count when > 0. Numbers above 99 display as "99+". The badge uses a subtle scale-in animation when new notifications arrive.

### Vote/Like Button

Vertical or horizontal layout depending on context. The vote button uses a spring easing animation on click - brief scale-up to 1.1 then settle back. Active state fills with primary-subtle background.

In list view: horizontal with number between up/down arrows.
In detail view: vertical stack with the number between arrows.

### User Card Popup

Appears on hover (desktop) or long-press (mobile) on any username or avatar. Shows: large avatar, display name, username, level/badge, join date, bio excerpt, follow button, and recent activity stats.

Uses surface-2 background with elevated shadow and hairline border. Appears after a 300ms hover delay to avoid accidental triggers.

### Sidebar Navigation

Desktop persistent sidebar with:
- Logo/brand at top
- Primary navigation (Home, Explore, Following, Bookmarks)
- Divider
- Node/category list with colored indicators
- Divider
- User section at bottom (avatar, name, settings gear)

Each nav item has a 44px minimum height for accessibility. Active item uses primary-muted background with primary text color. Hover uses surface-2 background.

Collapsed mode (56px width) shows only icons with tooltips on hover.

### Mobile Bottom Tab Bar

5 tabs maximum: Home, Explore/Discover, Create (+), Notifications, Profile.

The center "Create" button is visually distinct (primary color filled circle or gradient).

Tab bar has a subtle top border and a backdrop-blur effect so scrolled content is faintly visible beneath.

Active tab shows primary color icon + label. Inactive shows ink-muted.

### Group Card

Cards representing forum groups/circles the user can join. Shows:
- Cover image or gradient header (120px height)
- Group avatar (40px, overlapping the cover)
- Group name (title typography)
- Member count + activity level
- Join button or "Joined" indicator

On hover: lifts 2px with enhanced shadow. On mobile: arranged in a horizontal scroll or 2-column grid.

### Check-in Button

A gamification element. Large, satisfying button with primary background. On press, it plays a spring animation (scale to 1.05, back to 1.0) and transitions to a "checked" state (muted background, checkmark icon).

The checked state shows today's streak count and EXP earned. Button re-enables at midnight local time.

### Level/EXP Progress Bar

Thin (6px height) progress bar showing progress toward next level. Track uses exp-bar-track color, fill uses primary or the achievement gradient for the final 10% before level-up.

Accompanied by: current level badge on the left, next level on the right, "X/Y EXP" text below.

The fill animates with a 600ms ease-out transition when EXP is gained.

### Q&A Status Indicators

Three states for question-type topics:

- **Solved**: Green muted background, green text, checkmark icon
- **Unsolved**: Amber muted background, amber text, question mark icon
- **Bounty**: Special treatment - amber border, bounty-gold text, coin icon, bounty amount displayed

### Sticky Header

Fixed header with backdrop-blur creating a frosted-glass effect. In light mode, the blur sits over warm white. In dark mode, over the deep canvas.

Content: back button (on sub-pages), page title (truncated), search icon, user avatar.

The header gains a stronger border-bottom when scrolled (vs invisible at scroll position 0) to indicate elevation.

### Toast Notifications

Slide up from the bottom (mobile) or top-right (desktop). Auto-dismiss after 4 seconds with a progress bar indicator. Types distinguished by left-border color:

- Success: green left border
- Error: red left border
- Warning: amber left border
- Info: primary left border

Toasts stack with 8px gap, max 3 visible at once. Swipe to dismiss on mobile.

### Modal / Dropdown

**Modals** center on screen with a blurred backdrop overlay. Entrance animation: fade backdrop + scale content from 0.95 to 1.0. Exit: reverse.

Max width 520px on desktop, full-width with 16px padding on mobile. Always has a clear close button (X) and respects escape key.

**Dropdowns** appear anchored to their trigger element. Entrance: fade + slide down 4px. Each item highlights on hover with surface-4 background.

### Tab Bar

Horizontal tabs for switching between content views (e.g., Latest/Hot/Following on the home page).

Active tab has primary-colored bottom border (2px) and full ink color text. Inactive tabs use ink-muted. Smooth color transition on switch.

On mobile, if tabs overflow, the tab bar becomes horizontally scrollable with a fade-out edge indicator.

### Article/Prose Reading Area

Long-form content gets special typography treatment:
- Max-width 720px for optimal line length (65-75 characters)
- `prose` typography with 1.75 line height
- Generous paragraph spacing (1.5em between paragraphs)
- Headings have extra top margin (32px) for clear section breaks
- Blockquotes: left border in primary-muted, background in surface-1
- Code blocks: mono font, surface-1 background, rounded-md, 16px padding
- Images: full-bleed within the content width, rounded-md, optional caption below

### Trending/Hot Topic Highlight

Topics marked as trending get a visual distinction:
- Coral left border (3px)
- Subtle secondary-subtle background
- Small "trending" badge with gradient background (coral to amber)
- Fire icon or trending arrow icon

This helps users spot popular discussions quickly in the topic list.

### Badge/Achievement Display

Badges use gradients to feel special and collectible:
- **Bronze tier**: warm brown gradient
- **Silver tier**: cool gray gradient
- **Gold tier**: rich gold gradient
- **Diamond tier**: iridescent blue-purple gradient

Badges display in a grid on user profiles. Each badge has a hover state showing its name and unlock date. Locked badges appear with 50% opacity and a lock icon overlay.

---

## Interaction States

Every interactive element supports these states:

### Default
The resting state. Uses the component's base tokens.

### Hover (Desktop only)
Triggered on mouse hover. Typically one surface level up in background, with optional subtle transform (translateY(-1px) for cards).

### Active/Pressed
Momentary state during click/tap. Usually darkens background slightly and may apply scale(0.98) for a "press" feel.

### Focus
Keyboard focus ring: 3px primary-muted box-shadow around the element. Must be clearly visible for accessibility. Never remove focus indicators.

### Disabled
Reduced opacity or muted colors. `cursor: not-allowed`. No hover/active effects. Text uses ink-disabled color.

### Loading
Replaces content with a skeleton loader (pulsing surface-1/surface-2 gradient) or a spinner. Buttons show an inline spinner and become non-interactive.

### Selected
For toggle-able items (tabs, chips, radio-like selectors). Uses primary-muted background with primary text. Clear visual difference from hover.

### Error
For form inputs: danger-colored border + subtle danger-muted shadow. Error message appears below in danger color with `caption` typography.

---

## Motion & Animation

### Philosophy

Motion serves three purposes: **feedback** (confirming actions), **orientation** (showing spatial relationships), and **delight** (making interactions feel alive). We never animate just for decoration.

### Timing

| Token | Duration | Use Case |
|-------|----------|----------|
| `instant` | 50ms | Color changes on hover, opacity toggles |
| `fast` | 100ms | Button states, small element transitions |
| `normal` | 150ms | Most UI transitions, dropdowns |
| `slow` | 250ms | Modals, toasts, page-level transitions |
| `page` | 200ms | Route transitions between pages |

### Easing

| Token | Curve | Use Case |
|-------|-------|----------|
| `default` | ease-out-quad | Most transitions |
| `enter` | ease-out | Elements appearing/entering |
| `exit` | ease-in | Elements leaving/disappearing |
| `spring` | custom overshoot | Playful interactions (vote, check-in, like) |
| `bounce` | aggressive overshoot | Achievement unlocks, level-ups |

### Micro-interactions

**Vote/Like**: Scale to 1.15 with spring easing, then settle to 1.0. The number counter rolls up/down.

**Check-in**: Button pulses once (scale 1.05), then confetti particles (subtle, max 8 particles) emit from the button center. Transitions to checked state with a checkmark draw animation.

**Follow**: Heart or plus icon animates from outlined to filled with a brief scale pop.

**Notification arrive**: Badge scales from 0 to 1 with spring easing. If already visible, it briefly pulses.

### Page Transitions

Content area fades and shifts slightly (8px vertical or horizontal depending on navigation direction):
- Forward navigation: content slides left, new content enters from right
- Back navigation: content slides right, new content enters from left
- Tab switches: crossfade only (no directional movement)

Duration: 200ms with ease-out easing.

### Loading States

**Skeleton screens**: Pulse animation (alternating surface-1 and surface-2 opacity) at 1.5s interval. Skeleton shapes match the final content layout.

**Inline spinners**: 16px or 20px circular spinner, rotating 360deg at 0.8s linear. Uses primary color.

**Pull-to-refresh**: Custom spring animation on the loading indicator. Content moves down with the pull gesture.

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce`. When active:
- Transforms (scale, translate) are removed
- Opacity transitions stay but with instant duration
- Skeleton loaders use opacity instead of shimmer
- Page transitions become instant crossfades

---

## Accessibility

### Color Contrast

All text meets WCAG 2.1 AA standards:

| Pair | Light Mode | Dark Mode | Ratio |
|------|-----------|-----------|-------|
| ink on canvas | #1a1a2e on #fafaf8 | #e8e6e3 on #0a0a0f | > 14:1 |
| ink-secondary on canvas | #4a4a5e on #fafaf8 | #b4b1ad on #0a0a0f | > 7:1 |
| ink-muted on canvas | #7a7a8e on #fafaf8 | #8c8a85 on #0a0a0f | > 4.5:1 |
| primary on canvas | #5e6ad2 on #fafaf8 | #5e6ad2 on #0a0a0f | > 4.5:1 |
| on-primary on primary | #ffffff on #5e6ad2 | #ffffff on #5e6ad2 | > 4.5:1 |

### Touch Targets

All interactive elements have a minimum touch target of **44x44px** as recommended by WCAG 2.1. For compact list items, the entire row is the touch target even if the visual element (e.g., a small icon) is smaller.

### Focus Management

- Focus is never trapped except within modals (focus trap within modal while open)
- Focus returns to the trigger element when modals/dropdowns close
- Skip-to-content link is the first focusable element on every page
- Tab order follows visual reading order (top-to-bottom, left-to-right)

### Screen Reader Support

- All images have descriptive alt text
- Icon-only buttons include `aria-label`
- Dynamic content updates use `aria-live` regions (polite for notifications, assertive for errors)
- Form inputs are properly labeled with associated error messages
- Loading states announce via `aria-busy`

### Keyboard Navigation

- All interactive elements reachable via Tab
- Enter/Space activate buttons and links
- Arrow keys navigate within groups (tabs, dropdown items, radio groups)
- Escape closes modals, dropdowns, and overlays
- Shortcuts displayed in tooltips (e.g., "N for new post")

---

## Dark/Light Mode Switching

### Behavior

- System preference is the default on first visit (`prefers-color-scheme` media query)
- Users can override with a toggle in settings/header
- Preference is stored in `localStorage` and as a user setting (synced across devices when logged in)
- Transition: 200ms crossfade on all color properties when switching

### Implementation Notes

Use CSS custom properties (variables) for all color tokens. Mode switching only changes the variable values at the `:root` level:

```css
:root {
  /* Default: light */
  --color-canvas: #fafaf8;
  --color-surface-1: #ffffff;
  --color-ink: #1a1a2e;
  /* ...all tokens */
}

:root[data-theme="dark"] {
  --color-canvas: #0a0a0f;
  --color-surface-1: #12121a;
  --color-ink: #e8e6e3;
  /* ...all tokens */
}
```

### Transition Class

Apply a transition class to the `<html>` element during mode switch:

```css
html.theme-transitioning,
html.theme-transitioning * {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease !important;
}
```

Remove the class after 250ms to avoid affecting other animations.

### Images & Media

- Provide two variants for UI illustrations (light and dark) where needed
- User-uploaded images are not altered
- SVG icons use `currentColor` to inherit text color automatically
- Logos may need separate light/dark variants

---

## Mobile-Specific Patterns

### Gestures

| Gesture | Action | Context |
|---------|--------|---------|
| Pull down | Refresh content | Any scrollable list |
| Swipe left on topic | Quick bookmark | Topic list |
| Swipe right on topic | Quick upvote | Topic list |
| Swipe right from edge | Open sidebar | Any page (tablet/mobile) |
| Long press on avatar | Show user card | Anywhere |
| Double tap on content | Like/upvote | Comments, posts |

### Bottom Sheet

On mobile, many desktop modals become bottom sheets:
- Slides up from bottom with spring easing
- Drag handle (4px x 40px rounded bar) at the top
- Can be dismissed by swiping down
- Respects safe area insets on iOS

### Safe Areas

- Bottom navigation respects `env(safe-area-inset-bottom)` on notched devices
- Header respects `env(safe-area-inset-top)`
- Content area applies horizontal safe area insets

### Performance

- Topic list uses virtual scrolling for 100+ items
- Images lazy-load with low-quality placeholder (LQIP)
- Skeleton screens show within 100ms of navigation
- Interactions remain 60fps (no layout thrashing during animations)

---

## Do's and Don'ts

### Do

- Use semantic color tokens, never raw hex values in components
- Use the surface ladder (surface-1 through surface-4) for elevation hierarchy
- Keep text on canvas/surface combinations within the tested contrast ratios
- Use shadows in light mode and borders in dark mode for elevation
- Apply motion tokens for consistent timing across the app
- Test all components in both light and dark mode
- Respect the minimum touch target of 44px
- Use gradients only for special elements (badges, achievements, trending)
- Let node colors come from the 10-color category palette
- Use the `prose` typography tokens for any long-form reading content

### Don't

- Don't use pure black (#000000) or pure white (#ffffff) as canvas colors
- Don't apply gradients to everyday UI elements (buttons, inputs, cards)
- Don't create new colors outside the defined palette without design review
- Don't use more than 3 levels of comment nesting visually
- Don't animate large layout shifts (triggers expensive repaints)
- Don't disable focus indicators for keyboard accessibility
- Don't rely solely on color to communicate state (always pair with icon/text)
- Don't use the secondary (coral) color for primary actions - it's for highlights only
- Don't make touch targets smaller than 44px, even if the visual element is smaller
- Don't use `display-lg` typography for anything other than page-level heroes

---

## Implementation Checklist

When building a new component, verify:

- [ ] Works in both light and dark mode
- [ ] All colors use CSS custom properties (no hardcoded values)
- [ ] Touch targets meet 44px minimum
- [ ] Focus state is visible and uses the standard focus ring
- [ ] Hover state only activates on pointer devices (`@media (hover: hover)`)
- [ ] Loading/skeleton state is defined
- [ ] Reduced motion is handled (`prefers-reduced-motion`)
- [ ] Responsive behavior is defined for all 4 breakpoints
- [ ] Text contrast meets AA standards (4.5:1 for body, 3:1 for large text)
- [ ] Component uses correct typography token (not arbitrary font sizes)
- [ ] Animations use motion tokens (not custom durations/easings)
- [ ] Disabled state prevents interaction and is visually distinct

---

## File & Token Naming Convention

### CSS Custom Properties

```
--{category}-{name}
--color-primary
--color-surface-1
--spacing-lg
--rounded-md
--motion-duration-fast
--z-dropdown
```

### Component Class Names (BEM-inspired)

```
.forum-topic-item
.forum-topic-item--unread
.forum-topic-item--sticky
.forum-topic-item__title
.forum-topic-item__meta
```

### File Organization

```
styles/
  tokens/
    colors-light.css
    colors-dark.css
    typography.css
    spacing.css
    motion.css
  components/
    topic-list.css
    comment-thread.css
    user-card.css
    ...
  layouts/
    sidebar.css
    mobile-nav.css
    responsive.css
  utilities/
    sr-only.css
    truncate.css
    transitions.css
```

---

*This design system is a living document. It evolves with the product. When in doubt, refer to the core principles: warm, information-dense, dual-mode, playfully restrained, and mobile-first.*
