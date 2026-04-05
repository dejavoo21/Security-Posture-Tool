import { Request, Response } from 'express';
import { mockAssessments } from '../../data/mockQuestions.js';

export const getLeaderboard = (req: Request, res: Response) => {
    try {
        // Only return completed assessments (those with a score)
        const completedAssessments = mockAssessments.filter((a: any) => a.overallScore > 0);

        // Sort by overall score descending
        const sorted = completedAssessments.sort((a: any, b: any) => b.overallScore - a.overallScore);

        // Map to a safe public leaderboard format
        const leaderboard = sorted.map((a: any) => ({
            id: a.id,
            companyName: a.companyData.name,
            industry: a.companyData.industry,
            score: a.overallScore,
            maturityLevel: a.maturityLevel,
            date: a.date
        }));

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving leaderboard' });
    }
};
