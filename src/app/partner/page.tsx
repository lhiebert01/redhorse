'use client';

import { useState } from 'react';
import Link from 'next/link';

const PLATFORMS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'other', label: 'Other' },
];

const FOLLOWER_RANGES = [
  { value: '', label: 'Select follower count' },
  { value: '1K-10K', label: '1K - 10K' },
  { value: '10K-50K', label: '10K - 50K' },
  { value: '50K-100K', label: '50K - 100K' },
  { value: '100K-500K', label: '100K - 500K' },
  { value: '500K-1M', label: '500K - 1M' },
  { value: '1M+', label: '1M+' },
];

export default function PartnerPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('');
  const [handle, setHandle] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/influencer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          platform: platform || null,
          handle: handle || null,
          followerCount: followerCount || null,
          message,
          sourcePage: 'partner',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-fire-gold mb-4">Application Received!</h1>
          <p className="text-gray-300 mb-8">
            Thank you for your interest in partnering with Red Horse Oracle.
            We&apos;ll review your application and get back to you soon!
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full py-3 bg-fire-gold text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              href="/party"
              className="block w-full py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Try Fire Horse Trivia
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage: 'url(/assets/Fire-Horse-2026-Chart-v2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="text-sm text-gray-400 hover:text-white">
              ← Back to Red Horse Oracle
            </span>
          </Link>

          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            🌟 INFLUENCER & PARTNER PROGRAM 🌟
          </div>

          <h1 className="text-4xl font-bold mb-4">
            <span className="text-fire-gold">Partner</span> With Us
          </h1>

          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Are you an influencer, content creator, or community leader?
            Let&apos;s collaborate to spread the Fire Horse energy in 2026!
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-900/80 rounded-xl p-4 text-center border border-purple-500/30">
            <div className="text-2xl mb-2">🎫</div>
            <div className="text-sm font-bold text-purple-400">Free VIP Access</div>
            <div className="text-xs text-gray-400">Test all features free</div>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-4 text-center border border-pink-500/30">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-bold text-pink-400">Revenue Share</div>
            <div className="text-xs text-gray-400">Earn on referrals</div>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-4 text-center border border-fire-gold/30">
            <div className="text-2xl mb-2">🎨</div>
            <div className="text-sm font-bold text-fire-gold">Custom Content</div>
            <div className="text-xs text-gray-400">Co-create with us</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900/90 rounded-2xl p-6 md:p-8 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Tell Us About Yourself</h2>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:border-fire-gold focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:border-fire-gold focus:outline-none"
                required
              />
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Primary Platform
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlatform(p.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      platform === p.value
                        ? 'bg-fire-gold text-black font-bold'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Handle & Followers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Your Handle/Username
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:border-fire-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Follower Count
                </label>
                <select
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:border-fire-gold focus:outline-none"
                >
                  {FOLLOWER_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Your Proposal <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Tell us what you&apos;d like to do! Content ideas, promotion plans, collaboration proposals — we want to hear it all.
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I'd like to create content about... / I have an audience interested in... / Here's my proposal..."
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:border-fire-gold focus:outline-none resize-none"
                rows={5}
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !name || !email || !message}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
            >
              {submitting ? 'Submitting...' : '🚀 SUBMIT APPLICATION'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>We review all applications personally and respond within 48 hours.</p>
          <p className="mt-2">
            Questions? Email us at{' '}
            <a href="mailto:lindsay.hiebert@gmail.com" className="text-fire-gold hover:underline">
              lindsay.hiebert@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
