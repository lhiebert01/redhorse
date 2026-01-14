'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Prophecy } from '@/types/prophecy';
import TalismanDisplay from '@/components/reveal/TalismanDisplay';
import ZodiacSummary from '@/components/reveal/ZodiacSummary';
import GeneratingState from '@/components/reveal/GeneratingState';

function RevealContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const fromAdmin = searchParams.get('from') === 'admin';

  const [prophecy, setProphecy] = useState<Prophecy | null>(null);
  const [status, setStatus] = useState<'loading' | 'generating' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchProphecy = useCallback(async () => {
    if (!sessionId) return;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('prophecies')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();

      if (error || !data) {
        // Not found yet - webhook may still be processing
        setStatus('generating');
        return;
      }

      setProphecy(data as Prophecy);

      if (data.status === 'completed') {
        setStatus('ready');
      } else if (data.status === 'failed') {
        setStatus('error');
        setErrorMessage(data.error_message || 'Generation failed. Please contact support.');
      } else {
        setStatus('generating');
      }
    } catch (err) {
      console.error('Error fetching prophecy:', err);
      setStatus('generating');
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Invalid session. Please try purchasing again.');
      return;
    }

    // Initial fetch
    fetchProphecy();

    // Set up real-time subscription
    const supabase = getSupabaseClient();
    const channel = supabase
      .channel(`prophecy-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prophecies',
          filter: `stripe_session_id=eq.${sessionId}`,
        },
        (payload) => {
          const updated = payload.new as Prophecy;
          setProphecy(updated);

          if (updated.status === 'completed') {
            setStatus('ready');
          } else if (updated.status === 'failed') {
            setStatus('error');
            setErrorMessage(updated.error_message || 'Generation failed.');
          }
        }
      )
      .subscribe();

    // Poll as fallback (in case realtime has issues)
    const pollInterval = setInterval(fetchProphecy, 3000);

    return () => {
      channel.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [sessionId, fetchProphecy]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl text-red-600 font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-8">{errorMessage}</p>
        <a
          href="/"
          className="bg-fire-gold text-black font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform"
        >
          Return Home
        </a>
      </div>
    );
  }

  if (status === 'loading' || status === 'generating') {
    return <GeneratingState />;
  }

  if (!prophecy) {
    return <GeneratingState />;
  }

  return (
    <div className="min-h-screen bg-fire-gradient text-fire-gold flex flex-col items-center p-4 py-12 relative overflow-hidden">
      {/* Background Watermark - Zodiac Medallion */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/Year-of-Horse-Hero-Image3.jpeg)',
          backgroundSize: '105%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.55,
          filter: 'blur(1px)',
        }}
      />
      {/* Gradient overlay to blend watermark */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      <div className="relative z-10">
        <TalismanDisplay prophecy={prophecy} />
      </div>

      {/* Zodiac Summary Section */}
      {prophecy.zodiac_sign && (
        <div className="relative z-10">
          <ZodiacSummary
            zodiacSign={prophecy.zodiac_sign}
            zodiacElement={prophecy.zodiac_element}
          />
        </div>
      )}

      <div className="mt-8 text-center space-y-4 relative z-10">
        {fromAdmin ? (
          <>
            <a
              href="/admin-test?skip_pin=true"
              className="block bg-fire-gold text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Generate Another Test
            </a>
            <a
              href="/"
              className="block text-gray-500 text-sm hover:text-gray-300 underline"
            >
              Return to Home
            </a>
          </>
        ) : (
          <a
            href="/"
            className="text-gray-500 text-sm hover:text-gray-300 underline"
          >
            Get another reading
          </a>
        )}
      </div>
    </div>
  );
}

export default function RevealPage() {
  return (
    <Suspense fallback={<GeneratingState />}>
      <RevealContent />
    </Suspense>
  );
}
