import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for NOTO AI - Smart Notes Powered by AI",
}

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy describes how NOTO AI ("we," "our," or "us") collects, uses, and discloses information
            about you when you use our application, website, and services (collectively, the "Service").
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, update your profile,
            use the interactive features of our Service, request customer support, or otherwise communicate with us.
          </p>

          <h3>2.1 Personal Information</h3>
          <p>This includes your name, email address, and any other information you choose to provide.</p>

          <h3>2.2 Content</h3>
          <p>
            We collect and store the content you create, upload, or receive from others when using our Service,
            including your notes, tags, and other data.
          </p>

          <h3>2.3 Usage Information</h3>
          <p>
            We automatically collect certain information about your use of the Service, such as the type of browser you
            use, access times, pages viewed, and the page you visited before navigating to our Service.
          </p>

          <h2>3. How We Use Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our Service, including to:</p>
          <ul>
            <li>Create and maintain your account</li>
            <li>Process transactions</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Develop new products and services</li>
            <li>Personalize your experience</li>
          </ul>

          <h2>4. AI Processing</h2>
          <p>
            Our Service uses artificial intelligence to analyze your notes and provide features such as summaries, tag
            suggestions, and insights. This processing is performed securely and in accordance with this Privacy Policy.
          </p>

          <h2>5. Sharing of Information</h2>
          <p>We do not share your personal information except in the following circumstances:</p>
          <ul>
            <li>With your consent</li>
            <li>
              With vendors, consultants, and other service providers who need access to such information to carry out
              work on our behalf
            </li>
            <li>
              In response to a request for information if we believe disclosure is in accordance with any applicable
              law, regulation, or legal process
            </li>
            <li>
              If we believe your actions are inconsistent with our user agreements or policies, or to protect the
              rights, property, and safety of us or others
            </li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized
            access, disclosure, alteration, and destruction.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            You may access, correct, or delete your personal information by logging into your account settings. If you
            wish to delete your account, please contact us at support@suryanand.com.
          </p>

          <h2>8. Changes to this Privacy Policy</h2>
          <p>
            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the
            date at the top of the policy and, in some cases, we may provide you with additional notice.
          </p>

          <h2>9. Contact Information</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@suryanand.com.</p>
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
