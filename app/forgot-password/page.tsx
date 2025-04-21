"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NotoLogo } from "@/components/noto-logo"
import Link from "next/link"
import { getBrowserClient } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailValid, setEmailValid] = useState<boolean | null>(null)

  const supabase = getBrowserClient()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setEmailValid(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Failed to send password reset email")
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
            Forgot Your Password?
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl mb-8 max-w-md">
            Don't worry, it happens to the best of us. Let's get you back into your account.
          </motion.p>

          <motion.div variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Simple Recovery</h3>
                <p className="text-white/80">We'll send you a secure link to reset your password</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Quick Process</h3>
                <p className="text-white/80">You'll be back to your notes in no time</p>
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
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
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
                    Password reset link has been sent to your email address. Please check your inbox.
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-gray-500 mt-2">If you don't see the email, please check your spam folder.</p>

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
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailValid(validateEmail(e.target.value))
                      }}
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
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
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
