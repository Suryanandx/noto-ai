import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, PlusCircle } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-4">
        <FileText className="h-10 w-10 text-purple-500" />
      </div>
      <h3 className="text-lg font-medium">No notes yet</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">Create your first note to get started</p>
      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <Link href="/dashboard/new-note">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Note
        </Link>
      </Button>
    </div>
  )
}
