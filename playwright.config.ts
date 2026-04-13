import { defineConfig, devices } from "@playwright/test";

const frontendUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5173";
const backendUrl = process.env.PLAYWRIGHT_API_URL ?? "http://127.0.0.1:4000";
const useHostedTarget = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: frontendUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: useHostedTarget
    ? undefined
    : [
        {
          command: "npm --prefix backend run dev",
          url: `${backendUrl}/api/health`,
          timeout: 120 * 1000,
          reuseExistingServer: true,
        },
        {
          command: "npm --prefix frontend run dev -- --host 127.0.0.1",
          url: frontendUrl,
          timeout: 120 * 1000,
          reuseExistingServer: true,
        },
      ],
});
