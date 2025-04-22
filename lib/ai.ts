import { callAIService } from "./ai-client"

// Auto Title Generator
export async function generateTitle(content: string) {
  try {
    const prompt = `Summarize the following note in a maximum of 6 words, as a good note title:
    
    ${content}
    
    Return only the title text without any additional comments.`

    const result = await callAIService("generateTitle", prompt, { temperature: 0.3 })

    if (!result.success) {
      throw new Error(result.error || "Failed to generate title")
    }

    return result.text.trim()
  } catch (error) {
    console.error("Error generating title:", error)
    return null
  }
}

// Smart Summary
export async function generateSummary(content: string) {
  try {
    const prompt = `Summarize this note in 1-2 lines as if you're explaining to someone who hasn't read it:
    
    ${content}
    
    Return only the summary without any additional comments.`

    const result = await callAIService("generateSummary", prompt, { temperature: 0.3 })

    if (!result.success) {
      throw new Error(result.error || "Failed to generate summary")
    }

    return result.text.trim()
  } catch (error) {
    console.error("Error generating summary:", error)
    return null
  }
}

// Auto Tag Suggestions
export async function suggestTags(content: string) {
  try {
    const prompt = `Based on the content, suggest up to 5 simple, relevant tags that describe this note:
    
    ${content}
    
    Return the tags as a JSON array of strings without any additional text.`

    const result = await callAIService("suggestTags", prompt, { temperature: 0.3 })

    if (!result.success) {
      throw new Error(result.error || "Failed to suggest tags")
    }

    try {
      // Try to parse the response as JSON
      return JSON.parse(result.text)
    } catch {
      // If parsing fails, try to extract tags from text
      const tagMatches = result.text.match(/#\w+/g) || []
      return tagMatches.map((tag) => tag.replace("#", ""))
    }
  } catch (error) {
    console.error("Error suggesting tags:", error)
    return []
  }
}

// Note Categorization
export async function categorizeNote(content: string) {
  try {
    const prompt = `Classify this note as one of the following categories: Work, Personal, Journal, Task, Idea, Misc:
    
    ${content}
    
    Return only the category name without any additional text.`

    const result = await callAIService("categorizeNote", prompt, { temperature: 0.2 })

    if (!result.success) {
      throw new Error(result.error || "Failed to categorize note")
    }

    return result.text.trim()
  } catch (error) {
    console.error("Error categorizing note:", error)
    return "Misc"
  }
}

// Sentiment + Emoji Mood Indicator
export async function analyzeSentiment(content: string) {
  try {
    const prompt = `What is the tone of this note? Return a JSON object with an emoji and one-word mood (e.g., {"emoji": "😊", "mood": "Happy"}):
    
    ${content}`

    const result = await callAIService("analyzeSentiment", prompt, { temperature: 0.2 })

    if (!result.success) {
      throw new Error(result.error || "Failed to analyze sentiment")
    }

    try {
      return JSON.parse(result.text)
    } catch {
      // Fallback if JSON parsing fails
      const emojiMatch = result.text.match(/[\p{Emoji}]/u)?.[0] || "😐"
      const moodMatch = result.text.match(/[a-zA-Z]+/)?.[0] || "Neutral"
      return { emoji: emojiMatch, mood: moodMatch }
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    return { emoji: "😐", mood: "Neutral" }
  }
}

// Extract Actionable Tasks
export async function extractTasks(content: string) {
  try {
    const prompt = `Extract a list of specific actionable tasks from this note. If none exist, return an empty array. Format as a JSON array of strings:
    
    ${content}`

    const result = await callAIService("extractTasks", prompt, { temperature: 0.2 })

    if (!result.success) {
      throw new Error(result.error || "Failed to extract tasks")
    }

    try {
      return JSON.parse(result.text)
    } catch {
      // Fallback if JSON parsing fails
      return []
    }
  } catch (error) {
    console.error("Error extracting tasks:", error)
    return []
  }
}

// Translate Note
export async function translateNote(content: string, targetLanguage: string) {
  try {
    const prompt = `Translate this note into ${targetLanguage}:

      ${content}

      Provide only the translated text without any additional comments.`

    const result = await callAIService("translateNote", prompt, { temperature: 0.3 })

    if (!result.success) {
      throw new Error(result.error || "Failed to translate note")
    }

    return result.text
  } catch (error) {
    console.error("Error translating note:", error)
    return null
  }
}

// What's Missing Insight Generator
export async function generateInsight(content: string) {
  try {
    const prompt = `Based on this note, what's one helpful insight or idea the writer might have missed?
    
    ${content}
    
    Provide a concise, thoughtful insight in 1-2 sentences.`

    const result = await callAIService("generateInsight", prompt, { temperature: 0.7 })

    if (!result.success) {
      throw new Error(result.error || "Failed to generate insight")
    }

    return result.text.trim()
  } catch (error) {
    console.error("Error generating insight:", error)
    return null
  }
}

// Smart Recap Mode (Weekly Summary)
export async function generateWeeklySummary(notes: { title: string; content: string; date: string }[]) {
  try {
    const notesText = notes
      .map((note) => `Title: ${note.title}\nDate: ${note.date}\nContent: ${note.content}`)
      .join("\n\n---\n\n")

    const prompt = `Summarize the following list of notes into a weekly digest. Group by theme and tone, highlight interesting trends:
    
    ${notesText}
    
    Format your response with clear sections for themes, trends, and a brief overall summary.`

    const result = await callAIService("generateWeeklySummary", prompt, { temperature: 0.5 })

    if (!result.success) {
      throw new Error(result.error || "Failed to generate weekly summary")
    }

    return result.text
  } catch (error) {
    console.error("Error generating weekly summary:", error)
    return null
  }
}

// Threadify Note for Social Sharing
export async function threadifyNote(content: string) {
  try {
    const prompt = `Break this long note into a Twitter/X thread. Number each part, keep each section under 280 characters:
    
    ${content}
    
    Format as a JSON array of strings, where each string is one tweet in the thread.`

    const result = await callAIService("threadifyNote", prompt, { temperature: 0.4 })

    if (!result.success) {
      throw new Error(result.error || "Failed to threadify note")
    }

    try {
      return JSON.parse(result.text)
    } catch {
      // Fallback if JSON parsing fails
      return [content.substring(0, 280)]
    }
  } catch (error) {
    console.error("Error threadifying note:", error)
    return [content.substring(0, 280)]
  }
}

// Comprehensive note analysis (combines multiple features)
export async function analyzeNote(content: string) {
  try {
    const prompt = `
      Analyze the following note and provide:
      1. A brief summary (max 2 sentences)
      2. 3-5 relevant tags
      3. The overall sentiment (positive, neutral, or negative)
      4. Extract any tasks or action items (if present)
      5. The note category (Work, Personal, Journal, Task, Idea, Misc)
      6. A mood emoji that represents the tone

      Note content:
      ${content}

      IMPORTANT: Return ONLY a valid JSON object with the following structure, without any markdown formatting, code blocks, or additional text:
      {
        "summary": "Brief summary here",
        "suggestedTags": ["tag1", "tag2", "tag3"],
        "sentiment": "positive/neutral/negative",
        "tasks": ["task1", "task2"],
        "category": "category name",
        "mood": {
          "emoji": "😊",
          "mood": "Happy"
        }
      }
    `

    const result = await callAIService("analyzeNote", prompt, { temperature: 0.3 })

    if (!result.success) {
      throw new Error(result.error || "Failed to analyze note")
    }

    try {
      // Check if the response is wrapped in a code block and extract the JSON
      let jsonText = result.text
      if (result.text.includes("```json")) {
        const match = result.text.match(/```json\s*([\s\S]*?)\s*```/)
        if (match && match[1]) {
          jsonText = match[1].trim()
        }
      } else if (result.text.includes("```")) {
        const match = result.text.match(/```\s*([\s\S]*?)\s*```/)
        if (match && match[1]) {
          jsonText = match[1].trim()
        }
      }

      return JSON.parse(jsonText)
    } catch (e) {
      console.error("Error parsing AI response:", e)
      console.log("Raw response:", result.text)
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
    }
  } catch (error) {
    console.error("Error analyzing note:", error)
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
  }
}
