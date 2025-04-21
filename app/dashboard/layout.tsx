import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your notes, access AI-powered features, and organize your thoughts with NOTO AI.",
  alternates: {
    canonical: "/dashboard",
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-16 lg:ml-64 transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-2 sm:px-4 md:px-6 xl:px-8 py-4">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
