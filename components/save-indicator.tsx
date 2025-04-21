"use client"

import { useState, useEffect } from "react"
import { Check, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaveIndicatorProps {
  isSaving: boolean
  lastSaved?: Date | null
  className?: string
}

export function SaveIndicator({ isSaving, lastSaved, className }: SaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false)
  const [timeAgo, setTimeAgo] = useState<string>("")

  // Show "Saved" message briefly after saving completes
  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaved(true)
      const timer = setTimeout(() => {
        setShowSaved(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, lastSaved])

  // Update time ago text
  useEffect(() => {
    if (!lastSaved) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diffMs = now.getTime() - lastSaved.getTime()
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)

      if (diffSec < 60) {
        setTimeAgo("just now")
      } else if (diffMin < 60) {
        setTimeAgo(`${diffMin}m ago`)
      } else {
        setTimeAgo(`${diffHour}h ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [lastSaved])

  return (
    <div
      className={cn(
        "flex items-center text-xs text-gray-500 transition-opacity",
        !isSaving && !showSaved && "opacity-0",
        className,
      )}
    >
      {isSaving ? (
        <>
          <Save className="h-3 w-3 mr-1 animate-pulse" />
          <span>Saving...</span>
        </>
      ) : showSaved ? (
        <>
          <Check className="h-3 w-3 mr-1 text-green-500" />
          <span>Saved {timeAgo}</span>
        </>
      ) : (
        <>
          <Check className="h-3 w-3 mr-1" />
          <span>Saved {timeAgo}</span>
        </>
      )}
    </div>
  )
}
