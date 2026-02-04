import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generatePartyCode } from '@/types/party';
import { VIPPass } from '@/types/vip';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'VIP code is required' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Validate VIP pass
    const { data: pass, error: passError } = await supabase
      .from('vip_passes')
      .select('*')
      .eq('code', cleanCode)
      .single();

    if (passError || !pass) {
      return NextResponse.json({ error: 'Invalid VIP code' }, { status: 400 });
    }

    const vipPass = pass as VIPPass;

    // Check expiration
    if (new Date(vipPass.expires_at) < new Date()) {
      return NextResponse.json({ error: 'VIP code has expired' }, { status: 400 });
    }

    // Check if hosted already used
    if (vipPass.hosted_used) {
      return NextResponse.json({ error: 'Hosted game already used on this VIP pass' }, { status: 400 });
    }

    // Check status
    if (vipPass.status !== 'active') {
      return NextResponse.json({ error: 'VIP code is not active' }, { status: 400 });
    }

    // Generate unique party code
    let partyCode = generatePartyCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('party_passes')
        .select('id')
        .eq('party_code', partyCode)
        .single();

      if (!existing) break;
      partyCode = generatePartyCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: 'Failed to generate party code' }, { status: 500 });
    }

    // Calculate expiration (48 hours for VIP hosted - like weekend pass)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Generate question sets (1 game for VIP)
    const questionSets = generateQuestionSet(1, 20);

    // Create party pass for hosted game
    const { data: partyPass, error: insertError } = await supabase
      .from('party_passes')
      .insert({
        stripe_session_id: `vip_${vipPass.id}_hosted`,
        stripe_payment_intent: null,
        host_email: `vip_${cleanCode}@redhorseoracle.com`,
        party_code: partyCode,
        pass_type: 'weekend', // Give weekend-level access for hosted
        expires_at: expiresAt.toISOString(),
        games_remaining: 1,
        games_total: 1,
        games_played: 0,
        question_sets: questionSets,
        settings: {
          timer_seconds: 30,
          questions_per_game: 20,
        },
        is_active: true,
        is_solo: false,
      })
      .select()
      .single();

    if (insertError || !partyPass) {
      console.error('Failed to create VIP hosted pass:', insertError);
      return NextResponse.json({ error: 'Failed to create hosted game' }, { status: 500 });
    }

    // Create initial game in lobby state
    const { error: gameError } = await supabase
      .from('party_games')
      .insert({
        party_pass_id: partyPass.id,
        timer_seconds: 30,
        questions_per_game: 20,
        question_ids: questionSets[0],
        game_number: 1,
        status: 'lobby',
      });

    if (gameError) {
      console.error('Failed to create initial game:', gameError);
    }

    // Mark VIP hosted as used
    await supabase
      .from('vip_passes')
      .update({
        hosted_used: true,
        hosted_used_at: new Date().toISOString(),
        hosted_party_pass_id: partyPass.id,
      })
      .eq('id', vipPass.id);

    console.log(`VIP hosted game created: ${partyCode} for VIP pass ${cleanCode}`);

    return NextResponse.json({
      success: true,
      party_code: partyCode,
      pass_id: partyPass.id,
      redirect: `/party/host/${partyCode}`,
    });
  } catch (error) {
    console.error('VIP use-hosted error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateQuestionSet(numGames: number, questionsPerGame: number = 20): number[][] {
  const totalQuestions = 400;
  const totalNeeded = numGames * questionsPerGame;

  const available = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  const allIds = available.slice(0, Math.min(totalNeeded, totalQuestions));

  const questionSets: number[][] = [];
  for (let i = 0; i < numGames; i++) {
    const start = i * questionsPerGame;
    const set = allIds.slice(start, start + questionsPerGame);
    questionSets.push(set);
  }

  return questionSets;
}
