"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Settings,
  FileText,
  Tag,
  Home,
  Menu,
  X,
  PanelLeft,
} from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NotoLogo } from "./noto-logo"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { Note, Tag as TagType } from "@/types/supabase"

// Breakpoints in pixels - update with more precise values
const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    quickLinks: true,
    recentNotes: true,
    tags: false,
    trash: false,
  })
  const [collapsed, setCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [screenSize, setScreenSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("lg")
  const sidebarRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const supabase = getBrowserClient()

  // Determine screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let newSize: "xs" | "sm" | "md" | "lg" | "xl"

      if (width < BREAKPOINTS.xs) {
        newSize = "xs"
      } else if (width < BREAKPOINTS.sm) {
        newSize = "sm"
      } else if (width < BREAKPOINTS.md) {
        newSize = "md"
      } else if (width < BREAKPOINTS.lg) {
        newSize = "lg"
      } else {
        newSize = "xl"
      }

      setScreenSize(newSize)

      // For larger screens, only use the saved preference
      if (width >= BREAKPOINTS.md) {
        const savedState = localStorage.getItem("sidebar-collapsed")
        if (savedState !== null) {
          setCollapsed(savedState === "true")
        } else {
          // Default to expanded if no saved preference
          setCollapsed(false)
        }
      } else {
        // For smaller screens, always start collapsed
        setCollapsed(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener with debounce for better performance
    let resizeTimer: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 100)
    }

    window.addEventListener("resize", debouncedResize)

    // Clean up
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", debouncedResize)
    }
  }, [])

  // Save collapsed state to localStorage
  useEffect(() => {
    if (screenSize !== "xs" && screenSize !== "sm") {
      localStorage.setItem("sidebar-collapsed", String(collapsed))
    }
  }, [collapsed, screenSize])

  // Handle touch gestures for swipe to open/close
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      if (!touchStartX.current || !touchEndX.current) return

      const distance = touchEndX.current - touchStartX.current
      const isLeftToRight = distance > 30 // Reduced threshold for better sensitivity
      const isRightToLeft = distance < -30
      const isNearLeftEdge = touchStartX.current < 50 // Increased edge area

      if (isLeftToRight && isNearLeftEdge && (screenSize === "xs" || screenSize === "sm" || screenSize === "md")) {
        setIsOpen(true)
      } else if (isRightToLeft && isOpen) {
        setIsOpen(false)
      }

      // Reset values
      touchStartX.current = null
      touchEndX.current = null
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [screenSize, isOpen])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        // Fetch recent notes
        const { data: notesData } = await supabase
          .from("notes")
          .select(`
            *,
            tags:note_tags(
              tag_id,
              tags:tags(*)
            )
          `)
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(5)

        // Transform the data
        const transformedNotes: Note[] =
          notesData?.map((note) => {
            const transformedTags = note.tags?.map((tagRelation: any) => tagRelation.tags) || []
            return {
              ...note,
              tags: transformedTags,
            }
          }) || []

        setNotes(transformedNotes)

        // Fetch all tags
        const { data: tagsData } = await supabase.from("tags").select("*").order("name")

        setTags(tagsData || [])
      } catch (error) {
        console.error("Error fetching sidebar data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, supabase])

  // Listen for custom toggle event from header
  useEffect(() => {
    const handleToggleSidebar = () => {
      if (screenSize === "xs" || screenSize === "sm") {
        setIsOpen(!isOpen)
      } else {
        setCollapsed(!collapsed)
      }
    }

    document.addEventListener("toggle-sidebar", handleToggleSidebar)

    return () => {
      document.removeEventListener("toggle-sidebar", handleToggleSidebar)
    }
  }, [isOpen, collapsed, screenSize])

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section as keyof typeof expandedSections],
    })
  }

  const filteredNotes = searchQuery
    ? notes.filter(
        (note) =>
          note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : notes

  const handleNavigation = (path: string) => {
    router.push(path)
    if (screenSize === "xs" || screenSize === "sm") {
      setIsOpen(false)
    }
  }

  // Determine if we should use mobile view
  const isMobileView =
    screenSize === "xs" || screenSize === "sm" || (screenSize === "md" && window.innerWidth < BREAKPOINTS.md)

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <NotoLogo />
        </div>
        <div className="flex items-center">
          {isMobileView ? (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="ml-2">
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="ml-2 transition-transform duration-200"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft className={cn("h-5 w-5", collapsed && "rotate-180")} />
            </Button>
          )}
        </div>
      </div>

      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-gray-100 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Quick Links */}
        <Collapsible
          open={expandedSections.quickLinks}
          onOpenChange={() => toggleSection("quickLinks")}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center w-full text-sm p-2 rounded-md hover:bg-gray-100">
              {expandedSections.quickLinks ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              <span className={cn("font-medium", collapsed && !isMobileView && "sr-only")}>Quick Links</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className={cn("pl-6 space-y-1", collapsed && !isMobileView && "pl-0")}>
            <div
              className={cn(
                "flex items-center text-sm p-2 rounded-md hover:bg-gray-100 cursor-pointer",
                pathname === "/dashboard" && "bg-gray-100 font-medium",
              )}
              onClick={() => handleNavigation("/dashboard")}
            >
              <Home className="h-4 w-4 mr-2" />
              <span className={cn(collapsed && !isMobileView && "sr-only")}>Home</span>
            </div>
            <div
              className={cn(
                "flex items-center text-sm p-2 rounded-md hover:bg-gray-100 cursor-pointer",
                pathname === "/dashboard/search" && "bg-gray-100 font-medium",
              )}
              onClick={() => handleNavigation("/dashboard/search")}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className={cn(collapsed && !isMobileView && "sr-only")}>Search</span>
            </div>
            <div
              className={cn(
                "flex items-center text-sm p-2 rounded-md hover:bg-gray-100 cursor-pointer",
                pathname === "/dashboard/settings" && "bg-gray-100 font-medium",
              )}
              onClick={() => handleNavigation("/dashboard/settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className={cn(collapsed && !isMobileView && "sr-only")}>Settings</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Recent Notes */}
        <Collapsible
          open={expandedSections.recentNotes}
          onOpenChange={() => toggleSection("recentNotes")}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center w-full text-sm p-2 rounded-md hover:bg-gray-100">
              {expandedSections.recentNotes ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              <span className={cn("font-medium", collapsed && !isMobileView && "sr-only")}>Recent Notes</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className={cn("pl-6 space-y-1", collapsed && !isMobileView && "pl-0")}>
            {isLoading ? (
              <div className="text-sm text-gray-500 p-2">Loading...</div>
            ) : filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "flex items-center text-sm p-2 rounded-md hover:bg-gray-100 cursor-pointer",
                    pathname === `/dashboard/edit/${note.id}` && "bg-gray-100 font-medium",
                  )}
                  onClick={() => handleNavigation(`/dashboard/edit/${note.id}`)}
                >
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className={cn("truncate", collapsed && !isMobileView && "sr-only")}>
                    {note.title || "Untitled Note"}
                  </span>
                </div>
              ))
            ) : (
              <div className={cn("text-sm text-gray-500 p-2", collapsed && !isMobileView && "sr-only")}>
                No notes found
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Tags */}
        <Collapsible open={expandedSections.tags} onOpenChange={() => toggleSection("tags")} className="w-full">
          <CollapsibleTrigger asChild>
            <button className="flex items-center w-full text-sm p-2 rounded-md hover:bg-gray-100">
              {expandedSections.tags ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              <span className={cn("font-medium", collapsed && !isMobileView && "sr-only")}>Tags</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className={cn("pl-6 space-y-1", collapsed && !isMobileView && "pl-0")}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center text-sm p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleNavigation(`/dashboard/search?tag=${tag.name}`)}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  <span className={cn(collapsed && !isMobileView && "sr-only")}>{tag.name}</span>
                </div>
              ))
            ) : (
              <div className={cn("text-sm text-gray-500 p-2", collapsed && !isMobileView && "sr-only")}>
                No tags found
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="p-3 border-t border-gray-200">
        <Button
          onClick={() => handleNavigation("/dashboard/new-note")}
          className={cn(
            "w-full justify-start bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-200",
            collapsed && !isMobileView && "justify-center p-2",
          )}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className={cn(collapsed && !isMobileView && "sr-only")}>New Note</span>
        </Button>
      </div>
    </>
  )

  // Mobile view with sheet
  if (isMobileView) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-[280px] max-w-[85vw] border-r shadow-lg"
            onPointerDownOutside={() => setIsOpen(false)}
            onEscapeKeyDown={() => setIsOpen(false)}
          >
            <div className="h-full flex flex-col bg-white dark:bg-gray-900">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Responsive sidebar for desktop and medium screens
  return (
    <div
      ref={sidebarRef}
      className={cn(
        "h-screen flex-col border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out z-20",
        collapsed ? "w-16" : "w-64",
        screenSize === "md" ? "absolute left-0 top-0 shadow-lg" : "relative",
        // Always display the sidebar on larger screens
        "hidden md:flex",
      )}
    >
      <SidebarContent />
    </div>
  )
}
