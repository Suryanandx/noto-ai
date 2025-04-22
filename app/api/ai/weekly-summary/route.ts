import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json()

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return NextResponse.json({ error: "Notes are required and must be an array" }, { status: 400 })
    }

    const notesText = notes
      .map((note: any) => `Title: ${note.title}\nDate: ${note.date}\nContent: ${note.content}`)
      .join("\n\n---\n\n")

    const prompt = `Summarize the following list of notes into a weekly digest. Group by theme and tone, highlight interesting trends:
    
    ${notesText}
    
    Format your response with clear sections for themes, trends, and a brief overall summary.`

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

    // Generate text with the provided prompt
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.5,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Error generating weekly summary:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate weekly summary",
      },
      { status: 500 },
    )
  }
}
