import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for NOTO AI - Smart Notes Powered by AI",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to NOTO AI ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of
            the NOTO AI application, website, and services (collectively, the "Service").
          </p>

          <h2>2. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms,
            you may not access or use the Service.
          </p>

          <h2>3. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. If we make changes, we will provide notice of such changes, such as
            by sending an email notification, providing notice through the Service, or updating the "Last Updated" date
            at the beginning of these Terms. Your continued use of the Service following notification of changes will
            constitute your acceptance of such changes.
          </p>

          <h2>4. Privacy Policy</h2>
          <p>
            Please refer to our Privacy Policy for information about how we collect, use, and disclose information about
            you.
          </p>

          <h2>5. User Accounts</h2>
          <p>
            To use certain features of the Service, you may be required to create an account and provide certain
            information about yourself. You are responsible for maintaining the confidentiality of your account
            credentials and for all activities that occur under your account.
          </p>

          <h2>6. Content and Licenses</h2>
          <p>
            Our Service allows you to create, store, and share content. You retain all rights to your content, but you
            grant us a license to use, copy, modify, and display your content in connection with providing the Service
            to you.
          </p>

          <h2>7. Prohibited Conduct</h2>
          <p>
            You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or
            disclosing any part of the Service; (ii) using any automated system to access the Service; (iii) introducing
            any viruses, trojan horses, worms, logic bombs, or other harmful material; (iv) using the Service for any
            illegal or unauthorized purpose; or (v) engaging in any other conduct that restricts or inhibits anyone's
            use or enjoyment of the Service.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for
            any reason whatsoever, including without limitation if you breach these Terms.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY
            KIND, WHETHER EXPRESS OR IMPLIED.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
          </p>

          <h2>11. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at support@suryanand.com.</p>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <a href="https://suryanand.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Powered by suryanand.com
          </a>
        </div>
      </div>
    </div>
  )
}
