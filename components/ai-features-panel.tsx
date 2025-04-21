"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Sparkles,
  Tag,
  CheckSquare,
  Languages,
  Lightbulb,
  Copy,
  Twitter,
  Briefcase,
  Home,
  Book,
  ListTodo,
  Calendar,
} from "lucide-react"
import { translateNote, generateInsight, threadifyNote } from "@/lib/ai"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "./markdown-renderer"

interface AIFeaturesPanelProps {
  noteContent: string
  aiSuggestions: {
    summary?: string
    suggestedTags?: string[]
    sentiment?: string
    tasks?: string[]
    category?: string
    mood?: {
      emoji: string
      mood: string
    }
  }
  isAnalyzing: boolean
  onAnalyzeWithAI: () => Promise<void>
  onApplySuggestedTag: (tag: string) => void
  onApplyTask?: (task: string) => void
  autoTitleSuggestion?: string
  onApplyTitle?: (title: string) => void
}

export function AIFeaturesPanel({
  noteContent,
  aiSuggestions,
  isAnalyzing,
  onAnalyzeWithAI,
  onApplySuggestedTag,
  onApplyTask,
  autoTitleSuggestion,
  onApplyTitle,
}: AIFeaturesPanelProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [targetLanguage, setTargetLanguage] = useState("Spanish")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [insight, setInsight] = useState("")
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)
  const [threadParts, setThreadParts] = useState<string[]>([])
  const [isThreadifying, setIsThreadifying] = useState(false)
  const [categoryIcon, setCategoryIcon] = useState<React.ReactNode>(<Briefcase className="h-4 w-4" />)

  const { toast } = useToast()

  // Set category icon based on category
  useEffect(() => {
    if (aiSuggestions.category) {
      switch (aiSuggestions.category.toLowerCase()) {
        case "work":
          setCategoryIcon(<Briefcase className="h-4 w-4" />)
          break
        case "personal":
          setCategoryIcon(<Home className="h-4 w-4" />)
          break
        case "journal":
          setCategoryIcon(<Book className="h-4 w-4" />)
          break
        case "task":
          setCategoryIcon(<ListTodo className="h-4 w-4" />)
          break
        case "idea":
          setCategoryIcon(<Lightbulb className="h-4 w-4" />)
          break
        default:
          setCategoryIcon(<Calendar className="h-4 w-4" />)
      }
    }
  }, [aiSuggestions.category])

  const handleTranslate = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      setIsTranslating(true)
      const translated = await translateNote(noteContent, targetLanguage)
      setTranslatedText(translated || "Translation failed")
    } catch (error) {
      console.error("Error translating note:", error)
      toast({
        title: "Error",
        description: "Failed to translate note",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleGenerateInsight = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGeneratingInsight(true)
      const generatedInsight = await generateInsight(noteContent)
      setInsight(generatedInsight || "Failed to generate insight")
    } catch (error) {
      console.error("Error generating insight:", error)
      toast({
        title: "Error",
        description: "Failed to generate insight",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingInsight(false)
    }
  }

  const handleThreadify = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      setIsThreadifying(true)
      const thread = await threadifyNote(noteContent)
      setThreadParts(thread || [])
    } catch (error) {
      console.error("Error threadifying note:", error)
      toast({
        title: "Error",
        description: "Failed to threadify note",
        variant: "destructive",
      })
    } finally {
      setIsThreadifying(false)
    }
  }

  const copyThreadToClipboard = () => {
    const threadText = threadParts.map((part, index) => `${index + 1}/${threadParts.length} ${part}`).join("\n\n")
    navigator.clipboard.writeText(threadText)
    toast({
      title: "Success",
      description: "Thread copied to clipboard",
    })
  }

  return (
    <Card className={cn("transition-opacity", Object.keys(aiSuggestions).length === 0 ? "opacity-50" : "opacity-100")}>
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="text-lg font-medium flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-white" />
          AI-Powered Features
        </CardTitle>
        <p className="text-sm text-white/90 mt-1">Enhance your notes with AI analysis and tools</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-md">
          <h3 className="text-sm font-medium text-purple-800 mb-1">How to use AI features:</h3>
          <ol className="text-xs text-purple-700 space-y-1 list-decimal pl-4">
            <li>Write your note in the editor</li>
            <li>Click "Analyze with AI" to get insights</li>
            <li>Apply suggestions with one click</li>
            <li>Try different tools in the tabs below</li>
          </ol>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Analysis</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Button
              onClick={onAnalyzeWithAI}
              disabled={isAnalyzing || !noteContent.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </Button>

            {autoTitleSuggestion && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Title Suggestion:</h4>
                  {onApplyTitle && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApplyTitle(autoTitleSuggestion)}
                      className="h-6 text-xs"
                    >
                      Apply
                    </Button>
                  )}
                </div>
                <p className="text-sm font-medium">{autoTitleSuggestion}</p>
              </div>
            )}

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Summary:</h4>
                {aiSuggestions.summary ? (
                  <div className="text-sm bg-gray-50 p-3 rounded-md">
                    <MarkdownRenderer content={aiSuggestions.summary} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Click "Analyze with AI" to generate a summary.</p>
                )}
              </div>

              {aiSuggestions.category && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Category:</h4>
                  <div className="flex items-center">
                    {categoryIcon}
                    <span className="ml-2 capitalize">{aiSuggestions.category}</span>
                  </div>
                </div>
              )}

              {aiSuggestions.mood && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Mood:</h4>
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{aiSuggestions.mood.emoji}</span>
                    <span className="capitalize">{aiSuggestions.mood.mood}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Suggested Tags:</h4>
                {aiSuggestions.suggestedTags && aiSuggestions.suggestedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.suggestedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => onApplySuggestedTag(tag)}
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Click "Analyze with AI" to suggest tags.</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tasks:</h4>
                {aiSuggestions.tasks && aiSuggestions.tasks.length > 0 ? (
                  <ul className="space-y-1">
                    {aiSuggestions.tasks.map((task, index) => (
                      <li key={index} className="flex items-start">
                        <CheckSquare className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{task}</span>
                        {onApplyTask && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onApplyTask(task)}
                            className="ml-auto h-6 text-xs"
                          >
                            Add
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Click "Analyze with AI" to extract tasks.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <Tabs defaultValue="translate">
              <TabsList className="w-full">
                <TabsTrigger value="translate" className="flex-1">
                  <Languages className="h-4 w-4 mr-2" />
                  Translate
                </TabsTrigger>
                <TabsTrigger value="insight" className="flex-1">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Insight
                </TabsTrigger>
              </TabsList>

              <TabsContent value="translate" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Italian">Italian</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTranslate}
                      disabled={isTranslating || !noteContent.trim()}
                    >
                      <Languages className="mr-2 h-4 w-4" />
                      {isTranslating ? "Translating..." : "Translate"}
                    </Button>
                  </div>
                </div>

                {translatedText && (
                  <div className="space-y-2 mt-2">
                    <h4 className="text-sm font-medium">Translation:</h4>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <MarkdownRenderer content={translatedText} />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="insight" className="space-y-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateInsight}
                  disabled={isGeneratingInsight || !noteContent.trim()}
                  className="w-full"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {isGeneratingInsight ? "Generating..." : "What's Missing?"}
                </Button>

                {insight && (
                  <div className="space-y-2 mt-2">
                    <h4 className="text-sm font-medium">Insight:</h4>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <MarkdownRenderer content={insight} />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleThreadify}
              disabled={isThreadifying || !noteContent.trim()}
              className="w-full"
            >
              <Twitter className="mr-2 h-4 w-4" />
              {isThreadifying ? "Creating Thread..." : "Threadify for Twitter/X"}
            </Button>

            {threadParts.length > 0 && (
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Thread ({threadParts.length} parts):</h4>
                  <Button variant="outline" size="sm" onClick={copyThreadToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {threadParts.map((part, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-500 font-medium">
                          {index + 1}/{threadParts.length}
                        </span>
                        <span className="text-xs text-gray-500">{part.length}/280</span>
                      </div>
                      <p className="text-sm mt-1">{part}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
