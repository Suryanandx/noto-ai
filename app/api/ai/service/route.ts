import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

// This runs on the server where environment variables are secure
export async function POST(req: NextRequest) {
  try {
    const { operation, prompt, options = {} } = await req.json()

    if (!operation || !prompt) {
      return NextResponse.json({ error: "Operation and prompt are required" }, { status: 400 })
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
          success: false,
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
      ...options,
    })

    return NextResponse.json({ success: true, text })
  } catch (error) {
    console.error("AI service error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown AI service error",
      },
      { status: 500 },
    )
  }
}
