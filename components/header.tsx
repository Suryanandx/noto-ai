"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoonIcon, SunIcon, PlusCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { NotoLogo } from "./noto-logo"
import { Sidebar } from "./sidebar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
  const { user, signOut } = useAuth()
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : "UN"

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-2 sm:px-4 py-2">
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center">
          <Sidebar />
          <NotoLogo size="sm" className="ml-2 md:hidden" />
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/new-note")}
            className="hidden sm:flex"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            New Note
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/new-note")}
            className="sm:hidden h-8 w-8"
            aria-label="New Note"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="h-8 w-8"
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={user?.email || "User"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
