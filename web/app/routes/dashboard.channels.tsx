"use client"

import {
  DashboardDataPage,
  type DashboardDataPageConfig,
} from "@/components/dashboard/data"
import * as dashboardData from "@/components/dashboard/data/dashboard-data-route-utils"
import { useI18n } from "@/lib/i18n/provider"
import { PERMISSIONS } from "@/lib/auth/permissions.generated"

export default function DashboardChannelsRoute() {
  const { t } = useI18n()
  const config: DashboardDataPageConfig = {
    title: dashboardData.title(t, "channels"),
    description: dashboardData.desc(t, "channels"),
    listEndpoint: "/api/admin/channel/list",
    viewPermission: PERMISSIONS.DASHBOARD_CHANNEL_VIEW,
    detailEndpoint: (id) => `/api/admin/channel/${id}`,
    createEndpoint: "/api/admin/channel/create",
    createPermission: PERMISSIONS.DASHBOARD_CHANNEL_CREATE,
    updateEndpoint: "/api/admin/channel/update",
    updatePermission: PERMISSIONS.DASHBOARD_CHANNEL_UPDATE,
    deleteEndpoint: "/api/admin/channel/delete",
    deletePermission: PERMISSIONS.DASHBOARD_CHANNEL_DELETE,
    deleteMode: "formId",
    sortEndpoint: "/api/admin/channel/update_sort",
    columns: [
      { key: "id", label: dashboardData.label(t, "id") },
      { key: "name", label: dashboardData.label(t, "name") },
      { key: "nameEn", label: dashboardData.label(t, "nameEn") },
      { key: "icon", label: dashboardData.label(t, "icon") },
      {
        key: "href",
        label: dashboardData.label(t, "href"),
        className: "min-w-72",
      },
      { key: "sortNo", label: dashboardData.label(t, "sortNo") },
      {
        key: "visible",
        label: dashboardData.label(t, "visible"),
        render: (record) =>
          record.visible ? t("dashboard.boolean.yes") : t("dashboard.boolean.no"),
      },
    ],
    formFields: [
      { name: "id", label: dashboardData.label(t, "id"), type: "number" },
      { name: "name", label: dashboardData.label(t, "name"), required: true },
      { name: "nameEn", label: dashboardData.label(t, "nameEn") },
      { name: "icon", label: dashboardData.label(t, "icon"), required: true },
      { name: "href", label: dashboardData.label(t, "href"), required: true },
      { name: "sortNo", label: dashboardData.label(t, "sortNo"), type: "number" },
      {
        name: "visible",
        label: dashboardData.label(t, "visible"),
        type: "select",
        required: true,
        options: dashboardData.booleanOptionsFor(t),
      },
    ],
  }

  return <DashboardDataPage config={config} />
}
