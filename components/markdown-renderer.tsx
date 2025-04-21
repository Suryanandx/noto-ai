"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={cn("prose prose-sm sm:prose max-w-none dark:prose-invert", className)}
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <pre className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md overflow-x-auto text-sm font-mono">
              <code className={className} {...props}>
                {String(children).replace(/\n$/, "")}
              </code>
            </pre>
          ) : (
            <code
              className={cn("bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono", className)}
              {...props}
            >
              {children}
            </code>
          )
        },
        // Add custom styling for other elements
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        ul: ({ node, ordered, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
        ol: ({ node, ordered, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
        li: ({ node, ordered, checked, ...props }) => {
          // Handle task list items differently
          if (checked !== null && checked !== undefined) {
            return (
              <li className="my-1 flex items-start">
                <input type="checkbox" checked={checked} readOnly className="mt-1 mr-2" />
                <span {...props} />
              </li>
            )
          }
          return <li className="my-1" {...props} />
        },
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-gray-200 pl-4 italic my-3" {...props} />
        ),
        a: ({ node, ...props }) => <a className="text-blue-500 hover:text-blue-700 hover:underline" {...props} />,
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 my-4" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-gray-700" {...props} />,
        th: ({ node, ...props }) => (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            {...props}
          />
        ),
        td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />,
        hr: ({ node, ...props }) => <hr className="my-6 border-gray-200 dark:border-gray-700" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
