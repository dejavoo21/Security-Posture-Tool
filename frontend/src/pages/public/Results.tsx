import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Layout } from "../../components/shared/Layout";
import { apiService } from "../../services/api";

export function Results() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await apiService.getResults(id!);
        setResult(data);
      } catch {
        setError("Failed to load assessment results.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="loading-state">Crunching compliance vectors...</div>
      </Layout>
    );
  }

  if (error || !result) {
    return (
      <Layout>
        <div className="error-state">{error || "Results not found."}</div>
      </Layout>
    );
  }

  const radarData = result.domainScores?.map((domain: any) => ({
    subject: domain.domain,
    A: domain.percentage,
    fullMark: 100
  })) || [];

  const frameworkData = result.frameworkScores?.map((framework: any) => ({
    name: framework.framework,
    score: framework.percentage
  })) || [];

  const recommendations = (result.recommendations || []).slice(0, 5);

  return (
    <Layout>
      <section className="page-container">
        <div className="score-card" style={{ marginBottom: 48 }}>
          <div className="score-card__row">
            <div>
              <div style={{ background: "rgba(251, 191, 36, 0.1)", border: "1px solid rgba(251, 191, 36, 0.2)", padding: "8px 16px", borderRadius: 8, marginBottom: 16, color: "#fbbf24", fontSize: "0.85rem", fontWeight: 600 }}>
                INDICATIVE RESULTS ONLY - CREATE AN ACCOUNT FOR FULL COMPLIANCE WORKFLOWS
              </div>
              <p className="eyebrow" style={{ color: "#fff" }}>Executive Summary</p>
              <h2 style={{ fontSize: "2rem", margin: "0 0 8px 0", color: "#fff" }}>
                {result.companyData?.name}
              </h2>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>
                {result.companyData?.industry} - {result.companyData?.size || "Unspecified size"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="eyebrow" style={{ color: "#fff" }}>Overall Readiness</p>
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
              <p className="score-tile__value">
                {result.riskLevel}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link to="/start" className="button-primary">Create Account to Unlock Details</Link>
            <Link to="/leaderboard" className="button-secondary">Compare Benchmarks</Link>
          </div>
        </div>

        <div className="results-grid" style={{ marginBottom: 48 }}>
          <div>
            <h3 style={{ marginBottom: 24, fontSize: "1.5rem" }}>Global Framework Alignment</h3>
            <div className="surface-card" style={{ height: 350, padding: "24px 0" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frameworkData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                  />
                  <Bar dataKey="score" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 24, fontSize: "1.5rem" }}>Domain Posture</h3>
            <div className="surface-card" style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                  <Radar name="Score" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ marginBottom: 24, fontSize: "1.5rem" }}>Strategic Next Actions</h3>
          <div className="recommendation-list">
            {recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="recommendation-item">
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
