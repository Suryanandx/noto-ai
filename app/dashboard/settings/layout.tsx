import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your NOTO AI account settings and preferences.",
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
