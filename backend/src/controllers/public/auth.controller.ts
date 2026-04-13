import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import {
    convertPublicSessionToWorkspaceAssessment,
    getPublicSessionOrganizationContext
} from '../../services/publicConversion.service.js';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { fullName, email, password, organizationName, organizationIndustry, organizationSize, publicSessionId } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'Full name, email, and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sessionContext = await getPublicSessionOrganizationContext(publicSessionId);

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash: hashedPassword,
                role: 'ORG_ADMIN',
                organization: {
                    create: {
                        name: organizationName || sessionContext.organizationName || 'My Organization',
                        industry: organizationIndustry || sessionContext.industry || 'General',
                        size: organizationSize || sessionContext.size || 'SME',
                        selectedFrameworks: [],
                    }
                }
            },
            include: {
                organization: true
            }
        });

        const conversion = publicSessionId && user.organizationId
            ? await convertPublicSessionToWorkspaceAssessment(publicSessionId, user.organizationId, user.id)
            : null;

        const token = jwt.sign(
            { id: user.id, organizationId: user.organizationId, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
            organization: user.organization,
            token,
            conversion
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, publicSessionId } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: true }
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const conversion = publicSessionId && user.organizationId
            ? await convertPublicSessionToWorkspaceAssessment(publicSessionId, user.organizationId, user.id)
            : null;

        const token = jwt.sign(
            { id: user.id, organizationId: user.organizationId, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
            organization: user.organization,
            token,
            conversion
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
