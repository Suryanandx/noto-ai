import { NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function GET() {
  try {
    // Check if API key exists - server-side variables should NOT have NEXT_PUBLIC_ prefix
    const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY

    // Fallback to client-side variables if server-side ones are not available
    const fallbackKey = process.env.NEXT_PUBLIC_XAI_API_KEY || process.env.NEXT_PUBLIC_GROK_API_KEY

    // Use the server-side key first, then fallback to client-side key
    const finalApiKey = apiKey || fallbackKey

    if (!finalApiKey) {
      return NextResponse.json({
        status: "error",
        message: "API key not configured",
        configured: false,
      })
    }

    // Test a simple AI call
    const model = xai("grok-2", { apiKey: finalApiKey })

    const { text } = await generateText({
      model,
      prompt: "Respond with 'OK' if you can read this message.",
      temperature: 0.1,
      maxTokens: 10,
    })

    const isWorking = text.toLowerCase().includes("ok")

    return NextResponse.json({
      status: isWorking ? "operational" : "degraded",
      message: isWorking ? "AI service is operational" : "AI service responded but may be degraded",
      configured: true,
    })
  } catch (error) {
    console.error("Error checking AI service status:", error)

    // Determine if it's an API key issue
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isApiKeyIssue =
      errorMessage.toLowerCase().includes("api key") ||
      errorMessage.toLowerCase().includes("authentication") ||
      errorMessage.toLowerCase().includes("unauthorized")

    return NextResponse.json(
      {
        status: "error",
        message: isApiKeyIssue ? "API key error: " + errorMessage : "AI service error: " + errorMessage,
        configured: !isApiKeyIssue,
      },
      { status: 500 },
    )
  }
}
