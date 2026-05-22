"use client"

import Link from "@/components/common/link"

import { useAppConfig, useAppLocale } from "@/components/app/app-provider"
import type { Locale } from "@/lib/i18n"
import { useI18n } from "@/lib/i18n/provider"

function localizedText(
  value: Record<string, string> | undefined,
  locale: Locale
) {
  if (!value) {
    return ""
  }

  return value[locale] || value["en-US"] || value["zh-CN"] || ""
}

function isInternalUrl(url: string | undefined) {
  return Boolean(url?.startsWith("/"))
}

export function SiteFooter() {
  const config = useAppConfig()
  const locale = useAppLocale()
  const { t } = useI18n()
  const links =
    config?.footerLinks?.filter(
      (item) => item.visible !== false && localizedText(item.text, locale)
    ) ?? []

  return (
    <section className="main">
      <div className="container">
        <footer className="footer">
          <div className="grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {config?.siteTitle || "BBS-GO"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("common.footer.siteDescription")}
              </p>
            </div>
            <div className="md:text-right">
              <h4 className="text-sm font-semibold text-foreground">
                {t("common.footer.quickLinks")}
              </h4>
              <nav className="mt-1 flex flex-wrap gap-3 md:justify-end">
                <Link
                  href="/topics"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {t("common.footer.topics")}
                </Link>
                <Link
                  href="/articles"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {t("common.footer.articles")}
                </Link>
                <Link
                  href="/search"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {t("common.footer.search")}
                </Link>
              </nav>
            </div>
          </div>
          {links.length ? (
            <div className="footer-links">
              {links.map((item, index) => {
                const label = localizedText(item.text, locale)
                const key = `${item.url || "text"}-${index}`

                if (item.url && isInternalUrl(item.url)) {
                  return (
                    <Link
                      key={key}
                      href={item.url}
                      className="hover:text-foreground"
                    >
                      {label}
                    </Link>
                  )
                }

                if (item.url) {
                  return (
                    <a
                      key={key}
                      href={item.url}
                      target={item.openInNewWindow ? "_blank" : undefined}
                      rel={
                        item.openInNewWindow ? "noopener noreferrer" : undefined
                      }
                      className="hover:text-foreground"
                    >
                      {label}
                    </a>
                  )
                }

                return <span key={key}>{label}</span>
              })}
            </div>
          ) : null}
          <div className="footer-powered">
            <span>{t("common.footer.poweredBy")}</span>
            <a
              href="https://bbs-go.com"
              target="_blank"
              rel="noopener noreferrer"
              className="light"
            >
              BBS-GO
            </a>
          </div>
        </footer>
      </div>
    </section>
  )
}
