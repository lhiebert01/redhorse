import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Session IDs from the generation
const EXAMPLE_SESSIONS = [
  { sessionId: 'admin_test_d9efd643-e32f-4dc4-97d1-e10b496993a6', name: 'michael-johnson-rat-wealth' },
  { sessionId: 'admin_test_3ff62289-5db7-4cd5-958a-1aa97b6e8318', name: 'jennifer-smith-ox-power' },
  { sessionId: 'admin_test_cefcf13b-6b18-44b3-9fb1-29d4a16c079d', name: 'david-williams-tiger-love' },
  { sessionId: 'admin_test_edad3cb2-20dd-47ec-926d-a2ff4e2dd103', name: 'sarah-davis-rabbit-shield' },
  { sessionId: 'admin_test_91da361a-e284-4b91-877c-d0f2d49e7e5c', name: 'james-miller-dragon-wealth' },
  { sessionId: 'admin_test_64cece9c-22c5-48c1-ac59-9f0d707b28ba', name: 'emily-brown-snake-power' },
  { sessionId: 'admin_test_9d132c19-de5d-48fd-9881-ca347b638a28', name: 'robert-jones-horse-love' },
  { sessionId: 'admin_test_0c39d3d3-5f74-44eb-b564-d6f8144c1941', name: 'lisa-anderson-goat-shield' },
  { sessionId: 'admin_test_f7e7b3e2-9f03-47ec-9444-c8acb7275d4c', name: 'william-taylor-monkey-wealth' },
  { sessionId: 'admin_test_4dd8dbc6-67a3-4dcf-9f2b-c83c8baafe71', name: 'maria-garcia-rooster-power' },
  { sessionId: 'admin_test_bbda455f-f989-4da8-b323-6f21d2030926', name: 'christopher-lee-dog-love' },
  { sessionId: 'admin_test_dd6bb61b-24cf-4fe1-9602-8192a39bf478', name: 'jessica-martinez-pig-shield' },
];

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = [];

    for (const example of EXAMPLE_SESSIONS) {
      const { data, error } = await supabase
        .from('prophecies')
        .select('*')
        .eq('stripe_session_id', example.sessionId)
        .single();

      if (error || !data) {
        results.push({
          name: example.name,
          sessionId: example.sessionId,
          status: 'not_found',
          error: error?.message,
        });
        continue;
      }

      results.push({
        name: example.name,
        sessionId: example.sessionId,
        status: data.status,
        imageUrl: data.image_url,
        mainText: data.main_text,
        subText: data.sub_text,
        zodiacSign: data.zodiac_sign,
        zodiacElement: data.zodiac_element,
        focusMode: data.focus_mode,
        revealUrl: `https://redhorse-omega.vercel.app/reveal?session_id=${example.sessionId}`,
      });
    }

    return NextResponse.json({
      success: true,
      examples: results,
      summary: {
        total: results.length,
        completed: results.filter(r => r.status === 'completed').length,
        pending: results.filter(r => r.status === 'pending').length,
        failed: results.filter(r => r.status === 'failed' || r.status === 'not_found').length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to export examples' },
      { status: 500 }
    );
  }
}
