"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Check, Eye, EyeOff, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NotoLogo } from "@/components/noto-logo"
import Link from "next/link"
import { getBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null)
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)

  const router = useRouter()
  const supabase = getBrowserClient()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!passwordValid || !passwordsMatch) {
      setError("Please fix the password errors before submitting")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?reset=true")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "Failed to reset password")
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
            Reset Your Password
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl mb-8 max-w-md">
            Create a new secure password for your NOTO AI account.
          </motion.p>

          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Strong Password</h3>
                <p className="text-white/80">Choose a password that's at least 6 characters long</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Account Security</h3>
                <p className="text-white/80">Your new password will be used for future logins</p>
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

      {/* Right side - Form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-xl border-0 dark:bg-gray-900/50">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2 md:hidden">
              <NotoLogo size="lg" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">Please enter a new password for your account</CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Your password has been reset successfully! Redirecting to login...
                  </AlertDescription>
                </Alert>

                <motion.div
                  className="w-full flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
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

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-2 text-sm text-gray-500">
            <Link href="/login" className="flex items-center text-purple-600 hover:text-purple-800 hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </Link>
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
