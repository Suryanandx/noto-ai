import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "AI Analysis Demo",
  description: "Try out NOTO AI's powerful AI analysis features with this interactive demo.",
}

export default function AIAnalysisDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
