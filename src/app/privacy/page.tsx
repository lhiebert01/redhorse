import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Red Horse Oracle',
  description: 'Privacy Policy for Red Horse Oracle - How we handle your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-gray-300 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-fire-gold mb-8">Privacy Policy</h1>

        <p className="text-gray-500 mb-8">Last Updated: January 13, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you use Red Horse Oracle, we collect:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-white">Email address</strong> - For delivery of your
                talisman and customer service
              </li>
              <li>
                <strong className="text-white">Birth date</strong> - For calculating your Chinese
                zodiac sign and generating personalized content
              </li>
              <li>
                <strong className="text-white">Focus mode selection</strong> - Your choice of
                Wealth, Power, Love, or Shield mode
              </li>
              <li>
                <strong className="text-white">Payment information</strong> - Processed securely
                by Stripe (we do not store card details)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">Your data is used solely to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Generate your personalized talisman and prophecy</li>
              <li>Process your payment</li>
              <li>Provide customer support if needed</li>
              <li>Improve our service (aggregated, anonymized analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Storage & Security</h2>
            <p>
              Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and
              in transit. Generated images are stored in secure cloud storage. We implement
              industry-standard security measures to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-white">Stripe</strong> - Payment processing
              </li>
              <li>
                <strong className="text-white">Google (Gemini AI)</strong> - Content and image
                generation
              </li>
              <li>
                <strong className="text-white">Supabase</strong> - Database and file storage
              </li>
              <li>
                <strong className="text-white">Vercel</strong> - Website hosting
              </li>
            </ul>
            <p className="mt-3">
              Each service has its own privacy policy governing how they handle data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Retention</h2>
            <p>
              We retain your prophecy data for 1 year to allow you to access your talisman. After
              this period, data may be deleted. You can request deletion of your data at any time
              by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Cookies</h2>
            <p>
              We use minimal cookies necessary for the website to function. We do not use
              third-party tracking cookies or sell your data to advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Red Horse Oracle is not intended for users under 18 years of age. We do not
              knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this
              page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
            <p>
              For privacy-related inquiries, please contact:{' '}
              <span className="text-fire-gold">privacy@redhorseoracle.com</span>
            </p>
          </section>
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
