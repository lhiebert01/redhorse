'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SUPERADMIN_PIN = '142857';
const AUTH_STORAGE_KEY = 'superadmin_authenticated';

interface Application {
  id: string;
  created_at: string;
  name: string;
  email: string;
  platform: string | null;
  handle: string | null;
  follower_count: string | null;
  message: string;
  status: 'new' | 'contacted' | 'approved' | 'declined' | 'completed';
  admin_notes: string | null;
  responded_at: string | null;
  source_page: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-900 text-yellow-300',
  contacted: 'bg-blue-900 text-blue-300',
  approved: 'bg-green-900 text-green-300',
  declined: 'bg-red-900 text-red-300',
  completed: 'bg-purple-900 text-purple-300',
};

export default function InfluencerApplicationsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Check auth on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // Fetch applications when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchApplications();
    }
  }, [authenticated]);

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

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/influencer/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: SUPERADMIN_PIN }),
      });
      const data = await response.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch('/api/influencer/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: SUPERADMIN_PIN,
          id,
          status: newStatus,
          admin_notes: notes,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchApplications();
        setSelectedApp(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter(app => app.status === statusFilter);

  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === 'new').length,
    contacted: applications.filter(a => a.status === 'contacted').length,
    approved: applications.filter(a => a.status === 'approved').length,
    declined: applications.filter(a => a.status === 'declined').length,
    completed: applications.filter(a => a.status === 'completed').length,
  };

  // PIN Authentication
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handlePinSubmit} className="bg-gray-900 p-8 rounded-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-fire-gold mb-6 text-center">
            🌟 Influencer Applications
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Enter PIN to view applications
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
            View Applications
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
              🌟 Influencer Applications
            </h1>
            <p className="text-gray-400">
              Review and manage partnership applications
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/superadmin/vip"
              className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              🎫 VIP Passes
            </Link>
            <Link
              href="/superadmin"
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              📷 Image Browser
            </Link>
            <button
              onClick={fetchApplications}
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
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'all' ? 'ring-2 ring-fire-gold' : ''} bg-gray-900`}
          >
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'new' ? 'ring-2 ring-yellow-400' : ''} bg-gray-900`}
          >
            <div className="text-2xl font-bold text-yellow-400">{stats.new}</div>
            <div className="text-xs text-gray-400">New</div>
          </button>
          <button
            onClick={() => setStatusFilter('contacted')}
            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'contacted' ? 'ring-2 ring-blue-400' : ''} bg-gray-900`}
          >
            <div className="text-2xl font-bold text-blue-400">{stats.contacted}</div>
            <div className="text-xs text-gray-400">Contacted</div>
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'approved' ? 'ring-2 ring-green-400' : ''} bg-gray-900`}
          >
            <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
            <div className="text-xs text-gray-400">Approved</div>
          </button>
          <button
            onClick={() => setStatusFilter('declined')}
            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'declined' ? 'ring-2 ring-red-400' : ''} bg-gray-900`}
          >
            <div className="text-2xl font-bold text-red-400">{stats.declined}</div>
            <div className="text-xs text-gray-400">Declined</div>
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`rounded-xl p-4 text-center transition-all ${statusFilter === 'completed' ? 'ring-2 ring-purple-400' : ''} bg-gray-900`}
          >
            <div className="text-2xl font-bold text-purple-400">{stats.completed}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Platform</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Followers</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Applied</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3 font-medium">{app.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <a href={`mailto:${app.email}`} className="text-blue-400 hover:underline">
                          {app.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {app.platform ? (
                          <span className="capitalize">{app.platform}</span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                        {app.handle && (
                          <div className="text-xs text-gray-500">{app.handle}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {app.follower_count || <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[app.status]}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-fire-gold hover:text-yellow-300 text-sm font-medium"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-fire-gold">Application Details</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Name</div>
                  <div className="font-medium">{selectedApp.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <a href={`mailto:${selectedApp.email}`} className="text-blue-400 hover:underline">
                    {selectedApp.email}
                  </a>
                </div>
              </div>

              {(selectedApp.platform || selectedApp.handle) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Platform</div>
                    <div className="capitalize">{selectedApp.platform || '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Handle</div>
                    <div>{selectedApp.handle || '—'}</div>
                  </div>
                </div>
              )}

              {selectedApp.follower_count && (
                <div>
                  <div className="text-sm text-gray-400">Followers</div>
                  <div>{selectedApp.follower_count}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-400 mb-2">Their Proposal</div>
                <div className="bg-gray-800 rounded-lg p-4 whitespace-pre-wrap">
                  {selectedApp.message}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Status</div>
                <div className="flex gap-2 flex-wrap">
                  {['new', 'contacted', 'approved', 'declined', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedApp.id, status)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        selectedApp.status === status
                          ? STATUS_COLORS[status]
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <a
                  href={`mailto:${selectedApp.email}`}
                  className="flex-1 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-600 text-center"
                >
                  📧 Email Applicant
                </a>
                <Link
                  href={`/superadmin/vip?recipient=${encodeURIComponent(selectedApp.name)}&platform=${selectedApp.platform || ''}`}
                  className="flex-1 py-3 bg-yellow-700 text-white font-bold rounded-lg hover:bg-yellow-600 text-center"
                >
                  🎫 Create VIP Pass
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
