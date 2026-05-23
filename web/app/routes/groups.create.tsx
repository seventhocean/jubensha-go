"use client"

import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import { CloudUpload, Loader2, Pencil, Upload } from "lucide-react"
import { toast } from "sonner"

import { MainShell } from "@/components/layout/main-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGroup } from "@/lib/api/groups"
import { useI18n } from "@/lib/i18n/provider"
import { useDocumentTitle } from "@/lib/use-document-title"

export async function loader() {
  return null
}

export async function clientLoader() {
  return null
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

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
        {/* Upload area */}
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

        {/* Or text + URL input */}
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

export default function GroupsCreateRoute() {
  const { t } = useI18n()
  useDocumentTitle(t("user.groups.createGroup"))
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [banner, setBanner] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function handleNameChange(value: string) {
    setName(value)
    if (!slugManuallyEdited) {
      setSlug(slugify(value))
    }
    if (error) setError("")
  }

  function handleSlugChange(value: string) {
    setSlug(value)
    setSlugManuallyEdited(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError(t("user.groups.nameRequired"))
      return
    }
    setSubmitting(true)
    try {
      await createGroup({
        name: name.trim(),
        slug: slug.trim() || slugify(name.trim()),
        description: description.trim(),
        icon: icon.trim(),
        banner: banner.trim(),
      })
      toast.success(t("user.groups.createSuccess"))
      navigate(`/groups/${slug.trim() || slugify(name.trim())}`)
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
            <CardTitle>{t("user.groups.createGroup")}</CardTitle>
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
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t("user.groups.namePlaceholder")}
                  required
                />
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">{t("user.groups.slugLabel")}</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder={t("user.groups.slugPlaceholder")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("user.groups.slugHelp")}
                </p>
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

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("user.groups.creating")}
                  </>
                ) : (
                  t("user.groups.createGroup")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainShell>
  )
}
