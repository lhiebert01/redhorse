'use client';

import { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Prophecy } from '@/types/prophecy';
import TalismanDisplay from '@/components/reveal/TalismanDisplay';
import ZodiacSummary from '@/components/reveal/ZodiacSummary';
import GeneratingState from '@/components/reveal/GeneratingState';
import StatusCard from '@/components/reveal/StatusCard';

// Minimum time to show loading animation (15 seconds)
const MIN_LOADING_TIME_MS = 15000;

function RevealContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const fromAdmin = searchParams.get('from') === 'admin';

  const [prophecy, setProphecy] = useState<Prophecy | null>(null);
  const [status, setStatus] = useState<'loading' | 'generating' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingStartTime] = useState<number>(Date.now());
  const [minTimeElapsed, setMinTimeElapsed] = useState<boolean>(false);

  // Track the last known status to prevent unnecessary re-renders
  const lastStatusRef = useRef<string | null>(null);
  const lastProphecyIdRef = useRef<string | null>(null);

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
        if (status !== 'generating') {
          setStatus('generating');
        }
        return;
      }

      // Only update prophecy state if it actually changed (prevent unnecessary re-renders)
      const prophecyData = data as Prophecy;
      const hasNewData = lastProphecyIdRef.current !== prophecyData.id ||
                         lastStatusRef.current !== prophecyData.status;

      if (hasNewData) {
        lastProphecyIdRef.current = prophecyData.id;
        lastStatusRef.current = prophecyData.status;
        setProphecy(prophecyData);

        if (prophecyData.status === 'completed') {
          setStatus('ready');
        } else if (prophecyData.status === 'failed') {
          setStatus('error');
          setErrorMessage(prophecyData.error_message || 'Generation failed. Please contact support.');
        } else if (status !== 'generating') {
          setStatus('generating');
        }
      }
    } catch (err) {
      console.error('Error fetching prophecy:', err);
      if (status !== 'generating') {
        setStatus('generating');
      }
    }
  }, [sessionId, status]);

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

          // Only update if status actually changed (prevent unnecessary re-renders)
          if (lastStatusRef.current !== updated.status) {
            lastStatusRef.current = updated.status;
            lastProphecyIdRef.current = updated.id;
            setProphecy(updated);

            if (updated.status === 'completed') {
              setStatus('ready');
            } else if (updated.status === 'failed') {
              setStatus('error');
              setErrorMessage(updated.error_message || 'Generation failed.');
            }
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

  // Ensure minimum loading time for the animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, MIN_LOADING_TIME_MS);

    return () => clearTimeout(timer);
  }, []);

  // Calculate if we should show loading (either not ready OR min time hasn't elapsed)
  const shouldShowLoading = (status === 'loading' || status === 'generating') ||
    (status === 'ready' && !minTimeElapsed);

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

  if (shouldShowLoading) {
    return (
      <GeneratingState
        zodiacSign={prophecy?.zodiac_sign}
        zodiacElement={prophecy?.zodiac_element}
        focusMode={prophecy?.focus_mode}
      />
    );
  }

  if (!prophecy) {
    return <GeneratingState />;
  }

  return (
    <div className="min-h-screen bg-fire-gradient text-fire-gold flex flex-col items-center p-4 py-12 relative overflow-hidden">
      {/* Background Watermark - Cinematic 12 Zodiac Chart - Crystal Clear, Subtle */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/Fire-Horse-2026-Chart-v2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.18,
        }}
      />

      <div className="relative z-10">
        <TalismanDisplay prophecy={prophecy} />
      </div>

      {/* Zodiac Summary Section */}
      {prophecy.zodiac_sign && (
        <div className="relative z-10">
          <ZodiacSummary
            zodiacSign={prophecy.zodiac_sign}
            zodiacElement={prophecy.zodiac_element}
            focusMode={prophecy.focus_mode}
            fullReading={prophecy.full_reading}
          />
        </div>
      )}

      {/* Viral Status Card Section */}
      {prophecy.zodiac_sign && prophecy.edition_number && (
        <div className="relative z-10">
          <StatusCard
            zodiacSign={prophecy.zodiac_sign}
            zodiacElement={prophecy.zodiac_element || 'Fire'}
            editionNumber={prophecy.edition_number}
            totalEditions={prophecy.total_editions || 888}
            focusMode={prophecy.focus_mode || 'wealth'}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 text-center space-y-4 relative z-10 w-full max-w-md">
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
              className="block text-gray-400 hover:text-fire-gold underline"
            >
              Return to Home
            </a>
          </>
        ) : (
          <>
            <a
              href="/"
              className="block bg-fire-gold text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Return to Home
            </a>
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '/'}
              className="block border-2 border-fire-gold text-fire-gold font-bold px-8 py-3 rounded-xl hover:bg-fire-gold hover:text-black transition-all"
            >
              Get Another Reading
            </a>
            <a
              href="/examples"
              className="block text-gray-400 hover:text-fire-gold underline text-sm"
            >
              View Examples Gallery
            </a>
          </>
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
