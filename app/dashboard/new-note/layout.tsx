import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Create New Note",
  description: "Create a new AI-powered note with smart features like tag suggestions, sentiment analysis, and more.",
}

export default function NewNoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
