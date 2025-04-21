import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NotoLogo } from "@/components/noto-logo"

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 text-center">
      <NotoLogo size="lg" />

      <h1 className="mt-8 text-4xl font-bold">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Button
        asChild
        className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>

      <div className="mt-8 text-sm text-gray-500">
        <a href="https://suryanand.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Powered by suryanand.com
        </a>
      </div>
    </div>
  )
}
