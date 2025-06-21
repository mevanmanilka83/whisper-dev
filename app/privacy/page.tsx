import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Whisper",
  description: "Privacy policy for Whisper - a secure platform for sharing thoughts and engaging in discussions.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicy() {
  return (
    <article className="max-w-7xl mx-auto py-8 px-4 bg-background">
      <header>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <Separator className="mb-6" />
        <p className="mb-6 text-base">
          At Whisper, we prioritize your privacy and security. This Privacy Policy explains how we handle your information when you use our platform for sharing thoughts and engaging in discussions.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Information Collection & Processing</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Account Information</h3>
              <p className="text-base">When you create an account, we collect your email address, name, and profile image (if provided). This information is used to manage your account and personalize your experience on Whisper.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Content You Share</h3>
              <p className="text-base">We store the content you create, including drops, comments, and zone memberships. This content is associated with your account and may be visible to other users based on your privacy settings.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Usage Analytics</h3>
              <p className="text-base">We collect anonymous usage statistics such as feature preferences, interaction patterns, and performance metrics to improve Whisper. We do not collect or analyze your personal content without consent.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Platform Functionality</h3>
              <p className="text-base">Your account information and content are used to provide core platform features like creating drops, joining zones, and engaging with other users&apos; content.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Feature Enhancement</h3>
              <p className="text-base">Anonymous usage data helps us improve Whisper&apos;s features, user experience, and overall performance. No personal content is used for this purpose.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Technical Support</h3>
              <p className="text-base">If you contact us for help, we may use the information you provide to assist you, but we never access your private content without your explicit permission.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Content Sharing & Privacy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Public Content</h3>
              <p className="text-base">Drops you create in public zones are visible to all users. You control what content you share and can delete your drops at any time.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Zone Privacy</h3>
              <p className="text-base">Zone owners control the privacy settings of their zones. Some zones may be invitation-only or require approval to join. Respect the privacy settings of zones you join.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Third Parties</h3>
              <p className="text-base">We do not share your personal content with third parties without your explicit consent. Any analytics services we use cannot access your private content.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Rights & Control</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Content Control</h3>
              <p className="text-base">You have full control over your content. You can edit, delete, or remove your drops at any time. Deleted content is permanently removed from our servers.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Account Management</h3>
              <p className="text-base">You can update your profile information, change your privacy settings, and manage your zone memberships through your account settings.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Data Export</h3>
              <p className="text-base">You can request a copy of your data or delete your account entirely. Account deletion will permanently remove all your content and personal information.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <p className="mb-6 text-base">
            We implement industry-standard security measures to protect your account information and content. This includes encryption, secure authentication, and regular security audits. However, no platform is completely secure, so please use strong passwords and be mindful of what you share.
          </p>

          <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="mb-4 text-base">
            We may update this Privacy Policy from time to time. Significant changes will be posted on this page and may be communicated through the platform. Continued use of Whisper means you accept any updates.
          </p>
        </section>
      </div>

      <footer className="mt-8 text-sm text-center">
        <p>Last updated June 2025</p>
      </footer>
    </article>
  )
}
