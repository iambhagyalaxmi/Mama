import { useState, useEffect } from 'react';

interface Metrics {
  totalConversations: number;
  ticketVolume: number;
  resolutionRate: string;
  activeStudents: number;
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_URL}/api/analytics`);
        const data = await res.json();
        if (!data.error) setMetrics(data);
      } catch (e) {
        console.error('Failed to fetch analytics', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 w-full max-w-4xl mx-auto my-8 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">System Analytics</h2>

      {loading || !metrics ? (
        <div className="text-slate-500 dark:text-slate-400">Loading live data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Total Conversations</p>
            <p className="text-3xl font-extrabold text-blue-900 dark:text-blue-100 mt-2">{metrics.totalConversations}</p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/50">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">Ticket Volume</p>
            <p className="text-3xl font-extrabold text-orange-900 dark:text-orange-100 mt-2">{metrics.ticketVolume}</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50">
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">Resolution Rate</p>
            <p className="text-3xl font-extrabold text-green-900 dark:text-green-100 mt-2">{metrics.resolutionRate}</p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/50">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">Active Students</p>
            <p className="text-3xl font-extrabold text-purple-900 dark:text-purple-100 mt-2">{metrics.activeStudents}</p>
          </div>
        </div>
      )}
    </div>
  );
}
