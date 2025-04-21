"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  PlusCircle,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  CheckSquare,
  Grip,
  X,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { VirtualizedBlockList } from "./virtualized-block-list"
import { SearchPanel, type SearchOptions } from "./search-panel"
import { type SearchMatch, type SearchResult, batchSearch, highlightText } from "@/lib/search-utils"

type BlockType =
  | "paragraph"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "bulleted-list"
  | "numbered-list"
  | "quote"
  | "code"
  | "image"
  | "todo"

interface Block {
  id: string
  type: BlockType
  content: string
  checked?: boolean
  highlightedContent?: string
}

interface BlockEditorProps {
  initialContent?: string
  onChange: (content: string) => void
  documentSize?: "small" | "medium" | "large"
}

// Memoized block menu to prevent unnecessary re-renders
const BlockMenu = memo(
  ({
    blockId,
    showBlockMenu,
    setShowBlockMenu,
    handleBlockTypeChange,
  }: {
    blockId: string
    showBlockMenu: string | null
    setShowBlockMenu: (id: string | null) => void
    handleBlockTypeChange: (blockId: string, newType: BlockType) => void
  }) => (
    <Popover open={showBlockMenu === blockId} onOpenChange={(open) => !open && setShowBlockMenu(null)}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setShowBlockMenu(blockId)}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2 text-sm font-medium border-b">Basic blocks</div>
        <div className="p-1">
          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "paragraph")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">T</div>
            <div>
              <div className="font-medium">Text</div>
              <div className="text-xs text-gray-500">Just start writing with plain text</div>
            </div>
          </button>

          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "heading-1")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <Heading1 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Heading 1</div>
              <div className="text-xs text-gray-500">Big section heading</div>
            </div>
          </button>

          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "heading-2")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <Heading2 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Heading 2</div>
              <div className="text-xs text-gray-500">Medium section heading</div>
            </div>
          </button>

          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "heading-3")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <Heading3 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Heading 3</div>
              <div className="text-xs text-gray-500">Small section heading</div>
            </div>
          </button>

          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "bulleted-list")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <List className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Bulleted List</div>
              <div className="text-xs text-gray-500">Create a simple bulleted list</div>
            </div>
          </button>

          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "numbered-list")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <ListOrdered className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Numbered List</div>
              <div className="text-xs text-gray-500">Create a list with numbering</div>
            </div>
          </button>

          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "todo")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <CheckSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">To-do List</div>
              <div className="text-xs text-gray-500">Track tasks with a to-do list</div>
            </div>
          </button>

          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "quote")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <Quote className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Quote</div>
              <div className="text-xs text-gray-500">Capture a quote</div>
            </div>
          </button>

          <button
            className="flex items-center w-full p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleBlockTypeChange(blockId, "code")}
          >
            <div className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded">
              <Code className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Code</div>
              <div className="text-xs text-gray-500">Capture a code snippet</div>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  ),
)
BlockMenu.displayName = "BlockMenu"

// Memoized block component to prevent unnecessary re-renders
const EditorBlock = memo(
  ({
    block,
    index,
    isActive,
    showBlockMenu,
    setShowBlockMenu,
    handleBlockChange,
    handleKeyDown,
    handleBlockTypeChange,
    handleTodoToggle,
    blockRefs,
    setActiveBlockId,
  }: {
    block: Block
    index: number
    isActive: boolean
    showBlockMenu: string | null
    setShowBlockMenu: (id: string | null) => void
    handleBlockChange: (id: string, content: string) => void
    handleKeyDown: (e: React.KeyboardEvent, blockId: string, index: number) => void
    handleBlockTypeChange: (blockId: string, newType: BlockType) => void
    handleTodoToggle: (blockId: string) => void
    blockRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>
    setActiveBlockId: (id: string) => void
  }) => {
    // Block props
    const blockProps = {
      className: cn("group relative p-1 my-1 rounded-md transition-colors", isActive && "bg-gray-100 dark:bg-gray-800"),
      onClick: () => setActiveBlockId(block.id),
    }

    // Content props
    const contentProps = {
      ref: (el: HTMLDivElement) => {
        if (el) blockRefs.current[block.id] = el
      },
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: (e: React.FormEvent<HTMLDivElement>) => {
        // Get the plain text content from the div
        const plainText = e.currentTarget.textContent || ""
        handleBlockChange(block.id, plainText)
      },
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, block.id, index),
      className: "outline-none w-full min-h-[1.5em] text-left",
      dangerouslySetInnerHTML: {
        __html: block.highlightedContent || block.content,
      },
    }

    // Block menu button (only visible on hover/focus)
    const blockMenu = (
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity",
          isActive && "opacity-100",
        )}
      >
        <BlockMenu
          blockId={block.id}
          showBlockMenu={showBlockMenu}
          setShowBlockMenu={setShowBlockMenu}
          handleBlockTypeChange={handleBlockTypeChange}
        />
      </div>
    )

    // Drag handle (only visible on hover/focus)
    const dragHandle = (
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-x-[calc(100%+0.5rem)] -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity cursor-grab",
          isActive && "opacity-100",
        )}
      >
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
          <Grip className="h-4 w-4" />
        </Button>
      </div>
    )

    // Render different block types
    switch (block.type) {
      case "heading-1":
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <h1 {...contentProps} className={cn("text-3xl font-bold", contentProps.className)} />
          </div>
        )

      case "heading-2":
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <h2 {...contentProps} className={cn("text-2xl font-bold", contentProps.className)} />
          </div>
        )

      case "heading-3":
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <h3 {...contentProps} className={cn("text-xl font-bold", contentProps.className)} />
          </div>
        )

      case "bulleted-list":
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <div className="flex">
              <div className="mr-2 mt-1.5">•</div>
              <div {...contentProps} />
            </div>
          </div>
        )

      case "numbered-list":
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <div className="flex">
              <div className="mr-2 font-medium">{index + 1}.</div>
              <div {...contentProps} />
            </div>
          </div>
        )

      case "quote":
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic">
              <div {...contentProps} />
            </blockquote>
          </div>
        )

      case "code":
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm">
              <code {...contentProps} />
            </pre>
          </div>
        )

      case "todo":
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <div className="flex items-start">
              <button
                className="mr-2 mt-0.5 h-4 w-4 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0"
                onClick={() => handleTodoToggle(block.id)}
              >
                {block.checked && <X className="h-3 w-3" />}
              </button>
              <div
                {...contentProps}
                className={cn(contentProps.className, block.checked && "line-through text-gray-500")}
              />
            </div>
          </div>
        )

      case "paragraph":
      default:
        return (
          <div {...blockProps}>
            {blockMenu}
            {dragHandle}
            <div {...contentProps} />
          </div>
        )
    }
  },
)
EditorBlock.displayName = "EditorBlock"

// Batch processing helper
function processBatch<T, R>(items: T[], batchSize: number, processor: (item: T) => R): Promise<R[]> {
  return new Promise((resolve) => {
    const results: R[] = []
    let index = 0

    function processNextBatch() {
      const batch = items.slice(index, index + batchSize)
      index += batchSize

      if (batch.length === 0) {
        resolve(results)
        return
      }

      // Process this batch
      batch.forEach((item) => {
        results.push(processor(item))
      })

      // Schedule next batch
      setTimeout(processNextBatch, 0)
    }

    processNextBatch()
  })
}

export function BlockEditor({ initialContent = "", onChange, documentSize = "small" }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult>({ matches: [], totalMatches: 0 })
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const initializedRef = useRef(false)
  const lastContentRef = useRef(initialContent)
  const contentUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const virtualListRef = useRef<any>(null)

  // Initialize blocks from content
  useEffect(() => {
    // Set default blocks if none are initialized yet
    if (!initializedRef.current) {
      let newBlocks: Block[] = []

      if (initialContent) {
        // Split content by paragraphs and create blocks
        const paragraphs = initialContent.split("\n\n").filter((p) => p.trim() !== "")

        newBlocks = paragraphs.map((p) => ({
          id: uuidv4(),
          type: "paragraph" as BlockType,
          content: p,
        }))
      }

      // If no blocks were created or initial content was empty, add an empty paragraph
      if (newBlocks.length === 0) {
        newBlocks = [
          {
            id: uuidv4(),
            type: "paragraph",
            content: "",
          },
        ]
      }

      setBlocks(newBlocks)
      initializedRef.current = true
      lastContentRef.current = initialContent

      // Set the first block as active
      if (newBlocks.length > 0) {
        setActiveBlockId(newBlocks[0].id)
      }
    }
  }, [initialContent])

  // Add an empty block if there are no blocks
  useEffect(() => {
    if (blocks.length === 0 && initializedRef.current) {
      const newBlock = {
        id: uuidv4(),
        type: "paragraph",
        content: "",
      }
      setBlocks([newBlock])
      setActiveBlockId(newBlock.id)
    }
  }, [blocks])

  // Focus the active block
  useEffect(() => {
    if (activeBlockId && blockRefs.current[activeBlockId]) {
      try {
        blockRefs.current[activeBlockId]?.focus()
      } catch (error) {
        console.error("Error focusing block:", error)
      }
    }
  }, [activeBlockId])

  // Update parent component when blocks change - with debounce for large documents
  useEffect(() => {
    if (!initializedRef.current) return

    // Clear any existing timeout
    if (contentUpdateTimeoutRef.current) {
      clearTimeout(contentUpdateTimeoutRef.current)
    }

    // Set a new timeout to update content
    contentUpdateTimeoutRef.current = setTimeout(() => {
      // For large documents, process in batches
      const processBlocksInBatches = async () => {
        const contentParts = await processBatch(
          blocks,
          50, // Process 50 blocks at a time
          (block) => {
            if (block.type === "todo") {
              return `[${block.checked ? "x" : " "}] ${block.content}`
            }
            return block.content
          },
        )

        const content = contentParts.join("\n\n")

        // Only update if content has actually changed
        if (content !== lastContentRef.current) {
          onChange(content)
          lastContentRef.current = content
        }
      }

      processBlocksInBatches()
    }, 300) // 300ms debounce

    return () => {
      if (contentUpdateTimeoutRef.current) {
        clearTimeout(contentUpdateTimeoutRef.current)
      }
    }
  }, [blocks, onChange])

  const handleBlockChange = useCallback((id: string, content: string) => {
    // Ensure we're using the correct text content from the event
    setBlocks((prevBlocks) => prevBlocks.map((block) => (block.id === id ? { ...block, content } : block)))
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, blockId: string, index: number) => {
      const block = blocks.find((b) => b.id === blockId)
      if (!block) return

      // Handle Enter key
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()

        // Get the current block's content
        const currentBlockElement = blockRefs.current[blockId]
        if (!currentBlockElement) return

        // Get cursor position to split content
        const selection = window.getSelection()
        const range = selection?.getRangeAt(0)

        if (!range) return

        // Get content before and after cursor
        const currentContent = block.content
        const cursorOffset = range.startOffset

        // Split the content at cursor position
        const contentBefore = currentContent.substring(0, cursorOffset)
        const contentAfter = currentContent.substring(cursorOffset)

        // Update current block with content before cursor
        setBlocks((prevBlocks) => {
          const updatedBlocks = [...prevBlocks]
          updatedBlocks[index] = {
            ...block,
            content: contentBefore,
          }

          // Create new block with content after cursor
          const newBlock: Block = {
            id: uuidv4(),
            type: block.type, // Inherit the same block type
            content: contentAfter,
          }

          // Insert the new block after the current one
          updatedBlocks.splice(index + 1, 0, newBlock)

          // Set the new block as active after rendering
          setTimeout(() => {
            setActiveBlockId(newBlock.id)
          }, 0)

          return updatedBlocks
        })
      }

      // Handle Backspace key on empty block
      if (e.key === "Backspace" && block.content === "" && blocks.length > 1) {
        e.preventDefault()

        setBlocks((prevBlocks) => prevBlocks.filter((b) => b.id !== blockId))

        // Focus the previous block
        const prevBlockId = blocks[index - 1]?.id
        if (prevBlockId) {
          setTimeout(() => {
            setActiveBlockId(prevBlockId)
            const prevBlockElement = blockRefs.current[prevBlockId]
            if (prevBlockElement) {
              prevBlockElement.focus()

              // Place cursor at the end of the previous block
              const selection = window.getSelection()
              const range = document.createRange()

              if (prevBlockElement.childNodes.length > 0) {
                const lastChild = prevBlockElement.childNodes[prevBlockElement.childNodes.length - 1]
                const textLength = lastChild.textContent?.length || 0
                range.setStart(lastChild, textLength)
              } else {
                range.setStart(prevBlockElement, 0)
              }

              range.collapse(true)
              selection?.removeAllRanges()
              selection?.addRange(range)
            }
          }, 0)
        }
      }

      // Handle slash command
      if (e.key === "/" && block.content === "") {
        e.preventDefault()
        setShowBlockMenu(blockId)
      }

      // Handle search shortcut (Ctrl+F)
      if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    },
    [blocks],
  )

  const handleBlockTypeChange = useCallback((blockId: string, newType: BlockType) => {
    setBlocks((prevBlocks) => prevBlocks.map((block) => (block.id === blockId ? { ...block, type: newType } : block)))
    setShowBlockMenu(null)
  }, [])

  const handleTodoToggle = useCallback((blockId: string) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => (block.id === blockId ? { ...block, checked: !block.checked } : block)),
    )
  }, [])

  const handleVisibleItemsChange = useCallback((startIndex: number, endIndex: number) => {
    setVisibleRange({ start: startIndex, end: endIndex })
  }, [])

  // Handle search
  const handleSearch = useCallback(
    async (query: string, options: SearchOptions) => {
      if (!query.trim()) {
        // Clear search results
        setSearchResults({ matches: [], totalMatches: 0 })
        setCurrentMatchIndex(0)

        // Clear highlights
        setBlocks((blocks) =>
          blocks.map((block) => ({
            ...block,
            highlightedContent: undefined,
          })),
        )

        return
      }

      // Prepare blocks for search
      const blocksForSearch = blocks.map((block) => ({
        id: block.id,
        content: block.content,
      }))

      // Perform search
      const results = await batchSearch(blocksForSearch, query, options)
      setSearchResults(results)
      setCurrentMatchIndex(results.matches.length > 0 ? 1 : 0)

      // Apply highlighting to blocks
      if (results.matches.length > 0) {
        const blocksWithHighlights = [...blocks]

        // Group matches by block ID
        const matchesByBlock = results.matches.reduce(
          (acc, match) => {
            if (!acc[match.blockId]) {
              acc[match.blockId] = []
            }
            acc[match.blockId].push({ start: match.startOffset, end: match.endOffset })
            return acc
          },
          {} as Record<string, { start: number; end: number }[]>,
        )

        // Apply highlights to each block
        Object.entries(matchesByBlock).forEach(([blockId, matches]) => {
          const blockIndex = blocksWithHighlights.findIndex((b) => b.id === blockId)
          if (blockIndex !== -1) {
            const block = blocksWithHighlights[blockIndex]
            blocksWithHighlights[blockIndex] = {
              ...block,
              highlightedContent: highlightText(block.content, matches),
            }
          }
        })

        setBlocks(blocksWithHighlights)

        // Navigate to the first match
        navigateToMatch(results.matches[0])
      } else {
        // Clear highlights if no matches
        setBlocks((blocks) =>
          blocks.map((block) => ({
            ...block,
            highlightedContent: undefined,
          })),
        )
      }
    },
    [blocks],
  )

  // Navigate between search results
  const navigateToMatch = useCallback((match: SearchMatch) => {
    // Find the block element
    const blockElement = blockRefs.current[match.blockId]
    if (!blockElement) return

    // Scroll the block into view
    if (virtualListRef.current && typeof virtualListRef.current.scrollToIndex === "function") {
      try {
        virtualListRef.current.scrollToIndex(match.blockIndex)
      } catch (error) {
        console.error("Error scrolling to match:", error)
      }
    }

    // Set the active block
    setActiveBlockId(match.blockId)

    // Focus the block
    setTimeout(() => {
      if (!blockElement) return

      blockElement.focus()

      // Try to set cursor at the match position
      try {
        const selection = window.getSelection()
        if (!selection) return

        const range = document.createRange()

        // Simple function to find the text node
        const findTextNode = (node: Node, offset: number): { node: Node; offset: number } | null => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || ""
            if (offset <= text.length) {
              return { node, offset }
            }
            return null
          }

          if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
              const result = findTextNode(node.childNodes[i], offset)
              if (result) return result
            }
          }

          return null
        }

        const result = findTextNode(blockElement, match.startOffset)
        if (result) {
          range.setStart(result.node, result.offset)
          range.setEnd(result.node, result.offset)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      } catch (error) {
        console.error("Error setting cursor position:", error)
      }
    }, 100)
  }, [])

  // Handle navigation between search results
  const handleSearchNavigation = useCallback(
    (direction: "next" | "prev") => {
      const { matches } = searchResults
      if (matches.length === 0) return

      let newIndex = currentMatchIndex

      if (direction === "next") {
        newIndex = currentMatchIndex >= matches.length ? 1 : currentMatchIndex + 1
      } else {
        newIndex = currentMatchIndex <= 1 ? matches.length : currentMatchIndex - 1
      }

      setCurrentMatchIndex(newIndex)
      navigateToMatch(matches[newIndex - 1])
    },
    [searchResults, currentMatchIndex, navigateToMatch],
  )

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search with Ctrl+F
      if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Memoize the render function to prevent unnecessary re-renders
  const renderBlock = useCallback(
    (block: Block, index: number) => {
      const isActive = activeBlockId === block.id

      return (
        <EditorBlock
          key={block.id}
          block={block}
          index={index}
          isActive={isActive}
          showBlockMenu={showBlockMenu}
          setShowBlockMenu={setShowBlockMenu}
          handleBlockChange={handleBlockChange}
          handleKeyDown={handleKeyDown}
          handleBlockTypeChange={handleBlockTypeChange}
          handleTodoToggle={handleTodoToggle}
          blockRefs={blockRefs}
          setActiveBlockId={setActiveBlockId}
        />
      )
    },
    [
      activeBlockId,
      showBlockMenu,
      handleBlockChange,
      handleKeyDown,
      handleBlockTypeChange,
      handleTodoToggle,
      setActiveBlockId,
    ],
  )

  // Memoize the blocks array to prevent unnecessary re-renders
  const memoizedBlocks = useMemo(() => blocks, [blocks])

  // For small documents, don't use virtualization
  const smallDocument = useMemo(() => documentSize === "small" && blocks.length < 20, [documentSize, blocks.length])

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* Search button */}
      <Button variant="outline" size="sm" className="absolute top-0 right-0 z-10" onClick={() => setIsSearchOpen(true)}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>

      {/* Search panel */}
      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false)
          // Clear highlights when closing search
          setBlocks((blocks) =>
            blocks.map((block) => ({
              ...block,
              highlightedContent: undefined,
            })),
          )
        }}
        onSearch={handleSearch}
        onNavigate={handleSearchNavigation}
        totalMatches={searchResults.totalMatches}
        currentMatch={currentMatchIndex}
        documentSize={documentSize}
      />

      <div className="pl-10 mt-10">
        {smallDocument ? (
          <div className="static-block-list">
            {blocks.map((block, index) => (
              <div key={block.id} className="mb-2">
                {renderBlock(block, index)}
              </div>
            ))}
          </div>
        ) : (
          <VirtualizedBlockList
            ref={virtualListRef}
            items={memoizedBlocks}
            renderItem={renderBlock}
            estimateSize={60} // Estimate average block height
            overscan={10} // Render 10 items above and below the visible area
            onVisibleItemsChange={handleVisibleItemsChange}
          />
        )}
      </div>
    </div>
  )
}
