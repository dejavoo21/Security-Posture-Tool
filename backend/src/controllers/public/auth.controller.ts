import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import {
    convertPublicSessionToWorkspaceAssessment,
    getPublicSessionOrganizationContext,
    validatePublicSessionForConversion
} from '../../services/publicConversion.service.js';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const publicSessionErrorResponse = (status: string) => {
    if (status === 'not_found') {
        return { code: 404, error: 'We could not find this assessment session. Please return to your results page and try again.' };
    }

    if (status === 'expired') {
        return { code: 410, error: 'This assessment session has expired. Please start a new assessment.' };
    }

    if (status === 'already_converted') {
        return { code: 409, error: 'This assessment has already been saved to a workspace. Please sign in to continue.' };
    }

    if (status === 'not_completed') {
        return { code: 409, error: 'This assessment is not complete yet. Please finish the questionnaire before saving it.' };
    }

    return null;
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { fullName, email, password, organizationName, organizationIndustry, organizationSize, publicSessionId } = req.body;
        console.info('[auth.register] attempt', { email, hasPublicSession: Boolean(publicSessionId) });

        if (!fullName || !email || !password) {
            return res.status(400).json({
                error: 'Please provide your full name, email, and password.',
                fields: {
                    fullName: !fullName ? 'Full name is required' : undefined,
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined,
                }
            });
        }

        if (String(password).length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters.',
                fields: { password: 'Use at least 8 characters' }
            });
        }

        const preflight = await validatePublicSessionForConversion(publicSessionId);
        if (preflight) {
            console.info('[auth.register] public session preflight', { publicSessionId, status: preflight.status });
            const expectedError = publicSessionErrorResponse(preflight.status);
            if (expectedError) {
                return res.status(expectedError.code).json({
                    error: expectedError.error,
                    conversion: preflight
                });
            }
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.info('[auth.register] email already exists', { email });
            return res.status(409).json({
                error: 'An account with this email already exists. Please sign in instead.',
                code: 'EMAIL_EXISTS'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sessionContext = await getPublicSessionOrganizationContext(publicSessionId);
        console.info('[auth.register] creating organization', {
            email,
            organizationName: organizationName || sessionContext.organizationName || 'My Organization',
            hasSessionContext: Boolean(sessionContext.organizationName)
        });

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

        if (conversion) {
            console.info('[auth.register] conversion result', {
                email,
                publicSessionId,
                status: conversion.status,
                assessmentId: conversion.assessmentId
            });

            const expectedError = publicSessionErrorResponse(conversion.status);
            if (expectedError) {
                if (user.organizationId) {
                    await prisma.organization.delete({ where: { id: user.organizationId } }).catch(() => undefined);
                }
                return res.status(expectedError.code).json({
                    error: expectedError.error,
                    conversion
                });
            }
        }

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
        console.error('[auth.register] unexpected failure', {
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        res.status(500).json({ error: 'We could not create your account right now. Please try again.' });
    }
};
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, publicSessionId } = req.body;
        console.info('[auth.login] attempt', { email, hasPublicSession: Boolean(publicSessionId) });

        if (!email || !password) {
            return res.status(400).json({
                error: 'Please enter your email and password.',
                fields: {
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined,
                }
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: true }
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'The email or password is incorrect.' });
        }

        if (publicSessionId) {
            const preflight = await validatePublicSessionForConversion(publicSessionId);
            if (preflight) {
                console.info('[auth.login] public session preflight', { publicSessionId, status: preflight.status });
                const expectedError = publicSessionErrorResponse(preflight.status);
                if (expectedError && preflight.status !== 'already_converted') {
                    return res.status(expectedError.code).json({
                        error: expectedError.error,
                        conversion: preflight
                    });
                }
            }
        }

        const conversion = publicSessionId && user.organizationId
            ? await convertPublicSessionToWorkspaceAssessment(publicSessionId, user.organizationId, user.id)
            : null;

        if (conversion) {
            console.info('[auth.login] conversion result', {
                email,
                publicSessionId,
                status: conversion.status,
                assessmentId: conversion.assessmentId
            });

            const expectedError = publicSessionErrorResponse(conversion.status);
            if (expectedError && conversion.status !== 'already_converted') {
                return res.status(expectedError.code).json({
                    error: expectedError.error,
                    conversion
                });
            }
        }

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
        console.error('[auth.login] unexpected failure', {
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        res.status(500).json({ error: 'We could not sign you in right now. Please try again.' });
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
