"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define a simple CaseSensitive icon component inline to avoid import issues
const CaseSensitive = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m18 16 4-9 4 9" />
    <path d="M18 7h8" />
    <rect x="2" y="7" width="12" height="12" rx="2" />
    <path d="M6 11v4" />
    <path d="M10 11v4" />
    <path d="M6 15h4" />
    <path d="M6 11h4" />
  </svg>
)

interface SearchPanelProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string, options: SearchOptions) => void
  onNavigate: (direction: "next" | "prev") => void
  totalMatches: number
  currentMatch: number
  documentSize: "small" | "medium" | "large"
}

export interface SearchOptions {
  caseSensitive: boolean
  wholeWord: boolean
  regex: boolean
}

export function SearchPanel({
  isOpen,
  onClose,
  onSearch,
  onNavigate,
  totalMatches,
  currentMatch,
  documentSize,
}: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [options, setOptions] = useState<SearchOptions>({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  })
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle search input changes with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      return
    }

    const debounceTime = documentSize === "large" ? 500 : documentSize === "medium" ? 300 : 150
    const timer = setTimeout(() => {
      onSearch(searchQuery, options)
    }, debounceTime)

    return () => clearTimeout(timer)
  }, [searchQuery, options, onSearch, documentSize])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        onClose()
      }

      // Find next with Enter or F3
      if ((e.key === "Enter" && !e.shiftKey) || (e.key === "F3" && !e.shiftKey)) {
        e.preventDefault()
        onNavigate("next")
      }

      // Find previous with Shift+Enter or Shift+F3
      if ((e.key === "Enter" && e.shiftKey) || (e.key === "F3" && e.shiftKey)) {
        e.preventDefault()
        onNavigate("prev")
      }

      // Open search with Ctrl+F
      if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (!isOpen) {
          // This would be handled by the parent component
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNavigate])

  if (!isOpen) return null

  return (
    <div className="absolute top-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700 w-80 p-3 m-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in document..."
            className="pl-8 h-9"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={options.caseSensitive ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setOptions({ ...options, caseSensitive: !options.caseSensitive })}
                >
                  <CaseSensitive className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Case sensitive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={options.wholeWord ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setOptions({ ...options, wholeWord: !options.wholeWord })}
                >
                  <span className="text-xs font-bold">Ab</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Match whole word</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={options.regex ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setOptions({ ...options, regex: !options.regex })}
                >
                  <span className="text-xs font-bold">.*</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use regular expression</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            {totalMatches > 0 ? `${currentMatch} of ${totalMatches}` : "No results"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("prev")}
            disabled={totalMatches === 0}
            className="h-8 w-8"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("next")}
            disabled={totalMatches === 0}
            className="h-8 w-8"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
