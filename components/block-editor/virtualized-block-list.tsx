"use client"

import type React from "react"

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { cn } from "@/lib/utils"

interface VirtualizedBlockListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  estimateSize?: number
  overscan?: number
  className?: string
  onVisibleItemsChange?: (startIndex: number, endIndex: number) => void
}

export const VirtualizedBlockList = forwardRef(function VirtualizedBlockList<T>(
  { items, renderItem, estimateSize = 50, overscan = 5, className, onVisibleItemsChange }: VirtualizedBlockListProps<T>,
  ref: React.ForwardedRef<{ scrollToIndex: (index: number) => void }>,
) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [parentHeight, setParentHeight] = useState(0)

  // Update parent height on resize
  useEffect(() => {
    if (!parentRef.current) return

    const updateParentHeight = () => {
      if (parentRef.current) {
        const height = window.innerHeight - parentRef.current.getBoundingClientRect().top - 100 // Leave some space at bottom
        setParentHeight(Math.max(400, height)) // Minimum height of 400px
      }
    }

    updateParentHeight()
    window.addEventListener("resize", updateParentHeight)
    return () => window.removeEventListener("resize", updateParentHeight)
  }, [])

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  // Expose scrollToIndex method to parent component
  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number) => {
        if (index >= 0 && index < items.length && virtualizer.range) {
          try {
            virtualizer.scrollToIndex(index, { align: "center" })
          } catch (error) {
            console.error("Error scrolling to index:", error)
            // Try an alternative approach if the main method fails
            if (parentRef.current) {
              const estimatedPosition = index * estimateSize
              parentRef.current.scrollTop = estimatedPosition
            }
          }
        }
      },
    }),
    [virtualizer, items.length, estimateSize],
  )

  // Notify parent component about visible items
  useEffect(() => {
    if (onVisibleItemsChange && virtualizer.range) {
      // Check if range exists before accessing its properties
      onVisibleItemsChange(virtualizer.range.startIndex, virtualizer.range.endIndex)
    }
  }, [virtualizer.range, onVisibleItemsChange])

  return (
    <div
      ref={parentRef}
      className={cn("overflow-auto", className)}
      style={{
        height: parentHeight,
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index] && renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  )
})
