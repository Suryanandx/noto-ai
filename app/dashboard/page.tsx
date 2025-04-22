"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { NoteCard } from "@/components/note-card"
import { EmptyState } from "@/components/empty-state"
import type { Note } from "@/types/supabase"
import { PlusCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeeklySummary } from "@/components/weekly-summary"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getBrowserClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    const fetchNotes = async () => {
      try {
        setIsLoading(true)

        const { data } = await supabase
          .from("notes")
          .select(`
            *,
            tags:note_tags(
              tag_id,
              tags:tags(*)
            )
          `)
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })

        // Transform the data to match our Note type
        const transformedNotes: Note[] =
          data?.map((note) => {
            const transformedTags = note.tags?.map((tagRelation: any) => tagRelation.tags) || []
            return {
              ...note,
              tags: transformedTags,
            }
          }) || []

        setNotes(transformedNotes)
      } catch (error) {
        console.error("Error fetching notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()

    // Add this event listener to handle manual refreshes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotes()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [user, authLoading, router, supabase])

  if (authLoading || isLoading) {
    return (
      <div className="p-3 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">My Notes</h1>
        <div className="flex justify-center py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Notes</h1>
        <Button onClick={() => router.push("/dashboard/new-note")} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Note</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      <div className="mb-4 sm:mb-6">
        <WeeklySummary />
      </div>

      {notes.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2 mr-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">AI-Powered Note Taking</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    NOTO AI can analyze your notes, suggest tags, extract tasks, and more. Try it out by editing any
                    note and clicking "Analyze with AI".
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/new-note")}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create AI-Enhanced Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {notes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}

          {/* Add note button as a card */}
          <div
            className="border border-dashed rounded-lg flex items-center justify-center h-full min-h-[200px] sm:min-h-[250px] cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/dashboard/new-note")}
          >
            <div className="flex flex-col items-center text-gray-500">
              <PlusCircle className="h-8 w-8 mb-2" />
              <span>New Note</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
