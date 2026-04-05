import { useState, useEffect } from 'react';
import { Layout } from '../../components/shared/Layout';
import { apiService } from '../../services/api';

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiService.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard data.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <Layout>
      <section className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="eyebrow" style={{ color: '#93c5fd' }}>Global Rankings</p>
          <h2 className="page-title">Leaderboard</h2>
          <p className="muted-text">See how top companies rank based on our standardized assessment model.</p>
        </div>

        {isLoading ? (
          <div className="loading-state">Loading rankings...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : leaderboard.length === 0 ? (
          <div className="empty-state">No completed assessments yet to rank. Be the first!</div>
        ) : (
          <div className="table-card">
            <table style={{ minWidth: 800 }}>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Rank</th>
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Score</th>
                  <th>Maturity</th>
                  <th style={{ textAlign: 'right' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <div className="rank-badge">
                        #{index + 1}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{item.companyName}</td>
                    <td style={{ color: 'rgba(255,255,255,0.7)' }}>{item.industry}</td>
                    <td>
                      <span style={{
                        color: '#38bdf8',
                        fontWeight: 700,
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        padding: '4px 12px',
                        borderRadius: 99
                      }}>
                        {item.score}
                      </span>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.9)' }}>{item.maturityLevel}</td>
                    <td style={{ textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}
