"use client"

import {
  DashboardDataPage,
  type DashboardDataPageConfig,
} from "@/components/dashboard/data"
import * as dashboardData from "@/components/dashboard/data/dashboard-data-route-utils"
import { useI18n } from "@/lib/i18n/provider"
import { PERMISSIONS } from "@/lib/auth/permissions.generated"

export default function DashboardGroupsRoute() {
  const { t } = useI18n()
  const config: DashboardDataPageConfig = {
    title: dashboardData.title(t, "groups"),
    description: dashboardData.desc(t, "groups"),
    listEndpoint: "/api/admin/group/list",
    viewPermission: PERMISSIONS.DASHBOARD_GROUP_VIEW,
    detailEndpoint: (id) => `/api/admin/group/${id}`,
    createEndpoint: "/api/admin/group/create",
    createPermission: PERMISSIONS.DASHBOARD_GROUP_CREATE,
    updateEndpoint: "/api/admin/group/update",
    updatePermission: PERMISSIONS.DASHBOARD_GROUP_UPDATE,
    deleteEndpoint: "/api/admin/group/delete",
    deletePermission: PERMISSIONS.DASHBOARD_GROUP_DELETE,
    deleteMode: "jsonIds",
    filters: [
      { name: "name", label: dashboardData.label(t, "name") },
      {
        name: "status",
        label: dashboardData.label(t, "status"),
        type: "select",
        options: dashboardData.normalDeletedOptions(t),
      },
    ],
    columns: [
      { key: "id", label: dashboardData.label(t, "id") },
      { key: "name", label: dashboardData.label(t, "name") },
      { key: "slug", label: dashboardData.label(t, "slug") },
      {
        key: "description",
        label: dashboardData.label(t, "description"),
        className: "min-w-72",
      },
      {
        key: "icon",
        label: dashboardData.label(t, "icon"),
        render: (record) =>
          dashboardData.imageCell(record.icon, String(record.name || "")),
      },
      {
        key: "visibility",
        label: dashboardData.label(t, "visibility"),
        render: (record) => {
          if (record.visibility === 1) {
            return t("dashboard.visibility.private")
          }
          return t("dashboard.visibility.public")
        },
      },
      { key: "memberCount", label: dashboardData.label(t, "memberCount") },
      { key: "topicCount", label: dashboardData.label(t, "topicCount") },
      { key: "sortNo", label: dashboardData.label(t, "sortNo") },
      {
        key: "showInNav",
        label: dashboardData.label(t, "showInNav"),
        render: (record) =>
          record.showInNav ? t("common.yes") : t("common.no"),
      },
      {
        key: "status",
        label: dashboardData.label(t, "status"),
        render: (record) => dashboardData.statusCell(t, record.status),
      },
      {
        key: "createTime",
        label: dashboardData.label(t, "createTime"),
        render: (record) => dashboardData.dateCell(record.createTime),
      },
    ],
    formFields: [
      { name: "name", label: dashboardData.label(t, "name"), required: true },
      { name: "slug", label: dashboardData.label(t, "slug"), required: true },
      { name: "description", label: dashboardData.label(t, "description"), type: "textarea" },
      { name: "icon", label: dashboardData.label(t, "icon"), type: "image", colSpan: 2 },
      {
        name: "visibility",
        label: dashboardData.label(t, "visibility"),
        type: "select",
        required: true,
        options: [
          { label: t("dashboard.visibility.public"), value: 0 },
          { label: t("dashboard.visibility.private"), value: 1 },
        ],
      },
      { name: "sortNo", label: dashboardData.label(t, "sortNo"), type: "number" },
      {
        name: "showInNav",
        label: dashboardData.label(t, "showInNav"),
        type: "select",
        options: [
          { label: t("common.yes"), value: 1 },
          { label: t("common.no"), value: 0 },
        ],
      },
      {
        name: "status",
        label: dashboardData.label(t, "status"),
        type: "select",
        options: dashboardData.normalDeletedOptions(t),
      },
    ],
  }
  return <DashboardDataPage config={config} />
}
