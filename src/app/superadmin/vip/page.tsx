'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VIPPass, getVIPUsage, formatVIPExpiry } from '@/types/vip';
import { VIP_MESSAGE_TEMPLATES, generateVIPCode, fillTemplate } from '@/constants/vip-templates';

const SUPERADMIN_PIN = '142857';
const AUTH_STORAGE_KEY = 'superadmin_authenticated';

interface VIPStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  oracle_used: number;
  solo_used: number;
  hosted_used: number;
  fully_used: number;
}

export default function VIPManagementPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // VIP Data
  const [passes, setPasses] = useState<VIPPass[]>([]);
  const [stats, setStats] = useState<VIPStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Create Pass Form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [codeStyle, setCodeStyle] = useState<'word' | 'random' | 'custom'>('word');
  const [customCode, setCustomCode] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPlatform, setRecipientPlatform] = useState<string>('instagram');
  const [notes, setNotes] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  // Message Generator
  const [showMessageGenerator, setShowMessageGenerator] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(VIP_MESSAGE_TEMPLATES[0].id);
  const [messageText, setMessageText] = useState('');
  const [copied, setCopied] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // Fetch passes when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchPasses();
    }
  }, [authenticated]);

  // Update message when template or code changes
  useEffect(() => {
    if (generatedCode) {
      const template = VIP_MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        const filled = fillTemplate(template.body, {
          code: generatedCode,
          name: recipientName || '[Name]',
          platform: recipientPlatform,
        });
        setMessageText(filled);
      }
    }
  }, [selectedTemplate, generatedCode, recipientName, recipientPlatform]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === SUPERADMIN_PIN) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthenticated(false);
    setPin('');
  };

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vip/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: SUPERADMIN_PIN }),
      });
      const data = await response.json();
      if (data.passes) {
        setPasses(data.passes);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching VIP passes:', error);
    }
    setLoading(false);
  };

  const handleCreatePass = async () => {
    const code = codeStyle === 'custom' ? customCode : generateVIPCode(codeStyle);

    if (!code || code.length < 3) {
      setCreateError('Code must be at least 3 characters');
      return;
    }

    setCreating(true);
    setCreateError('');

    try {
      const response = await fetch('/api/vip/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: SUPERADMIN_PIN,
          code,
          recipient_name: recipientName || null,
          recipient_platform: recipientPlatform || null,
          notes: notes || null,
          expires_in_days: expiresInDays,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show message generator with the new code
        setGeneratedCode(data.pass.code);
        setShowCreateForm(false);
        setShowMessageGenerator(true);
        // Reset form
        setCustomCode('');
        setRecipientName('');
        setNotes('');
        // Refresh list
        fetchPasses();
      } else {
        setCreateError(data.error || 'Failed to create pass');
      }
    } catch (error) {
      setCreateError('Failed to create pass');
    }
    setCreating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getUsageDisplay = (pass: VIPPass) => {
    const usage = getVIPUsage(pass);
    return (
      <div className="flex gap-2">
        <span className={`text-xs px-2 py-1 rounded ${pass.oracle_used ? 'bg-purple-900 text-purple-300' : 'bg-gray-800 text-gray-500'}`}>
          🔮 {pass.oracle_used ? '✓' : '○'}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${pass.solo_used ? 'bg-blue-900 text-blue-300' : 'bg-gray-800 text-gray-500'}`}>
          🎮 {pass.solo_used ? '✓' : '○'}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${pass.hosted_used ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-500'}`}>
          🎉 {pass.hosted_used ? '✓' : '○'}
        </span>
      </div>
    );
  };

  // PIN Authentication Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handlePinSubmit} className="bg-gray-900 p-8 rounded-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-fire-gold mb-6 text-center">
            🎫 VIP Pass Management
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Enter PIN to access VIP management
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg mb-4 text-center text-2xl tracking-widest"
            autoFocus
          />
          {pinError && (
            <p className="text-red-500 text-center mb-4">{pinError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-fire-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Access VIP Management
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-fire-gold mb-2">
              🎫 VIP Pass Management
            </h1>
            <p className="text-gray-400">
              Generate and track VIP passes for influencer marketing
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              + Create VIP Pass
            </button>
            <Link
              href="/superadmin/influencers"
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              🌟 Influencers
            </Link>
            <Link
              href="/superadmin"
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              📷 Image Browser
            </Link>
            <button
              onClick={fetchPasses}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-fire-gold">{stats.total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.active}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.expired}</div>
              <div className="text-xs text-gray-400">Expired</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.oracle_used}</div>
              <div className="text-xs text-gray-400">🔮 Used</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.solo_used}</div>
              <div className="text-xs text-gray-400">🎮 Used</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.hosted_used}</div>
              <div className="text-xs text-gray-400">🎉 Used</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.fully_used}</div>
              <div className="text-xs text-gray-400">3/3 Used</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-400">{stats.revoked}</div>
              <div className="text-xs text-gray-400">Revoked</div>
            </div>
          </div>
        </div>
      )}

      {/* Passes Table */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Code</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Recipient</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Platform</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Usage</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Created</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : passes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No VIP passes yet. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  passes.map((pass) => (
                    <tr key={pass.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-fire-gold font-bold">{pass.code}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {pass.recipient_name || <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {pass.recipient_platform ? (
                          <span className="capitalize">{pass.recipient_platform}</span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getUsageDisplay(pass)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          pass.status === 'active' && new Date(pass.expires_at) > new Date()
                            ? 'bg-green-900 text-green-300'
                            : pass.status === 'revoked'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {pass.status === 'active' && new Date(pass.expires_at) <= new Date()
                            ? 'Expired'
                            : pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(pass.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {formatVIPExpiry(pass)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Pass Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-fire-gold mb-6">Create VIP Pass</h2>

            <div className="space-y-4">
              {/* Code Style */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Code Style</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCodeStyle('word')}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      codeStyle === 'word' ? 'bg-fire-gold text-black' : 'bg-gray-800 text-white'
                    }`}
                  >
                    Word-based
                  </button>
                  <button
                    onClick={() => setCodeStyle('random')}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      codeStyle === 'random' ? 'bg-fire-gold text-black' : 'bg-gray-800 text-white'
                    }`}
                  >
                    Random
                  </button>
                  <button
                    onClick={() => setCodeStyle('custom')}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      codeStyle === 'custom' ? 'bg-fire-gold text-black' : 'bg-gray-800 text-white'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Custom Code Input */}
              {codeStyle === 'custom' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Custom Code</label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    placeholder="e.g., KCLOVE"
                    className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg uppercase"
                    maxLength={12}
                  />
                </div>
              )}

              {/* Preview Code */}
              {codeStyle !== 'custom' && (
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-400 mb-1">Preview Code</div>
                  <div className="font-mono text-2xl text-fire-gold">{generateVIPCode(codeStyle)}</div>
                  <div className="text-xs text-gray-500 mt-1">(new code generated on create)</div>
                </div>
              )}

              {/* Recipient Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Recipient Name (optional)</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., Emma, Tommy"
                  className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg"
                />
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <select
                  value={recipientPlatform}
                  onChange={(e) => setRecipientPlatform(e.target.value)}
                  className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg"
                >
                  <option value="instagram">Instagram</option>
                  <option value="email">Email</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="tiktok">TikTok</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Expires In */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Expires In (days)</label>
                <input
                  type="number"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 30)}
                  min={1}
                  max={365}
                  className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any internal notes..."
                  className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg resize-none"
                  rows={2}
                />
              </div>

              {/* Error */}
              {createError && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                  {createError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePass}
                  disabled={creating || (codeStyle === 'custom' && !customCode)}
                  className="flex-1 px-4 py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Pass'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Generator Modal */}
      {showMessageGenerator && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-fire-gold mb-2">✅ VIP Pass Created!</h2>
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-center">
              <div className="text-sm text-gray-400 mb-1">VIP Code</div>
              <div className="font-mono text-3xl text-fire-gold">{generatedCode}</div>
            </div>

            <h3 className="text-lg font-bold text-white mb-4">Generate Outreach Message</h3>

            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Message Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as typeof selectedTemplate)}
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg"
              >
                {VIP_MESSAGE_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.platform})
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Name for placeholder */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Recipient Name (for message)</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g., Emma"
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg"
              />
            </div>

            {/* Subject Line (for email) */}
            {VIP_MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate)?.subject && (
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Subject Line</label>
                <div className="bg-gray-800 text-white px-4 py-3 rounded-lg">
                  {VIP_MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate)?.subject}
                </div>
              </div>
            )}

            {/* Message Preview */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Message (editable)</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg resize-none font-mono text-sm"
                rows={12}
              />
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className={`w-full py-4 font-bold rounded-lg transition-all ${
                copied
                  ? 'bg-green-700 text-white'
                  : 'bg-fire-gold text-black hover:bg-yellow-400'
              }`}
            >
              {copied ? '✓ COPIED TO CLIPBOARD!' : '📋 COPY MESSAGE TO CLIPBOARD'}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                setShowMessageGenerator(false);
                setGeneratedCode('');
                setRecipientName('');
              }}
              className="w-full mt-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
