"use client"

import { AlertCircle, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface AIErrorFallbackProps {
  onRetry?: () => void
  message?: string
}

export function AIErrorFallback({ onRetry, message }: AIErrorFallbackProps) {
  return (
    <Alert className="bg-gray-50 border-gray-200">
      <AlertCircle className="h-4 w-4 text-gray-500" />
      <AlertTitle className="flex items-center">
        <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
        AI Features Unavailable
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-gray-600 mb-3">
          {message ||
            "The AI features are currently unavailable. This might be due to missing API keys or a temporary service issue."}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
