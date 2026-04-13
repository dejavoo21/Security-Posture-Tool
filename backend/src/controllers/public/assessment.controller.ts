import { Request, Response } from 'express';
import crypto from 'crypto';
import { mockQuestions, mockAssessments } from '../../data/mockQuestions.js';
import { Assessment, AssessmentResponse, CompanyData } from '../../types/index.js';
import { calculateScore, computeMaturityLevel, computeRiskLevel, generateRecommendations } from '../../services/scoring.service.js';

export const startAssessment = (req: Request, res: Response) => {
  try {
    const companyData: CompanyData = req.body;

    const newAssessment: Assessment = {
      id: crypto.randomUUID(),
      companyData,
      responses: [],
      overallScore: 0,
      maturityLevel: 'Unknown',
      riskLevel: 'Unknown',
      domainScores: [],
      frameworkScores: [],
      recommendations: [],
      date: new Date().toISOString()
    };

    mockAssessments.push(newAssessment);

    res.status(201).json({ id: newAssessment.id, message: 'Assessment started' });
  } catch (error) {
    res.status(500).json({ message: 'Error starting assessment' });
  }
};

export const getQuestions = (req: Request, res: Response) => {
  try {
    res.status(200).json(mockQuestions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving questions' });
  }
};

export const submitAssessment = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { responses } = req.body as { responses: AssessmentResponse[] };

    const assessmentIndex = mockAssessments.findIndex(a => a.id === id);
    if (assessmentIndex === -1) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = mockAssessments[assessmentIndex];
    assessment.responses = responses;

    const { overallScore, domainScores, frameworkScores, controlReadiness, gaps } = calculateScore(responses, mockQuestions);

    assessment.overallScore = overallScore;
    assessment.domainScores = domainScores;
    assessment.frameworkScores = frameworkScores;
    assessment.controlReadiness = controlReadiness;
    assessment.gaps = gaps;
    assessment.maturityLevel = computeMaturityLevel(overallScore);
    assessment.riskLevel = computeRiskLevel(overallScore);
    assessment.recommendations = generateRecommendations(domainScores, frameworkScores);

    mockAssessments[assessmentIndex] = assessment;

    res.status(200).json({ message: 'Assessment completed successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assessment' });
  }
};

export const getAssessmentResults = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assessment = mockAssessments.find(a => a.id === id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.status(200).json({
      id: assessment.id,
      companyData: {
        name: assessment.companyData.name,
        industry: assessment.companyData.industry,
        size: assessment.companyData.size,
      },
      overallScore: assessment.overallScore,
      maturityLevel: assessment.maturityLevel,
      riskLevel: assessment.riskLevel,
      domainScores: assessment.domainScores,
      frameworkScores: assessment.frameworkScores,
      recommendations: assessment.recommendations.slice(0, 5),
      date: assessment.date,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving assessment results' });
  }
};
