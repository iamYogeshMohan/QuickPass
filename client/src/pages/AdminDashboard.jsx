import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState({ totalVisitors: 0, activeVisitors: 0, completedVisitors: 0 });
  const [filter, setFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      const url = filter === 'today' ? 'http://localhost:5000/admin/logs?date=today' : 'http://localhost:5000/admin/logs';
      const res = await axios.get(url);
      setLogs(res.data.logs);
      setAnalytics(res.data.analytics);
    } catch(err) {
      console.error('Failed to fetch logs', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Admin Dashboard</h2>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--card-border)', borderRadius: '8px' }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
          </select>
        </div>

        {/* Analytics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analytics.totalVisitors}</div>
            <div style={{ opacity: 0.8 }}>Total Visitors</div>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{analytics.activeVisitors}</div>
            <div style={{ opacity: 0.8 }}>Currently Active</div>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{analytics.completedVisitors}</div>
            <div style={{ opacity: 0.8 }}>Completed Visits</div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '16px' }}>Visitor Logs</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px', opacity: 0.7 }}>Visitor</th>
                <th style={{ padding: '12px', opacity: 0.7 }}>Host</th>
                <th style={{ padding: '12px', opacity: 0.7 }}>Status</th>
                <th style={{ padding: '12px', opacity: 0.7 }}>Entry Time</th>
                <th style={{ padding: '12px', opacity: 0.7 }}>Exit Time</th>
                <th style={{ padding: '12px', opacity: 0.7 }}>Guard</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>
                    <strong>{log.visitorId?.visitorName || 'Unknown'}</strong><br/>
                    <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{log.visitorId?.phone}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{log.visitorId?.hostId?.name || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem',
                      background: log.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: log.status === 'active' ? 'var(--success)' : 'white' 
                    }}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{log.entryTime ? new Date(log.entryTime).toLocaleTimeString() : '-'}</td>
                  <td style={{ padding: '12px' }}>{log.exitTime ? new Date(log.exitTime).toLocaleTimeString() : '-'}</td>
                  <td style={{ padding: '12px' }}>{log.guardId?.name || 'N/A'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', opacity: 0.5 }}>No logs found for this period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
