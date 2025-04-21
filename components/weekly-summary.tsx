"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, BarChart, Tag } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { generateWeeklySummary } from "@/lib/ai"
import { format, subDays } from "date-fns"
import type { Note } from "@/types/supabase"
import { MarkdownRenderer } from "./markdown-renderer"

export function WeeklySummary() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [summary, setSummary] = useState<string | null>(null)
  const [topTags, setTopTags] = useState<{ name: string; count: number }[]>([])
  const [moodDistribution, setMoodDistribution] = useState<{ mood: string; count: number }[]>([])
  const { user } = useAuth()
  const supabase = getBrowserClient()

  useEffect(() => {
    if (!user) return

    const fetchRecentNotes = async () => {
      try {
        setIsLoading(true)
        const oneWeekAgo = format(subDays(new Date(), 7), "yyyy-MM-dd")

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
          .gte("created_at", oneWeekAgo)
          .order("created_at", { ascending: false })

        // Transform the data
        const transformedNotes: Note[] =
          data?.map((note) => {
            const transformedTags = note.tags?.map((tagRelation: any) => tagRelation.tags) || []
            return {
              ...note,
              tags: transformedTags,
            }
          }) || []

        setNotes(transformedNotes)

        // Calculate top tags
        const tagCounts: Record<string, number> = {}
        transformedNotes.forEach((note) => {
          note.tags?.forEach((tag) => {
            tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1
          })
        })

        const sortedTags = Object.entries(tagCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setTopTags(sortedTags)

        // Calculate mood distribution
        const moodCounts: Record<string, number> = {}
        transformedNotes.forEach((note) => {
          if (note.mood?.mood) {
            const mood = note.mood.mood
            moodCounts[mood] = (moodCounts[mood] || 0) + 1
          }
        })

        const sortedMoods = Object.entries(moodCounts)
          .map(([mood, count]) => ({ mood, count }))
          .sort((a, b) => b.count - a.count)

        setMoodDistribution(sortedMoods)
      } catch (error) {
        console.error("Error fetching recent notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentNotes()
  }, [user, supabase])

  const handleGenerateSummary = async () => {
    if (notes.length === 0) {
      return
    }

    try {
      setIsGenerating(true)

      const notesForSummary = notes.map((note) => ({
        title: note.title || "Untitled",
        content: note.content,
        date: format(new Date(note.created_at), "yyyy-MM-dd"),
      }))

      const result = await generateWeeklySummary(notesForSummary)
      setSummary(result)
    } catch (error) {
      console.error("Error generating weekly summary:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Weekly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Weekly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No notes created in the past week.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Calendar className="mr-2 h-5 w-5" />
          Weekly Summary ({notes.length} notes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            {summary ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <MarkdownRenderer content={summary} />
                </div>
                <Button variant="outline" size="sm" onClick={handleGenerateSummary}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500">Generate an AI-powered summary of your notes from the past week.</p>
                <Button onClick={handleGenerateSummary} disabled={isGenerating}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Summary"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Top Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topTags.length > 0 ? (
                    topTags.map((tag) => (
                      <Badge key={tag.name} variant="secondary">
                        {tag.name} ({tag.count})
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tags found in recent notes.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  Mood Distribution
                </h3>
                {moodDistribution.length > 0 ? (
                  <div className="space-y-2">
                    {moodDistribution.map((item) => (
                      <div key={item.mood} className="flex items-center">
                        <span className="capitalize w-24">{item.mood}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{
                              width: `${(item.count / notes.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="ml-2 text-sm">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No mood data found in recent notes.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
