'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { PartyScore } from '@/types/party';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResultsPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const partyCode = resolvedParams.code.toUpperCase();

  const [scores, setScores] = useState<PartyScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameSummary, setGameSummary] = useState<{
    total_questions: number;
    total_players: number;
    game_date: string;
  } | null>(null);

  useEffect(() => {
    async function loadResults() {
      try {
        // Get party pass
        const { data: pass } = await supabase
          .from('party_passes')
          .select('id')
          .eq('party_code', partyCode)
          .single();

        if (!pass) {
          setLoading(false);
          return;
        }

        // Get latest finished game
        const { data: game } = await supabase
          .from('party_games')
          .select('*')
          .eq('party_pass_id', pass.id)
          .eq('status', 'finished')
          .order('ended_at', { ascending: false })
          .limit(1)
          .single();

        if (!game) {
          setLoading(false);
          return;
        }

        // Get scores
        const { data: scoreData } = await supabase
          .from('party_scores')
          .select('*')
          .eq('party_game_id', game.id)
          .order('rank', { ascending: true });

        if (scoreData) {
          setScores(scoreData);
          setGameSummary({
            total_questions: game.questions_per_game,
            total_players: scoreData.length,
            game_date: new Date(game.ended_at || game.created_at).toLocaleDateString(),
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to load results:', error);
        setLoading(false);
      }
    }

    loadResults();
  }, [partyCode]);

  // Export to CSV
  const exportCSV = () => {
    if (scores.length === 0) return;

    const headers = ['Rank', 'Nickname', 'Zodiac', 'Points', 'Correct', 'Accuracy', 'Best Streak'];
    const rows = scores.map((s) => [
      s.rank,
      s.nickname,
      s.zodiac_element && s.zodiac_sign ? `${s.zodiac_element} ${s.zodiac_sign}` : '',
      s.total_points,
      `${s.correct_answers}/${s.total_questions}`,
      `${Math.round(s.accuracy_percent)}%`,
      s.best_streak,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fire-horse-trivia-${partyCode}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">🐴</div>
          <p>Loading results...</p>
        </div>
      </main>
    );
  }

  if (scores.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-400 mb-4">No results found for this party</p>
          <Link href="/party" className="text-blue-400 hover:underline">
            ← Back to Party Home
          </Link>
        </div>
      </main>
    );
  }

  const top3 = scores.slice(0, 3);
  const rest = scores.slice(3);

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
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/party" className="inline-block mb-4">
            <span className="text-sm text-gray-400 hover:text-white">
              ← Back to Party Home
            </span>
          </Link>

          <h1 className="text-3xl font-bold">
            🏆 Final Results
          </h1>
          <p className="text-gray-400">
            Party: {partyCode} • {gameSummary?.game_date}
          </p>
          <p className="text-sm text-gray-500">
            {gameSummary?.total_questions} questions • {gameSummary?.total_players} players
          </p>
        </div>

        {/* Podium (Top 3) */}
        <div className="flex justify-center items-end gap-4 mb-8 h-48">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="text-center">
              <div className="text-4xl mb-2">🥈</div>
              <div className="bg-gray-700 rounded-t-xl p-4 h-28 flex flex-col justify-end">
                <div className="font-bold">{top3[1].nickname}</div>
                <div className="text-yellow-400 font-bold">{top3[1].total_points}</div>
                {top3[1].zodiac_sign && (
                  <div className="text-xs text-gray-400">
                    {top3[1].zodiac_element} {top3[1].zodiac_sign}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="text-center">
              <div className="text-5xl mb-2">🏆</div>
              <div className="bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-t-xl p-4 h-36 flex flex-col justify-end">
                <div className="font-bold text-lg">{top3[0].nickname}</div>
                <div className="text-2xl font-bold">{top3[0].total_points}</div>
                {top3[0].zodiac_sign && (
                  <div className="text-xs text-yellow-200">
                    {top3[0].zodiac_element} {top3[0].zodiac_sign}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="text-center">
              <div className="text-4xl mb-2">🥉</div>
              <div className="bg-amber-800 rounded-t-xl p-4 h-24 flex flex-col justify-end">
                <div className="font-bold">{top3[2].nickname}</div>
                <div className="text-yellow-400 font-bold">{top3[2].total_points}</div>
                {top3[2].zodiac_sign && (
                  <div className="text-xs text-gray-300">
                    {top3[2].zodiac_element} {top3[2].zodiac_sign}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">Full Leaderboard</h2>

          <div className="space-y-2">
            {scores.map((score) => (
              <div
                key={score.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  score.rank <= 3
                    ? 'bg-gradient-to-r from-yellow-900/30 to-transparent'
                    : 'bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-bold text-gray-400">
                    {score.rank === 1 ? '🥇' : score.rank === 2 ? '🥈' : score.rank === 3 ? '🥉' : `${score.rank}.`}
                  </span>
                  <div>
                    <div className="font-bold">{score.nickname}</div>
                    {score.zodiac_sign && (
                      <div className="text-xs text-gray-400">
                        {score.zodiac_element} {score.zodiac_sign}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-yellow-400">{score.total_points}</div>
                  <div className="text-xs text-gray-400">
                    {score.correct_answers}/{score.total_questions} • {Math.round(score.accuracy_percent)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats by Zodiac */}
        <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">🐲 Top by Zodiac</h2>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(
              scores.reduce(
                (acc, s) => {
                  if (s.zodiac_sign) {
                    if (!acc[s.zodiac_sign] || acc[s.zodiac_sign].total_points < s.total_points) {
                      acc[s.zodiac_sign] = s;
                    }
                  }
                  return acc;
                },
                {} as Record<string, PartyScore>
              )
            ).map(([sign, topScore]) => (
              <div
                key={sign}
                className="bg-gray-800/50 rounded-lg p-3 text-center"
              >
                <div className="text-sm text-gray-400">{sign}</div>
                <div className="font-bold">{topScore.nickname}</div>
                <div className="text-yellow-400">{topScore.total_points} pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* Export & Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={exportCSV}
            className="py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold"
          >
            📥 Export Results (CSV)
          </button>

          <Link
            href="/party"
            className="py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-center"
          >
            Back to Party Home
          </Link>
        </div>

        {/* Share */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">Share this game:</p>
          <button
            onClick={() => {
              const text = `🏆 Fire Horse Trivia Results!\n\n🥇 ${top3[0]?.nickname}: ${top3[0]?.total_points} pts\n🥈 ${top3[1]?.nickname}: ${top3[1]?.total_points} pts\n🥉 ${top3[2]?.nickname}: ${top3[2]?.total_points} pts\n\nPlay at redhorseoracle.com/party\n\n#FireHorse2026 #CNY2026`;
              navigator.clipboard.writeText(text);
              alert('Results copied to clipboard!');
            }}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg text-sm"
          >
            Copy Results
          </button>
        </div>
      </div>
    </main>
  );
}
