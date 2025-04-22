"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NotoLogo } from "@/components/noto-logo"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LoginPage() {
  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [success, setSuccess] = useState<string | null>(null)

  // Add this to the top of the component, after the useState declarations
  const searchParams = useSearchParams()
  const verified = searchParams.get("verified") === "true"

  // Add this after the useState declarations
  useEffect(() => {
    if (verified) {
      setSuccess("Email verified successfully! You can now log in.")
      setActiveTab("login")
    }

    const reset = searchParams.get("reset") === "true"
    if (reset) {
      setSuccess("Password reset successfully! You can now log in with your new password.")
      setActiveTab("login")
    }
  }, [verified, searchParams])

  // Validation states
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null)
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)
  const [nameValid, setNameValid] = useState<boolean | null>(null)

  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [searchParams])

  // Email validation
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setEmailValid(emailRegex.test(email))
    }
  }, [email])

  // Password validation
  useEffect(() => {
    if (password) {
      setPasswordValid(password.length >= 6)
    }
  }, [password])

  // Confirm password validation
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    }
  }, [confirmPassword, password])

  // Name validation
  useEffect(() => {
    if (name) {
      setNameValid(name.length >= 2)
    }
  }, [name])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError("Invalid email or password")
      } else {
        router.push(redirectTo)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!emailValid || !passwordValid || !nameValid || !passwordsMatch) {
      setError("Please fix the form errors before submitting")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signUp(email, password, name)
      if (error) {
        setError("Error creating account: " + error.message)
      } else {
        setSuccess("Account created successfully! Please check your email for a confirmation link.")
        // Don't redirect immediately - wait for email confirmation
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] bg-cover opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-purple-500/80 to-blue-500/80"></div>

        <motion.div
          className="relative z-10 flex flex-col h-full justify-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <NotoLogo size="lg" className="mb-8" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-6">
            Welcome to NOTO AI
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl mb-8 max-w-md">
            The intelligent note-taking app that helps you organize your thoughts with the power of AI.
          </motion.p>

          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Powered Analysis</h3>
                <p className="text-white/80">Get insights, summaries, and suggestions automatically</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Smart Organization</h3>
                <p className="text-white/80">Auto-tagging and categorization for effortless management</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Seamless Experience</h3>
                <p className="text-white/80">Works across all your devices with real-time sync</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-auto text-sm text-white/70">
            Powered by suryanand.com
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute top-32 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-64 left-16 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Right side - Auth form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950"
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
      >
        <Card className="w-full max-w-md shadow-xl border-0 dark:bg-gray-900/50">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2 md:hidden">
              <NotoLogo size="lg" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === "login" ? "Sign in to your account" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Enter your credentials to access your notes"
                : "Join NOTO AI to start your AI-powered note-taking journey"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <motion.form
                  onSubmit={handleSignIn}
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${emailValid === false ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-purple-500"} pl-3 pr-3 py-2 h-11`}
                        required
                      />
                      {emailValid === true && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {emailValid === false && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500"
                      >
                        Please enter a valid email address
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus-visible:ring-purple-500 pl-3 pr-10 py-2 h-11"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </motion.div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {verified && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <Check className="h-4 w-4" />
                        <AlertDescription>Email verified successfully! You can now log in.</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <span className="flex items-center">
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>

              <TabsContent value="register">
                <motion.form
                  onSubmit={handleSignUp}
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${nameValid === false ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-purple-500"} pl-3 pr-3 py-2 h-11`}
                        required
                      />
                      {nameValid === true && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {nameValid === false && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500"
                      >
                        Name must be at least 2 characters
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="register-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${emailValid === false ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-purple-500"} pl-3 pr-3 py-2 h-11`}
                        required
                      />
                      {emailValid === true && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {emailValid === false && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500"
                      >
                        Please enter a valid email address
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="register-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${passwordValid === false ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-purple-500"} pl-3 pr-10 py-2 h-11`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                    {passwordValid === false && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500"
                      >
                        Password must be at least 6 characters
                      </motion.p>
                    )}

                    {/* Password strength indicator */}
                    {password && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1">
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${password.length < 6 ? "bg-red-500" : password.length < 10 ? "bg-yellow-500" : "bg-green-500"}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (password.length / 12) * 100)}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs mt-1 text-gray-500">
                          {password.length < 6
                            ? "Weak password"
                            : password.length < 10
                              ? "Moderate password"
                              : "Strong password"}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${passwordsMatch === false ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-purple-500"} pl-3 pr-3 py-2 h-11`}
                        required
                      />
                      {passwordsMatch === true && confirmPassword && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    {passwordsMatch === false && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500"
                      >
                        Passwords do not match
                      </motion.p>
                    )}
                  </motion.div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <Check className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <span className="flex items-center">
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-2 text-sm text-gray-500">
            <div>
              {activeTab === "login" ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
            <div className="text-xs mt-4 md:hidden">
              <a
                href="https://suryanand.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline"
              >
                Powered by suryanand.com
              </a>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
