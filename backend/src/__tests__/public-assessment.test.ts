import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const signToken = (role: string) => jwt.sign(
  { id: "test-user-id", organizationId: "test-org-id", role },
  JWT_SECRET,
  { expiresIn: "1h" }
);

describe("public assessment API", () => {
  it("starts a public assessment without account creation", async () => {
    const response = await request(app)
      .post("/api/public/assessments/start")
      .send({
        name: "Test Corp",
        industry: "Technology",
        size: "1-50",
        contactName: "Test User",
        email: "test@example.com"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("returns questionnaire questions from the intended public assessment endpoint", async () => {
    const response = await request(app).get("/api/public/assessments/questions");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("text");
    expect(response.body[0]).toHaveProperty("domain");
    expect(response.body[0]).toHaveProperty("options");
  });

  it("returns public summary results without workspace-only details", async () => {
    const startResponse = await request(app)
      .post("/api/public/assessments/start")
      .send({
        name: "Summary Corp",
        industry: "Finance",
        size: "51-200",
        contactName: "Summary User",
        email: "summary@example.com"
      });

    const questionsResponse = await request(app).get("/api/public/assessments/questions");
    const responses = questionsResponse.body.map((question: any) => ({
      questionId: question.id,
      scoreValue: question.options[0].scoreValue
    }));

    await request(app)
      .post(`/api/public/assessments/${startResponse.body.id}/submit`)
      .send({ responses })
      .expect(200);

    const resultsResponse = await request(app)
      .get(`/api/public/assessments/${startResponse.body.id}/results`);

    expect(resultsResponse.status).toBe(200);
    expect(resultsResponse.body).toHaveProperty("overallScore");
    expect(resultsResponse.body).toHaveProperty("maturityLevel");
    expect(resultsResponse.body).toHaveProperty("riskLevel");
    expect(resultsResponse.body).toHaveProperty("recommendations");
    expect(resultsResponse.body).not.toHaveProperty("responses");
    expect(resultsResponse.body).not.toHaveProperty("controlReadiness");
    expect(resultsResponse.body).not.toHaveProperty("gaps");
    expect(JSON.stringify(resultsResponse.body).toLowerCase()).not.toContain("evidence");
  });

  it("returns 404 for invalid public result IDs", async () => {
    const response = await request(app).get("/api/public/assessments/not-a-session/results");

    expect(response.status).toBe(404);
  });
});

describe("backend route protection", () => {
  it("blocks unauthenticated workspace routes", async () => {
    await request(app).get("/api/workspace/notes").expect(401);
    await request(app).get("/api/workspace/results/example").expect(401);
    await request(app).get("/api/workspace/reports/example/pdf").expect(401);
  });

  it("blocks unauthenticated admin routes", async () => {
    await request(app).get("/api/admin/questions").expect(401);
  });

  it("blocks authenticated non-admin users from admin routes", async () => {
    await request(app)
      .get("/api/admin/questions")
      .set("Authorization", `Bearer ${signToken("ORG_ADMIN")}`)
      .expect(403);
  });

  it("allows SUPER_ADMIN users to access admin routes", async () => {
    await request(app)
      .get("/api/admin/questions")
      .set("Authorization", `Bearer ${signToken("SUPER_ADMIN")}`)
      .expect(200);
  });

  it("keeps public routes accessible without authentication", async () => {
    await request(app).get("/api/health").expect(200);
    await request(app).get("/api/public/assessments/questions").expect(200);
  });
});
