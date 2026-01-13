'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FOCUS_MODES = [
  { id: 'wealth', name: 'Wealth Mode', description: '6 Lucky Numbers (XX-XX-XX-XX-XX-XX)' },
  { id: 'power', name: 'Power Mode', description: '3-Word Strategic Motto (e.g., STRIKE THE NORTH)' },
  { id: 'love', name: 'Love Mode', description: '4-Word Love Phrase (e.g., LOVE FINDS YOU WORTHY)' },
  { id: 'shield', name: 'Shield Mode', description: '3-Word Protective Mantra (e.g., FIRE SHIELDS ME)' },
];

export default function AdminTestPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [birthDate, setBirthDate] = useState('');
  const [focusMode, setFocusMode] = useState('wealth');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '142857') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid PIN');
      setPin('');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/admin-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: '142857',
          birthDate,
          focusMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      // Redirect to reveal page with the session ID
      router.push(`/reveal?session_id=${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsGenerating(false);
    }
  };

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-fire-gold text-center mb-2">
            Admin Access
          </h1>
          <p className="text-gray-400 text-center text-sm mb-6">
            Enter your PIN to access the test console
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="w-full bg-black border border-red-900/50 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-fire-gold"
                maxLength={6}
                autoFocus
              />
              {pinError && (
                <p className="text-red-500 text-sm text-center mt-2">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-fire-gold text-black font-bold py-3 px-6 rounded-xl hover:scale-105 active:scale-95 transition-transform"
            >
              Unlock
            </button>
          </form>

          <a
            href="/"
            className="block text-center text-gray-500 text-sm mt-6 hover:text-gray-300"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Admin Test Console
  return (
    <div className="min-h-screen bg-fire-gradient flex flex-col items-center p-4 py-12">
      <div className="bg-black/80 border border-fire-gold/30 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🔧</span>
          <h1 className="text-2xl font-bold text-fire-gold">Admin Test Console</h1>
        </div>
        <p className="text-gray-400 text-center text-sm mb-8">
          Generate prophecies without payment for testing
        </p>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Birth Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Date of Birth
            </label>
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              className="w-full bg-black border border-red-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fire-gold"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 03/14/1958 or 1990-05-15
            </p>
          </div>

          {/* Focus Mode */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Oracle Mode
            </label>
            <select
              value={focusMode}
              onChange={(e) => setFocusMode(e.target.value)}
              className="w-full bg-black border border-red-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fire-gold appearance-none cursor-pointer"
            >
              {FOCUS_MODES.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.name} - {mode.description}
                </option>
              ))}
            </select>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-fire-gold text-black font-bold py-4 px-6 rounded-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">🔥</span>
                Generating Prophecy...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Test Prophecy
              </>
            )}
          </button>
        </form>

        {isGenerating && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm animate-pulse">
              This may take 30-60 seconds while AI generates your talisman...
            </p>
          </div>
        )}

        <a
          href="/"
          className="block text-center text-gray-500 text-sm mt-8 hover:text-gray-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
