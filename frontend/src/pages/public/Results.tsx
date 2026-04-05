import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Layout } from '../../components/shared/Layout';
import { apiService } from '../../services/api';

export function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPublicMode = true; // For now, the entire results page from the public flow is public mode

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await apiService.getResults(id!);
        setResult(data);
      } catch (err) {
        setError('Failed to load assessment results.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [id]);

  if (isLoading) {
    return <Layout><div className="loading-state">Crunching compliance vectors...</div></Layout>;
  }

  if (error || !result) {
    return <Layout><div className="error-state">{error || 'Results not found.'}</div></Layout>;
  }

  // Format Recharts data
  const radarData = result.domainScores?.map((d: any) => ({
    subject: d.domain,
    A: d.percentage,
    fullMark: 100,
  })) || [];

  const frameworkData = result.frameworkScores?.map((f: any) => ({
    name: f.framework,
    score: f.percentage
  })) || [];

  return (
    <Layout>
      <section className="page-container">

        {/* Executive Summary Header */}
        <div className="score-card" style={{ marginBottom: 48 }}>
          <div className="score-card__row">
            <div>
              {isPublicMode && (
                <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '8px 16px', borderRadius: 8, marginBottom: 16, color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠️ INDICATIVE RESULTS ONLY — CREATE AN ACCOUNT FOR FULL COMPLIANCE WORKFLOWS
                </div>
              )}
              <p className="eyebrow" style={{ color: '#fff' }}>Executive Summary</p>
              <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: '#fff' }}>{result.companyData?.name}</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                {result.companyData?.industry} • {result.companyData?.size} employees
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="eyebrow" style={{ color: '#fff' }}>Overall Readiness</p>
              <div className="score-card__score">{result.overallScore}%</div>
            </div>
          </div>

          <div className="score-card__grid">
            <div className="score-tile">
              <p className="score-tile__label">Maturity Level</p>
              <p className="score-tile__value">{result.maturityLevel}</p>
            </div>
            <div className="score-tile">
              <p className="score-tile__label">Risk Level</p>
              <p className="score-tile__value" style={{ color: result.riskLevel.includes('High') ? '#f87171' : '#34d399' }}>
                {result.riskLevel}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
            {isPublicMode ? (
              <Link to="/start" className="button-primary">Create Account to Unlock Details</Link>
            ) : (
              <a href={apiService.downloadPdfUrl(id!)} className="button-primary">Download Executive PDF</a>
            )}
            <Link to="/leaderboard" className="button-secondary">Compare Benchmarks</Link>
          </div>
        </div>

        {/* Charts Section: Framework Alignment */}
        <div className="results-grid" style={{ marginBottom: 48 }}>
          <div>
            <h3 style={{ marginBottom: 24, fontSize: '1.5rem' }}>Global Framework Alignment</h3>
            <div className="surface-card" style={{ height: 350, padding: '24px 0' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frameworkData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  />
                  <Bar dataKey="score" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 24, fontSize: '1.5rem' }}>Domain Posture</h3>
            <div className="surface-card" style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                  <Radar name="Score" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Priority Gaps & Action Plan - Hidden or Locked in Public Mode */}
        <h3 style={{ marginBottom: 24, fontSize: '1.5rem' }}>Priority Control Gaps & Required Evidence</h3>

        {isPublicMode ? (
          <div className="surface-card" style={{ padding: '48px 24px', textAlign: 'center', background: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 48 }}>
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Detailed Gap Analysis Restricted</h4>
              <p className="muted-text" style={{ marginBottom: 24 }}>
                A full breakdown of {result.gaps?.length || 'multiple'} critical control gaps and suggested evidence artifacts is reserved for registered organizations.
              </p>
              <button className="button-primary" onClick={() => navigate('/start')}>Create Workspace to Unlock</button>
            </div>
          </div>
        ) : (
          <>
            <p className="muted-text" style={{ marginBottom: 24 }}>The following missing or partially implemented controls act as blockers for compliance against ISO, SOC 2, and broader privacy frameworks. Evidence collection must be prioritized for these items.</p>
            {result.gaps && result.gaps.length > 0 ? (
              <div className="table-card" style={{ marginBottom: 48 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Control & Issue</th>
                      <th>Priority</th>
                      <th>Target Timeline</th>
                      <th>Suggested Artifacts (Evidence)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.gaps.map((gap: any, i: number) => (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>{gap.controlTitle}</div>
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{gap.issueSummary}</div>
                        </td>
                        <td>
                          <span className="badge" style={{
                            color: gap.severity === 'High' ? '#f87171' : gap.severity === 'Medium' ? '#fbbf24' : '#34d399',
                            background: gap.severity === 'High' ? 'rgba(248, 113, 113, 0.1)' : gap.severity === 'Medium' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                            borderColor: gap.severity === 'High' ? 'rgba(248, 113, 113, 0.2)' : 'transparent'
                          }}>
                            {gap.severity}
                          </span>
                        </td>
                        <td style={{ color: 'rgba(255,255,255,0.9)' }}>{gap.targetTimeline}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {gap.suggestedEvidence?.map((ev: string) => (
                              <span key={ev} style={{ color: '#94a3b8', fontSize: '0.85rem' }}>• {ev}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="surface-card" style={{ marginBottom: 48, textAlign: 'center' }}>
                <p className="muted-text">Outstanding posture! No significant control gaps identified.</p>
              </div>
            )}
          </>
        )}

        {/* Full Control Readiness Log */}
        <h3 style={{ marginBottom: 24, fontSize: '1.5rem' }}>Detailed Control Readiness</h3>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th style={{ width: 120 }}>Control ID</th>
                <th>Control Objective</th>
                <th style={{ textAlign: 'right' }}>Implementation Status</th>
              </tr>
            </thead>
            <tbody>
              {result.controlReadiness?.map((ctrl: any, i: number) => (
                <tr key={i}>
                  <td style={{ color: '#38bdf8', fontWeight: 600 }}>{ctrl.controlId}</td>
                  <td style={{ color: '#fff' }}>{ctrl.controlTitle}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="badge" style={{
                      border: 'none',
                      background: 'rgba(255,255,255,0.05)',
                      color: ctrl.status === 'Implemented' ? '#34d399' : ctrl.status === 'Largely Implemented' ? '#818cf8' : ctrl.status === 'Partially Implemented' ? '#fbbf24' : '#94a3b8'
                    }}>
                      {ctrl.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* High-Level Recommendations */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ marginBottom: 24, fontSize: '1.5rem' }}>Strategic Next Actions</h3>
          <div className="recommendation-list">
            {result.recommendations?.map((rec: string, i: number) => (
              <div key={i} className="recommendation-item">
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </Layout>
  );
}
