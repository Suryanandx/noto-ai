import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-2 sm:mb-0">
            <p>© {new Date().getFullYear()} NOTO AI. All rights reserved.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
              Privacy
            </Link>
            <a
              href="https://suryanand.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-gray-700 dark:hover:text-gray-300"
            >
              Powered by suryanand.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
