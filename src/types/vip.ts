// VIP Pass Types for Influencer Marketing

export interface VIPPass {
  id: string;
  code: string;
  created_at: string;
  expires_at: string;

  // Recipient info
  recipient_name: string | null;
  recipient_platform: 'instagram' | 'email' | 'twitter' | 'tiktok' | 'other' | null;
  notes: string | null;

  // Oracle entitlement
  oracle_used: boolean;
  oracle_used_at: string | null;
  oracle_prophecy_id: string | null;

  // Solo game entitlement
  solo_used: boolean;
  solo_used_at: string | null;
  solo_game_id: string | null;

  // Hosted game entitlement
  hosted_used: boolean;
  hosted_used_at: string | null;
  hosted_party_pass_id: string | null;

  // Status
  status: 'active' | 'expired' | 'revoked';
}

export interface VIPPassCreate {
  code: string;
  recipient_name?: string;
  recipient_platform?: VIPPass['recipient_platform'];
  notes?: string;
  expires_in_days?: number; // Default 30
}

export interface VIPPassUsage {
  oracle: { used: boolean; usedAt: string | null };
  solo: { used: boolean; usedAt: string | null };
  hosted: { used: boolean; usedAt: string | null };
  remaining: number; // 0-3
  total: number; // Always 3
}

export interface VIPValidationResult {
  valid: boolean;
  pass: VIPPass | null;
  usage: VIPPassUsage | null;
  error?: string;
}

// Message template types
export type MessageTemplateType = 'instagram_local' | 'instagram_creator' | 'email_pitch' | 'cny_followup' | 'followup' | 'custom';

export interface MessageTemplate {
  id: MessageTemplateType;
  name: string;
  description: string;
  subject?: string; // For email
  body: string;
  platform: 'instagram' | 'email' | 'twitter' | 'universal';
}

// Helper functions
export function getVIPUsage(pass: VIPPass): VIPPassUsage {
  const oracle = { used: pass.oracle_used, usedAt: pass.oracle_used_at };
  const solo = { used: pass.solo_used, usedAt: pass.solo_used_at };
  const hosted = { used: pass.hosted_used, usedAt: pass.hosted_used_at };

  const usedCount = [oracle.used, solo.used, hosted.used].filter(Boolean).length;

  return {
    oracle,
    solo,
    hosted,
    remaining: 3 - usedCount,
    total: 3,
  };
}

export function isVIPExpired(pass: VIPPass): boolean {
  return new Date(pass.expires_at) < new Date() || pass.status !== 'active';
}

export function formatVIPExpiry(pass: VIPPass): string {
  const expiresAt = new Date(pass.expires_at);
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Expires today';
  if (diffDays === 1) return 'Expires tomorrow';
  return `Expires in ${diffDays} days`;
}
