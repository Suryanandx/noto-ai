export interface SearchMatch {
  blockId: string
  blockIndex: number
  startOffset: number
  endOffset: number
  text: string
}

export interface SearchResult {
  matches: SearchMatch[]
  totalMatches: number
}

// Helper function to escape regex special characters
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Create a regex based on search options
export function createSearchRegex(
  query: string,
  options: { caseSensitive: boolean; wholeWord: boolean; regex: boolean },
): RegExp | null {
  if (!query) return null

  try {
    let pattern: string

    if (options.regex) {
      // Use the query as a regex pattern directly
      pattern = query
    } else {
      // Escape special regex characters if not using regex mode
      pattern = escapeRegExp(query)

      // Add word boundary assertions if whole word option is enabled
      if (options.wholeWord) {
        pattern = `\\b${pattern}\\b`
      }
    }

    // Create the regex with appropriate flags
    return new RegExp(pattern, options.caseSensitive ? "g" : "gi")
  } catch (error) {
    console.error("Invalid regex pattern:", error)
    return null
  }
}

// Find all matches in a block of text
export function findMatchesInBlock(blockId: string, blockIndex: number, content: string, regex: RegExp): SearchMatch[] {
  if (!content || !regex) return []

  const matches: SearchMatch[] = []
  let match: RegExpExecArray | null

  // Reset regex lastIndex to start from the beginning
  regex.lastIndex = 0

  // Find all matches in the block
  while ((match = regex.exec(content)) !== null) {
    matches.push({
      blockId,
      blockIndex,
      startOffset: match.index,
      endOffset: match.index + match[0].length,
      text: match[0],
    })
  }

  return matches
}

// Apply highlighting to text based on matches
export function highlightText(text: string, matches: { start: number; end: number }[]): string {
  if (!text || !matches.length) return text

  // Sort matches by start position (in case they're not already sorted)
  const sortedMatches = [...matches].sort((a, b) => a.start - b.start)

  let result = ""
  let lastIndex = 0

  // Build the highlighted text by inserting highlight markers
  sortedMatches.forEach((match) => {
    // Add text before the match
    result += text.substring(lastIndex, match.start)

    // Add the highlighted match with explicit direction
    result += `<mark class="bg-yellow-200 dark:bg-yellow-700" dir="ltr">${text.substring(match.start, match.end)}</mark>`

    lastIndex = match.end
  })

  // Add any remaining text after the last match
  result += text.substring(lastIndex)

  return result
}

// Batch process search for large documents
export async function batchSearch(
  blocks: { id: string; content: string }[],
  query: string,
  options: { caseSensitive: boolean; wholeWord: boolean; regex: boolean },
  batchSize = 50,
): Promise<SearchResult> {
  if (!query.trim() || blocks.length === 0) {
    return { matches: [], totalMatches: 0 }
  }

  const regex = createSearchRegex(query, options)
  if (!regex) return { matches: [], totalMatches: 0 }

  const allMatches: SearchMatch[] = []

  // Process in batches to avoid blocking the UI
  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize)

    // Use setTimeout to yield to the main thread between batches
    await new Promise((resolve) => setTimeout(resolve, 0))

    batch.forEach((block, batchIndex) => {
      if (!block || !block.content) return

      const blockIndex = i + batchIndex
      const blockMatches = findMatchesInBlock(block.id, blockIndex, block.content, regex)
      allMatches.push(...blockMatches)
    })
  }

  return {
    matches: allMatches,
    totalMatches: allMatches.length,
  }
}
