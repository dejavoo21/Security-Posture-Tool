import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';

export const createNote = async (req: any, res: Response) => {
    try {
        const { organizationId, content, visibility, linkedType, linkedId } = req.body;
        const note = await prisma.note.create({
            data: {
                organizationId,
                authorId: req.user.id,
                content,
                visibility,
                linkedType,
                linkedId
            },
            include: { author: { select: { fullName: true } } }
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
};

export const getNotes = async (req: any, res: Response) => {
    try {
        const { linkedType, linkedId } = req.query;
        const where: any = { linkedId: String(linkedId) };

        // Organization users only see CLIENT_VISIBLE notes
        if (req.user.role === 'ORG_ADMIN' || req.user.role === 'ASSESSOR' || req.user.role === 'VIEWER') {
            where.visibility = 'CLIENT_VISIBLE';
        }

        const notes = await prisma.note.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { fullName: true } } }
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};
