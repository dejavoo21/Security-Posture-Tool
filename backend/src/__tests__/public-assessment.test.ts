import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';

// Mock Prisma
vi.mock('@prisma/client', () => {
    return {
        PrismaClient: vi.fn().mockImplementation(() => ({
            assessmentSession: {
                create: vi.fn().mockResolvedValue({ id: 'mock-session-id', companyName: 'Test Corp' }),
                findUnique: vi.fn().mockResolvedValue({ id: 'mock-session-id', companyName: 'Test Corp', score: 85 }),
            },
            question: {
                findMany: vi.fn().mockResolvedValue([
                    { id: '1', text: 'Test Question', domain: 'Test Domain' }
                ]),
            },
            $connect: vi.fn(),
            $disconnect: vi.fn(),
        })),
    };
});

describe('Public Assessment API', () => {
    let publicSessionId: string;

    it('POST /api/public/assessments/start should create a new session', async () => {
        const response = await request(app)
            .post('/api/public/assessments/start')
            .send({
                name: 'Test Corp',
                industry: 'Technology',
                email: 'test@example.com'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        publicSessionId = response.body.id;
    });

    it('GET /api/public/questions should return framework questions', async () => {
        const response = await request(app).get('/api/public/questions');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('text');
        expect(response.body[0]).toHaveProperty('domain');
    });

    it('GET /api/public/assessments/:id/results should show indicative results only', async () => {
        // First create a completed session (mocking or using the start one)
        const response = await request(app).get(`/api/public/assessments/${publicSessionId}/results`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('overallScore');
        expect(response.body).toHaveProperty('maturityLevel');

        // Strict Product Rule: No evidence or deep notes in public results
        expect(response.body).not.toHaveProperty('evidence');
        expect(response.body).not.toHaveProperty('consultantNotes');
    });

    it('Protected Routes: GET /api/workspace/notes should return 401 for public users', async () => {
        const response = await request(app).get('/api/workspace/notes');
        // This assumes middleware is implemented. If not, this test will fail, indicating a security gap.
        expect([401, 403]).toContain(response.status);
    });

    it('Admin Routes: GET /api/admin/questions should return 401/403 for public users', async () => {
        const response = await request(app).get('/api/admin/questions');
        expect([401, 403]).toContain(response.status);
    });
});
