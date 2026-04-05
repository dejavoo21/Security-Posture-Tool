export interface QuestionOption {
    text: string;
    scoreValue: number;
}

export interface FrameworkMapping {
    frameworkId: string;
    controlId?: string;
}

export interface Question {
    id: string;
    domain: string;
    text: string;
    weight: number;
    options: QuestionOption[];
    mappings: FrameworkMapping[];
    controlIds?: string[];
}

export interface Control {
    id: string;
    title: string;
    domain: string;
    frameworks: string[];
    references: string[];
    description: string;
    expectedEvidence: string[];
    remediationGuidance: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface ControlReadiness {
    controlId: string;
    controlTitle: string;
    status: 'Not Started' | 'Partially Implemented' | 'Largely Implemented' | 'Implemented';
    evidence: string[];
}

export interface Gap {
    controlId: string;
    controlTitle: string;
    frameworks: string[];
    references: string[];
    issueSummary: string;
    severity: 'High' | 'Medium' | 'Low';
    recommendedRemediation: string;
    suggestedEvidence: string[];
    targetTimeline: string;
}

export interface CompanyData {
    name: string;
    industry: string;
    size: string;
    contactName: string;
    email: string;
}

export interface AssessmentResponse {
    questionId: string;
    scoreValue: number;
}

export interface DomainScore {
    domain: string;
    score: number;
    maxScore: number;
    percentage: number;
}

export interface FrameworkScore {
    framework: string;
    score: number;
    maxScore: number;
    percentage: number;
}

export interface Assessment {
    id: string;
    companyData: CompanyData;
    responses: AssessmentResponse[];
    overallScore: number;
    maturityLevel: string;
    riskLevel: string;
    domainScores: DomainScore[];
    frameworkScores: FrameworkScore[];
    controlReadiness?: ControlReadiness[];
    gaps?: Gap[];
    recommendations: string[];
    date: string;
}
