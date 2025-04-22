"use client"

import { useState } from "react"

interface AIAnalysisResult {
  summary?: string
  suggestedTags?: string[]
  sentiment?: string
  tasks?: string[]
  category?: string
  mood?: {
    emoji: string
    mood: string
  }
}

export function useAIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeNote = async (content: string): Promise<AIAnalysisResult> => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze note")
      }

      const result = await response.json()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      console.error("Error analyzing note:", err)
      return {
        summary: "Failed to generate summary",
        suggestedTags: [],
        sentiment: "neutral",
        tasks: [],
        category: "Misc",
        mood: {
          emoji: "😐",
          mood: "Neutral",
        },
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return {
    analyzeNote,
    isAnalyzing,
    error,
  }
}
