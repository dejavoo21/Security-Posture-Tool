import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

export const getConsultantQueue = async (req: any, res: Response) => {
    try {
        const evidenceQueue = await prisma.evidence.findMany({
            where: { reviewStatus: 'SUBMITTED' },
            include: { organization: true, uploadedBy: true }
        });

        const assessmentQueue = await prisma.assessment.findMany({
            where: { reviewStatus: 'SUBMITTED' },
            include: { organization: true }
        });

        res.json({
            evidence: evidenceQueue,
            assessments: assessmentQueue
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch review queue' });
    }
};

export const assignConsultant = async (req: any, res: Response) => {
    try {
        const { organizationId } = req.params;
        const { consultantId } = req.body;

        const updated = await prisma.organization.update({
            where: { id: organizationId },
            data: { assignedConsultantId: consultantId }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign consultant' });
    }
};

export const getConsultantOrganizations = async (req: any, res: Response) => {
    try {
        const orgs = await prisma.organization.findMany({
            where: { assignedConsultantId: req.user.id },
            include: { users: true, assessments: { take: 1, orderBy: { date: 'desc' } } }
        });
        res.json(orgs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assigned organizations' });
    }
};
