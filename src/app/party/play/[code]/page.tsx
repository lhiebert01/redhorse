'use client';

import { useState, useEffect, useCallback } from 'react';
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

  // Load player state from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem('party_player');
    if (stored) {
      try {
        const player = JSON.parse(stored) as PlayerState;
        if (player.party_code === partyCode) {
          setPlayerState(player);
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
          total_questions: number;
          timer_seconds: number;
        };
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
      if (selectedAnswer || !currentQuestion || !playerState || !questionStartTime)
        return;

      const answerTimeMs = Date.now() - questionStartTime;
      setSelectedAnswer(answer);

      try {
        const response = await fetch('/api/party/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game_id: playerState.game_id,
            player_id: playerState.player_id,
            question_index: gameState.current_question_index,
            question_id: currentQuestion.id,
            answer_given: answer,
            answer_time_ms: answerTimeMs,
          }),
        });

        const data = await response.json();
        if (data.is_correct) {
          setIsCorrect(true);
          setPointsEarned(data.total_points);
          setCurrentStreak(data.current_streak);
          setTotalPoints((prev) => prev + data.total_points);
        } else {
          setIsCorrect(false);
          setCurrentStreak(0);
        }
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    },
    [selectedAnswer, currentQuestion, playerState, questionStartTime, gameState.current_question_index]
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
    <main className="min-h-screen bg-black text-white">
      {/* Header with Score */}
      <div className="bg-gradient-to-r from-red-900 to-yellow-900 p-3">
        <div className="max-w-md mx-auto flex justify-between items-center">
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
      <div className="max-w-md mx-auto px-4 py-4">
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

        {/* PLAYING */}
        {gameState.status === 'playing' && currentQuestion && (
          <div>
            {/* Progress & Timer */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">
                Q{gameState.current_question_index + 1} of{' '}
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

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {currentQuestion.options.map((option, index) => {
                const color = ANSWER_COLORS[index];
                const isSelected = selectedAnswer === option;
                const showResult = selectedAnswer !== null;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer || timeRemaining === 0}
                    className={`p-4 rounded-xl font-bold text-base transition-all min-h-[80px] ${
                      showResult && isSelected
                        ? isCorrect
                          ? 'ring-4 ring-green-400 bg-green-600'
                          : 'ring-4 ring-red-400 bg-red-600'
                        : showResult
                        ? 'opacity-50'
                        : 'hover:scale-105'
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

            {/* Feedback */}
            {selectedAnswer && (
              <div
                className={`p-4 rounded-xl text-center ${
                  isCorrect
                    ? 'bg-green-900/50 border-2 border-green-500'
                    : 'bg-red-900/50 border-2 border-red-500'
                }`}
              >
                {isCorrect ? (
                  <>
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-2xl font-bold text-green-400">
                      +{pointsEarned} points!
                    </div>
                    {currentStreak >= 3 && (
                      <div className="text-xl text-yellow-400">
                        🔥 {currentStreak} streak!
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">❌</div>
                    <div className="text-2xl font-bold text-red-400">
                      Wrong answer
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

        {/* SHOWING ANSWER */}
        {gameState.status === 'showing_answer' && currentQuestion && (
          <div>
            {/* Question Recap */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 mb-4 border border-gray-700">
              <div className="text-lg font-bold text-center mb-2">
                {currentQuestion.question}
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-400">
                  Q{gameState.current_question_index + 1} of {gameState.total_questions}
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

            {/* Your Result */}
            <div
              className={`p-4 rounded-xl text-center mb-4 ${
                isCorrect
                  ? 'bg-green-900/50 border-2 border-green-500'
                  : selectedAnswer
                  ? 'bg-red-900/50 border-2 border-red-500'
                  : 'bg-gray-900/50 border-2 border-gray-600'
              }`}
            >
              {isCorrect ? (
                <>
                  <div className="text-3xl font-bold text-green-400">
                    ✅ CORRECT! +{pointsEarned}
                  </div>
                </>
              ) : selectedAnswer ? (
                <>
                  <div className="text-3xl font-bold text-red-400">
                    ❌ WRONG
                  </div>
                  <div className="text-lg text-gray-300 mt-1">
                    Correct: <span className="text-green-400 font-bold">{correctAnswer}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-400">
                    ⏰ TIME'S UP!
                  </div>
                  <div className="text-lg text-gray-300 mt-1">
                    Correct: <span className="text-green-400 font-bold">{correctAnswer}</span>
                  </div>
                </>
              )}
            </div>

            {/* Explanation if available */}
            {explanation && (
              <div className="bg-blue-900/30 rounded-xl p-3 mb-4 border border-blue-600/50">
                <div className="text-sm text-blue-300">
                  💡 {explanation}
                </div>
              </div>
            )}

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

            {/* Live Leaderboard */}
            {leaderboard.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl p-4">
                <h3 className="text-lg font-bold mb-3 text-center">🏆 Leaderboard</h3>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded ${
                        entry.player_id === playerState.player_id
                          ? 'bg-yellow-900/50 border border-yellow-600'
                          : 'bg-gray-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg w-6">
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                          </span>
                          <span className={entry.player_id === playerState.player_id ? 'font-bold' : ''}>
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

            {/* Waiting message */}
            <div className="text-center mt-4 text-gray-400">
              <div className="animate-pulse">Waiting for next question...</div>
            </div>
          </div>
        )}

        {/* FINISHED */}
        {gameState.status === 'finished' && (
          <div className="text-center">
            <div className="text-6xl mb-4">
              {finalRank === 1 ? '🏆' : finalRank === 2 ? '🥈' : finalRank === 3 ? '🥉' : '🎉'}
            </div>
            <h1 className="text-3xl font-bold mb-2">Game Over!</h1>

            {finalRank && (
              <div className="text-6xl font-bold text-yellow-400 mb-2">
                #{finalRank}
              </div>
            )}

            <div className="text-3xl mb-6">
              Final Score: <span className="text-yellow-400 font-bold">{totalPoints}</span>
            </div>

            {/* Leaderboard */}
            <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
              <h2 className="text-xl font-bold mb-4">🏆 Final Leaderboard</h2>
              <div className="space-y-2">
                {finalScores.slice(0, 10).map((score, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded ${
                      score.player_id === playerState.player_id
                        ? 'bg-yellow-900/50 border-2 border-yellow-600'
                        : 'bg-gray-800/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl w-8">
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                        </span>
                        <span className={`text-lg ${score.player_id === playerState.player_id ? 'font-bold' : ''}`}>
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

            <Link
              href="/party"
              className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-lg"
            >
              Back to Party Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
