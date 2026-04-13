# Release Readiness Checklist

## Smoke Tests

- Public landing page loads without authentication.
- Public start assessment form creates an assessment without account creation.
- Public questionnaire can be completed end to end.
- Public results show score, maturity, risk, framework summary, and recommendations.
- Backend health endpoint responds at `/api/health`.

## Accessibility Review

- Run `npm run test:a11y`.
- Keyboard navigation reaches all primary actions on landing, start, questionnaire, results, login, workspace, and admin pages.
- Focus states are visible against the dark theme.
- Inputs have programmatic labels and validation messages are announced or visible near the relevant controls.
- Buttons and links have accessible names.
- Status indicators include text and do not rely on color alone.

## Responsive Review

- Check small mobile, large phone, tablet, and desktop viewports.
- Confirm there is no unwanted horizontal scrolling.
- Confirm questionnaire options remain tappable on mobile.
- Confirm results cards and charts reflow without clipping.
- Confirm dense private workspace tables/cards collapse or adapt on mobile.

## Public/Private Separation

- Public results do not show detailed control readiness.
- Public results do not show evidence prompts, upload workflows, or evidence artifact language.
- Public results do not show remediation operations or private workspace controls.
- Public CTAs point only to account creation, unlock, or consultation flows.
- Private workspace pages require authentication.

## Route Protection

- Anonymous users are blocked from admin APIs.
- Authenticated non-admin users are blocked from admin APIs.
- Anonymous users are blocked from private workspace APIs.
- Frontend `/admin` redirects anonymous and non-admin users.
- Public assessment routes remain accessible without authentication.
