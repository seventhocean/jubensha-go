"use client"

import { useEffect, useRef, useState } from "react"
import { Navigate, useLocation, useNavigate, useParams } from "react-router"
import { CloudUpload, Loader2, Pencil } from "lucide-react"
import { toast } from "sonner"

import { useAuthChecked, useCurrentUser } from "@/components/app/app-provider"
import { MainShell } from "@/components/layout/main-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getGroup, updateGroup } from "@/lib/api/groups"
import type { GroupItem } from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { useDocumentTitle } from "@/lib/use-document-title"

function ImageUploader({
  value,
  onChange,
  width,
  height,
  t,
}: {
  value: string
  onChange: (url: string) => void
  width: number
  height: number
  t: (key: string) => string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function upload(file: File) {
    const form = new FormData()
    form.append("image", file, file.name)
    setUploading(true)
    try {
      const resp = await fetch("/api/upload", { method: "POST", body: form })
      const data = await resp.json()
      if (data.code === 0) {
        onChange(data.data.url)
      } else {
        toast.error(data.msg || t("user.groups.operationFailed"))
      }
    } catch {
      toast.error(t("user.groups.operationFailed"))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-muted-foreground/25 bg-muted/40 hover:border-primary hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          style={{ width, height }}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {value ? (
            <>
              <img
                src={value}
                alt=""
                className="size-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity hover:opacity-100">
                <Pencil className="size-5 text-white" />
              </span>
            </>
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <CloudUpload className="size-5" />
              {t("user.groups.uploadImage")}
            </span>
          )}
          {uploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="size-5 animate-spin text-primary" />
            </span>
          ) : null}
        </button>

        <div className="flex-1 space-y-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
          />
          <p className="text-xs text-muted-foreground">
            {t("user.groups.clickToReplace")}
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void upload(file)
        }}
      />
    </div>
  )
}

export default function GroupSettingsRoute() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  useDocumentTitle(t("user.groups.editGroup"))
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useCurrentUser()
  const authChecked = useAuthChecked()

  const [group, setGroup] = useState<GroupItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [banner, setBanner] = useState("")
  const [notice, setNotice] = useState("")
  const [rules, setRules] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!slug) return
    getGroup(slug)
      .then((g) => {
        setGroup(g)
        setName(g.name || "")
        setDescription(g.description || "")
        setIcon(g.icon || "")
        setBanner(g.banner || "")
        setNotice(g.notice || "")
        setRules(g.rules || "")
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (!authChecked) {
    return null
  }

  if (!currentUser) {
    return (
      <Navigate
        to={`/user/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  if (loading) {
    return (
      <MainShell>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </MainShell>
    )
  }

  if (!group) {
    return (
      <MainShell>
        <p className="text-center py-12 text-muted-foreground">
          {t("user.groups.not_found")}
        </p>
      </MainShell>
    )
  }

  if (!group.canManage) {
    return <Navigate to={`/groups/${slug}`} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!group) return
    setSubmitting(true)
    try {
      await updateGroup({
        groupId: group.id,
        name: name.trim(),
        description: description.trim(),
        icon: icon.trim(),
        banner: banner.trim(),
        notice: notice.trim(),
        rules: rules.trim(),
      })
      toast.success(t("user.groups.updateSuccess"))
      navigate(`/groups/${slug}`)
    } catch {
      toast.error(t("user.groups.operationFailed"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MainShell>
      <div className="max-w-xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("user.groups.editGroup")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t("user.groups.nameLabel")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("user.groups.namePlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("user.groups.descriptionLabel")}
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("user.groups.descriptionPlaceholder")}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("user.groups.iconLabel")}</Label>
                <ImageUploader
                  value={icon}
                  onChange={setIcon}
                  width={64}
                  height={64}
                  t={t}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("user.groups.bannerLabel")}</Label>
                <ImageUploader
                  value={banner}
                  onChange={setBanner}
                  width={320}
                  height={160}
                  t={t}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notice">
                  {t("user.groups.noticeLabel")}
                </Label>
                <Textarea
                  id="notice"
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                  placeholder={t("user.groups.noticePlaceholder")}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">
                  {t("user.groups.rulesLabel")}
                </Label>
                <Textarea
                  id="rules"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder={t("user.groups.rulesPlaceholder")}
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("user.groups.saveSettings")}
                  </>
                ) : (
                  t("user.groups.saveSettings")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainShell>
  )
}
