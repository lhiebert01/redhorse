'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { PARTY_QUESTIONS } from '@/constants/party-questions';
import {
  PartyPass,
  PartyGame,
  PartyPlayer,
  GameStatus,
  getPassTimeRemaining,
  ANSWER_COLORS,
} from '@/types/party';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  category: string;
  difficulty: string;
  explanation?: string;
}

interface AnswerStats {
  total: number;
  correct: number;
  distribution: Record<string, number>;
}

export default function HostConsolePage() {
  const params = useParams();
  const partyCode = (params.code as string || '').toUpperCase();
  const router = useRouter();

  // Pass & Game state
  const [pass, setPass] = useState<PartyPass | null>(null);
  const [game, setGame] = useState<PartyGame | null>(null);
  const [players, setPlayers] = useState<PartyPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Question state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answerStats, setAnswerStats] = useState<AnswerStats | null>(null);
  const [showingAnswer, setShowingAnswer] = useState(false);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Timer configuration (0 = manual/no timer)
  const [selectedTimer, setSelectedTimer] = useState(30);
  const TIMER_OPTIONS = [
    { value: 30, label: '30 sec' },
    { value: 60, label: '60 sec' },
    { value: 90, label: '90 sec' },
    { value: 120, label: '2 min' },
    { value: 0, label: 'Manual' },
  ];

  // Countdown before game
  const [countdown, setCountdown] = useState<number | null>(null);

  // Leaderboard state (updated after each question)
  interface LeaderboardEntry {
    player_id: string;
    nickname: string;
    total_points: number;
    zodiac_sign?: string;
    zodiac_element?: string;
    rank: number;
  }
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load party pass and game data
  useEffect(() => {
    async function loadData() {
      try {
        // Get party pass
        const { data: passData, error: passError } = await supabase
          .from('party_passes')
          .select('*')
          .eq('party_code', partyCode)
          .single();

        if (passError || !passData) {
          setError('Party not found');
          setLoading(false);
          return;
        }

        setPass(passData);

        // Get or create game
        let { data: gameData } = await supabase
          .from('party_games')
          .select('*')
          .eq('party_pass_id', passData.id)
          .in('status', ['lobby', 'playing', 'showing_answer'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (gameData) {
          setGame(gameData);

          // Load current question if game is in progress
          if (gameData.status === 'playing' || gameData.status === 'showing_answer') {
            const questionId = gameData.question_ids[gameData.current_question_index];
            const question = PARTY_QUESTIONS.find((q) => q.id === questionId);
            if (question) {
              setCurrentQuestion(question as Question);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load party data');
        setLoading(false);
      }
    }

    loadData();
  }, [partyCode]);

  // Subscribe to player presence
  useEffect(() => {
    if (!game?.id) return;

    const channel = supabase.channel(`party:${partyCode}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const playerList = Object.values(state).flat() as unknown as PartyPlayer[];
        setPlayers(playerList);
      })
      .on('broadcast', { event: 'player_answered' }, (payload) => {
        // Update answer count
        const data = payload.payload as { answers_received: number };
        setAnswerStats((prev) => prev ? { ...prev, total: data.answers_received } : null);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.id, partyCode]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          handleQuestionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Start game countdown
  const startGame = useCallback(async () => {
    if (!game || !pass) return;

    // Start 3-2-1 countdown
    setCountdown(3);

    const channel = supabase.channel(`party:${partyCode}`);
    await channel.send({
      type: 'broadcast',
      event: 'game_start',
      payload: {
        total_questions: game.questions_per_game,
        timer_seconds: game.timer_seconds,
      },
    });

    // Countdown animation
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);

    // Start first question
    showNextQuestion(0);
  }, [game, pass, partyCode]);

  // Show next question
  const showNextQuestion = useCallback(
    async (questionIndex: number) => {
      if (!game) return;

      const questionId = game.question_ids[questionIndex];
      const question = PARTY_QUESTIONS.find((q) => q.id === questionId);

      if (!question) {
        console.error('Question not found:', questionId);
        return;
      }

      setCurrentQuestion(question as Question);
      setShowingAnswer(false);
      setAnswerStats({ total: 0, correct: 0, distribution: {} });

      // Use selectedTimer; if manual (0), don't start timer
      const timerSeconds = selectedTimer || 9999; // Large number for manual mode display
      setTimeRemaining(timerSeconds);
      setTimerActive(selectedTimer > 0); // Only activate timer if not manual

      // Update game in database
      await supabase
        .from('party_games')
        .update({
          current_question_index: questionIndex,
          status: 'playing',
          started_at: game.started_at || new Date().toISOString(),
          timer_seconds: selectedTimer || 30, // Store selected timer
        })
        .eq('id', game.id);

      setGame((prev) =>
        prev ? { ...prev, current_question_index: questionIndex, status: 'playing', timer_seconds: selectedTimer || 30 } : null
      );

      // Broadcast question to players
      const channel = supabase.channel(`party:${partyCode}`);
      await channel.send({
        type: 'broadcast',
        event: 'next_question',
        payload: {
          question_index: questionIndex,
          question: {
            id: question.id,
            question: question.question,
            options: question.options,
            category: question.category,
            difficulty: question.difficulty,
          },
          timer_seconds: selectedTimer, // 0 = manual mode for players
        },
      });
    },
    [game, partyCode, selectedTimer]
  );

  // Handle question end (timer expired) - just stops accepting answers
  const handleQuestionEnd = useCallback(async () => {
    if (!game || !currentQuestion) return;

    setTimerActive(false);

    // Update game status
    await supabase
      .from('party_games')
      .update({ status: 'showing_answer' })
      .eq('id', game.id);

    setGame((prev) => (prev ? { ...prev, status: 'showing_answer' } : null));

    // Broadcast question end
    const channel = supabase.channel(`party:${partyCode}`);
    await channel.send({
      type: 'broadcast',
      event: 'question_end',
      payload: { question_index: game.current_question_index },
    });
  }, [game, currentQuestion, partyCode]);

  // Handle manual mode: end question AND immediately show answer
  const handleEndAndShowAnswer = useCallback(async () => {
    if (!game || !currentQuestion) return;

    setTimerActive(false);

    // Update game status
    await supabase
      .from('party_games')
      .update({ status: 'showing_answer' })
      .eq('id', game.id);

    setGame((prev) => (prev ? { ...prev, status: 'showing_answer' } : null));

    // Broadcast question end
    const channel = supabase.channel(`party:${partyCode}`);
    await channel.send({
      type: 'broadcast',
      event: 'question_end',
      payload: { question_index: game.current_question_index },
    });

    // Small delay to ensure question_end is processed
    await new Promise((r) => setTimeout(r, 100));

    // Now show the answer
    setShowingAnswer(true);

    // Get answer stats for this question
    const { data: questionAnswers } = await supabase
      .from('party_answers')
      .select('*')
      .eq('party_game_id', game.id)
      .eq('question_index', game.current_question_index);

    let distribution: Record<string, number> = {};
    let correctCount = 0;

    if (questionAnswers) {
      questionAnswers.forEach((ans) => {
        distribution[ans.answer_given] = (distribution[ans.answer_given] || 0) + 1;
        if (ans.is_correct) correctCount++;
      });

      setAnswerStats({
        total: questionAnswers.length,
        correct: correctCount,
        distribution,
      });
    }

    // Calculate leaderboard from ALL answers so far
    const { data: allAnswers } = await supabase
      .from('party_answers')
      .select('player_id, total_points')
      .eq('party_game_id', game.id);

    const { data: gamePlayers } = await supabase
      .from('party_players')
      .select('id, nickname, zodiac_sign, zodiac_element')
      .eq('party_game_id', game.id);

    let leaderboardData: LeaderboardEntry[] = [];

    if (allAnswers && gamePlayers) {
      const pointsMap = new Map<string, number>();
      allAnswers.forEach((ans) => {
        pointsMap.set(ans.player_id, (pointsMap.get(ans.player_id) || 0) + ans.total_points);
      });

      leaderboardData = gamePlayers
        .map((p) => ({
          player_id: p.id,
          nickname: p.nickname,
          total_points: pointsMap.get(p.id) || 0,
          zodiac_sign: p.zodiac_sign || undefined,
          zodiac_element: p.zodiac_element || undefined,
          rank: 0,
        }))
        .sort((a, b) => b.total_points - a.total_points);

      leaderboardData.forEach((entry, i) => {
        entry.rank = i + 1;
      });

      setLeaderboard(leaderboardData);
    }

    // Broadcast answer reveal WITH leaderboard
    await channel.send({
      type: 'broadcast',
      event: 'show_answer',
      payload: {
        question_index: game.current_question_index,
        correct_answer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        stats: {
          total: questionAnswers?.length || 0,
          correct: correctCount,
          distribution,
        },
        leaderboard: leaderboardData,
      },
    });
  }, [game, currentQuestion, partyCode]);

  // Show answer reveal
  const showAnswer = useCallback(async () => {
    if (!game || !currentQuestion) return;

    setShowingAnswer(true);

    // Get answer stats for this question
    const { data: questionAnswers } = await supabase
      .from('party_answers')
      .select('*')
      .eq('party_game_id', game.id)
      .eq('question_index', game.current_question_index);

    let distribution: Record<string, number> = {};
    let correctCount = 0;

    if (questionAnswers) {
      questionAnswers.forEach((ans) => {
        distribution[ans.answer_given] = (distribution[ans.answer_given] || 0) + 1;
        if (ans.is_correct) correctCount++;
      });

      setAnswerStats({
        total: questionAnswers.length,
        correct: correctCount,
        distribution,
      });
    }

    // Calculate leaderboard from ALL answers so far
    const { data: allAnswers } = await supabase
      .from('party_answers')
      .select('player_id, total_points')
      .eq('party_game_id', game.id);

    const { data: gamePlayers } = await supabase
      .from('party_players')
      .select('id, nickname, zodiac_sign, zodiac_element')
      .eq('party_game_id', game.id);

    let leaderboardData: LeaderboardEntry[] = [];

    if (allAnswers && gamePlayers) {
      // Sum up points per player
      const pointsMap = new Map<string, number>();
      allAnswers.forEach((ans) => {
        pointsMap.set(ans.player_id, (pointsMap.get(ans.player_id) || 0) + ans.total_points);
      });

      // Build leaderboard with zodiac info
      leaderboardData = gamePlayers
        .map((p) => ({
          player_id: p.id,
          nickname: p.nickname,
          total_points: pointsMap.get(p.id) || 0,
          zodiac_sign: p.zodiac_sign || undefined,
          zodiac_element: p.zodiac_element || undefined,
          rank: 0,
        }))
        .sort((a, b) => b.total_points - a.total_points);

      // Assign ranks
      leaderboardData.forEach((entry, i) => {
        entry.rank = i + 1;
      });

      // Update the leaderboard state
      setLeaderboard(leaderboardData);
    }

    // Broadcast answer reveal WITH leaderboard
    const channel = supabase.channel(`party:${partyCode}`);
    await channel.send({
      type: 'broadcast',
      event: 'show_answer',
      payload: {
        question_index: game.current_question_index,
        correct_answer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        stats: {
          total: questionAnswers?.length || 0,
          correct: correctCount,
          distribution,
        },
        leaderboard: leaderboardData,
      },
    });
  }, [game, currentQuestion, partyCode]);

  // Move to next question or end game
  const nextQuestion = useCallback(async () => {
    if (!game) return;

    const nextIndex = game.current_question_index + 1;

    if (nextIndex >= game.questions_per_game) {
      // Game over
      await endGame();
    } else {
      showNextQuestion(nextIndex);
    }
  }, [game, showNextQuestion]);

  // End the game
  const endGame = useCallback(async () => {
    if (!game) return;

    // Calculate final scores
    const { data: answers } = await supabase
      .from('party_answers')
      .select('player_id, total_points, is_correct, current_streak')
      .eq('party_game_id', game.id);

    const { data: gamePlayers } = await supabase
      .from('party_players')
      .select('*')
      .eq('party_game_id', game.id);

    if (answers && gamePlayers) {
      // Aggregate scores per player
      const scoreMap = new Map<
        string,
        { total: number; correct: number; streak: number }
      >();

      answers.forEach((ans) => {
        const current = scoreMap.get(ans.player_id) || {
          total: 0,
          correct: 0,
          streak: 0,
        };
        scoreMap.set(ans.player_id, {
          total: current.total + ans.total_points,
          correct: current.correct + (ans.is_correct ? 1 : 0),
          streak: Math.max(current.streak, ans.current_streak),
        });
      });

      // Create score entries with rankings
      const scores = gamePlayers
        .map((p) => {
          const stats = scoreMap.get(p.id) || { total: 0, correct: 0, streak: 0 };
          return {
            party_game_id: game.id,
            player_id: p.id,
            nickname: p.nickname,
            zodiac_sign: p.zodiac_sign,
            zodiac_element: p.zodiac_element,
            total_points: stats.total,
            correct_answers: stats.correct,
            total_questions: game.questions_per_game,
            accuracy_percent: (stats.correct / game.questions_per_game) * 100,
            best_streak: stats.streak,
            rank: 0,
          };
        })
        .sort((a, b) => b.total_points - a.total_points);

      // Assign ranks
      scores.forEach((s, i) => {
        s.rank = i + 1;
      });

      // Insert scores
      await supabase.from('party_scores').insert(scores);

      // Update game status
      await supabase
        .from('party_games')
        .update({ status: 'finished', ended_at: new Date().toISOString() })
        .eq('id', game.id);

      // Decrement games remaining
      await supabase
        .from('party_passes')
        .update({ games_remaining: (pass?.games_remaining || 1) - 1 })
        .eq('id', pass?.id);

      setGame((prev) => (prev ? { ...prev, status: 'finished' } : null));

      // Broadcast game end with zodiac info
      const channel = supabase.channel(`party:${partyCode}`);
      await channel.send({
        type: 'broadcast',
        event: 'game_end',
        payload: {
          game_id: game.id,
          scores: scores.map((s) => ({
            nickname: s.nickname,
            total_points: s.total_points,
            rank: s.rank,
            player_id: s.player_id,
            zodiac_sign: s.zodiac_sign,
            zodiac_element: s.zodiac_element,
          })),
        },
      });
    }
  }, [game, pass, partyCode]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">🐴</div>
          <p>Loading host console...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !pass) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400 mb-4">{error || 'Party not found'}</p>
          <Link
            href="/party"
            className="text-blue-400 hover:underline"
          >
            ← Back to Party Home
          </Link>
        </div>
      </main>
    );
  }

  const passTime = getPassTimeRemaining(pass);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-yellow-900 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-300">Party Code:</div>
            <div className="text-3xl font-mono font-bold tracking-widest">
              {partyCode}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">
              {pass.pass_type.charAt(0).toUpperCase() + pass.pass_type.slice(1)} Pass
            </div>
            <div className="text-sm">
              {passTime.expired ? (
                <span className="text-red-400">Expired</span>
              ) : (
                <span>{passTime.hours}h {passTime.minutes}m remaining</span>
              )}
            </div>
            <div className="text-sm text-yellow-400">
              {pass.games_remaining} games left
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* COUNTDOWN */}
        {countdown !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl font-bold text-yellow-400 animate-pulse">
                {countdown}
              </div>
              <p className="text-2xl mt-4">Get Ready!</p>
            </div>
          </div>
        )}

        {/* LOBBY */}
        {(!game || game.status === 'lobby') && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">🎮 Party Lobby</h2>

            {/* Share Code */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 mb-6 text-center">
              <p className="text-gray-400 mb-2">Share this code with your guests:</p>
              <div className="text-5xl font-mono font-bold tracking-widest mb-4">
                {partyCode}
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigator.clipboard.writeText(partyCode)}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(
                    `Join my Fire Horse Trivia party! 🔥🐴\n\nGo to: redhorseoracle.com/party\nEnter code: ${partyCode}`
                  )}
                  className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm"
                >
                  Copy Invite Message
                </button>
              </div>
            </div>

            {/* Players */}
            <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Players Connected</h3>
                <span className="text-2xl font-bold text-yellow-400">
                  {players.length}/20
                </span>
              </div>

              {players.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Waiting for players to join...
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {players.map((p, i) => (
                    <div
                      key={i}
                      className="bg-gray-800 rounded-lg p-3 text-center"
                    >
                      <div className="font-bold">
                        {(p as unknown as { nickname: string }).nickname}
                      </div>
                      {(p as unknown as { zodiac_sign?: string }).zodiac_sign && (
                        <div className="text-xs text-gray-400">
                          {(p as unknown as { zodiac_element?: string }).zodiac_element}{' '}
                          {(p as unknown as { zodiac_sign?: string }).zodiac_sign}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timer Settings */}
            <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-6 mb-6 border border-orange-600/30">
              <h3 className="text-lg font-bold mb-3 text-center">⏱️ Question Timer</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {TIMER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedTimer(option.value)}
                    className={`px-4 py-3 rounded-xl font-bold text-lg transition-all ${
                      selectedTimer === option.value
                        ? 'bg-orange-500 text-white ring-2 ring-orange-300 shadow-lg'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-center text-gray-400 text-sm mt-3">
                {selectedTimer === 0
                  ? '📋 Manual Mode: You control when to reveal answers and move to next question'
                  : `⏰ Each question will auto-end after ${selectedTimer} seconds`}
              </p>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              disabled={players.length < 1}
              className={`w-full py-6 rounded-xl font-bold text-2xl transition-all ${
                players.length >= 1
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-lg hover:shadow-green-500/30'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {players.length >= 1
                ? `START GAME (${players.length} players) →`
                : 'Waiting for players...'}
            </button>
          </div>
        )}

        {/* PLAYING / SHOWING ANSWER */}
        {game && (game.status === 'playing' || game.status === 'showing_answer') && currentQuestion && (
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Progress & Timer */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg">
                  Question <span className="font-bold">{game.current_question_index + 1}</span>
                  {' of '}
                  <span className="font-bold">{game.questions_per_game}</span>
                </div>
                <div
                  className={`text-4xl font-bold font-mono ${
                    selectedTimer === 0
                      ? 'text-blue-400'
                      : timeRemaining <= 5
                      ? 'text-red-500 animate-pulse'
                      : 'text-yellow-400'
                  }`}
                >
                  {selectedTimer === 0 ? '📋 MANUAL' : timeRemaining}
                </div>
              </div>

              {/* Timer Bar (only show if not manual) */}
              {selectedTimer > 0 && (
                <div className="h-3 bg-gray-800 rounded-full mb-6 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      timeRemaining <= 5 ? 'bg-red-500' : 'bg-yellow-400'
                    }`}
                    style={{
                      width: `${(timeRemaining / selectedTimer) * 100}%`,
                    }}
                  />
                </div>
              )}

              {/* Category Badge */}
              <div className="text-center mb-4">
                <span className="bg-gray-800 px-4 py-1 rounded-full text-sm text-gray-400">
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question */}
              <div className="text-2xl md:text-3xl font-bold text-center mb-8">
                {currentQuestion.question}
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const color = ANSWER_COLORS[index];
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const answerCount = answerStats?.distribution[option] || 0;
                  const percentage = answerStats?.total
                    ? Math.round((answerCount / answerStats.total) * 100)
                    : 0;

                  return (
                    <div
                      key={index}
                      className={`p-6 rounded-xl font-bold text-xl relative overflow-hidden ${
                        showingAnswer && isCorrect
                          ? 'ring-4 ring-green-400'
                          : ''
                      }`}
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                      }}
                    >
                      {/* Answer Percentage Bar */}
                      {showingAnswer && (
                        <div
                          className="absolute inset-0 bg-black/30"
                          style={{ width: `${percentage}%` }}
                        />
                      )}
                      <span className="relative z-10 flex justify-between items-center">
                        <span>{option}</span>
                        {showingAnswer && (
                          <span className="text-sm">
                            {answerCount} ({percentage}%)
                          </span>
                        )}
                      </span>
                      {showingAnswer && isCorrect && (
                        <span className="absolute top-2 right-2 text-2xl">✅</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Correct Answer Box */}
              {showingAnswer && (
                <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-5 mb-4 border-2 border-green-500">
                  <div className="text-center">
                    <div className="text-sm text-green-300 font-bold mb-1">✅ CORRECT ANSWER</div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {currentQuestion.correctAnswer}
                    </div>
                    {currentQuestion.explanation && (
                      <div className="bg-black/30 rounded-lg p-3 mt-3">
                        <div className="text-sm text-gray-300">
                          💡 <span className="text-yellow-300">Why?</span> {currentQuestion.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Answer Stats */}
              {showingAnswer && answerStats && (
                <div className="bg-gray-900/50 rounded-xl p-4 mb-6 text-center">
                  <div className="text-lg">
                    <span className="text-green-400 font-bold">
                      {answerStats.correct}
                    </span>
                    {' of '}
                    <span className="font-bold">{answerStats.total}</span>
                    {' players got it right '}
                    ({Math.round((answerStats.correct / Math.max(1, answerStats.total)) * 100)}%)
                  </div>
                </div>
              )}

              {/* Answers Received Counter */}
              {!showingAnswer && (
                <div className="text-center text-gray-400 mb-6">
                  {answerStats?.total || 0} of {players.length} answered
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex gap-4">
                {/* Manual mode: End Question & Show Answer in one step */}
                {!showingAnswer && selectedTimer === 0 && (
                  <button
                    onClick={handleEndAndShowAnswer}
                    className="flex-1 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg"
                  >
                    End Question & Show Answer
                  </button>
                )}

                {/* Timed mode with active timer: End Question Early */}
                {!showingAnswer && timerActive && selectedTimer > 0 && (
                  <button
                    onClick={handleQuestionEnd}
                    className="flex-1 py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-lg"
                  >
                    End Question Early
                  </button>
                )}

                {/* Timed mode after timer ends: Show Answer */}
                {!showingAnswer && !timerActive && selectedTimer > 0 && (
                  <button
                    onClick={showAnswer}
                    className="flex-1 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg"
                  >
                    Show Answer
                  </button>
                )}

                {showingAnswer && (
                  <button
                    onClick={nextQuestion}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-lg"
                  >
                    {game.current_question_index + 1 >= game.questions_per_game
                      ? 'Finish Game →'
                      : 'Next Question →'}
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar Leaderboard */}
            <div className="w-72 hidden lg:block">
              <div className="bg-gray-900/70 rounded-xl p-4 sticky top-4">
                <h3 className="text-lg font-bold mb-3 text-center text-yellow-400">🏆 Leaderboard</h3>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((entry) => (
                      <div
                        key={entry.player_id}
                        className={`p-2 rounded ${
                          entry.rank <= 3 ? 'bg-yellow-900/30' : 'bg-gray-800/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-400 w-6">
                              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `${entry.rank}.`}
                            </span>
                            <span className="truncate max-w-[100px] font-medium">{entry.nickname}</span>
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
                    // Show players waiting for first scores
                    players.map((p, i) => {
                      const player = p as unknown as { nickname: string; zodiac_sign?: string; zodiac_element?: string };
                      return (
                        <div
                          key={i}
                          className="p-2 rounded bg-gray-800/50"
                        >
                          <div className="flex justify-between items-center">
                            <span className="truncate max-w-[120px]">{player.nickname}</span>
                            <span className="text-gray-500">--</span>
                          </div>
                          {player.zodiac_sign && (
                            <div className="text-xs text-gray-400">
                              {player.zodiac_element} {player.zodiac_sign}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  {players.length === 0 && leaderboard.length === 0 && (
                    <p className="text-gray-500 text-center text-sm">No players yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FINISHED */}
        {game?.status === 'finished' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
            <p className="text-gray-400 mb-8">
              Thanks for playing Fire Horse Trivia!
            </p>

            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <Link
                href={`/party/results/${partyCode}`}
                className="py-4 bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold text-lg"
              >
                View Full Results
              </Link>

              {(pass.games_remaining || 0) > 0 && (
                <button
                  onClick={() => {
                    setGame(null);
                    setCurrentQuestion(null);
                    setAnswerStats(null);
                    setShowingAnswer(false);
                  }}
                  className="py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg"
                >
                  Play Another Game ({pass.games_remaining} left)
                </button>
              )}

              <Link
                href="/party"
                className="py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg"
              >
                Back to Party Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
