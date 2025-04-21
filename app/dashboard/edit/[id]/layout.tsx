import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Edit Note",
  description: "Edit your note with AI-powered assistance for better organization and insights.",
}

export default function EditNoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
