import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to login page with a success message
  return NextResponse.redirect(new URL("/login?verified=true", request.url))
}
