import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../../components/shared/Layout";

const highlights = [
  { value: "12", label: "starter questions" },
  { value: "6", label: "security domains" },
  { value: "100", label: "point score model" },
  { value: "<3m", label: "estimated completion" }
];


export function LandingPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="hero-card">
        <div>
          <p className="eyebrow">Security posture assessment</p>
          <h2 className="hero-title">Measure cyber maturity with a cleaner, faster assessment experience.</h2>
          <p className="hero-text">
            This starter app gives you a polished landing page, guided questionnaire, scoring engine, and results dashboard so you can shape it into your own platform quickly.
          </p>

          <div className="hero-actions">
            <button className="button-primary" onClick={() => navigate("/start")}>Start assessment</button>
            <Link className="button-secondary" to="/leaderboard">View leaderboard</Link>
          </div>
        </div>

        <div className="hero-panel" aria-label="Sample result preview">
          <div>
            <p className="eyebrow" style={{ color: "#93c5fd", marginBottom: 8 }}>Sample result preview</p>
            <div className="hero-panel__score">78</div>
            <p className="muted-text" style={{ color: "rgba(255,255,255,.74)", marginTop: 10 }}>
              Managed maturity with moderate risk exposure and a focused remediation path.
            </p>
          </div>

          <div className="hero-panel__list">
            {[
              "Governance and policy coverage",
              "Access control and MFA",
              "Backups, recovery, and response readiness"
            ].map((item) => (
              <div className="hero-panel__list-item" key={item}>
                <span className="hero-panel__dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Key stats">
        {highlights.map((item) => (
          <article className="metric-card" key={item.label}>
            <p className="metric-value">{item.value}</p>
            <p className="metric-label">{item.label}</p>
          </article>
        ))}
      </section>


    </Layout>
  );
}
