import { NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
// Import the AI_CONFIG from our new env.ts file
import { AI_CONFIG } from "@/lib/env"

// Update the GET function to use our centralized environment configuration
export async function GET() {
  try {
    // Log which environment variables are available (without revealing their values)
    const envVars = {
      XAI_API_KEY: !!AI_CONFIG.xaiApiKey,
      NEXT_PUBLIC_XAI_API_KEY: !!AI_CONFIG.publicXaiApiKey,
      GROK_API_KEY: !!AI_CONFIG.grokApiKey,
      NEXT_PUBLIC_GROK_API_KEY: !!AI_CONFIG.publicGrokApiKey,
    }

    // Try to get the API key using our helper function
    const apiKey = AI_CONFIG.getApiKey()

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "API key not found",
          availableEnvVars: envVars,
        },
        { status: 500 },
      )
    }

    // Test a simple AI call
    const { text } = await generateText({
      model: xai("grok-2", { apiKey }),
      prompt: "Say hello and confirm you are working correctly.",
      temperature: 0.3,
    })

    return NextResponse.json({
      status: "success",
      message: "AI service is working correctly",
      response: text,
      availableEnvVars: envVars,
    })
  } catch (error) {
    console.error("Error testing AI service:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
