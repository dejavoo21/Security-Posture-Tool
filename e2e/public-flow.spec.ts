import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("public assessment flow", () => {
  test("completes the public flow and shows lightweight results only", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/security posture tool/i);
    await expect(page.locator(".hero-title")).toContainText(/cyber maturity/i);

    await page.getByRole("button", { name: /start assessment/i }).click();
    await expect(page).toHaveURL(/\/start/);

    await page.getByLabel(/company name/i).fill("E2E Test Corp");
    await page.getByLabel(/industry/i).selectOption("Technology");
    await page.getByLabel(/company size/i).selectOption("1-50");
    await page.getByLabel(/contact name/i).fill("QA Tester");
    await page.getByLabel(/email address/i).fill("qa@example.com");
    await page.getByRole("button", { name: /begin questionnaire/i }).click();

    await expect(page).toHaveURL(/\/assessment\//);

    for (let questionNumber = 0; questionNumber < 20; questionNumber += 1) {
      await page.locator(".option-button").first().click();

      const finishButton = page.getByRole("button", { name: /finish assessment/i });
      if (await finishButton.isVisible().catch(() => false)) {
        await finishButton.click();
        break;
      }

      await page.getByRole("button", { name: /next question/i }).click();
    }

    await expect(page).toHaveURL(/\/results\//);
    await expect(page.locator(".score-card__score")).toBeVisible();
    await expect(page.getByText(/E2E Test Corp/i)).toBeVisible();
    await expect(page.getByText("Maturity Level")).toBeVisible();
    await expect(page.getByText("Risk Level")).toBeVisible();
    await expect(page.getByText(/top recommendations/i)).toBeVisible();

    await expect(page.getByText(/detailed control readiness/i)).toHaveCount(0);
    await expect(page.getByText(/required evidence/i)).toHaveCount(0);
    await expect(page.getByText(/evidence artifact/i)).toHaveCount(0);
    await expect(page.getByText(/remediation tracker/i)).toHaveCount(0);
  });

  test("keeps the public pages usable on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: /main navigation/i })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test("blocks anonymous users from the admin page", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: /admin/i })).toHaveCount(0);
  });

  test("@a11y landing page passes automated accessibility smoke checks", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("@a11y start assessment page passes automated accessibility smoke checks", async ({ page }) => {
    await page.goto("/start");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
