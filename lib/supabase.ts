import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Get environment variables with fallbacks
const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required")
  }
  return url
}

const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
  }
  return key
}

// Create a single supabase client for the browser
let browserClient: ReturnType<typeof createClient<Database>> | null = null

export const getBrowserClient = () => {
  if (browserClient) return browserClient

  try {
    const supabaseUrl = getSupabaseUrl()
    const supabaseAnonKey = getSupabaseAnonKey()

    browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
    return browserClient
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}

// Create a server client (for server components)
export const getServerClient = () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is required")
    }

    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is required")
    }

    return createClient<Database>(supabaseUrl, supabaseServiceKey)
  } catch (error) {
    console.error("Error creating Supabase server client:", error)
    throw error
  }
}
