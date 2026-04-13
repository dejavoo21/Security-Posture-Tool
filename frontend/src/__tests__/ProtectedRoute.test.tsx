import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

const renderProtectedRoute = () => render(
  <MemoryRouter initialEntries={["/admin"]}>
    <Routes>
      <Route path="/" element={<h1>Public landing</h1>} />
      <Route
        path="/admin"
        element={(
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <h1>Admin console</h1>
          </ProtectedRoute>
        )}
      />
    </Routes>
  </MemoryRouter>
);

describe("ProtectedRoute", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("redirects unauthenticated users away from protected routes", () => {
    renderProtectedRoute();

    expect(screen.getByRole("heading", { name: /public landing/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /admin console/i })).not.toBeInTheDocument();
  });

  it("redirects authenticated users without the required role", () => {
    window.localStorage.setItem("authToken", "token");
    window.localStorage.setItem("authUser", JSON.stringify({ role: "ORG_ADMIN" }));

    renderProtectedRoute();

    expect(screen.getByRole("heading", { name: /public landing/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /admin console/i })).not.toBeInTheDocument();
  });

  it("allows users with the required role", () => {
    window.localStorage.setItem("authToken", "token");
    window.localStorage.setItem("authUser", JSON.stringify({ role: "SUPER_ADMIN" }));

    renderProtectedRoute();

    expect(screen.getByRole("heading", { name: /admin console/i })).toBeInTheDocument();
  });
});
