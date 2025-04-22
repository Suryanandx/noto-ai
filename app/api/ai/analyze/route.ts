import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

// Update the POST function to better handle environment variables
export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required and must be a string" }, { status: 400 })
    }

    // Get API key from server environment variables - server-side variables should NOT have NEXT_PUBLIC_prefix
    const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY

    // Fallback to client-side variables if server-side ones are not available
    const fallbackKey = process.env.NEXT_PUBLIC_XAI_API_KEY || process.env.NEXT_PUBLIC_GROK_API_KEY

    // Use the server-side key first, then fallback to client-side key
    const finalApiKey = apiKey || fallbackKey

    if (!finalApiKey) {
      console.error("API key not found in server environment")
      return NextResponse.json(
        {
          error: "AI service not configured. Please add XAI_API_KEY or GROK_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    // Create the AI model with the API key
    const model = xai("grok-2", { apiKey: finalApiKey })

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

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
      maxTokens: 1000,
    })

    // Parse the response
    try {
      // Check if the response is wrapped in a code block and extract the JSON
      let jsonText = text
      if (text.includes("```json")) {
        const match = text.match(/```json\s*([\s\S]*?)\s*```/)
        if (match && match[1]) {
          jsonText = match[1].trim()
        }
      } else if (text.includes("```")) {
        const match = text.match(/```\s*([\s\S]*?)\s*```/)
        if (match && match[1]) {
          jsonText = match[1].trim()
        }
      }

      const result = JSON.parse(jsonText)
      return NextResponse.json(result)
    } catch (e) {
      console.error("Error parsing AI response:", e)
      console.log("Raw response:", text)
      return NextResponse.json(
        {
          summary: "Failed to generate summary",
          suggestedTags: [],
          sentiment: "neutral",
          tasks: [],
          category: "Misc",
          mood: {
            emoji: "😐",
            mood: "Neutral",
          },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in AI analysis:", error)
    return NextResponse.json({ error: "Failed to analyze note" }, { status: 500 })
  }
}
