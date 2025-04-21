"use client"

import { useState } from "react"
import { useAIAnalysis } from "@/hooks/use-ai-analysis"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Tag, CheckSquare } from "lucide-react"

export function AIAnalysisDemo() {
  const [noteContent, setNoteContent] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const { analyzeNote, isAnalyzing, error } = useAIAnalysis()

  const handleAnalyze = async () => {
    if (!noteContent.trim()) return

    const result = await analyzeNote(noteContent)
    setAnalysisResult(result)
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
            AI Analysis Demo
          </CardTitle>
          <CardDescription>Enter some text and see how Grok analyzes it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your note content here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !noteContent.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isAnalyzing ? "Analyzing..." : "Analyze with Grok"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Card className="border-red-300">
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Summary:</h3>
              <p className="bg-gray-50 p-3 rounded-md">{analysisResult.summary}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Category:</h3>
              <p className="capitalize">{analysisResult.category}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Sentiment:</h3>
              <p className="capitalize">{analysisResult.sentiment}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Mood:</h3>
              <div className="flex items-center">
                <span className="text-xl mr-2">{analysisResult.mood?.emoji}</span>
                <span className="capitalize">{analysisResult.mood?.mood}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Suggested Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.suggestedTags?.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {analysisResult.tasks && analysisResult.tasks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Tasks:</h3>
                <ul className="space-y-1">
                  {analysisResult.tasks.map((task: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckSquare className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
