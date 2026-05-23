"use client"

import * as React from "react"
import { UserCheck, UserPlus } from "lucide-react"

import { followAction } from "@/lib/actions/user"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"
import { useI18n } from "@/lib/i18n/provider"

export function FollowButton({
  userId,
  initialFollowed,
  onChanged,
}: {
  userId: string
  initialFollowed?: boolean
  onChanged?: (followed: boolean) => void
}) {
  const { t } = useI18n()
  const [followed, setFollowed] = React.useState(Boolean(initialFollowed))
  const [pending, startTransition] = React.useTransition()

  function submit() {
    const previousFollowed = followed
    const nextFollowed = !followed
    // Optimistically update state immediately
    setFollowed(nextFollowed)
    onChanged?.(nextFollowed)

    startTransition(async () => {
      const result = await followAction(userId, previousFollowed)
      if (!result.ok) {
        // Roll back on error
        setFollowed(previousFollowed)
        onChanged?.(previousFollowed)
        toast.error(result.message || t("composables.unknownError"))
        return
      }
      // Confirm final state from server
      const confirmed = Boolean(result.followed)
      if (confirmed !== nextFollowed) {
        setFollowed(confirmed)
        onChanged?.(confirmed)
      }
    })
  }

  return (
    <Button
      type="button"
      variant={followed ? "outline" : "default"}
      size="sm"
      className="h-7 text-xs"
      disabled={pending}
      onClick={submit}
    >
      {followed ? (
        <UserCheck className="size-3" aria-hidden="true" />
      ) : (
        <UserPlus className="size-3" aria-hidden="true" />
      )}
      <span className="ml-1">
        {followed
          ? t("component.followBtn.followed")
          : t("component.followBtn.follow")}
      </span>
    </Button>
  )
}
