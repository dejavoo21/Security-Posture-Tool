import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LandingPage } from "../pages/public/Landing";
import { StartAssessment } from "../pages/public/StartAssessment";

expect.extend(toHaveNoViolations);

describe("component accessibility smoke checks", () => {
  it("landing page has no obvious axe violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("start assessment form has no obvious axe violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <StartAssessment />
      </MemoryRouter>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
