"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Save, ArrowLeft, X, Plus, ImageIcon, Sparkles } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"
import type { Note } from "@/types/supabase"
import { useToast } from "@/hooks/use-toast"
import { analyzeNote, generateTitle } from "@/lib/ai"
import type { Tag as TagType } from "@/types/supabase"
import { AIFeaturesPanel } from "@/components/ai-features-panel"
import { SimpleNoteEditor } from "@/components/simple-note-editor"
import { useMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecoveryDialog } from "@/components/recovery-dialog"
import {
  type DraftData,
  checkForCrash,
  clearAllRecoveryDrafts,
  getAllDrafts,
  initDraftRecovery,
  saveDraft,
  updateDraft,
} from "@/lib/draft-recovery"

interface NoteEditorProps {
  note?: Note
  isNew?: boolean
}

// Helper function to chunk large content for analysis
async function chunkAndAnalyze(content: string, analyzeFunction: (chunk: string) => Promise<any>) {
  // If content is small enough, analyze directly
  if (content.length < 10000) {
    return analyzeFunction(content)
  }

  // For large content, split into chunks and analyze the first chunk
  // plus a summary of the rest
  const firstChunk = content.substring(0, 8000)
  const remainingContent = content.substring(8000)

  // Create a summary of the remaining content
  const summary =
    remainingContent.length > 2000
      ? remainingContent.substring(0, 1000) +
        "... [content truncated for analysis] ..." +
        remainingContent.substring(remainingContent.length - 1000)
      : remainingContent

  // Analyze the first chunk with a note about truncation
  const analysisResult = await analyzeFunction(
    firstChunk + "\n\n[Note: This document has been truncated for analysis. The full content will be saved.]",
  )

  return analysisResult
}

export function NoteEditor({ note, isNew = false }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [tags, setTags] = useState<TagType[]>(note?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(note?.updated_at ? new Date(note.updated_at) : null)
  const [aiSuggestions, setAiSuggestions] = useState<{
    summary?: string
    suggestedTags?: string[]
    sentiment?: string
    tasks?: string[]
    category?: string
    mood?: {
      emoji: string
      mood: string
    }
  }>(
    note?.summary || note?.sentiment || note?.category || note?.mood
      ? {
          summary: note.summary || undefined,
          sentiment: note.sentiment || undefined,
          category: note.category || undefined,
          mood: note.mood || undefined,
        }
      : {},
  )
  const [titleSuggestion, setTitleSuggestion] = useState<string | null>(null)
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState("")
  const [activeTab, setActiveTab] = useState("editor")
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [recoveryDrafts, setRecoveryDrafts] = useState<DraftData[]>([])
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)
  const [hasBeenSaved, setHasBeenSaved] = useState(!!note?.id)
  const [aiError, setAiError] = useState<string | null>(null)

  const contentRef = useRef(content)
  const isMobile = useMobile()
  const hasInitializedFromStorage = useRef(false)
  const draftSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  // Initialize draft recovery system
  useEffect(() => {
    const cleanup = initDraftRecovery()

    // Check for crash and get recovery drafts
    if (checkForCrash()) {
      const drafts = getAllDrafts().filter((draft) => draft.isRecovery)
      if (drafts.length > 0) {
        setRecoveryDrafts(drafts)
        setShowRecoveryDialog(true)
      }
    }

    return cleanup
  }, [])

  // Update contentRef when content changes
  useEffect(() => {
    contentRef.current = content

    // Save to local storage whenever content changes
    const saveToLocalStorage = () => {
      try {
        // Save as a recovery draft
        if (currentDraftId) {
          // Update existing draft
          updateDraft(currentDraftId, {
            title,
            content,
            tags,
            coverImage,
          })
        } else {
          // Create new draft
          const draftId = saveDraft({
            noteId: note?.id || null,
            title,
            content,
            tags,
            coverImage,
          })
          setCurrentDraftId(draftId)
        }
      } catch (error) {
        console.error("Error saving to draft recovery:", error)
      }
    }

    // Throttle local storage updates
    if (draftSaveTimeoutRef.current) {
      clearTimeout(draftSaveTimeoutRef.current)
    }
    draftSaveTimeoutRef.current = setTimeout(saveToLocalStorage, 1000)

    return () => {
      if (draftSaveTimeoutRef.current) {
        clearTimeout(draftSaveTimeoutRef.current)
      }
    }
  }, [content, title, tags, coverImage, currentDraftId, note?.id])

  // Save before tab switch
  const handleTabChange = (value: string) => {
    // If switching away from editor, save the current state
    if (activeTab === "editor" && value !== "editor") {
      // Save the current content to prevent data loss when switching tabs
      if (content.trim()) {
        handleSave(true)
      }
    }
    setActiveTab(value)
  }

  // Auto-analyze content when it changes significantly
  useEffect(() => {
    const analyzeContentIfNeeded = async () => {
      // Only analyze if content has changed significantly
      const minChangeThreshold = 50

      if (content.length > 30 && Math.abs(content.length - lastAnalyzedContent.length) > minChangeThreshold) {
        await handleAnalyzeWithAI()
        setLastAnalyzedContent(content)
      }
    }

    const timer = setTimeout(() => {
      if (content) {
        analyzeContentIfNeeded()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [content, lastAnalyzedContent])

  // Auto-suggest title when content changes
  useEffect(() => {
    const suggestTitleIfNeeded = async () => {
      // Only suggest title if content is substantial and no title exists yet
      if (content.length > 50 && !title) {
        try {
          const suggestion = await generateTitle(content)
          if (suggestion) {
            setTitleSuggestion(suggestion)
          }
        } catch (error) {
          console.error("Error generating title suggestion:", error)
        }
      }
    }

    const timer = setTimeout(() => {
      if (content) {
        suggestTitleIfNeeded()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [content, title])

  const handleSave = async (isAutoSave = false) => {
    if (!content.trim()) {
      if (!isAutoSave) {
        toast({
          title: "Error",
          description: "Note content cannot be empty",
          variant: "destructive",
        })
      }
      return
    }

    try {
      setIsSaving(true)

      if (isNew || !note?.id) {
        // Create new note - only if it hasn't been saved before or we don't have a note ID
        if (!hasBeenSaved) {
          const { data: newNote, error } = await supabase
            .from("notes")
            .insert({
              title: title || null,
              content,
              user_id: (await supabase.auth.getUser()).data.user?.id,
              summary: aiSuggestions.summary,
              sentiment: aiSuggestions.sentiment,
              category: aiSuggestions.category,
              mood: aiSuggestions.mood,
            })
            .select()
            .single()

          if (error) throw error

          // Mark as saved to prevent duplicate creation
          setHasBeenSaved(true)

          // Store the new note ID for future updates
          const newNoteId = newNote.id

          // Add tags
          if (tags.length > 0) {
            for (const tag of tags) {
              // Check if tag exists
              let tagId = tag.id

              if (!tagId) {
                // Create tag if it doesn't exist
                const { data: newTag, error: tagError } = await supabase
                  .from("tags")
                  .insert({ name: tag.name })
                  .select()
                  .single()

                if (tagError) continue
                tagId = newTag.id
              }

              // Create note-tag relationship
              await supabase.from("note_tags").insert({
                note_id: newNote.id,
                tag_id: tagId,
              })
            }
          }

          setLastSaved(new Date())

          if (!isAutoSave) {
            toast({
              title: "Success",
              description: "Note created successfully",
            })

            // Clear recovery draft after successful save
            if (currentDraftId) {
              clearAllRecoveryDrafts()
              setCurrentDraftId(null)
            }

            // Navigate to edit page with the new note ID
            router.push(`/dashboard/edit/${newNote.id}`)
          }
        }
      } else {
        // Update existing note
        const noteId = note?.id

        if (!noteId) {
          console.error("Cannot update note: missing note ID")
          return
        }

        const { error } = await supabase
          .from("notes")
          .update({
            title: title || null,
            content,
            updated_at: new Date().toISOString(),
            summary: aiSuggestions.summary || note?.summary,
            sentiment: aiSuggestions.sentiment || note?.sentiment,
            category: aiSuggestions.category || note?.category,
            mood: aiSuggestions.mood || note?.mood,
          })
          .eq("id", noteId)

        if (error) throw error

        setLastSaved(new Date())

        // Handle tags (this is simplified - a more robust solution would compare existing tags)
        if (!isAutoSave) {
          // Clear existing tags
          await supabase.from("note_tags").delete().eq("note_id", noteId)

          // Add new tags
          if (tags.length > 0) {
            for (const tag of tags) {
              // Check if tag exists
              let tagId = tag.id

              if (!tagId) {
                // Create tag if it doesn't exist
                const { data: newTag, error: tagError } = await supabase
                  .from("tags")
                  .insert({ name: tag.name })
                  .select()
                  .single()

                if (tagError) continue
                tagId = newTag.id
              }

              // Create note-tag relationship
              await supabase.from("note_tags").insert({
                note_id: noteId,
                tag_id: tagId,
              })
            }
          }
        }
      }

      if (!isAutoSave) {
        toast({
          title: "Success",
          description: "Note updated successfully",
        })

        // Clear recovery draft after successful save
        if (currentDraftId) {
          clearAllRecoveryDrafts()
          setCurrentDraftId(null)
        }
      }
    } catch (error) {
      console.error("Error saving note:", error)
      if (!isAutoSave) {
        toast({
          title: "Error",
          description: "Failed to save note",
          variant: "destructive",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return

    // Check if tag already exists
    if (tags.some((tag) => tag.name.toLowerCase() === newTag.toLowerCase())) {
      setNewTag("")
      return
    }

    setTags([...tags, { id: "", name: newTag, created_at: new Date().toISOString() }])
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: TagType) => {
    setTags(tags.filter((tag) => tag.name !== tagToRemove.name))
  }

  const handleAnalyzeWithAI = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAnalyzing(true)
      setAiError(null)

      // Use chunking for large documents
      const analysis = await chunkAndAnalyze(content, analyzeNote)

      setAiSuggestions(analysis)

      // Auto-update note with AI suggestions if it's a new note
      if (isNew && !title && analysis.summary) {
        setTitleSuggestion(analysis.summary.split(".")[0])
      }

      // Save AI analysis results to the database if the note exists
      if (!isNew && note?.id) {
        try {
          await supabase
            .from("notes")
            .update({
              summary: analysis.summary,
              sentiment: analysis.sentiment,
              category: analysis.category,
              mood: analysis.mood,
              updated_at: new Date().toISOString(),
            })
            .eq("id", note.id)

          setLastSaved(new Date())
        } catch (error) {
          console.error("Error saving AI analysis to database:", error)
        }
      }
    } catch (error) {
      console.error("Error analyzing note:", error)

      // Improved error handling with more specific messages
      let errorMessage = "Failed to analyze note with AI"

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = "AI service API key is missing or invalid. Please check your environment variables."
        } else if (error.message.includes("network")) {
          errorMessage = "Network error while connecting to AI service. Please check your connection."
        }
      }

      setAiError(errorMessage)

      toast({
        title: "AI Analysis Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApplySuggestedTag = (tag: string) => {
    if (tags.some((t) => t.name.toLowerCase() === tag.toLowerCase())) return

    setTags([...tags, { id: "", name: tag, created_at: new Date().toISOString() }])
  }

  const handleApplyTitle = (suggestedTitle: string) => {
    setTitle(suggestedTitle)
    setTitleSuggestion(null)
  }

  const handleAddCoverImage = () => {
    // For demo purposes, we'll just use a placeholder image
    setCoverImage("/vibrant-swirls.png")
  }

  const handleApplyTask = (task: string) => {
    // Add the task to the content as a todo item
    const newContent = content + `\n\n- [ ] ${task}`
    setContent(newContent)

    // Don't auto-save immediately after adding a task
    // The regular auto-save interval will handle this
  }

  // Handle recovery dialog actions
  const handleRecoverDraft = (draft: DraftData) => {
    setTitle(draft.title)
    setContent(draft.content)
    setTags(draft.tags || [])
    if (draft.coverImage) setCoverImage(draft.coverImage)

    // Close the dialog
    setShowRecoveryDialog(false)

    toast({
      title: "Draft Recovered",
      description: "Your unsaved draft has been successfully recovered.",
    })
  }

  const handleDiscardAllDrafts = () => {
    clearAllRecoveryDrafts()
    setRecoveryDrafts([])
    setShowRecoveryDialog(false)

    toast({
      title: "Drafts Discarded",
      description: "All recovery drafts have been discarded.",
    })
  }

  // Replace the auto-save effect with this improved version
  useEffect(() => {
    // Only auto-save if there's actual content and enough time has passed
    if (!content.trim() || !hasInitializedFromStorage.current) return

    const timer = setTimeout(() => {
      // Only save if content has changed from the initial content
      if (content !== note?.content) {
        handleSave(true)
      }
    }, 5000) // 5 second auto-save interval

    return () => clearTimeout(timer)
  }, [content, note?.content, hasInitializedFromStorage.current])

  return (
    <div className="container mx-auto max-w-5xl px-2 sm:px-4">
      {/* Recovery Dialog */}
      <RecoveryDialog
        drafts={recoveryDrafts}
        isOpen={showRecoveryDialog}
        onClose={() => setShowRecoveryDialog(false)}
        onRecover={handleRecoverDraft}
        onDiscardAll={handleDiscardAllDrafts}
      />

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => handleSave()}
              disabled={isSaving || !content.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Cover image */}
        {coverImage ? (
          <div className="relative h-32 sm:h-48 w-full rounded-lg overflow-hidden">
            <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setCoverImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="w-full h-12 border-dashed" onClick={handleAddCoverImage}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Add Cover
          </Button>
        )}

        {isMobile ? (
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger
                value="ai"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                AI Features
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Untitled"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl sm:text-3xl font-bold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {titleSuggestion && !title && (
                  <div className="absolute top-full left-0 mt-1 text-sm text-purple-600 flex items-center">
                    <span className="truncate">Suggested: {titleSuggestion}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApplyTitle(titleSuggestion)}
                      className="ml-2 h-6 text-xs py-0 px-2"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <SimpleNoteEditor
                initialContent={content}
                onChange={setContent}
                onSave={() => handleSave(true)}
                autoSaveInterval={5000}
                placeholder="Start typing your note here..."
              />

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <div className="text-sm font-medium">Tags:</div>
                {tags.map((tag) => (
                  <Badge key={tag.name} variant="secondary" className="flex items-center gap-1">
                    {tag.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag.name}</span>
                    </Button>
                  </Badge>
                ))}
                <div className="flex items-center gap-1">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="h-8 w-32"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add tag</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai">
              <AIFeaturesPanel
                noteContent={content}
                aiSuggestions={aiSuggestions}
                isAnalyzing={isAnalyzing}
                onAnalyzeWithAI={handleAnalyzeWithAI}
                onApplySuggestedTag={handleApplySuggestedTag}
                onApplyTask={handleApplyTask}
                autoTitleSuggestion={titleSuggestion}
                onApplyTitle={handleApplyTitle}
                aiError={aiError}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Input
                  placeholder="Untitled"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-3xl font-bold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {titleSuggestion && !title && (
                  <div className="absolute top-full left-0 mt-1 text-sm text-purple-600 flex items-center">
                    <span>Suggested: {titleSuggestion}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApplyTitle(titleSuggestion)}
                      className="ml-2 h-6 text-xs py-0 px-2"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <SimpleNoteEditor
                initialContent={content}
                onChange={setContent}
                onSave={() => handleSave(true)}
                autoSaveInterval={5000}
                placeholder="Start typing your note here..."
              />

              {!isMobile && (
                <div className="fixed bottom-6 right-6 z-10">
                  <Button
                    onClick={() => handleAnalyzeWithAI()}
                    disabled={isAnalyzing || !content.trim()}
                    className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="sr-only">Analyze with AI</span>
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <div className="text-sm font-medium">Tags:</div>
                {tags.map((tag) => (
                  <Badge key={tag.name} variant="secondary" className="flex items-center gap-1">
                    {tag.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag.name}</span>
                    </Button>
                  </Badge>
                ))}
                <div className="flex items-center gap-1">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="h-8 w-32"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add tag</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-0">
              <AIFeaturesPanel
                noteContent={content}
                aiSuggestions={aiSuggestions}
                isAnalyzing={isAnalyzing}
                onAnalyzeWithAI={handleAnalyzeWithAI}
                onApplySuggestedTag={handleApplySuggestedTag}
                onApplyTask={handleApplyTask}
                autoTitleSuggestion={titleSuggestion}
                onApplyTitle={handleApplyTitle}
                aiError={aiError}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
