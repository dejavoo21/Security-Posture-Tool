import type { PropsWithChildren } from "react";
import { NavLink, Link } from "react-router-dom";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand-block" to="/">
            <img className="brand-mark" src="/logo.png" alt="Security Posture Tool Logo" />
            <div>
              <h1 className="brand-title">Security Posture Tool</h1>
              <p className="brand-subtitle">Assess cyber maturity in minutes.</p>
            </div>
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/">
              Home
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/start">
              Start
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/leaderboard">
              Leaderboard
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="page-container">{children}</main>
    </div>
  );
}
