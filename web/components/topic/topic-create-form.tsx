"use client"

import * as React from "react"
import Link from "@/components/common/link"
import { useRouter } from "@/lib/router/navigation"
import { AlertCircle, Image as ImageIcon, Plus, Trash2, X } from "lucide-react"

import { TagInput } from "@/components/common/tag-input"
import {
  CaptchaChallenge,
  type CaptchaChallengeHandle,
} from "@/components/auth/captcha-field"
import {
  ConfirmDialog,
  type ConfirmDialogState,
} from "@/components/common/confirm-dialog"
import { PreviewableImage } from "@/components/common/image-preview"
import { ContentEditor } from "@/components/editor/content-editor"
import { TopicNodeQuickSelector } from "@/components/topic/topic-node-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/lib/api/client"
import {
  getEditorModeOptions,
  getEditorSwitchConfirmMessage,
  type EditorMode,
} from "@/lib/editor-mode"
import type {
  ImageInfo,
  GroupItem,
  SiteConfig,
  Topic,
  TopicAttachment,
  TopicNode,
  UserSummary,
} from "@/lib/api/types"
import { useI18n } from "@/lib/i18n/provider"
import { formatDate } from "@/lib/format"
import {
  getFirstTopicNodeId,
  hasTopicNode,
} from "@/lib/topic-nodes"
import { useToastActions } from "@/lib/toast"

type TopicCreateFormState = {
  nodeId: number
  groupId: number
  title: string
  tags: string[]
  contentType: "html" | "markdown" | "text"
  content: string
  hideContent: string
  imageList: ImageInfo[]
  vote: TopicVoteForm | null
  bountyScore?: number
  attachmentIds: string[]
}

type TopicVoteForm = {
  type: 1 | 2
  title: string
  expiredAt: number
  voteNum: number
  options: Array<{ content: string }>
}

const DEFAULT_ATTACHMENT_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.zip,.rar,.7z,.tar,.gz"

function createInitialForm({
  nodeId,
  groupId,
  contentType,
}: {
  nodeId: number
  groupId?: number
  contentType: TopicCreateFormState["contentType"]
}): TopicCreateFormState {
  return {
    nodeId,
    groupId: groupId || 0,
    title: "",
    tags: [],
    contentType,
    content: "",
    hideContent: "",
    imageList: [],
    vote: null,
    bountyScore: undefined,
    attachmentIds: [],
  }
}

function TopicAttachmentField({
  value,
  config,
  uploading,
  onUploadingChange,
  onChange,
}: {
  value: TopicAttachment[]
  config?: SiteConfig["attachmentConfig"]
  uploading: boolean
  onUploadingChange: (value: boolean) => void
  onChange: (value: TopicAttachment[]) => void
}) {
  const { t } = useI18n()
  const { catchError } = useToastActions()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const maxCount = config?.maxCount ?? 5
  const maxSizeMB = config?.maxSizeMB ?? 10
  const accept =
    Array.isArray(config?.allowedTypes) && config.allowedTypes.length
      ? config.allowedTypes.join(",")
      : DEFAULT_ATTACHMENT_ACCEPT

  async function upload(file: File) {
    onUploadingChange(true)
    try {
      const body = new FormData()
      body.append("file", file, file.name)
      body.append("downloadScore", "0")
      const attachment = await apiFetch<TopicAttachment>(
        "/api/attachment/upload",
        {
          method: "POST",
          body,
        }
      )
      onChange([...value, attachment])
    } catch (error) {
      catchError(error)
    } finally {
      onUploadingChange(false)
    }
  }

  async function updateScore(
    attachment: TopicAttachment,
    downloadScore: number
  ) {
    onChange(
      value.map((item) =>
        item.id === attachment.id ? { ...item, downloadScore } : item
      )
    )
    try {
      await apiFetch<null>("/api/attachment/update_download_score", {
        method: "POST",
        body: { id: attachment.id, downloadScore },
      })
    } catch (error) {
      catchError(error)
    }
  }

  return (
    <div className="rounded-md border border-dashed bg-muted/20 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t("pages.topic.create.attachment.label")}
        </span>
        <span className="text-xs text-muted-foreground">
          {t("pages.topic.create.attachment.limitHint", {
            maxCount,
            maxSizeMB,
          })}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || value.length >= maxCount}
          onClick={() => inputRef.current?.click()}
        >
          {t("pages.topic.create.attachment.add")}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            if (file) void upload(file)
            event.currentTarget.value = ""
          }}
        />
      </div>
      {uploading ? (
        <div className="mt-2 text-xs text-muted-foreground">
          {t("pages.topic.create.attachmentUploading")}
        </div>
      ) : null}
      {value.length ? (
        <ul className="mt-2 space-y-2 text-sm">
          {value.map((attachment, index) => (
            <li
              key={attachment.id || index}
              className="flex flex-col gap-2 rounded border bg-background p-2 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <span className="block truncate font-medium">
                  {attachment.fileName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {attachment.fileSize || 0} B
                </span>
              </div>
              <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                {t("pages.topic.create.attachment.scorePlaceholder")}
                <Input
                  type="number"
                  min="0"
                  step="1"
                  className="h-8 w-20"
                  value={attachment.downloadScore ?? 0}
                  onChange={(event) =>
                    void updateScore(
                      attachment,
                      Math.max(0, Number(event.currentTarget.value) || 0)
                    )
                  }
                />
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive"
                aria-label={t("pages.topic.create.attachment.remove")}
                onClick={() =>
                  onChange(value.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function imageSrc(image: ImageInfo) {
  return image.url || image.preview || ""
}

function findNodeById(
  nodes: TopicNode[],
  id: number
): TopicNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

function defaultVote(): TopicVoteForm {
  return {
    type: 1,
    title: "",
    expiredAt: Date.now() + 24 * 60 * 60 * 1000,
    voteNum: 1,
    options: [{ content: "" }, { content: "" }],
  }
}

function cloneVote(vote: TopicVoteForm): TopicVoteForm {
  return {
    type: vote.type === 2 ? 2 : 1,
    title: vote.title || "",
    expiredAt: vote.expiredAt || Date.now() + 24 * 60 * 60 * 1000,
    voteNum: Number(vote.voteNum) || (vote.type === 2 ? 2 : 1),
    options:
      vote.options && vote.options.length >= 2
        ? vote.options.map((option) => ({ content: option.content || "" }))
        : [{ content: "" }, { content: "" }],
  }
}

function VoteEditor({
  vote,
  onChange,
}: {
  vote: TopicVoteForm
  onChange: (vote: TopicVoteForm) => void
}) {
  const { t } = useI18n()
  const dateValue = new Date(vote.expiredAt).toISOString().slice(0, 16)

  return (
    <div className="mt-2 space-y-3 rounded-md border bg-background p-3">
      <Input
        value={vote.title}
        placeholder={t("pages.topic.create.vote.titlePlaceholder")}
        onChange={(event) =>
          onChange({ ...vote, title: event.currentTarget.value })
        }
      />
      <div className="space-y-2">
        {vote.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-5 text-xs text-muted-foreground">
              {index + 1}.
            </span>
            <Input
              value={option.content}
              placeholder={t("pages.topic.create.vote.optionPlaceholder", {
                index: index + 1,
              })}
              onChange={(event) =>
                onChange({
                  ...vote,
                  options: vote.options.map((item, itemIndex) =>
                    itemIndex === index
                      ? { content: event.currentTarget.value }
                      : item
                  ),
                })
              }
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={vote.options.length <= 2}
              onClick={() =>
                onChange({
                  ...vote,
                  options: vote.options.filter(
                    (_, itemIndex) => itemIndex !== index
                  ),
                  voteNum: Math.min(vote.voteNum, vote.options.length - 1),
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={vote.options.length >= 20}
        onClick={() =>
          onChange({ ...vote, options: [...vote.options, { content: "" }] })
        }
      >
        <Plus className="h-4 w-4" />
        {t("pages.topic.create.vote.addOption")}
      </Button>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={vote.type === 1 ? "default" : "outline"}
          onClick={() => onChange({ ...vote, type: 1, voteNum: 1 })}
        >
          {t("pages.topic.create.vote.single")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={vote.type === 2 ? "default" : "outline"}
          onClick={() =>
            onChange({ ...vote, type: 2, voteNum: Math.max(2, vote.voteNum) })
          }
        >
          {t("pages.topic.create.vote.multipleShort")}
        </Button>
        {vote.type === 2 ? (
          <>
            <span className="text-xs text-muted-foreground">
              {t("pages.topic.create.vote.voteNum")}
            </span>
            <Input
              type="number"
              min="1"
              max={vote.options.length}
              className="h-8 w-20"
              value={vote.voteNum}
              onChange={(event) =>
                onChange({
                  ...vote,
                  voteNum: Number(event.currentTarget.value) || 1,
                })
              }
            />
          </>
        ) : null}
      </div>
      <Input
        type="datetime-local"
        value={dateValue}
        onChange={(event) =>
          onChange({
            ...vote,
            expiredAt: new Date(event.currentTarget.value).getTime(),
          })
        }
      />
    </div>
  )
}

function VoteEditorModal({
  open,
  editing,
  vote,
  onOpenChange,
  onChange,
  onConfirm,
}: {
  open: boolean
  editing: boolean
  vote: TopicVoteForm
  onOpenChange: (open: boolean) => void
  onChange: (vote: TopicVoteForm) => void
  onConfirm: () => void
}) {
  const { t } = useI18n()

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border bg-background shadow-lg">
        <div className="border-b px-4 py-3 text-lg font-semibold">
          {editing
            ? t("pages.topic.create.vote.editTitle")
            : t("pages.topic.create.vote.addTitle")}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <VoteEditor vote={vote} onChange={onChange} />
        </div>
        <div className="flex justify-end gap-2 border-t px-4 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("dialog.cancel")}
          </Button>
          <Button type="button" onClick={onConfirm}>
            {t("dialog.ok")}
          </Button>
        </div>
      </div>
    </div>
  )
}

function validateVote(
  vote: TopicVoteForm | null,
  t: ReturnType<typeof useI18n>["t"],
  msgWarning: (message: string) => void
) {
  if (!vote) return true
  if (!vote.title.trim()) {
    msgWarning(t("pages.topic.create.vote.validateTitle"))
    return false
  }
  if (!vote.expiredAt || vote.expiredAt <= Date.now()) {
    msgWarning(t("pages.topic.create.vote.validateExpiredAt"))
    return false
  }
  const options = vote.options
    .map((option) => option.content.trim())
    .filter(Boolean)
  if (options.length < 2) {
    msgWarning(t("pages.topic.create.vote.validateOptionCount"))
    return false
  }
  if (
    new Set(options.map((item) => item.toLowerCase())).size !== options.length
  ) {
    msgWarning(t("pages.topic.create.vote.validateOptionDuplicate"))
    return false
  }
  if (vote.type === 2 && (vote.voteNum <= 0 || vote.voteNum > options.length)) {
    msgWarning(t("pages.topic.create.vote.validateVoteNum"))
    return false
  }
  return true
}

export function TopicCreateForm({
  contentType,
  currentUser,
  config,
  nodeId,
  groupId,
  groupSlug,
  nodes,
}: {
  contentType: TopicCreateFormState["contentType"]
  currentUser: UserSummary
  config: SiteConfig | null
  nodeId: number
  groupId?: number
  groupSlug?: string
  nodes: TopicNode[]
}) {
  const router = useRouter()
  const { t } = useI18n()
  const { catchError, msgWarning } = useToastActions()
  const editorModeOptions = React.useMemo(() => getEditorModeOptions(t), [t])
  const captchaRef = React.useRef<CaptchaChallengeHandle>(null)
  const lastSubmitAtRef = React.useRef(0)
  const [publishing, setPublishing] = React.useState(false)
  const [attachmentList, setAttachmentList] = React.useState<TopicAttachment[]>(
    []
  )
  const [attachmentUploading, setAttachmentUploading] = React.useState(false)
  const [voteModalOpen, setVoteModalOpen] = React.useState(false)
  const [voteEditing, setVoteEditing] = React.useState(false)
  const [voteDraft, setVoteDraft] = React.useState<TopicVoteForm>(defaultVote())
  const [confirmState, setConfirmState] =
    React.useState<ConfirmDialogState>(null)
  const [form, setForm] = React.useState<TopicCreateFormState>(() =>
    createInitialForm({
      nodeId: nodeId || config?.defaultNodeId || 0,
      groupId,
      contentType,
    })
  )

  const [groupInfo, setGroupInfo] = React.useState<GroupItem | null>(null)
  React.useEffect(() => {
    if (groupId && groupId > 0 && groupSlug) {
      apiFetch<GroupItem>(`/api/group/${groupSlug}`)
        .then((g) => setGroupInfo(g))
        .catch(() => setGroupInfo(null))
    }
  }, [groupId, groupSlug])

  const effectiveNodeId = hasTopicNode(nodes, form.nodeId)
    ? form.nodeId
    : getFirstTopicNodeId(nodes)

  const selectedNode = findNodeById(nodes, effectiveNodeId)
  const isQaNode = selectedNode?.type === "qa"

  const isNeedEmailVerify = Boolean(
    config?.createTopicEmailVerified && !currentUser.emailVerified
  )
  const featureDisabled = config
    ? !(config.modules?.topic || config.modules?.qa)
    : false

  function updateForm(next: Partial<TopicCreateFormState>) {
    setForm((current) => ({ ...current, ...next }))
  }

  function switchEditor(nextContentType: EditorMode) {
    const currentContentType: EditorMode =
      form.contentType === "markdown" ? "markdown" : "html"
    if (nextContentType === currentContentType) {
      return
    }
    if (form.content.trim()) {
      setConfirmState({
        description: getEditorSwitchConfirmMessage(currentContentType, t),
        confirmText: t("common.confirm"),
        onConfirm: () => {
          updateForm({
            content: "",
            contentType: nextContentType,
          })
        },
      })
      return
    }
    updateForm({
      content: "",
      contentType: nextContentType,
    })
  }

  async function publish(
    captcha?: ReturnType<CaptchaChallengeHandle["getCaptcha"]>
  ) {
    if (publishing) return
    const now = Date.now()
    if (now - lastSubmitAtRef.current < 500) {
      return
    }
    lastSubmitAtRef.current = now
    if (attachmentUploading) {
      msgWarning(t("pages.topic.create.attachmentUploading"))
      return
    }
    if (!validateVote(form.vote, t, msgWarning)) {
      return
    }

    setPublishing(true)
    try {
      const data = await apiFetch<Topic>("/api/topic/create", {
        method: "POST",
        body: {
          type: 0,
          ...form,
          nodeId: effectiveNodeId,
          bountyScore: Number(form.bountyScore) || 0,
          attachmentIds:
            !isQaNode && config?.attachmentConfig?.enabled
              ? attachmentList.map((item) => item.id)
              : [],
          vote:
            !isQaNode && form.vote
              ? {
                  ...form.vote,
                  voteNum: form.vote.type === 1 ? 1 : form.vote.voteNum,
                  options: form.vote.options.map((option) => ({
                    content: option.content.trim(),
                  })),
                }
              : null,
          captchaId: captcha?.captchaId || "",
          captchaCode: captcha?.captchaCode || "",
          captchaProtocol: captcha?.captchaProtocol || 2,
        },
      })
      router.push(`/topic/${data.id}`)
    } catch (error) {
      catchError(error)
      setPublishing(false)
      captchaRef.current?.reset()
    }
  }

  function submit() {
    if (config?.topicCaptcha) {
      void captchaRef.current?.open()
      return
    }
    void publish()
  }

  function showVoteEditor(vote?: TopicVoteForm | null) {
    setVoteEditing(Boolean(vote))
    setVoteDraft(vote ? cloneVote(vote) : defaultVote())
    setVoteModalOpen(true)
  }

  function confirmVote() {
    if (!validateVote(voteDraft, t, msgWarning)) {
      return
    }
    updateForm({
      vote: {
        ...voteDraft,
        type: voteDraft.type === 2 ? 2 : 1,
        voteNum: voteDraft.type === 1 ? 1 : voteDraft.voteNum,
        options: voteDraft.options.map((option) => ({
          content: option.content.trim(),
        })),
      },
    })
    setVoteModalOpen(false)
  }

  if (featureDisabled) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4 shrink-0" />
        <AlertTitle>{t("pages.topic.create.topicFeatureDisabled")}</AlertTitle>
      </Alert>
    )
  }

  if (isNeedEmailVerify) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4 shrink-0" />
        <AlertTitle>{t("pages.topic.create.needEmailTitle")}</AlertTitle>
        <AlertDescription>
          {t("pages.topic.create.needEmailBody")}
          <Link href="/user/profile/account" className="text-primary">
            {t("pages.topic.create.goVerify")}
          </Link>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="publish-form">
        <div className="form-title">
          <div className="form-title-name">
            {t("pages.topic.create.post")}
          </div>
          <div
            className="editor-mode-switch flex"
            aria-label={t("component.editorMode.switchLabel")}
          >
            <span className="editor-mode-switch-label">
              {t("component.editorMode.label")}
            </span>
            <Tabs
              value={form.contentType === "markdown" ? "markdown" : "html"}
              onValueChange={(value) => switchEditor(value as EditorMode)}
            >
              <TabsList className="h-7 p-0.5 group-data-horizontal/tabs:h-7">
                {editorModeOptions.map((option) => (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    className="h-6 px-2 py-0 text-xs"
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {groupInfo ? (
          <div className="flex items-center gap-2 rounded-md border border-[var(--color-hairline)] bg-[var(--color-semantic-info-bg)] px-3 py-2 mb-3">
            {groupInfo.icon ? (
              <img
                src={groupInfo.icon}
                alt={groupInfo.name}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : null}
            <span className="text-sm text-[var(--color-semantic-info)]">
              {t("pages.topic.create.publishingTo", { group: groupInfo.name })}
            </span>
          </div>
        ) : null}

        <div className="field">
          <TopicNodeQuickSelector
            value={effectiveNodeId}
            nodes={nodes}
            onChange={(nodeId) => updateForm({ nodeId })}
          />
        </div>

        <div className="field">
          <Input
            value={form.title}
            placeholder={t("pages.topic.create.titlePlaceholder")}
            onChange={(event) =>
              updateForm({ title: event.currentTarget.value })
            }
          />
        </div>

        <div className="field">
          <ContentEditor
            contentType={
              form.contentType === "markdown" ? "markdown" : "html"
            }
            value={form.content}
            placeholder={t("pages.topic.create.contentPlaceholder")}
            height="400px"
            onChange={(content) => updateForm({ content })}
          />
        </div>

        {!isQaNode && config?.enableHideContent ? (
          <div className="field">
            <ContentEditor
              contentType="html"
              value={form.hideContent}
              placeholder={t("pages.topic.detail.hideContent")}
              height="200px"
              onChange={(hideContent) => updateForm({ hideContent })}
            />
          </div>
        ) : null}

        <div className="field">
          <TagInput
            value={form.tags}
            recommendTags={config?.recommendTags}
            placeholder={t("component.tagInput.placeholder")}
            onChange={(tags) => updateForm({ tags })}
          />
        </div>

        {isQaNode && config?.enableQaBounty ? (
          <div className="field rounded-md border border-dashed bg-muted/20 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t("pages.topic.create.bountyLabel")}
              </span>
              <Input
                value={form.bountyScore ?? ""}
                type="number"
                min="0"
                step="1"
                placeholder={t("pages.topic.create.bountyPlaceholder")}
                className="w-38"
                onChange={(event) =>
                  updateForm({
                    bountyScore: Number(event.currentTarget.value) || 0,
                  })
                }
              />
            </div>
          </div>
        ) : null}

        {!isQaNode && config?.attachmentConfig?.enabled ? (
          <div className="field">
            <TopicAttachmentField
              value={attachmentList}
              config={config.attachmentConfig}
              uploading={attachmentUploading}
              onUploadingChange={setAttachmentUploading}
              onChange={setAttachmentList}
            />
          </div>
        ) : null}

        {!isQaNode ? (
          <div className="field rounded-md border border-dashed bg-muted/20 p-3">
            <div className="flex flex-wrap items-center gap-2">
              {!form.vote ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => showVoteEditor()}
                >
                  {t("pages.topic.create.vote.addEntry")}
                </Button>
              ) : (
                <>
                  <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    {t("pages.topic.create.vote.added")}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => showVoteEditor(form.vote)}
                  >
                    {t("pages.topic.create.vote.edit")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateForm({ vote: null })}
                  >
                    {t("pages.topic.create.vote.remove")}
                  </Button>
                </>
              )}
            </div>
            {form.vote ? (
              <div className="mt-2 rounded-md border bg-background px-2 py-2 text-xs text-muted-foreground">
                <div>{form.vote.title}</div>
                <div className="mt-1">
                  {form.vote.type === 1
                    ? t("pages.topic.create.vote.single")
                    : t("pages.topic.create.vote.multiple", {
                        num: form.vote.voteNum,
                      })}
                  {" · "}
                  {form.vote.options.length}{" "}
                  {t("pages.topic.create.vote.optionsCount")}
                </div>
                <div className="mt-1">
                  {t("pages.topic.create.vote.expiredAt")}:{" "}
                  {formatDate(form.vote.expiredAt)}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="form-footer">
          <Button
            type="button"
            disabled={publishing || attachmentUploading}
            onClick={submit}
          >
            {t("pages.topic.create.postBtn")}
          </Button>
        </div>
      </div>
      <VoteEditorModal
        open={voteModalOpen}
        editing={voteEditing}
        vote={voteDraft}
        onOpenChange={setVoteModalOpen}
        onChange={setVoteDraft}
        onConfirm={confirmVote}
      />
      <CaptchaChallenge
        ref={captchaRef}
        onVerified={() => {
          const captcha = captchaRef.current?.getCaptcha()
          void publish(captcha)
        }}
      />
      <ConfirmDialog
        state={confirmState}
        onOpenChange={(open) => {
          if (!open) setConfirmState(null)
        }}
      />
    </>
  )
}
