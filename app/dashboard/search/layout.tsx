import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Search Notes",
  description: "Search through your notes with powerful filtering options and tag-based organization.",
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
