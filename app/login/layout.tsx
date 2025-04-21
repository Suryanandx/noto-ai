import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your NOTO AI account or create a new account to get started with AI-powered note-taking.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
