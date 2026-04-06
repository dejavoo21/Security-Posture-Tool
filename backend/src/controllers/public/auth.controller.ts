import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { fullName, email, password, organizationName, publicSessionId } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash: hashedPassword,
                role: 'ORG_ADMIN',
                organization: {
                    create: {
                        name: organizationName,
                        industry: 'General',
                        size: 'SME',
                    }
                }
            },
            include: {
                organization: true
            }
        });

        if (publicSessionId && user.organizationId) {
            await convertPublicSession(publicSessionId, user.organizationId, user.id);
        }

        const token = jwt.sign(
            { id: user.id, organizationId: user.organizationId, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
            organization: user.organization,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, publicSessionId } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: true }
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (publicSessionId && user.organizationId) {
            await convertPublicSession(publicSessionId, user.organizationId, user.id);
        }

        const token = jwt.sign(
            { id: user.id, organizationId: user.organizationId, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
            organization: user.organization,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMe = async (req: any, res: Response): Promise<any> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                organizationId: true,
                organization: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function convertPublicSession(sessionId: string, orgId: string, userId: string) {
    const session = await prisma.publicAssessmentSession.findUnique({ where: { id: sessionId } });
    if (!session || session.status !== 'COMPLETED' || session.convertedAt) {
        return;
    }

    const assessment = await prisma.assessment.create({
        data: {
            organizationId: orgId,
            overallScore: session.overallScore || 0,
            maturityLevel: session.maturityLevel || 'Unknown',
            riskLevel: session.riskLevel || 'Unknown',
            date: new Date(),
        }
    });

    await prisma.publicAssessmentSession.update({
        where: { id: sessionId },
        data: {
            convertedAt: new Date(),
            convertedAssessmentId: assessment.id,
            convertedOrganizationId: orgId,
            convertedUserId: userId,
        }
    });
}
