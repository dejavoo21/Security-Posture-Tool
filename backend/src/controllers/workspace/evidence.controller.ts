import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';

export const uploadEvidence = async (req: any, res: Response) => {
    try {
        const { organizationId, linkedEntityType, linkedEntityId, description, originalName, filename, mimeType, fileSize, storagePath } = req.body;

        const evidence = await prisma.evidence.create({
            data: {
                organizationId,
                uploadedByUserId: req.user.id,
                originalName,
                filename,
                mimeType,
                fileSize,
                storagePath,
                linkedEntityType,
                linkedEntityId,
                description,
                reviewStatus: 'SUBMITTED'
            }
        });

        res.status(201).json(evidence);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload evidence record' });
    }
};

export const updateReviewStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { status, reviewNotes } = req.body;

        const updated = await prisma.evidence.update({
            where: { id },
            data: {
                reviewStatus: status,
                reviewerId: req.user.id,
                reviewedAt: new Date(),
                reviewNotes
            }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update evidence review status' });
    }
};

export const listEvidence = async (req: any, res: Response) => {
    try {
        const { organizationId } = req.query;
        const evidence = await prisma.evidence.findMany({
            where: { organizationId: String(organizationId) },
            include: { uploadedBy: { select: { fullName: true } }, reviewer: { select: { fullName: true } } }
        });
        res.json(evidence);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list evidence' });
    }
};
