"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SaveIndicator } from "@/components/save-indicator"
import { debounce } from "@/lib/utils"

interface SimpleNoteEditorProps {
  initialContent: string
  onChange: (content: string) => void
  onSave?: () => void
  autoSaveInterval?: number
  className?: string
  placeholder?: string
}

export function SimpleNoteEditor({
  initialContent = "",
  onChange,
  onSave,
  autoSaveInterval = 5000,
  className = "",
  placeholder = "Start typing...",
}: SimpleNoteEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const contentRef = useRef(content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update contentRef when content changes
  useEffect(() => {
    contentRef.current = content
  }, [content])

  // Auto-save functionality
  useEffect(() => {
    // Only auto-save if content has actually changed
    if (content === initialContent) return

    const timer = setTimeout(() => {
      handleSave()
    }, autoSaveInterval)

    return () => clearTimeout(timer)
  }, [content, initialContent, autoSaveInterval])

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (contentRef.current !== initialContent) {
        handleSave()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [initialContent])

  // Debounced onChange to avoid too many updates
  const debouncedOnChange = useRef(
    debounce((value: string) => {
      onChange(value)
    }, 300),
  ).current

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    debouncedOnChange(newContent)
  }

  const handleSave = async () => {
    if (!content.trim() || content === initialContent) return

    setIsSaving(true)

    try {
      // Call the parent's onSave if provided
      if (onSave) {
        await onSave()
      }

      setLastSaved(new Date())
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Focus the textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-end mb-2">
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
      </div>

      <Textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
        className="min-h-[300px] resize-y text-base leading-relaxed p-4 focus:ring-1 focus:ring-purple-500"
        dir="ltr"
      />

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving || !content.trim() || content === initialContent}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}
