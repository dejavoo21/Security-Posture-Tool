import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

export const listFrameworkPacks = async (req: Request, res: Response) => {
    try {
        const packs = await prisma.frameworkPack.findMany();
        res.json(packs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch framework packs' });
    }
};

export const updateFrameworkPackStatus = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const status = typeof req.body?.status === 'string' ? req.body.status : undefined;

        if (!status) {
            return res.status(400).json({ error: 'A valid string status is required' });
        }

        const updated = await prisma.frameworkPack.update({
            where: { id },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update framework pack status' });
    }
};

export const seedFrameworkPacks = async (req: Request, res: Response) => {
    try {
        const packs = [
            { slug: 'iso-42001', name: 'ISO/IEC 42001 (AI Management)', description: 'International standard for AI management systems.' },
            { slug: 'eu-ai-act', name: 'EU AI Act', description: 'European regulatory framework for artificial intelligence.' },
            { slug: 'ndpa', name: 'NDPA (Nigeria Data Protection Act)', description: 'Compliance requirements for Nigerian data protection.' },
            { slug: 'hitrust', name: 'HITRUST CSF', description: 'Healthcare information security framework.' }
        ];

        for (const p of packs) {
            await prisma.frameworkPack.upsert({
                where: { slug: p.slug },
                update: {},
                create: { ...p, status: 'ACTIVE' }
            });
        }
        res.json({ message: 'Framework packs seeded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to seed framework packs' });
    }
};
