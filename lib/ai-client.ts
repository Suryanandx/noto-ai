// Add a function to check if AI service is configured
export function isAIServiceConfigured() {
  // Check if any of the AI API keys are available
  return !!(process.env.NEXT_PUBLIC_XAI_API_KEY || process.env.NEXT_PUBLIC_GROK_API_KEY)
}

// Function to call the AI service API endpoint
export async function callAIService(operation: string, prompt: string, options = {}) {
  try {
    // Check if AI service is configured on the client side
    if (!isAIServiceConfigured()) {
      console.warn("AI service is not configured. Missing API keys.")
    }

    const response = await fetch("/api/ai/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation,
        prompt,
        options,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("AI service error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to AI service",
      text: null,
    }
  }
}

// For backward compatibility
export async function generateAIText(prompt: string, options = {}) {
  return callAIService("generateText", prompt, options)
}
