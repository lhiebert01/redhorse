'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { PartyPass, getPassTimeRemaining, PASS_CONFIGS } from '@/types/party';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [pass, setPass] = useState<PartyPass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPass() {
      if (!sessionId) {
        setError('Missing session ID');
        setLoading(false);
        return;
      }

      // Poll for the pass (webhook might be processing)
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const { data, error: fetchError } = await supabase
          .from('party_passes')
          .select('*')
          .eq('stripe_session_id', sessionId)
          .single();

        if (data) {
          setPass(data);
          setLoading(false);
          return;
        }

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 = no rows found, which is expected while processing
          console.error('Fetch error:', fetchError);
        }

        attempts++;
        await new Promise((r) => setTimeout(r, 2000)); // Wait 2 seconds
      }

      setError('Failed to load party pass. Please refresh the page.');
      setLoading(false);
    }

    loadPass();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl animate-bounce mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Setting up your party...</h1>
        <p className="text-gray-400">This will only take a moment</p>
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (error || !pass) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-2 text-red-400">
          {error || 'Something went wrong'}
        </h1>
        <p className="text-gray-400 mb-6">
          Please contact support if this persists
        </p>
        <Link
          href="/party"
          className="text-blue-400 hover:underline"
        >
          ← Back to Party Home
        </Link>
      </div>
    );
  }

  const passConfig = PASS_CONFIGS[pass.pass_type];
  const timeRemaining = getPassTimeRemaining(pass);

  const shareMessage = `🎉 Join my Fire Horse Trivia party!\n\n🔥 Go to: redhorseoracle.com/party\n📱 Enter code: ${pass.party_code}\n\n#FireHorse2026 #CNY2026`;

  return (
    <div className="text-center py-10">
      <div className="text-6xl mb-4">🎊</div>
      <h1 className="text-3xl font-bold mb-2">Party Created!</h1>
      <p className="text-gray-400 mb-8">
        Your {passConfig.name} is ready to go
      </p>

      {/* Party Code Display */}
      <div className="bg-gradient-to-r from-red-900/50 to-yellow-900/50 rounded-2xl p-8 mb-8 max-w-md mx-auto">
        <div className="text-sm text-gray-400 mb-2">Your Party Code</div>
        <div className="text-5xl font-mono font-bold tracking-widest text-yellow-400 mb-4">
          {pass.party_code}
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigator.clipboard.writeText(pass.party_code)}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm"
          >
            Copy Code
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(shareMessage)}
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm"
          >
            Copy Invite
          </button>
        </div>
      </div>

      {/* Pass Details */}
      <div className="bg-gray-900/50 rounded-xl p-6 mb-8 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {passConfig.durationHours}h
            </div>
            <div className="text-xs text-gray-400">Duration</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {pass.games_remaining}
            </div>
            <div className="text-xs text-gray-400">Games Left</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">20</div>
            <div className="text-xs text-gray-400">Max Players</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Expires in: {timeRemaining.hours}h {timeRemaining.minutes}m
        </div>
      </div>

      {/* How to Share */}
      <div className="bg-blue-900/30 rounded-xl p-6 mb-8 max-w-md mx-auto text-left">
        <h3 className="font-bold text-lg mb-3">📱 Share with your guests:</h3>
        <ol className="space-y-2 text-gray-300">
          <li>
            1. Tell them to go to{' '}
            <span className="text-blue-400 font-mono">redhorseoracle.com/party</span>
          </li>
          <li>
            2. Click &quot;Join a Party&quot;
          </li>
          <li>
            3. Enter code: <span className="font-mono text-yellow-400">{pass.party_code}</span>
          </li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <Link
          href={`/party/host/${pass.party_code}`}
          className="py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-xl shadow-lg hover:shadow-green-500/30"
        >
          GO TO HOST CONSOLE →
        </Link>

        <Link
          href="/party"
          className="py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold"
        >
          Back to Party Home
        </Link>
      </div>

      {/* Tips */}
      <div className="mt-8 text-sm text-gray-500 max-w-md mx-auto">
        <p>💡 Tip: Display the host console on a TV or large screen for everyone to see!</p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl animate-bounce mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">Loading...</h1>
    </div>
  );
}

export default function SuccessPage() {
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

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <Suspense fallback={<LoadingFallback />}>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
