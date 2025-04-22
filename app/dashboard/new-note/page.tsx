import { NoteEditor } from "@/components/note-editor"

export default function NewNotePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">New Note</h1>
      <NoteEditor isNew />
    </div>
  )
}
