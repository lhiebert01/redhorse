import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Email notification recipient
const NOTIFICATION_EMAIL = 'lindsay.hiebert@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, platform, handle, followerCount, message, sourcePage } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store in database
    const { data: application, error: insertError } = await supabase
      .from('influencer_applications')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        platform: platform || null,
        handle: handle?.trim() || null,
        follower_count: followerCount || null,
        message: message.trim(),
        source_page: sourcePage || 'unknown',
        status: 'new',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing influencer application:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    console.log(`[INFLUENCER] New application from ${name} (${email}) - Platform: ${platform || 'not specified'}`);

    // Try to send email notification (optional - requires RESEND_API_KEY)
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmailNotification({
          name,
          email,
          platform,
          handle,
          followerCount,
          message,
          applicationId: application.id,
        });
        console.log(`[INFLUENCER] Email notification sent to ${NOTIFICATION_EMAIL}`);
      } catch (emailError) {
        console.error('[INFLUENCER] Failed to send email notification:', emailError);
        // Don't fail the request if email fails - application is already stored
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! We\'ll be in touch soon.',
      applicationId: application.id,
    });
  } catch (error) {
    console.error('Influencer application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional email notification using Resend
async function sendEmailNotification(data: {
  name: string;
  email: string;
  platform?: string;
  handle?: string;
  followerCount?: string;
  message: string;
  applicationId: string;
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Red Horse Oracle <notifications@redhorseoracle.com>',
      to: NOTIFICATION_EMAIL,
      subject: `🌟 New Influencer Application: ${data.name}`,
      html: `
        <h2>New Influencer/Partner Application</h2>
        <p><strong>From:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.platform ? `<p><strong>Platform:</strong> ${data.platform}</p>` : ''}
        ${data.handle ? `<p><strong>Handle:</strong> ${data.handle}</p>` : ''}
        ${data.followerCount ? `<p><strong>Followers:</strong> ${data.followerCount}</p>` : ''}
        <hr>
        <h3>Their Message:</h3>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px;">${data.message}</p>
        <hr>
        <p><small>Application ID: ${data.applicationId}</small></p>
        <p><small>View all applications at: <a href="https://redhorseoracle.com/superadmin/influencers">SuperAdmin Dashboard</a></small></p>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend API error: ${response.status}`);
  }
}
