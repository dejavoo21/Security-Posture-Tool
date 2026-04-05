import { test, expect } from '@playwright/test';

test.describe('Public Assessment Flow', () => {
    test('should complete the full flow from landing to results', async ({ page }) => {
        // 1. Visit Landing
        await page.goto('/');
        await expect(page.locator('h2.hero-title')).toContainText('Measure cyber maturity');

        // 2. Start Assessment
        await page.click('button:has-text("Start assessment")');
        await expect(page).toHaveURL(/\/start/);

        // 3. Fill Onboarding Form
        await page.fill('input[name="name"]', 'E2E Test Corp');
        await page.selectOption('select[name="industry"]', 'Technology');
        await page.fill('input[name="email"]', 'e2e@example.com');
        await page.click('button:has-text("Begin Questionnaire")');

        // 4. Complete Questionnaire
        await expect(page).toHaveURL(/\/assessment\//);

        // Loop through questions (assume 12 based on highlights)
        // For simplicity in this test, we'll answer a few and wait for progress
        // Ideally, we'd loop until the 'Finish' button appears
        let isFinished = false;
        while (!isFinished) {
            const questionText = await page.locator('h2').textContent();
            console.log(`Answering: ${questionText}`);

            // Click the first option
            await page.locator('.option-button').first().click();

            const nextButton = page.locator('button:has-text("Next Question"), button:has-text("Finish Assessment")');
            const buttonText = await nextButton.textContent();

            if (buttonText?.includes('Finish')) {
                isFinished = true;
            }

            await nextButton.click();
        }

        // 5. Verify Results Summary
        await expect(page).toHaveURL(/\/results\//);
        await expect(page.locator('.score-card__score')).toBeVisible();
        await expect(page.locator('h2')).toContainText('E2E Test Corp');

        // 6. Security Check: Restricted content in public mode
        await expect(page.locator('text=Detailed Gap Analysis Restricted')).toBeVisible();
        await expect(page.locator('text=🔒')).toBeVisible();
    });

    test('mobile responsiveness', async ({ page, isMobile }) => {
        await page.goto('/');
        if (isMobile) {
            // Check for mobile-specific navigation elements if they exist
            // Or verify that the layout stack correctly
            const heroCard = page.locator('.hero-card');
            const box = await heroCard.boundingBox();
            expect(box?.width).toBeLessThan(600);
        }
    });

    test('accessibility audit', async ({ page }) => {
        await page.goto('/');
        // In a real scenario, we'd use axe-playwright here
        // await injectAxe(page);
        // await checkA11y(page);

        // Manual checks for accessibility markers
        await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
        await expect(page.locator('h1')).toBeVisible();
    });
});
