"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NoteCard } from "@/components/note-card"
import { getBrowserClient } from "@/lib/supabase"
import type { Note, Tag } from "@/types/supabase"
import { SearchIcon, TagIcon, X } from "lucide-react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = getBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        // Fetch all notes
        const { data: notesData } = await supabase
          .from("notes")
          .select(`
            *,
            tags:note_tags(
              tag_id,
              tags:tags(*)
            )
          `)
          .order("updated_at", { ascending: false })

        // Transform the data to match our Note type
        const transformedNotes: Note[] =
          notesData?.map((note) => {
            const transformedTags = note.tags?.map((tagRelation: any) => tagRelation.tags) || []
            return {
              ...note,
              tags: transformedTags,
            }
          }) || []

        setNotes(transformedNotes)
        setFilteredNotes(transformedNotes)

        // Fetch all tags
        const { data: tagsData } = await supabase.from("tags").select("*").order("name")

        setTags(tagsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  useEffect(() => {
    // Filter notes based on search query and selected tags
    let filtered = notes

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (note) => note.title?.toLowerCase().includes(query) || false || note.content.toLowerCase().includes(query),
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) => note.tags?.some((tag) => selectedTags.includes(tag.name)))
    }

    setFilteredNotes(filtered)
  }, [searchQuery, selectedTags, notes])

  const handleTagSelect = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Notes</h1>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div>
          <div className="flex items-center mb-2">
            <TagIcon className="h-4 w-4 mr-2" />
            <h3 className="text-sm font-medium">Filter by tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagSelect(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {(searchQuery || selectedTags.length > 0) && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Found {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
            </p>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {!isLoading && filteredNotes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No notes found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
