import { useState, useEffect, useCallback } from 'react';
import { Shield, Filter, RefreshCw, AlertTriangle, PlusCircle, Pencil, Trash2, LogIn } from 'lucide-react';

interface AuditLog {
  logId: string;
  actionType: string;
  tableName: string;
  recordId: string;
  oldValue: any;
  newValue: any;
  changeReason: string | null;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: string;
  userRole: string | null;
  user: { name: string; email: string; role: string } | null;
}

interface Stats {
  total: number;
  actionSummary: { type: string; count: number }[];
  tableSummary: { table: string; count: number }[];
  dailyActivity: { date: string; INSERT: number; UPDATE: number; DELETE: number }[];
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  INSERT: <PlusCircle size={14} className="text-emerald-500" />,
  UPDATE: <Pencil size={14} className="text-blue-500" />,
  DELETE: <Trash2 size={14} className="text-red-500" />,
  LOGIN:  <LogIn size={14} className="text-purple-500" />,
};

const ACTION_BADGE: Record<string, string> = {
  INSERT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  UPDATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  LOGIN:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function AuditDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableFilter, setTableFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const params = new URLSearchParams({
        tableName: tableFilter,
        actionType: actionFilter,
        page: String(page),
        limit: '10',
      });
      const res = await fetch(`${API_URL}/api/audit?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setStats(data.stats || null);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (e) {
      console.error('Failed to fetch audit logs', e);
    } finally {
      setLoading(false);
    }
  }, [tableFilter, actionFilter, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const tables = ['all', 'Student', 'Course', 'FeeStructure', 'Batch', 'Application', 'Ticket', 'User'];
  const actions = ['all', 'INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];

  return (
    <div className="w-full max-w-6xl mx-auto my-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Audit Log Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Track every data change — who, what, when, and why</p>
          </div>
        </div>
        <button onClick={fetchLogs} className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Total Events</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 mt-1">{stats.total.toLocaleString()}</p>
          </div>
          {stats.actionSummary.slice(0, 3).map(a => (
            <div key={a.type} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                {ACTION_ICONS[a.type]}
                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{a.type}s</p>
              </div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-slate-100">{a.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Most Active Tables */}
      {stats && stats.tableSummary.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" /> Most Modified Tables
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.tableSummary.map(t => (
              <div key={t.table} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full text-sm">
                <span className="font-semibold text-gray-800 dark:text-slate-200">{t.table}</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <Filter size={16} className="text-gray-400" />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-slate-400 font-medium">Table:</label>
          <select
            value={tableFilter}
            onChange={e => { setTableFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {tables.map(t => <option key={t} value={t}>{t === 'all' ? 'All Tables' : t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-slate-400 font-medium">Action:</label>
          <select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {actions.map(a => <option key={a} value={a}>{a === 'all' ? 'All Actions' : a}</option>)}
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400">
            <Shield size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            No audit events found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Table</th>
                  <th className="px-4 py-3 font-semibold">Changed By</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">IP Address</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {logs.map(log => (
                  <>
                    <tr key={log.logId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${ACTION_BADGE[log.actionType] || 'bg-gray-100 text-gray-600'}`}>
                          {ACTION_ICONS[log.actionType]}
                          {log.actionType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-slate-200">{log.tableName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
                        {log.user ? (
                          <div>
                            <div className="font-medium">{log.user.name}</div>
                            <div className="text-xs text-gray-400 dark:text-slate-500">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-slate-500 italic">System / Anonymous</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">{log.userRole || log.user?.role || '—'}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-500 dark:text-slate-400">{log.ipAddress || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-slate-400">
                        {new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedLog(expandedLog === log.logId ? null : log.logId)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          {expandedLog === log.logId ? 'Hide' : 'View diff'}
                        </button>
                      </td>
                    </tr>
                    {expandedLog === log.logId && (
                      <tr key={`${log.logId}-detail`} className="bg-slate-50 dark:bg-slate-800/40">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {log.oldValue && (
                              <div>
                                <p className="text-xs font-bold text-red-500 uppercase mb-1.5">Before (Old Value)</p>
                                <pre className="text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 overflow-auto max-h-48 text-gray-800 dark:text-slate-300">
                                  {JSON.stringify(log.oldValue, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.newValue && (
                              <div>
                                <p className="text-xs font-bold text-emerald-600 uppercase mb-1.5">After (New Value)</p>
                                <pre className="text-xs bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-3 overflow-auto max-h-48 text-gray-800 dark:text-slate-300">
                                  {JSON.stringify(log.newValue, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.changeReason && (
                              <div className="md:col-span-2">
                                <p className="text-xs font-bold text-amber-600 uppercase mb-1">Change Reason</p>
                                <p className="text-sm text-gray-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3">{log.changeReason}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-gray-700 dark:text-slate-300"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-gray-700 dark:text-slate-300"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
