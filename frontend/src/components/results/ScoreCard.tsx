type ScoreCardProps = {
  overallScore: number;
  maturityLevel: string;
  riskLevel: string;
};

export function ScoreCard({ overallScore, maturityLevel, riskLevel }: ScoreCardProps) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <section className="score-card">
      <div className="score-card__row" style={{ alignItems: 'center' }}>
        <div>
          <p className="eyebrow" style={{ color: "var(--accent-cyan)", marginBottom: 16, border: 'none', padding: 0, background: 'none' }}>Overall Posture Score</p>
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.4))' }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
              <circle 
                cx="70" cy="70" r={radius} 
                stroke="url(#scoreGrad)" strokeWidth="12" fill="none" 
                strokeDasharray={circumference} strokeDashoffset={offset} 
                strokeLinecap="round" 
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.05em', color: 'var(--text-bright)' }}>{overallScore}</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>/ 100</span>
            </div>
          </div>
        </div>
        <span className="badge badge-dark" style={{ alignSelf: 'flex-start' }}>Assessment complete</span>
      </div>

      <div className="score-card__grid">
        <div className="score-tile">
          <p className="score-tile__label">Maturity level</p>
          <p className="score-tile__value" style={{ color: 'var(--accent-cyan)' }}>{maturityLevel}</p>
        </div>
        <div className="score-tile">
          <p className="score-tile__label">Risk level</p>
          <p className="score-tile__value" style={{ color: riskLevel === 'High' ? '#f87171' : riskLevel === 'Medium' ? '#fbbf24' : '#34d399' }}>{riskLevel}</p>
        </div>
      </div>
    </section>
  );
}
