"use client"

import { useState, useEffect } from "react"
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import our environment configuration
import { AI_CONFIG } from "@/lib/env"

// Update the AIStatusIndicator component to check for environment variables
export function AIStatusIndicator() {
  const [status, setStatus] = useState<"loading" | "operational" | "degraded" | "error" | "unconfigured">("loading")
  const [message, setMessage] = useState("Checking AI service status...")
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    try {
      // First check if we have client-side configuration
      if (!AI_CONFIG.isClientConfigured()) {
        setStatus("unconfigured")
        setMessage("AI service is not configured. Missing API keys.")
        return
      }

      setIsChecking(true)
      const response = await fetch("/api/ai/status")
      const data = await response.json()

      setStatus(data.status === "operational" ? "operational" : data.status === "degraded" ? "degraded" : "error")
      setMessage(data.message)
    } catch (error) {
      setStatus("error")
      setMessage("Could not connect to AI service")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2 px-2" onClick={checkStatus} disabled={isChecking}>
            {status === "loading" || isChecking ? (
              <Sparkles className="h-4 w-4 animate-pulse text-yellow-500" />
            ) : status === "operational" ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : status === "unconfigured" ? (
              <AlertCircle className="h-4 w-4 text-gray-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-xs">
              {status === "loading" || isChecking
                ? "Checking AI..."
                : status === "operational"
                  ? "AI Ready"
                  : status === "unconfigured"
                    ? "AI Not Configured"
                    : "AI Issue"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
          {status === "unconfigured" && (
            <p className="text-xs mt-1">
              Add XAI_API_KEY or GROK_API_KEY to your environment variables to enable AI features.
            </p>
          )}
          {status !== "operational" && status !== "unconfigured" && (
            <p className="text-xs mt-1">Some AI features may be unavailable. Click to check again.</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
