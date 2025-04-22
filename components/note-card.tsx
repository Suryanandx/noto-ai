"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Clock, Sparkles, Briefcase, Home, Book, ListTodo, Lightbulb, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { Note, Tag } from "@/types/supabase"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function NoteCard({ note }: { note: Note }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()
  const supabase = getBrowserClient()

  const handleDelete = async () => {
    try {
      // Close the dialog first to prevent UI issues
      setIsDeleteDialogOpen(false)

      // Add a small delay before performing the deletion
      // This helps prevent UI freezing issues
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Perform the deletion
      await supabase.from("notes").delete().eq("id", note.id)

      // Use a controlled approach to refresh instead of router.refresh()
      // which can sometimes cause UI to become unresponsive
      toast({
        title: "Success",
        description: "Note deleted successfully",
      })

      // Use push instead of refresh for more reliable navigation
      router.push("/dashboard?refresh=" + Date.now())
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  const getCategoryIcon = () => {
    if (!note.category) return <Calendar className="h-4 w-4" />

    switch (note.category.toLowerCase()) {
      case "work":
        return <Briefcase className="h-4 w-4" />
      case "personal":
        return <Home className="h-4 w-4" />
      case "journal":
        return <Book className="h-4 w-4" />
      case "task":
        return <ListTodo className="h-4 w-4" />
      case "idea":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const formattedDate = note.updated_at ? formatDistanceToNow(new Date(note.updated_at), { addSuffix: true }) : ""

  // Check if the note has AI-generated content
  const hasAiContent = note.summary || note.sentiment || note.category || note.mood

  // Get border color based on sentiment
  const getBorderColor = () => {
    if (!note.sentiment) return ""

    switch (note.sentiment.toLowerCase()) {
      case "positive":
        return "border-l-4 border-l-green-500"
      case "negative":
        return "border-l-4 border-l-red-500"
      case "neutral":
      default:
        return "border-l-4 border-l-gray-300"
    }
  }

  return (
    <div className="h-full" onClick={() => router.push(`/dashboard/edit/${note.id}`)}>
      <Card
        className={`h-full flex flex-col transition-all duration-200 hover:shadow-md cursor-pointer border-transparent hover:border-gray-300 ${getBorderColor()}`}
      >
        <CardContent className="p-0 flex flex-col h-full">
          {/* Random pastel color for the card header */}
          <div
            className="h-24 sm:h-32 w-full bg-gradient-to-r from-blue-100 to-purple-100"
            style={{
              backgroundImage: `url('/abstract-geometric-flow.png')`,
            }}
          />

          <div className="p-3 sm:p-4 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-base sm:text-lg font-medium line-clamp-1">{note.title || "Untitled Note"}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/dashboard/edit/${note.id}`)
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="text-xs text-gray-500 mt-1 flex items-center flex-wrap gap-1 sm:gap-2">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formattedDate}
              </span>

              {note.category && (
                <span className="flex items-center">
                  {getCategoryIcon()}
                  <span className="ml-1 capitalize">{note.category}</span>
                </span>
              )}

              {note.mood && (
                <span className="flex items-center">
                  <span className="mr-1">{note.mood.emoji}</span>
                  <span className="capitalize">{note.mood.mood}</span>
                </span>
              )}

              {hasAiContent && (
                <span className="flex items-center">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-3">{truncateContent(note.content)}</p>

            {note.tags && note.tags.length > 0 && (
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
                {note.tags.map((tag: Tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
