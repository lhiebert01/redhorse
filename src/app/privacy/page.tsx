import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Red Horse Oracle',
  description: 'Privacy Policy for Red Horse Oracle - Privacy by Design. No personal information collected or stored.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-gray-300 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-fire-gold mb-4">Privacy Policy</h1>
        <p className="text-xl text-green-400 font-bold mb-8">Privacy by Design - Zero PII Collection</p>

        <p className="text-gray-500 mb-8">Last Updated: January 14, 2026</p>

        {/* Privacy by Design Highlight */}
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-3">Our Privacy Commitment</h2>
          <p className="text-gray-300 mb-4">
            Red Horse Oracle is built with <strong className="text-green-400">Privacy by Design</strong> as a core principle.
            We believe the most secure way to protect your personal information is to <strong className="text-white">never collect it in the first place</strong>.
          </p>
          <p className="text-gray-300">
            Unlike other apps that collect and store your data, Red Horse Oracle is architected to deliver
            a fully personalized experience <strong className="text-white">without ever storing your personal information</strong>.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. What We DO NOT Collect or Store</h2>
            <p className="mb-3 text-gray-300">Red Horse Oracle does <strong className="text-green-400">NOT</strong> collect, store, or retain:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-white">Your Name</strong> - We never ask for your name
              </li>
              <li>
                <strong className="text-white">Your Date of Birth</strong> - Used only for instant zodiac calculation, then immediately discarded
              </li>
              <li>
                <strong className="text-white">Your Email Address</strong> - Handled only by Stripe for payment receipts, not stored by us
              </li>
              <li>
                <strong className="text-white">Payment Card Details</strong> - Processed entirely by Stripe, never touches our servers
              </li>
              <li>
                <strong className="text-white">Tracking Cookies</strong> - No third-party tracking or advertising cookies
              </li>
              <li>
                <strong className="text-white">Device Identifiers</strong> - No fingerprinting or device tracking
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How Your Birth Date is Used</h2>
            <p className="mb-4 text-gray-300">
              When you enter your birth date during checkout, here is exactly what happens:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-400">
              <li>
                Your birth date is used to calculate your Chinese zodiac sign (e.g., &quot;Wood Rabbit&quot;)
              </li>
              <li>
                The zodiac sign (not your birth date) is used to generate your personalized Oracle
              </li>
              <li>
                <strong className="text-green-400">Your birth date is immediately discarded</strong> - it is never stored in any database
              </li>
              <li>
                Only your zodiac sign (non-personally-identifiable) is retained with your Oracle artwork
              </li>
            </ol>
            <p className="mt-4 text-gray-300">
              <strong className="text-fire-gold">Result:</strong> Your Oracle is personalized to your zodiac sign,
              but there is no way to trace it back to your specific birth date or identity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. What Appears on Your Oracle</h2>
            <p className="mb-3 text-gray-300">Your Fire Horse Oracle artwork contains:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-green-400">NO name</strong> - We never ask for or display names
              </li>
              <li>
                <strong className="text-green-400">NO birth date</strong> - Your DOB is never printed or stored
              </li>
              <li>
                <strong className="text-green-400">NO identifying information</strong> - Nothing that links the Oracle to you personally
              </li>
            </ul>
            <p className="mt-4 text-gray-300">
              Your Oracle displays only your Chinese zodiac sign (e.g., &quot;Wood Rabbit&quot;), your prophecy,
              and the AI-generated artwork. This means your Oracle is <strong className="text-white">safe to share publicly</strong> without
              exposing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Payment Processing</h2>
            <p className="text-gray-300 mb-3">
              All payments are processed securely by <strong className="text-white">Stripe</strong>, an industry-leading payment processor.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Your payment card details are handled entirely by Stripe</li>
              <li>Card numbers never touch our servers</li>
              <li>Stripe sends payment receipts directly to your email</li>
              <li>We receive only confirmation that payment was successful</li>
            </ul>
            <p className="mt-3 text-gray-400">
              Stripe&apos;s privacy policy: <a href="https://stripe.com/privacy" className="text-fire-gold hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. What We Do Store</h2>
            <p className="mb-3 text-gray-300">For your Oracle to be accessible after generation, we store only:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-white">Your Zodiac Sign</strong> - Non-personally-identifiable (e.g., &quot;Metal Rat&quot;)
              </li>
              <li>
                <strong className="text-white">Your Oracle Mode</strong> - Wealth, Power, Love, or Shield
              </li>
              <li>
                <strong className="text-white">Generated Prophecy Text</strong> - The AI-generated reading
              </li>
              <li>
                <strong className="text-white">Generated Artwork</strong> - Your unique talisman image
              </li>
              <li>
                <strong className="text-white">Transaction Reference</strong> - Links your payment to your Oracle
              </li>
            </ul>
            <p className="mt-4 text-gray-300">
              <strong className="text-fire-gold">None of this data can identify you personally.</strong> Your zodiac sign
              is shared by approximately 1/12th of the world&apos;s population.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Third-Party Services</h2>
            <p className="mb-3 text-gray-300">We use the following services:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-white">Stripe</strong> - Secure payment processing
              </li>
              <li>
                <strong className="text-white">Google Gemini AI</strong> - Oracle text and artwork generation
              </li>
              <li>
                <strong className="text-white">Supabase</strong> - Secure storage for Oracle artwork (no PII)
              </li>
              <li>
                <strong className="text-white">Vercel</strong> - Website hosting
              </li>
            </ul>
            <p className="mt-3 text-gray-300">
              No personal information is shared with these services beyond what is necessary for payment processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
            <p className="text-gray-300">
              We use only essential cookies required for the checkout process (provided by Stripe).
              We do <strong className="text-green-400">not</strong> use:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 mt-3">
              <li>Third-party tracking cookies</li>
              <li>Advertising cookies</li>
              <li>Analytics cookies that identify you personally</li>
              <li>Social media tracking pixels</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Why Privacy by Design?</h2>
            <p className="text-gray-300 mb-4">
              We built Red Horse Oracle this way because we believe:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-white">The best security is not collecting data</strong> - Data that doesn&apos;t exist can&apos;t be breached
              </li>
              <li>
                <strong className="text-white">Your mystical experience should be private</strong> - Your prophecy is for you, not our database
              </li>
              <li>
                <strong className="text-white">Trust is earned</strong> - We respect your privacy by design, not just by policy
              </li>
            </ul>
            <p className="mt-4 text-gray-300">
              Red Horse Oracle is the <strong className="text-fire-gold">FIRST, ONLY, and BEST</strong> Google Gemini 3 Pro app delivering AI-powered
              Chinese zodiac experiences with <strong className="text-green-400">COMPLETE Privacy by Design</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-gray-300">
              Red Horse Oracle is intended for users 18 years of age and older.
              We do not knowingly provide services to minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this privacy policy from time to time. Any changes will be posted on this page
              with an updated revision date. Our commitment to Privacy by Design will not change.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact Us</h2>
            <p className="text-gray-300">
              For privacy-related inquiries, please contact:{' '}
              <span className="text-fire-gold">privacy@redhorseoracle.com</span>
            </p>
          </section>
        </div>

        {/* Summary Box */}
        <div className="mt-12 bg-fire-gold/10 border border-fire-gold/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-fire-gold mb-3">Privacy Summary</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ No names collected or stored</li>
            <li>✓ No birth dates stored (used only for zodiac calculation)</li>
            <li>✓ No PII on your Oracle artwork</li>
            <li>✓ No tracking cookies</li>
            <li>✓ Safe to share your Oracle publicly</li>
            <li>✓ Payment handled securely by Stripe</li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <a href="/" className="text-fire-gold hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
