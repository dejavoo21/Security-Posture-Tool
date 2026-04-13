import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnlockResults } from "../pages/public/UnlockResults";
import { apiService } from "../services/api";

vi.mock("../services/api", () => ({
  apiService: {
    getResults: vi.fn(),
    register: vi.fn(),
    login: vi.fn()
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
  recommendations: ["Prioritize MFA rollout"]
};

const renderUnlock = (path = "/results/assessment-1/unlock") => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/results/:id/unlock" element={<UnlockResults />} />
      <Route path="/results/:id" element={<div>Saved result route</div>} />
    </Routes>
  </MemoryRouter>
);

describe("post-results unlock flow", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("prefills organization context and preserves the public session during registration", async () => {
    (apiService.getResults as any).mockResolvedValue(publicResult);
    (apiService.register as any).mockResolvedValue({
      token: "token",
      user: { id: "user-1", role: "ORG_ADMIN" },
      conversion: { status: "converted", publicSessionId: "assessment-1", assessmentId: "saved-1" }
    });

    renderUnlock();

    await waitFor(() => {
      expect(screen.getByLabelText(/organization/i)).toHaveValue("Acme");
    });

    await userEvent.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await userEvent.type(screen.getByLabelText(/email address/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /create account and save results/i }));

    await waitFor(() => {
      expect(apiService.register).toHaveBeenCalledWith(expect.objectContaining({
        publicSessionId: "assessment-1",
        organizationName: "Acme",
        organizationIndustry: "Technology",
        organizationSize: "1-50"
      }));
    });

    expect(await screen.findByText(/connected to your account/i)).toBeInTheDocument();
    expect(window.localStorage.getItem("authToken")).toBe("token");
  });

  it("supports existing-user login claim mode", async () => {
    (apiService.getResults as any).mockResolvedValue(publicResult);
    (apiService.login as any).mockResolvedValue({
      token: "token",
      user: { id: "user-1", role: "ORG_ADMIN" },
      conversion: { status: "already_converted", publicSessionId: "assessment-1", assessmentId: "saved-1" }
    });

    renderUnlock("/results/assessment-1/unlock?mode=login");

    await screen.findByText(/sign in to save this assessment/i);
    await userEvent.type(screen.getByLabelText(/email address/i), "jane@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in and save assessment/i }));

    await waitFor(() => {
      expect(apiService.login).toHaveBeenCalledWith({
        email: "jane@example.com",
        password: "password123",
        publicSessionId: "assessment-1"
      });
    });

    expect(await screen.findByText(/connected to your account/i)).toBeInTheDocument();
  });
});
