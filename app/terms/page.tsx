import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Whisper",
  description: "Terms of service for Whisper - a secure platform for sharing thoughts and engaging in discussions.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function Terms() {
  return (
    <article className="max-w-7xl mx-auto py-8 px-4 bg-background">
      <header>
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <Separator className="mb-6" />
        
        <p className="mb-6 text-base">
          By using Whisper&apos;s platform for sharing thoughts and engaging in discussions, you agree to these terms. Please read them carefully.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Platform Usage</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Account Creation</h3>
              <p className="text-base">To use Whisper, you must create an account with valid information. You are responsible for maintaining the security of your account and for all activities that occur under your account.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Content Sharing</h3>
              <p className="text-base">Whisper allows you to create and share drops (posts) in various zones. You maintain control over your content and can edit or delete your drops at any time.</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Content & Rights</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Content Ownership</h3>
              <p className="text-base">You retain all rights to your original content. You are solely responsible for ensuring you have the necessary rights to share any content you post on Whisper.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Copyright Compliance</h3>
              <p className="text-base">Do not share copyrighted content unless you have explicit permission to do so. You are responsible for any copyright violations or legal issues arising from your use of Whisper.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Zones & Communities</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Zone Creation</h3>
              <p className="text-base">Users can create zones (communities) around specific topics or interests. Zone creators are responsible for managing their zones and ensuring compliance with these terms.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Zone Membership</h3>
              <p className="text-base">Joining zones may require approval from zone owners. You agree to respect the rules and guidelines established by each zone you join.</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">User Conduct</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Respectful Behavior</h3>
              <p className="text-base">Treat all users with respect and kindness. Harassment, hate speech, or any form of discrimination is strictly prohibited on Whisper.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Appropriate Content</h3>
              <p className="text-base">Do not share content that is illegal, harmful, or violates the rights of others. This includes but is not limited to spam, misinformation, and explicit content.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Content Storage</h3>
              <p className="text-base">Your drops, comments, and profile information are stored on our servers to provide the platform&apos;s functionality. We implement security measures to protect your data.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Analytics</h3>
              <p className="text-base">We collect anonymous usage statistics to improve our platform. Your personal content is not used for analytics without your explicit consent.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Limitations & Liability</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Service Availability</h3>
              <p className="text-base">Whisper is provided as is without any warranties. We do not guarantee uninterrupted service or perfect functionality at all times.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">User Responsibility</h3>
              <p className="text-base">You are responsible for your actions and content on Whisper. We are not liable for any damages, losses, or legal issues resulting from your use of the platform.</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Account Termination</h2>
          <div className="space-y-4">
            <div>
              <h3 className="block mb-2 text-base font-semibold">Violation Consequences</h3>
              <p className="text-base">Violation of these terms may result in content removal, account suspension, or permanent account termination at our discretion.</p>
            </div>
            <div>
              <h3 className="block mb-2 text-base font-semibold">Appeal Process</h3>
              <p className="text-base">If you believe your account was suspended in error, you may contact us to appeal the decision. We will review each case individually.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
          <p className="mb-4 text-base">
            We may update these terms at any time. Significant changes will be posted on this page and may be communicated through the platform. Continued use of Whisper means you accept any updates.
          </p>
        </section>
      </div>

      <footer className="mt-8 text-sm text-center">
        <p>Last updated June 2025</p>
      </footer>
    </article>
  );
}
