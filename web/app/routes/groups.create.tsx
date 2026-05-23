"use client"

import { useState } from "react"
import { useNavigate } from "react-router"
import { Loader2 } from "lucide-react"
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
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Group name"
                  required
                />
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="my-group"
                />
                <p className="text-xs text-muted-foreground">
                  {t("user.groups.slugHint")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your group"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon URL</Label>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner">Banner URL</Label>
                <Input
                  id="banner"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="https://..."
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
