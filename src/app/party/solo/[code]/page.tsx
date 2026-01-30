'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  ANSWER_COLORS,
  PartyPass,
  calculatePoints,
  formatTimeRemaining,
  getZodiacFromYear,
  getPassTimeRemaining,
  isPassValid,
  PASS_CONFIGS,
} from '@/types/party';
import { Confetti } from '@/components/party/Celebration';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Question {
  id: number;
  question: string;
  answer: string;
  options: string[];
  category: string;
  difficulty: string;
  explanation?: string;
}

interface GameStats {
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  bestStreak: number;
  fastestAnswerMs: number | null;
}

type GamePhase = 'setup' | 'playing' | 'showing_answer' | 'finished';
type TimerOption = 0 | 15 | 30 | 45 | 60;

export default function SoloPlayPage() {
  const params = useParams();
  const router = useRouter();
  const partyCode = (params.code as string || '').toUpperCase();

  // Pass state
  const [pass, setPass] = useState<PartyPass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Player setup
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [timerSetting, setTimerSetting] = useState<TimerOption>(30);
  const [hasJoined, setHasJoined] = useState(false);
  const [zodiacInfo, setZodiacInfo] = useState<{ sign: string; element: string } | null>(null);

  // Game state
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(30000);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

  // Stats
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPoints: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    bestStreak: 0,
    fastestAnswerMs: null,
  });

  // Celebration
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch pass on mount
  useEffect(() => {
    const fetchPass = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: passData, error: passError } = await supabase
          .from('party_passes')
          .select('*')
          .eq('party_code', partyCode)
          .single();

        if (passError || !passData) {
          setError('Invalid party code. Please check and try again.');
          return;
        }

        // Verify this is a solo pass
        if (!passData.is_solo) {
          setError('This is not a solo play pass. Please use the party play page.');
          return;
        }

        // Check if pass is still valid
        if (!isPassValid(passData)) {
          if (passData.games_remaining <= 0) {
            setError('This pass has no games remaining.');
          } else if (new Date(passData.expires_at) < new Date()) {
            setError('This pass has expired.');
          } else {
            setError('This pass is no longer active.');
          }
          return;
        }

        setPass(passData);
      } catch (err) {
        console.error('Error fetching pass:', err);
        setError('Failed to load pass. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (partyCode) {
      fetchPass();
    }
  }, [partyCode]);

  // Handle nickname and birth year submission
  const handleJoin = useCallback(() => {
    if (!nickname.trim() || !birthYear) return;

    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      alert('Please enter a valid birth year');
      return;
    }

    const zodiac = getZodiacFromYear(year);
    setZodiacInfo(zodiac);
    setHasJoined(true);
  }, [nickname, birthYear]);

  // Start a new game
  const startGame = useCallback(async () => {
    if (!pass) return;

    try {
      // Fetch fresh pass data
      const { data: freshPass, error: passError } = await supabase
        .from('party_passes')
        .select('*')
        .eq('id', pass.id)
        .single();

      if (passError || !freshPass) {
        setError('Failed to load pass');
        return;
      }

      if (freshPass.games_remaining <= 0) {
        setError('No games remaining on this pass');
        return;
      }

      // Get the next question set
      const gamesPlayed = freshPass.games_played || 0;
      const questionSets = freshPass.question_sets;
      const gameNumber = gamesPlayed + 1;

      let questionIds: number[];
      if (questionSets && Array.isArray(questionSets) && questionSets.length > gamesPlayed) {
        questionIds = questionSets[gamesPlayed];
      } else {
        // Legacy fallback - generate random IDs
        questionIds = Array.from({ length: 20 }, () => Math.floor(Math.random() * 400) + 1);
      }

      // Limit to questions per game setting
      const questionsPerGame = freshPass.settings?.questions_per_game || 20;
      questionIds = questionIds.slice(0, questionsPerGame);

      // Create the game
      const { data: game, error: gameError } = await supabase
        .from('party_games')
        .insert({
          party_pass_id: pass.id,
          timer_seconds: timerSetting,
          questions_per_game: questionsPerGame,
          question_ids: questionIds,
          game_number: gameNumber,
          status: 'playing',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (gameError || !game) {
        console.error('Error creating game:', gameError);
        setError('Failed to start game');
        return;
      }

      // Update pass: increment games_played, decrement games_remaining
      await supabase
        .from('party_passes')
        .update({
          games_played: gameNumber,
          games_remaining: freshPass.games_remaining - 1,
        })
        .eq('id', pass.id);

      // Update local pass state
      setPass({
        ...freshPass,
        games_played: gameNumber,
        games_remaining: freshPass.games_remaining - 1,
      });

      setCurrentGameId(game.id);
      setCurrentQuestionIndex(0);
      setGameStats({
        totalPoints: 0,
        correctAnswers: 0,
        totalQuestions: questionsPerGame,
        bestStreak: 0,
        fastestAnswerMs: null,
      });
      setCurrentStreak(0);

      // Load first question
      await loadQuestion(questionIds[0]);
      setGamePhase('playing');
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start game');
    }
  }, [pass, timerSetting]);

  // Load a question by ID
  const loadQuestion = async (questionId: number) => {
    try {
      const { data: question, error } = await supabase
        .from('party_questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (error || !question) {
        console.error('Error loading question:', error);
        return;
      }

      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setPointsEarned(0);
      setTimeRemaining(timerSetting * 1000);
      setQuestionStartTime(Date.now());
    } catch (err) {
      console.error('Error loading question:', err);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (gamePhase !== 'playing' || !questionStartTime || timerSetting === 0) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      const remaining = Math.max(0, timerSetting * 1000 - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0 && !selectedAnswer) {
        // Time's up - auto-submit with no answer
        handleTimeUp();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gamePhase, questionStartTime, timerSetting, selectedAnswer]);

  // Handle time running out
  const handleTimeUp = useCallback(() => {
    if (selectedAnswer) return; // Already answered

    setSelectedAnswer('__TIMEOUT__');
    setIsCorrect(false);
    setCurrentStreak(0);
    setGamePhase('showing_answer');

    // Record the timeout
    if (currentGameId && currentQuestion && zodiacInfo) {
      recordAnswer('__TIMEOUT__', false, 0, 0, 0, 0, timerSetting * 1000);
    }
  }, [selectedAnswer, currentGameId, currentQuestion, zodiacInfo, timerSetting]);

  // Record answer to database
  const recordAnswer = async (
    answerGiven: string,
    correct: boolean,
    basePoints: number,
    speedBonus: number,
    streakBonus: number,
    totalPoints: number,
    answerTimeMs: number
  ) => {
    if (!currentGameId || !currentQuestion) return;

    try {
      await supabase.from('party_answers').insert({
        party_game_id: currentGameId,
        player_id: 'solo', // Special player ID for solo play
        question_index: currentQuestionIndex,
        question_id: currentQuestion.id,
        answer_given: answerGiven,
        is_correct: correct,
        answer_time_ms: answerTimeMs,
        base_points: basePoints,
        speed_bonus: speedBonus,
        streak_bonus: streakBonus,
        total_points: totalPoints,
        current_streak: correct ? currentStreak + 1 : 0,
      });
    } catch (err) {
      console.error('Error recording answer:', err);
    }
  };

  // Handle answer selection
  const handleAnswer = useCallback(async (answer: string) => {
    if (selectedAnswer || !currentQuestion || !questionStartTime) return;

    const answerTimeMs = Date.now() - questionStartTime;
    setSelectedAnswer(answer);

    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      const newStreak = currentStreak + 1;
      const points = calculatePoints(true, answerTimeMs, timerSetting, currentStreak);

      setPointsEarned(points.total);
      setCurrentStreak(newStreak);

      setGameStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + points.total,
        correctAnswers: prev.correctAnswers + 1,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        fastestAnswerMs: prev.fastestAnswerMs === null
          ? answerTimeMs
          : Math.min(prev.fastestAnswerMs, answerTimeMs),
      }));

      recordAnswer(answer, true, points.base, points.speed, points.streak, points.total, answerTimeMs);
    } else {
      setCurrentStreak(0);
      recordAnswer(answer, false, 0, 0, 0, 0, answerTimeMs);
    }

    setGamePhase('showing_answer');
  }, [selectedAnswer, currentQuestion, questionStartTime, currentStreak, timerSetting]);

  // Move to next question or end game
  const nextQuestion = useCallback(async () => {
    if (!pass || !currentGameId) return;

    // Get the game to check question_ids
    const { data: game } = await supabase
      .from('party_games')
      .select('question_ids, questions_per_game')
      .eq('id', currentGameId)
      .single();

    if (!game) return;

    const nextIndex = currentQuestionIndex + 1;
    const totalQuestions = game.questions_per_game || game.question_ids.length;

    if (nextIndex >= totalQuestions) {
      // Game finished
      await finishGame();
    } else {
      // Load next question
      setCurrentQuestionIndex(nextIndex);
      await loadQuestion(game.question_ids[nextIndex]);
      setGamePhase('playing');
    }
  }, [pass, currentGameId, currentQuestionIndex]);

  // Finish the game
  const finishGame = async () => {
    if (!currentGameId) return;

    try {
      // Update game status
      await supabase
        .from('party_games')
        .update({
          status: 'finished',
          ended_at: new Date().toISOString(),
        })
        .eq('id', currentGameId);

      // Save score
      await supabase.from('party_scores').insert({
        party_game_id: currentGameId,
        player_id: 'solo',
        nickname: nickname,
        zodiac_sign: zodiacInfo?.sign,
        zodiac_element: zodiacInfo?.element,
        total_points: gameStats.totalPoints,
        correct_answers: gameStats.correctAnswers,
        total_questions: gameStats.totalQuestions,
        accuracy_percent: Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100),
        best_streak: gameStats.bestStreak,
        fastest_answer_ms: gameStats.fastestAnswerMs,
        rank: 1, // Solo play is always rank 1
      });

      setGamePhase('finished');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    } catch (err) {
      console.error('Error finishing game:', err);
    }
  };

  // Play another game
  const playAgain = () => {
    setGamePhase('setup');
    setCurrentGameId(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentStreak(0);
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🐴</div>
          <p className="text-xl">Loading Solo Play...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold mb-4 text-red-400">{error}</h1>
          <Link
            href="/party"
            className="inline-block bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold"
          >
            Back to Party Home
          </Link>
        </div>
      </main>
    );
  }

  // Render based on game phase
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
      <div className="relative z-10 max-w-lg mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-3 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-300">Solo Play</span>
              <div className="font-mono font-bold text-purple-300">{partyCode}</div>
            </div>
            {pass && (
              <div className="text-right">
                <div className="text-sm text-gray-300">Games Left</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {pass.games_remaining}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SETUP PHASE */}
        {gamePhase === 'setup' && !hasJoined && (
          <div className="bg-gray-900/80 rounded-2xl p-6 border border-purple-500/30">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎯</div>
              <h1 className="text-2xl font-bold text-purple-300">Solo Play</h1>
              <p className="text-gray-400 mt-1">Fire Horse Trivia - Test Your Knowledge!</p>
            </div>

            {/* Pass Info */}
            {pass && (
              <div className="bg-purple-900/30 rounded-xl p-4 mb-6 border border-purple-500/30">
                <div className="text-sm text-gray-400 mb-1">Your Pass</div>
                <div className="font-bold text-lg">{PASS_CONFIGS.solo.name}</div>
                <div className="flex gap-4 text-sm text-gray-300 mt-2">
                  <span>✓ {pass.games_remaining} games left</span>
                  <span>✓ {(() => {
                    const time = getPassTimeRemaining(pass);
                    return time.expired ? 'Expired' : `${time.hours}h ${time.minutes}m left`;
                  })()}</span>
                </div>
              </div>
            )}

            {/* Player Setup */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Your Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter a nickname"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-xl focus:border-purple-400 focus:outline-none text-lg"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Birth Year (for zodiac)
                </label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="e.g., 1990"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-xl focus:border-purple-400 focus:outline-none text-lg"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!nickname.trim() || !birthYear}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                  nickname.trim() && birthYear
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* SETUP PHASE - After joining, choose timer */}
        {gamePhase === 'setup' && hasJoined && (
          <div className="bg-gray-900/80 rounded-2xl p-6 border border-purple-500/30">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">
                {zodiacInfo?.element === 'Fire' && zodiacInfo?.sign === 'Horse' ? '🔥🐴' : '🐴'}
              </div>
              <h1 className="text-2xl font-bold">Welcome, {nickname}!</h1>
              <p className="text-lg text-yellow-400 mt-1">
                {zodiacInfo?.element} {zodiacInfo?.sign}
              </p>
            </div>

            {/* Timer Selection */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-3 text-center">
                Choose Timer Mode
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {([15, 30, 45] as TimerOption[]).map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => setTimerSetting(seconds)}
                    className={`p-3 rounded-xl font-bold transition-all ${
                      timerSetting === seconds
                        ? 'bg-purple-600 ring-2 ring-purple-400'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTimerSetting(60)}
                  className={`p-3 rounded-xl font-bold transition-all ${
                    timerSetting === 60
                      ? 'bg-purple-600 ring-2 ring-purple-400'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  60s (Relaxed)
                </button>
                <button
                  onClick={() => setTimerSetting(0)}
                  className={`p-3 rounded-xl font-bold transition-all ${
                    timerSetting === 0
                      ? 'bg-blue-600 ring-2 ring-blue-400'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  📋 Manual
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                {timerSetting === 0
                  ? 'No timer - advance questions manually'
                  : `${timerSetting} seconds per question`}
              </p>
            </div>

            {/* Start Game Button */}
            <button
              onClick={startGame}
              disabled={!pass || pass.games_remaining <= 0}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                pass && pass.games_remaining > 0
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/30'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              🎮 START GAME
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              20 questions • {timerSetting === 0 ? 'Manual mode' : `${timerSetting}s timer`}
            </p>
          </div>
        )}

        {/* PLAYING PHASE */}
        {gamePhase === 'playing' && currentQuestion && (
          <div>
            {/* Score Bar */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-3 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Score</div>
                  <div className="text-2xl font-bold text-yellow-400">{gameStats.totalPoints}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Q{currentQuestionIndex + 1}/{gameStats.totalQuestions}</div>
                  {currentStreak >= 3 && (
                    <div className="text-yellow-400 font-bold">🔥 {currentStreak} streak!</div>
                  )}
                </div>
                <div className="text-right">
                  {timerSetting === 0 ? (
                    <div className="text-2xl font-bold text-blue-400">📋</div>
                  ) : (
                    <div className={`text-3xl font-bold font-mono ${
                      timeRemaining < 5000 ? 'text-red-500 animate-pulse' : 'text-yellow-400'
                    }`}>
                      {formatTimeRemaining(timeRemaining)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timer Bar */}
            {timerSetting > 0 && (
              <div className="h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${
                    timeRemaining < 5000 ? 'bg-red-500' : 'bg-purple-500'
                  }`}
                  style={{
                    width: `${(timeRemaining / (timerSetting * 1000)) * 100}%`,
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

            {/* Question */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 mb-4 border border-gray-700">
              <div className="text-xl font-bold text-center leading-relaxed">
                {currentQuestion.question}
              </div>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => {
                const color = ANSWER_COLORS[index];
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer || (timerSetting > 0 && timeRemaining === 0)}
                    className="p-4 rounded-xl font-bold text-base transition-all min-h-[80px] hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: color.bg,
                      color: color.text,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SHOWING ANSWER PHASE */}
        {gamePhase === 'showing_answer' && currentQuestion && (
          <div>
            {/* Question Recap */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 mb-4 border border-gray-700">
              <div className="text-lg font-bold text-center mb-2">
                {currentQuestion.question}
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-400">
                  Q{currentQuestionIndex + 1} of {gameStats.totalQuestions}
                </span>
              </div>
            </div>

            {/* Answer Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {currentQuestion.options.map((option, index) => {
                const color = ANSWER_COLORS[index];
                const isCorrectAnswer = currentQuestion.answer === option;
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

            {/* Result Box */}
            <div className={`p-4 rounded-xl text-center mb-4 ${
              isCorrect
                ? 'bg-green-900/50 border-2 border-green-500'
                : 'bg-red-900/50 border-2 border-red-500'
            }`}>
              {isCorrect ? (
                <>
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-3xl font-bold text-green-400">
                    +{pointsEarned} points!
                  </div>
                  {currentStreak >= 3 && (
                    <div className="text-xl text-yellow-400 mt-1">
                      🔥 {currentStreak} streak!
                    </div>
                  )}
                </>
              ) : selectedAnswer === '__TIMEOUT__' ? (
                <>
                  <div className="text-4xl mb-2">⏰</div>
                  <div className="text-2xl font-bold text-red-400">Time&apos;s Up!</div>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">❌</div>
                  <div className="text-2xl font-bold text-red-400">Wrong!</div>
                </>
              )}
            </div>

            {/* Correct Answer + Explanation */}
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 mb-4 border border-green-500">
              <div className="text-center">
                <div className="text-sm text-green-300 font-bold mb-1">✅ CORRECT ANSWER</div>
                <div className="text-xl font-bold text-white">
                  {currentQuestion.answer}
                </div>
                {currentQuestion.explanation && (
                  <div className="bg-black/30 rounded-lg p-3 mt-3">
                    <div className="text-sm text-gray-300">
                      💡 {currentQuestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Score Summary */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Total Score</div>
                  <div className="text-3xl font-bold text-yellow-400">{gameStats.totalPoints}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Correct</div>
                  <div className="text-xl font-bold">
                    {gameStats.correctAnswers}/{currentQuestionIndex + 1}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextQuestion}
              className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              {currentQuestionIndex + 1 >= gameStats.totalQuestions
                ? '🏆 See Results'
                : 'Next Question →'}
            </button>
          </div>
        )}

        {/* FINISHED PHASE */}
        {gamePhase === 'finished' && (
          <div className="text-center relative">
            {showCelebration && <Confetti count={80} />}

            {/* Victory Header */}
            <div className="mb-6">
              <div className="text-7xl mb-2 animate-bounce">🏆</div>
              <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400">
                Game Complete!
              </h1>
            </div>

            {/* Final Score */}
            <div className="bg-gradient-to-r from-yellow-900/50 to-red-900/50 rounded-xl p-6 mb-6 border-2 border-yellow-500">
              <div className="text-sm text-gray-400 mb-1">Final Score</div>
              <div className="text-6xl font-bold text-yellow-400">
                {gameStats.totalPoints}
              </div>
              <div className="text-lg text-gray-300 mt-2">
                {gameStats.correctAnswers}/{gameStats.totalQuestions} correct (
                {Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100)}%)
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-yellow-400">{gameStats.bestStreak}</div>
                <div className="text-sm text-gray-400">Best Streak</div>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                <div className="text-3xl mb-1">⚡</div>
                <div className="text-2xl font-bold text-blue-400">
                  {gameStats.fastestAnswerMs
                    ? `${(gameStats.fastestAnswerMs / 1000).toFixed(1)}s`
                    : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">Fastest Answer</div>
              </div>
            </div>

            {/* Zodiac Sign */}
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-4 mb-6 border border-purple-500/30">
              <p className="text-lg text-purple-300">
                Great job, {nickname}! 🐴
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {zodiacInfo?.element} {zodiacInfo?.sign} • May the Fire Horse bring you fortune!
              </p>
            </div>

            {/* Games Remaining */}
            {pass && pass.games_remaining > 0 && (
              <div className="bg-green-900/30 rounded-xl p-4 mb-6 border border-green-500/30">
                <p className="text-green-300">
                  🎮 You have {pass.games_remaining} game{pass.games_remaining !== 1 ? 's' : ''} remaining!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {pass && pass.games_remaining > 0 && (
                <button
                  onClick={playAgain}
                  className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                >
                  🎮 Play Again
                </button>
              )}

              <Link
                href="/party"
                className="block w-full py-4 rounded-xl font-bold text-lg bg-gray-700 hover:bg-gray-600 text-center"
              >
                Back to Party Home
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-8 pb-4">
          <Link href="/" className="hover:underline">Red Horse Oracle</Link>
          {' • '}
          Fire Horse Trivia 2026
        </div>
      </div>
    </main>
  );
}
