"use client"

import type React from "react"

import { useState } from "react"
import { type DraftData, deleteDraft, formatDate, markDraftAsRecovered } from "@/lib/draft-recovery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Clock, AlignLeft, Tag, Trash2 } from "lucide-react"

interface RecoveryDialogProps {
  drafts: DraftData[]
  isOpen: boolean
  onClose: () => void
  onRecover: (draft: DraftData) => void
  onDiscardAll: () => void
}

export function RecoveryDialog({ drafts, isOpen, onClose, onRecover, onDiscardAll }: RecoveryDialogProps) {
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(drafts.length > 0 ? drafts[0].id : null)

  const selectedDraft = drafts.find((draft) => draft.id === selectedDraftId) || null

  const handleRecover = () => {
    if (selectedDraft) {
      markDraftAsRecovered(selectedDraft.id)
      onRecover(selectedDraft)
    }
  }

  const handleDeleteDraft = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteDraft(draftId)

    // If we deleted the selected draft, select the first remaining one
    if (draftId === selectedDraftId) {
      const remainingDrafts = drafts.filter((d) => d.id !== draftId)
      setSelectedDraftId(remainingDrafts.length > 0 ? remainingDrafts[0].id : null)
    }

    // If no drafts left, close the dialog
    if (drafts.length <= 1) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Recover Unsaved Notes</DialogTitle>
          <DialogDescription>
            We found unsaved notes from a previous session that may have been interrupted. Would you like to recover any
            of these drafts?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-4 flex-1 min-h-0 mt-4">
          {/* Draft list */}
          <div className="w-full sm:w-1/3 border rounded-md overflow-hidden">
            <ScrollArea className="h-[300px] sm:h-[400px]">
              <div className="p-1">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedDraftId === draft.id
                        ? "bg-purple-100 dark:bg-purple-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedDraftId(draft.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium truncate">{draft.title || "Untitled Note"}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-2 flex-shrink-0"
                        onClick={(e) => handleDeleteDraft(draft.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(draft.lastModified)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <AlignLeft className="h-3 w-3 mr-1" />
                      {draft.wordCount} words
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Draft preview */}
          <div className="flex-1 border rounded-md overflow-hidden">
            <ScrollArea className="h-[300px] sm:h-[400px]">
              {selectedDraft ? (
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{selectedDraft.title || "Untitled Note"}</h3>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    Last edited {formatDate(selectedDraft.lastModified)}
                  </div>

                  {selectedDraft.tags && selectedDraft.tags.length > 0 && (
                    <div className="flex items-center gap-1 mb-4">
                      <Tag className="h-3 w-3" />
                      <div className="text-xs text-gray-500">
                        {selectedDraft.tags.map((tag) => tag.name).join(", ")}
                      </div>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 border-t pt-4">
                    {selectedDraft.content.length > 500
                      ? `${selectedDraft.content.substring(0, 500)}...`
                      : selectedDraft.content}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Select a draft to preview</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center mt-4 gap-2">
          <Button variant="outline" onClick={onDiscardAll}>
            Discard All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleRecover} disabled={!selectedDraft} className="bg-purple-600 hover:bg-purple-700">
              Recover Selected
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
