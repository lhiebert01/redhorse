'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  ANSWER_COLORS,
  PartyPlayer,
  GameStatus,
  calculatePoints,
  formatTimeRemaining,
} from '@/types/party';
import { Confetti, BouncingHorse } from '@/components/party/Celebration';
import PartyEndScreen from '@/components/party/PartyEndScreen';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  category: string;
  difficulty: string;
}

interface PlayerState {
  player_id: string;
  nickname: string;
  zodiac_sign?: string;
  zodiac_element?: string;
  party_code: string;
  game_id: string;
}

interface GameState {
  status: GameStatus;
  current_question_index: number;
  timer_seconds: number;
  total_questions: number;
}

interface LeaderboardEntry {
  nickname: string;
  total_points: number;
  rank: number;
  player_id: string;
  zodiac_sign?: string;
  zodiac_element?: string;
}

export default function PlayerGamePage() {
  const params = useParams();
  const partyCode = (params.code as string || '').toUpperCase();
  const router = useRouter();

  // Player state
  // Using ref to avoid stale closure issues in callbacks (especially handleAnswer)
  const playerStateRef = useRef<PlayerState | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [players, setPlayers] = useState<PartyPlayer[]>([]);

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    status: 'lobby',
    current_question_index: 0,
    timer_seconds: 30,
    total_questions: 20,
  });

  // Question state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [explanation, setExplanation] = useState<string | null>(null);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(30000); // ms
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

  // Leaderboard (updated after each question)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);

  // Results
  const [finalRank, setFinalRank] = useState<number | null>(null);
  const [finalScores, setFinalScores] = useState<LeaderboardEntry[]>([]);

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPartyEnd, setShowPartyEnd] = useState(false);

  // Load player state from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem('party_player');
    if (stored) {
      try {
        const player = JSON.parse(stored) as PlayerState;
        if (player.party_code === partyCode) {
          setPlayerState(player);
          playerStateRef.current = player; // CRITICAL: Update ref immediately
        } else {
          router.push(`/party/join?code=${partyCode}`);
        }
      } catch {
        router.push(`/party/join?code=${partyCode}`);
      }
    } else {
      router.push(`/party/join?code=${partyCode}`);
    }
  }, [partyCode, router]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!playerState?.game_id) return;

    const channel = supabase.channel(`party:${partyCode}`)
      .on('broadcast', { event: 'game_start' }, (payload) => {
        const data = payload.payload as {
          game_id?: string;
          total_questions: number;
          timer_seconds: number;
        };
        // Sync game_id from host to ensure we're in the same game
        if (data.game_id && playerState) {
          const updatedState = { ...playerState, game_id: data.game_id };
          setPlayerState(updatedState);
          playerStateRef.current = updatedState; // CRITICAL: Update ref immediately for handleAnswer
          sessionStorage.setItem('party_player', JSON.stringify(updatedState));
          console.log('[PLAYER] Synced game_id from host:', data.game_id);
        }
        // Reset scores for new game
        setLeaderboard([]);
        setTotalPoints(0);
        setMyRank(null);
        setCurrentStreak(0);
        setGameState((prev) => ({
          ...prev,
          status: 'countdown',
          total_questions: data.total_questions,
          timer_seconds: data.timer_seconds,
        }));
      })
      .on('broadcast', { event: 'next_question' }, (payload) => {
        const data = payload.payload as {
          question_index: number;
          question: Question;
          timer_seconds: number;
        };
        setCurrentQuestion(data.question);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setIsCorrect(null);
        setPointsEarned(0);
        setExplanation(null);
        setTimeRemaining(data.timer_seconds * 1000);
        setQuestionStartTime(Date.now());
        setGameState((prev) => ({
          ...prev,
          status: 'playing',
          current_question_index: data.question_index,
          timer_seconds: data.timer_seconds, // IMPORTANT: Update timer setting
        }));
      })
      .on('broadcast', { event: 'question_end' }, () => {
        setGameState((prev) => ({
          ...prev,
          status: 'showing_answer',
        }));
      })
      .on('broadcast', { event: 'show_answer' }, (payload) => {
        const data = payload.payload as {
          correct_answer: string;
          explanation?: string;
          leaderboard?: LeaderboardEntry[];
        };
        setCorrectAnswer(data.correct_answer);
        setExplanation(data.explanation || null);

        // Update isCorrect based on actual answer
        if (selectedAnswer) {
          const correct = selectedAnswer === data.correct_answer;
          setIsCorrect(correct);
          if (!correct) {
            setCurrentStreak(0);
          }
        }

        // Update leaderboard if provided
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
          const myEntry = data.leaderboard.find((e) => e.player_id === playerState?.player_id);
          if (myEntry) {
            setMyRank(myEntry.rank);
          }
        }
      })
      .on('broadcast', { event: 'leaderboard_update' }, (payload) => {
        const data = payload.payload as {
          leaderboard: LeaderboardEntry[];
        };
        setLeaderboard(data.leaderboard);
        const myEntry = data.leaderboard.find((e) => e.player_id === playerState?.player_id);
        if (myEntry) {
          setMyRank(myEntry.rank);
          setTotalPoints(myEntry.total_points);
        }
      })
      .on('broadcast', { event: 'game_end' }, (payload) => {
        const data = payload.payload as {
          scores: LeaderboardEntry[];
        };
        setFinalScores(data.scores);
        const myScore = data.scores.find((s) => s.player_id === playerState?.player_id);
        if (myScore) {
          setFinalRank(myScore.rank);
        }
        setGameState((prev) => ({
          ...prev,
          status: 'finished',
        }));
        // Show celebration! (25 seconds for bouncing horse + confetti)
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 25000);
      })
      .on('broadcast', { event: 'party_end' }, () => {
        // Host ended the party - show thank you screen
        setShowPartyEnd(true);
      })
      .on('broadcast', { event: 'new_game' }, () => {
        // Reset for new game - redirect to lobby
        setGameState((prev) => ({
          ...prev,
          status: 'lobby',
          current_question_index: 0,
        }));
        setCurrentQuestion(null);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setIsCorrect(null);
        setPointsEarned(0);
        setTotalPoints(0);
        setCurrentStreak(0);
        setFinalRank(null);
        setFinalScores([]);
        setLeaderboard([]);
        setShowCelebration(false);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const playerList = Object.values(state).flat() as unknown as PartyPlayer[];
        setPlayers(playerList);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && playerState) {
          await channel.track({
            player_id: playerState.player_id,
            nickname: playerState.nickname,
            zodiac_sign: playerState.zodiac_sign,
            zodiac_element: playerState.zodiac_element,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playerState, partyCode]);

  // Timer countdown
  useEffect(() => {
    if (gameState.status !== 'playing' || !questionStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      const remaining = Math.max(0, gameState.timer_seconds * 1000 - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.status, questionStartTime, gameState.timer_seconds]);

  // Handle answer selection
  const handleAnswer = useCallback(
    async (answer: string) => {
      // CRITICAL: Use ref instead of state to avoid stale closure
      const currentPlayerState = playerStateRef.current;
      if (selectedAnswer || !currentQuestion || !currentPlayerState || !questionStartTime)
        return;

      const answerTimeMs = Date.now() - questionStartTime;
      setSelectedAnswer(answer);

      // Debug: Log what we're sending
      const requestData = {
        game_id: currentPlayerState.game_id,
        player_id: currentPlayerState.player_id,
        question_index: gameState.current_question_index,
        question_id: currentQuestion.id,
        answer_given: answer,
        answer_time_ms: answerTimeMs,
      };
      console.log('[PLAYER] Submitting answer:', requestData);

      try {
        const response = await fetch('/api/party/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        console.log('[PLAYER] API response:', { status: response.status, data });

        // Check if API returned an error
        if (!response.ok || data.error) {
          console.error('[PLAYER] API error:', data.error || response.statusText);
          // For "already answered" errors, just ignore silently - answer is already recorded
          if (data.error?.includes('Already answered')) {
            console.log('[PLAYER] Already answered - ignoring duplicate submission');
            return;
          }
          // For other errors, log but don't disrupt the user
          console.error('[PLAYER] Answer error:', data.error);
          return;
        }

        // Only process if we got a valid response with is_correct field
        if (data.is_correct === true) {
          console.log('[PLAYER] Correct! Points:', data.total_points);
          setIsCorrect(true);
          setPointsEarned(data.total_points);
          setCurrentStreak(data.current_streak);
          setTotalPoints((prev) => prev + data.total_points);
        } else if (data.is_correct === false) {
          console.log('[PLAYER] Wrong! Correct answer was:', data.correct_answer);
          setIsCorrect(false);
          setCurrentStreak(0);
        }
      } catch (error) {
        console.error('[PLAYER] Failed to submit answer:', error);
        // Don't disrupt user with alert - just log the error
      }
    },
    [selectedAnswer, currentQuestion, questionStartTime, gameState.current_question_index] // playerState removed - using ref
  );

  // Loading state
  if (!playerState) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-4">🐴</div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  // Render based on game status
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fire Horse Background with Transparency */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(/assets/Fire-Horse-2026-Chart-v2.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
        }}
      />

      {/* Header with Score */}
      <div className="bg-gradient-to-r from-red-900 to-yellow-900 p-3 relative z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-300">Party: </span>
            <span className="font-mono font-bold">{partyCode}</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{totalPoints}</div>
            <div className="text-xs text-gray-300">points</div>
          </div>
          <div className="text-right">
            <div className="font-bold">{playerState.nickname}</div>
            {myRank && (
              <div className="text-xs text-yellow-400">
                Rank #{myRank}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-4 relative z-10">
        {/* LOBBY */}
        {gameState.status === 'lobby' && (
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎮</div>
            <h1 className="text-2xl font-bold mb-2">Waiting for Host</h1>
            <p className="text-gray-400 mb-6">
              The game will start when the host is ready
            </p>

            {/* Player List */}
            <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">
                Players Connected ({players.length}/20)
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {players.map((p, i) => (
                  <span
                    key={i}
                    className="bg-blue-900/50 px-3 py-1 rounded-full text-sm"
                  >
                    {(p as unknown as { nickname: string }).nickname}
                  </span>
                ))}
                {players.length === 0 && (
                  <span className="text-gray-500">
                    Waiting for players...
                  </span>
                )}
              </div>
            </div>

            {/* Your Stats */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-red-900/30 rounded-xl p-4 border border-yellow-600/30">
              <div className="text-lg font-bold">
                {playerState.zodiac_element} {playerState.zodiac_sign}
                {playerState.zodiac_element === 'Fire' &&
                  playerState.zodiac_sign === 'Horse' &&
                  ' 🔥🐴'}
              </div>
              <div className="text-sm text-gray-400">
                Your zodiac for this game
              </div>
            </div>
          </div>
        )}

        {/* COUNTDOWN */}
        {gameState.status === 'countdown' && (
          <div className="text-center py-20">
            <div className="text-8xl font-bold animate-pulse text-yellow-400">
              3
            </div>
            <p className="text-2xl mt-4">Get Ready!</p>
          </div>
        )}

        {/* PLAYING / SHOWING ANSWER - with Sidebar Layout */}
        {(gameState.status === 'playing' || gameState.status === 'showing_answer') && currentQuestion && (
          <div className="flex gap-4 xl:gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* PLAYING STATE */}
              {gameState.status === 'playing' && (
                <div>
                  {/* Player Name Banner */}
                  <div className="text-center mb-3 py-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-500/30">
                    <div className="text-2xl font-bold text-yellow-400">
                      🎮 {playerState.nickname}
                    </div>
                  </div>

                  {/* Progress & Timer */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">
                Question {gameState.current_question_index + 1} of{' '}
                {gameState.total_questions}
              </div>
              {gameState.timer_seconds === 0 ? (
                <div className="text-2xl font-bold text-blue-400">
                  📋 MANUAL
                </div>
              ) : (
                <div
                  className={`text-3xl font-bold font-mono ${
                    timeRemaining < 5000 ? 'text-red-500 animate-pulse' : 'text-yellow-400'
                  }`}
                >
                  {formatTimeRemaining(timeRemaining)}
                </div>
              )}
            </div>

            {/* Timer Bar (only show if not manual mode) */}
            {gameState.timer_seconds > 0 && (
              <div className="h-3 bg-gray-800 rounded-full mb-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${
                    timeRemaining < 5000 ? 'bg-red-500' : 'bg-yellow-400'
                  }`}
                  style={{
                    width: `${(timeRemaining / (gameState.timer_seconds * 1000)) * 100}%`,
                  }}
                />
              </div>
            )}

            {/* Category Badge */}
            <div className="text-center mb-3">
              <span className="bg-gray-800 px-4 py-1 rounded-full text-sm text-gray-400">
                {currentQuestion.category}
              </span>
            </div>

            {/* QUESTION TEXT - PROMINENTLY DISPLAYED */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 mb-4 border border-gray-700">
              <div className="text-xl md:text-2xl font-bold text-center leading-relaxed">
                {currentQuestion.question}
              </div>
            </div>

            {/* Answer Buttons - Full width on mobile, 2 cols on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {currentQuestion.options.map((option, index) => {
                const color = ANSWER_COLORS[index];
                const isSelected = selectedAnswer === option;
                const showResult = selectedAnswer !== null;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer || timeRemaining === 0}
                    className={`p-4 rounded-xl font-bold text-base transition-all min-h-[70px] text-center break-words leading-tight ${
                      showResult && isSelected
                        ? isCorrect
                          ? 'ring-4 ring-green-400 bg-green-600'
                          : 'ring-4 ring-red-400 bg-red-600'
                        : showResult
                        ? 'opacity-50'
                        : 'hover:scale-105 active:scale-95'
                    }`}
                    style={{
                      backgroundColor: showResult && isSelected
                        ? undefined
                        : color.bg,
                      color: color.text,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Feedback - shown immediately after answering */}
            {selectedAnswer && (
              <div
                className={`p-4 rounded-xl text-center ${
                  isCorrect === true
                    ? 'bg-green-900/50 border-2 border-green-500'
                    : isCorrect === false
                    ? 'bg-red-900/50 border-2 border-red-500'
                    : 'bg-yellow-900/50 border-2 border-yellow-500'
                }`}
              >
                {isCorrect === true ? (
                  <>
                    <div className="text-4xl mb-2">🎉</div>
                    <div className="text-2xl font-bold text-green-400">
                      +{pointsEarned} points!
                    </div>
                    {currentStreak >= 3 && (
                      <div className="text-lg text-yellow-400">
                        🔥 {currentStreak} streak!
                      </div>
                    )}
                  </>
                ) : isCorrect === false ? (
                  <>
                    <div className="text-4xl mb-2">😔</div>
                    <div className="text-xl font-bold text-red-400">
                      Waiting for answer reveal...
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">⏳</div>
                    <div className="text-xl font-bold text-yellow-400">
                      Answer submitted...
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Question Text Repeated at Bottom */}
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 text-center">
                {currentQuestion.question}
              </div>
            </div>
                </div>
              )}

              {/* SHOWING ANSWER STATE */}
              {gameState.status === 'showing_answer' && (
                <div>
                  {/* Player Name Banner */}
                  <div className="text-center mb-3 py-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-500/30">
                    <div className="text-2xl font-bold text-yellow-400">
                      🎮 {playerState.nickname}
                    </div>
                  </div>

                  {/* Category Badge */}
            <div className="text-center mb-3">
              <span className="bg-gray-800 px-4 py-1 rounded-full text-sm text-gray-400">
                {currentQuestion.category}
              </span>
            </div>

            {/* Question Recap */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 mb-4 border border-gray-700">
              <div className="text-lg font-bold text-center mb-2">
                {currentQuestion.question}
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-400">
                  Question {gameState.current_question_index + 1} of {gameState.total_questions}
                </span>
              </div>
            </div>

            {/* Answer Grid showing correct answer */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {currentQuestion.options.map((option, index) => {
                const color = ANSWER_COLORS[index];
                const isCorrectAnswer = correctAnswer === option;
                const wasSelected = selectedAnswer === option;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl font-bold text-base min-h-[80px] flex items-center justify-center relative ${
                      isCorrectAnswer
                        ? 'ring-4 ring-green-400 bg-green-600'
                        : wasSelected && !isCorrectAnswer
                        ? 'ring-4 ring-red-400 bg-red-600 opacity-75'
                        : 'opacity-40'
                    }`}
                    style={{
                      backgroundColor: isCorrectAnswer
                        ? undefined
                        : wasSelected && !isCorrectAnswer
                        ? undefined
                        : color.bg,
                      color: color.text,
                    }}
                  >
                    {option}
                    {isCorrectAnswer && (
                      <span className="absolute top-1 right-1 text-2xl">✅</span>
                    )}
                    {wasSelected && !isCorrectAnswer && (
                      <span className="absolute top-1 right-1 text-2xl">❌</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* YOUR RESULT - Single combined box for clarity */}
            <div
              className={`p-5 rounded-xl text-center mb-4 ${
                isCorrect
                  ? 'bg-gradient-to-b from-green-800/80 to-green-900/80 border-2 border-green-400'
                  : selectedAnswer
                  ? 'bg-gradient-to-b from-red-800/80 to-red-900/80 border-2 border-red-400'
                  : 'bg-gradient-to-b from-gray-700/80 to-gray-800/80 border-2 border-gray-500'
              }`}
            >
              {/* Result Icon & Text */}
              {isCorrect ? (
                <>
                  <div className="text-5xl mb-2">🎉</div>
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    YOU GOT IT!
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    +{pointsEarned} points
                  </div>
                </>
              ) : selectedAnswer ? (
                <>
                  <div className="text-5xl mb-2">😔</div>
                  <div className="text-3xl font-bold text-red-400 mb-3">
                    NOT QUITE
                  </div>
                  {/* Show what the correct answer was */}
                  <div className="bg-black/40 rounded-lg p-3 mt-2">
                    <div className="text-sm text-gray-400 mb-1">The answer was:</div>
                    <div className="text-xl font-bold text-green-400">
                      {correctAnswer}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-2">⏰</div>
                  <div className="text-2xl font-bold text-gray-300 mb-3">
                    TIME&apos;S UP!
                  </div>
                  {/* Show what the correct answer was */}
                  <div className="bg-black/40 rounded-lg p-3 mt-2">
                    <div className="text-sm text-gray-400 mb-1">The answer was:</div>
                    <div className="text-xl font-bold text-green-400">
                      {correctAnswer}
                    </div>
                  </div>
                </>
              )}

              {/* Explanation if available */}
              {explanation && (
                <div className="bg-black/30 rounded-lg p-3 mt-3 border-t border-gray-600">
                  <div className="text-sm text-gray-300">
                    💡 {explanation}
                  </div>
                </div>
              )}
            </div>

                  {/* Your Score */}
                  <div className="bg-gradient-to-r from-yellow-900/50 to-red-900/50 rounded-xl p-4 mb-4 text-center">
                    <div className="text-sm text-gray-400">Your Total Score</div>
                    <div className="text-5xl font-bold text-yellow-400">{totalPoints}</div>
                    {myRank && (
                      <div className="text-xl text-gray-300 mt-1">
                        Rank: <span className="text-yellow-400 font-bold">#{myRank}</span>
                      </div>
                    )}
                  </div>

                  {/* Waiting message */}
                  <div className="text-center mt-4 text-gray-400">
                    <div className="animate-pulse">Waiting for next question...</div>
                  </div>

                  {/* Mobile Leaderboard - shown on screens below xl (1280px) */}
                  <div className="xl:hidden mt-4">
                    {leaderboard.length > 0 && (
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <h3 className="text-lg font-bold mb-3 text-center text-yellow-400">🏆 Leaderboard</h3>
                        <div className="space-y-2">
                          {leaderboard.slice(0, 5).map((entry, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded ${
                                entry.player_id === playerState?.player_id
                                  ? 'bg-yellow-900/50 border border-yellow-600'
                                  : 'bg-gray-800/50'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-lg w-6">
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                                  </span>
                                  <span className={entry.player_id === playerState?.player_id ? 'font-bold' : ''}>
                                    {entry.nickname}
                                  </span>
                                </div>
                                <span className="font-bold text-xl text-yellow-400">
                                  {entry.total_points}
                                </span>
                              </div>
                              {entry.zodiac_sign && (
                                <div className="text-xs text-gray-400 ml-8">
                                  {entry.zodiac_element} {entry.zodiac_sign}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Leaderboard - visible on extra-large screens only */}
            <div className="w-56 hidden xl:block shrink-0">
              <div className="bg-gray-900/70 rounded-xl p-4 sticky top-4">
                <h3 className="text-lg font-bold mb-3 text-center text-yellow-400">🏆 Leaderboard</h3>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((entry, i) => (
                      <div
                        key={entry.player_id}
                        className={`p-2 rounded ${
                          entry.player_id === playerState?.player_id
                            ? 'bg-yellow-900/50 border border-yellow-600'
                            : entry.rank <= 3
                            ? 'bg-yellow-900/30'
                            : 'bg-gray-800/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-400 w-6">
                              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `${entry.rank}.`}
                            </span>
                            <span className={`truncate max-w-[100px] ${entry.player_id === playerState?.player_id ? 'font-bold text-yellow-300' : 'font-medium'}`}>
                              {entry.nickname}
                            </span>
                          </div>
                          <span className="font-bold text-yellow-400 text-lg">{entry.total_points}</span>
                        </div>
                        {entry.zodiac_sign && (
                          <div className="text-xs text-gray-400 ml-8">
                            {entry.zodiac_element} {entry.zodiac_sign}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center text-sm">Scores loading...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FINISHED */}
        {gameState.status === 'finished' && (
          <div className="flex gap-4 xl:gap-6">
            {/* Main Content */}
            <div className="flex-1 text-center relative">
              {/* Celebration Animation - 2.5x longer */}
              {showCelebration && <Confetti count={150} durationMultiplier={2.5} />}

              {/* Victory Header */}
              <div className="mb-4">
                {/* Bouncing Horse - only shows during celebration (10 seconds) */}
                {showCelebration && (
                  <BouncingHorse
                    size={finalRank === 1 ? 'medium' : 'small'}
                    showFrame={true}
                    showRotatingMessages={true}
                    showShareButton={true}
                    partyCode={partyCode}
                  />
                )}

                {/* Medal emoji for non-champions (shows always) */}
                {!showCelebration && finalRank !== 1 && (
                  <div className="text-7xl mb-2">
                    {finalRank === 2 ? '🥈' : finalRank === 3 ? '🥉' : '🎉'}
                  </div>
                )}

                {/* Trophy for champion after celebration ends */}
                {!showCelebration && finalRank === 1 && (
                  <div className="text-7xl mb-2">🏆</div>
                )}

                <h1 className="text-4xl font-bold mb-2 mt-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400">
                  {finalRank === 1 ? 'CHAMPION!' : finalRank && finalRank <= 3 ? 'PODIUM FINISH!' : 'Game Over!'}
                </h1>
              </div>

              {finalRank && (
                <div className="text-7xl font-bold text-yellow-400 mb-2">
                  #{finalRank}
                </div>
              )}

              <div className="text-3xl mb-6">
                Final Score: <span className="text-yellow-400 font-bold">{totalPoints}</span>
              </div>

              {/* Congratulations Message */}
              <div className="bg-gradient-to-r from-red-900/40 to-yellow-900/40 rounded-xl p-4 mb-6 border border-yellow-600/30">
                <p className="text-lg text-yellow-300">
                  🔥 Great job, {playerState.nickname}! 🐴
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  May the Fire Horse bring you fortune in 2026!
                </p>
              </div>

              {/* Mobile Leaderboard - shown below xl */}
              <div className="xl:hidden bg-gray-900/50 rounded-xl p-4 mb-6">
                <h2 className="text-xl font-bold mb-4">🏆 Final Leaderboard</h2>
                <div className="space-y-2">
                  {finalScores.slice(0, 10).map((score, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl ${
                        score.player_id === playerState.player_id
                          ? 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-2 border-yellow-500'
                          : i < 3 ? 'bg-gradient-to-r from-gray-800/80 to-gray-700/80' : 'bg-gray-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xl w-8">
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                          </span>
                          <span className={`text-lg ${score.player_id === playerState.player_id ? 'font-bold text-yellow-300' : ''}`}>
                            {score.nickname}
                          </span>
                        </div>
                        <span className="font-bold text-2xl text-yellow-400">
                          {score.total_points}
                        </span>
                      </div>
                      {score.zodiac_sign && (
                        <div className="text-xs text-gray-400 ml-11">
                          {score.zodiac_element} {score.zodiac_sign}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Message about waiting */}
              <div className="bg-blue-900/30 rounded-xl p-4 mb-6 border border-blue-500/30">
                <p className="text-blue-300">
                  ⏳ Waiting for host to start another game or end the party...
                </p>
              </div>

              {/* Cross-Promotion: Red Horse Oracle */}
              <div className="bg-gradient-to-r from-purple-900/40 to-red-900/40 rounded-xl p-4 mb-6 border border-purple-500/30">
                <div className="text-center">
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400">
                    🔮 Get Your 2026 Fire Horse Oracle
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    Only 888 Limited Edition prophecies per zodiac sign!
                  </p>
                  <Link
                    href="/"
                    className="inline-block mt-3 px-6 py-2 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 rounded-lg font-bold text-sm"
                  >
                    Discover Your Prophecy → $8.88
                  </Link>
                </div>
              </div>

              <Link
                href="/party"
                className="inline-block bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold text-lg"
              >
                Back to Party Home
              </Link>
            </div>

            {/* Sidebar Leaderboard - visible on xl screens */}
            <div className="w-56 hidden xl:block shrink-0">
              <div className="bg-gray-900/70 rounded-xl p-4 sticky top-4">
                <h3 className="text-lg font-bold mb-3 text-center text-yellow-400">🏆 Final Standings</h3>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {finalScores.length > 0 ? (
                    finalScores.map((score, i) => (
                      <div
                        key={score.player_id}
                        className={`p-2 rounded ${
                          score.player_id === playerState?.player_id
                            ? 'bg-yellow-900/50 border border-yellow-600'
                            : i < 3
                            ? 'bg-yellow-900/30'
                            : 'bg-gray-800/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-400 w-6">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                            </span>
                            <span className={`truncate max-w-[80px] ${score.player_id === playerState?.player_id ? 'font-bold text-yellow-300' : 'font-medium'}`}>
                              {score.nickname}
                            </span>
                          </div>
                          <span className="font-bold text-yellow-400">{score.total_points}</span>
                        </div>
                        {score.zodiac_sign && (
                          <div className="text-xs text-gray-400 ml-8">
                            {score.zodiac_element} {score.zodiac_sign}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center text-sm">No scores yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PARTY END SCREEN - Shows when host ends the party */}
        {showPartyEnd && playerState && (
          <PartyEndScreen
            nickname={playerState.nickname}
            zodiacSign={playerState.zodiac_sign}
            zodiacElement={playerState.zodiac_element}
            partyCode={partyCode}
            totalPoints={totalPoints}
            rank={finalRank || undefined}
          />
        )}
      </div>
    </main>
  );
}
