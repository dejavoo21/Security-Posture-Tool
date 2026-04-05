export type DomainScore = {
  domainId: string;
  domainName: string;
  score: number;
};

export type Recommendation = {
  domainId: string;
  title: string;
  description: string;
};

export type AssessmentResult = {
  assessmentId: string;
  overallScore: number;
  maturityLevel: string;
  riskLevel: string;
  domainScores: DomainScore[];
  recommendations: Recommendation[];
  submittedAt: string;
};
