import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Results } from "../pages/public/Results";
import { apiService } from "../services/api";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  RadarChart: ({ children }: any) => <div>{children}</div>,
  PolarGrid: () => <div />,
  PolarAngleAxis: () => <div />,
  PolarRadiusAxis: () => <div />,
  Radar: () => <div />,
  BarChart: ({ children }: any) => <div>{children}</div>,
  CartesianGrid: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Bar: () => <div />
}));

vi.mock("../services/api", () => ({
  apiService: {
    getResults: vi.fn()
  }
}));

const publicResult = {
  id: "assessment-1",
  companyData: {
    name: "Acme",
    industry: "Technology",
    size: "1-50"
  },
  overallScore: 72,
  maturityLevel: "Managed",
  riskLevel: "Moderate",
  domainScores: [{ domain: "Governance", percentage: 70 }],
  frameworkScores: [{ framework: "SOC 2", percentage: 72 }],
  recommendations: ["Prioritize MFA rollout", "Document incident response ownership"],
  controlReadiness: [{ controlTitle: "Private control" }],
  gaps: [{ controlTitle: "Private gap", suggestedEvidence: ["Private artifact"] }]
};

const renderResults = () => render(
  <MemoryRouter initialEntries={["/results/assessment-1"]}>
    <Routes>
      <Route path="/results/:id" element={<Results />} />
    </Routes>
  </MemoryRouter>
);

describe("public results page", () => {
  it("renders only lightweight public summary information", async () => {
    (apiService.getResults as any).mockResolvedValue(publicResult);

    renderResults();

    await waitFor(() => {
      expect(screen.getByText("Acme")).toBeInTheDocument();
    });

    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("Managed")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("Prioritize MFA rollout")).toBeInTheDocument();
    expect(screen.getByText("Global Framework Alignment")).toBeInTheDocument();

    expect(screen.queryByText(/detailed control readiness/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/required evidence/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/private control/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/private artifact/i)).not.toBeInTheDocument();
  });
});
