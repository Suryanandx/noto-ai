import { v4 as uuidv4 } from "uuid"

export interface DraftData {
  id: string
  noteId: string | null // null for new notes
  title: string
  content: string
  tags: any[]
  coverImage: string | null
  lastModified: number
  wordCount: number
  isRecovery: boolean
}

export interface RecoveryMetadata {
  lastSessionId: string
  lastActiveTime: number
  cleanExit: boolean
}

const DRAFT_PREFIX = "note-draft-"
const RECOVERY_METADATA_KEY = "note-recovery-metadata"
const SESSION_ID = uuidv4()
const HEARTBEAT_INTERVAL = 10000 // 10 seconds

// Initialize session tracking
export function initDraftRecovery() {
  // Set up the current session
  const metadata: RecoveryMetadata = {
    lastSessionId: SESSION_ID,
    lastActiveTime: Date.now(),
    cleanExit: false,
  }
  localStorage.setItem(RECOVERY_METADATA_KEY, JSON.stringify(metadata))

  // Set up heartbeat to update lastActiveTime
  const heartbeatInterval = setInterval(() => {
    updateLastActiveTime()
  }, HEARTBEAT_INTERVAL)

  // Set up beforeunload handler to mark clean exit
  const beforeUnloadHandler = () => {
    const metadata = getRecoveryMetadata()
    if (metadata) {
      metadata.cleanExit = true
      localStorage.setItem(RECOVERY_METADATA_KEY, JSON.stringify(metadata))
    }
  }

  window.addEventListener("beforeunload", beforeUnloadHandler)

  // Return cleanup function
  return () => {
    clearInterval(heartbeatInterval)
    window.removeEventListener("beforeunload", beforeUnloadHandler)
    // Mark clean exit on component unmount
    beforeUnloadHandler()
  }
}

// Update the last active time
function updateLastActiveTime() {
  const metadata = getRecoveryMetadata()
  if (metadata) {
    metadata.lastActiveTime = Date.now()
    localStorage.setItem(RECOVERY_METADATA_KEY, JSON.stringify(metadata))
  }
}

// Get recovery metadata
export function getRecoveryMetadata(): RecoveryMetadata | null {
  try {
    const data = localStorage.getItem(RECOVERY_METADATA_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error getting recovery metadata:", error)
    return null
  }
}

// Check if there was a crash
export function checkForCrash(): boolean {
  const metadata = getRecoveryMetadata()
  if (!metadata) return false

  // If the last session ID is different from the current one
  // and the clean exit flag is false, there was likely a crash
  return metadata.lastSessionId !== SESSION_ID && !metadata.cleanExit
}

// Save draft to localStorage
export function saveDraft(draft: Omit<DraftData, "id" | "lastModified" | "wordCount" | "isRecovery">): string {
  const draftId = uuidv4()
  const wordCount = countWords(draft.content)

  const draftData: DraftData = {
    ...draft,
    id: draftId,
    lastModified: Date.now(),
    wordCount,
    isRecovery: true,
  }

  localStorage.setItem(`${DRAFT_PREFIX}${draftId}`, JSON.stringify(draftData))
  return draftId
}

// Update existing draft
export function updateDraft(draftId: string, draft: Partial<DraftData>): void {
  try {
    const existingDraft = getDraft(draftId)
    if (!existingDraft) return

    const wordCount = draft.content ? countWords(draft.content) : existingDraft.wordCount

    const updatedDraft: DraftData = {
      ...existingDraft,
      ...draft,
      lastModified: Date.now(),
      wordCount,
      isRecovery: true,
    }

    localStorage.setItem(`${DRAFT_PREFIX}${draftId}`, JSON.stringify(updatedDraft))
  } catch (error) {
    console.error("Error updating draft:", error)
  }
}

// Get a specific draft
export function getDraft(draftId: string): DraftData | null {
  try {
    const data = localStorage.getItem(`${DRAFT_PREFIX}${draftId}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error getting draft:", error)
    return null
  }
}

// Get all drafts
export function getAllDrafts(): DraftData[] {
  try {
    const drafts: DraftData[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(DRAFT_PREFIX)) {
        const data = localStorage.getItem(key)
        if (data) {
          drafts.push(JSON.parse(data))
        }
      }
    }
    return drafts.sort((a, b) => b.lastModified - a.lastModified) // Sort by most recent
  } catch (error) {
    console.error("Error getting all drafts:", error)
    return []
  }
}

// Delete a draft
export function deleteDraft(draftId: string): void {
  localStorage.removeItem(`${DRAFT_PREFIX}${draftId}`)
}

// Clear all recovery drafts
export function clearAllRecoveryDrafts(): void {
  const drafts = getAllDrafts()
  drafts.forEach((draft) => {
    if (draft.isRecovery) {
      deleteDraft(draft.id)
    }
  })
}

// Mark a draft as no longer a recovery draft (it's been recovered)
export function markDraftAsRecovered(draftId: string): void {
  const draft = getDraft(draftId)
  if (draft) {
    draft.isRecovery = false
    localStorage.setItem(`${DRAFT_PREFIX}${draftId}`, JSON.stringify(draft))
  }
}

// Helper function to count words in content
function countWords(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length
}

// Format date for display
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
