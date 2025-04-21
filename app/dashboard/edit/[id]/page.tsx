"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { NoteEditor } from "@/components/note-editor"
import type { Note } from "@/types/supabase"

export default function EditNotePage() {
  const { id } = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getBrowserClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    const fetchNote = async () => {
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
          .eq("id", id)
          .eq("user_id", user.id)
          .single()

        if (!data) {
          router.push("/dashboard")
          return
        }

        // Transform the data to match our Note type
        const transformedNote: Note = {
          ...data,
          tags: data.tags?.map((tagRelation: any) => tagRelation.tags) || [],
        }

        setNote(transformedNote)
      } catch (error) {
        console.error("Error fetching note:", error)
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [id, user, authLoading, router, supabase])

  if (authLoading || isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Edit Note</h1>
        <div className="flex justify-center py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return null
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Note</h1>
      <NoteEditor note={note} />
    </div>
  )
}
