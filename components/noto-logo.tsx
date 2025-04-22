import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotoLogoProps {
  className?: string
  showBadge?: boolean
  size?: "sm" | "md" | "lg"
}

export function NotoLogo({ className, showBadge = true, size = "md" }: NotoLogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("font-bold tracking-tight", sizeClasses[size])}>
        <span>NOTO</span>
        <span className="text-purple-500">AI</span>
      </div>
      {showBadge && (
        <div className="ml-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs py-0.5 px-1.5 rounded-full flex items-center">
          <Sparkles className="h-3 w-3 mr-0.5" />
          <span className="font-medium">AI</span>
        </div>
      )}
    </div>
  )
}
