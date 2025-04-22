export const SUPABASE_CONFIG = {
  // Client-side variables (NEXT_PUBLIC_ prefix)
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",

  // Server-side variables (no NEXT_PUBLIC_ prefix)
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",

  // Helper functions
  isConfigured: () => {
    return !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey)
  },

  isServerConfigured: () => {
    return !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.serviceRoleKey)
  },
}

// AI service configuration
export const AI_CONFIG = {
  // Server-side variables (no NEXT_PUBLIC_ prefix)
  xaiApiKey: process.env.XAI_API_KEY || "",
  grokApiKey: process.env.GROK_API_KEY || "",

  // Client-side variables (NEXT_PUBLIC_ prefix)
  publicXaiApiKey: process.env.NEXT_PUBLIC_XAI_API_KEY || "",
  publicGrokApiKey: process.env.NEXT_PUBLIC_GROK_API_KEY || "",

  // Helper functions
  getApiKey: () => {
    // Server-side keys take precedence
    return AI_CONFIG.xaiApiKey || AI_CONFIG.grokApiKey || AI_CONFIG.publicXaiApiKey || AI_CONFIG.publicGrokApiKey || ""
  },

  isConfigured: () => {
    return !!AI_CONFIG.getApiKey()
  },

  // For client-side checks only
  isClientConfigured: () => {
    return !!(AI_CONFIG.publicXaiApiKey || AI_CONFIG.publicGrokApiKey)
  },
}

// Application configuration
export const APP_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  environment: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
}

// Export a function to log environment variable status (for debugging)
export function logEnvironmentStatus() {
  if (APP_CONFIG.isDevelopment) {
    console.log("Environment Variables Status:")
    console.log("- Supabase Client: " + (SUPABASE_CONFIG.isConfigured() ? "Configured ✅" : "Missing ❌"))
    console.log("- Supabase Server: " + (SUPABASE_CONFIG.isServerConfigured() ? "Configured ✅" : "Missing ❌"))
    console.log("- AI Service: " + (AI_CONFIG.isConfigured() ? "Configured ✅" : "Missing ❌"))
    console.log("- Base URL: " + APP_CONFIG.baseUrl)
    console.log("- Environment: " + APP_CONFIG.environment)
  }
}
