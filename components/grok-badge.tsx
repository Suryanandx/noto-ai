import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export function GrokBadge() {
  return (
    <Badge variant="outline" className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
      <Sparkles className="h-3 w-3 mr-1" />
      Powered by AI
    </Badge>
  )
}
