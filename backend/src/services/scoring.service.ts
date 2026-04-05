import { AssessmentResponse, DomainScore, FrameworkScore, Question, ControlReadiness, Gap, Control } from '../types/index.js';
import { mockControls } from '../data/mockControls.js';

export function calculateScore(
    responses: AssessmentResponse[],
    questions: Question[]
): { overallScore: number; domainScores: DomainScore[]; frameworkScores: FrameworkScore[]; controlReadiness: ControlReadiness[]; gaps: Gap[] } {
    const domainTotals: Record<string, { earned: number; max: number }> = {};
    const frameworkTotals: Record<string, { earned: number; max: number }> = {};
    const controlTotals: Record<string, { earned: number; max: number }> = {};

    // Initialize totals based on questions
    for (const q of questions) {
        // Domains
        if (!domainTotals[q.domain]) {
            domainTotals[q.domain] = { earned: 0, max: 0 };
        }
        domainTotals[q.domain].max += q.weight * 100;

        // Frameworks
        for (const mapping of q.mappings) {
            if (!frameworkTotals[mapping.frameworkId]) {
                frameworkTotals[mapping.frameworkId] = { earned: 0, max: 0 };
            }
            frameworkTotals[mapping.frameworkId].max += q.weight * 100;
        }

        // Controls
        for (const cid of (q.controlIds || [])) {
            if (!controlTotals[cid]) {
                controlTotals[cid] = { earned: 0, max: 0 };
            }
            controlTotals[cid].max += q.weight * 100;
        }
    }

    // Add earned points from responses
    for (const response of responses) {
        const question = questions.find((q) => q.id === response.questionId);
        if (!question) continue;

        const points = question.weight * response.scoreValue;

        // Domain tally
        domainTotals[question.domain].earned += points;

        // Framework tally
        for (const mapping of question.mappings) {
            frameworkTotals[mapping.frameworkId].earned += points;
        }

        // Control tally
        for (const cid of (question.controlIds || [])) {
            controlTotals[cid].earned += points;
        }
    }

    const domainScores: DomainScore[] = [];
    let totalEarned = 0;
    let totalMax = 0;

    for (const [domain, totals] of Object.entries(domainTotals)) {
        const percentage = totals.max > 0 ? Math.round((totals.earned / totals.max) * 100) : 0;
        domainScores.push({
            domain,
            score: totals.earned,
            maxScore: totals.max,
            percentage,
        });
        totalEarned += totals.earned;
        totalMax += totals.max;
    }

    const frameworkScores: FrameworkScore[] = [];
    for (const [framework, totals] of Object.entries(frameworkTotals)) {
        const percentage = totals.max > 0 ? Math.round((totals.earned / totals.max) * 100) : 0;
        frameworkScores.push({
            framework,
            score: totals.earned,
            maxScore: totals.max,
            percentage,
        });
    }

    const overallScore = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

    const controlReadiness: ControlReadiness[] = [];
    const gaps: Gap[] = [];

    for (const [controlId, totals] of Object.entries(controlTotals)) {
        const control = mockControls.find(c => c.id === controlId);
        if (!control) continue;

        const ratio = totals.max > 0 ? totals.earned / totals.max : 0;

        let status: ControlReadiness['status'] = 'Not Started';
        if (ratio === 1) status = 'Implemented';
        else if (ratio >= 0.66) status = 'Largely Implemented';
        else if (ratio >= 0.33) status = 'Partially Implemented';

        controlReadiness.push({
            controlId: control.id,
            controlTitle: control.title,
            status,
            evidence: control.expectedEvidence
        });

        // Any control not largely implemented is a gap
        if (ratio < 0.66) {
            gaps.push({
                controlId: control.id,
                controlTitle: control.title,
                frameworks: control.frameworks,
                references: control.references,
                issueSummary: `Missing full implementation for: ${control.title}`,
                severity: control.priority,
                recommendedRemediation: control.remediationGuidance,
                suggestedEvidence: control.expectedEvidence,
                targetTimeline: control.priority === 'High' ? '30 Days' : '90 Days'
            });
        }
    }

    // Sort gaps by severity (High first)
    gaps.sort((a, b) => {
        const srv = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return srv[b.severity] - srv[a.severity];
    });

    return { overallScore, domainScores, frameworkScores, controlReadiness, gaps };
}

export function computeMaturityLevel(score: number): string {
    if (score <= 20) return 'Reactive';
    if (score <= 40) return 'Basic';
    if (score <= 60) return 'Developing';
    if (score <= 80) return 'Managed';
    return 'Resilient';
}

export function computeRiskLevel(score: number): string {
    if (score <= 30) return 'High Risk';
    if (score <= 60) return 'Moderate Risk';
    return 'Lower Risk';
}

export function generateRecommendations(domainScores: DomainScore[], frameworkScores: FrameworkScore[]): string[] {
    const recommendations: string[] = [];

    const sortedDomains = [...domainScores].sort((a, b) => a.percentage - b.percentage);
    const weakerFrameworks = [...frameworkScores].filter(f => f.percentage < 70).map(f => f.framework);

    // Recommendations mapping
    const recommendationMap: Record<string, string> = {
        'Governance': 'Establish formalized cybersecurity policies, procedures, and dedicate a designated security team.',
        'Risk Management': 'Implement an annual risk assessment process explicitly factoring in data privacy impacts.',
        'Access Control': 'Implement Role-Based Access Control (RBAC) and enforce Multi-Factor Authentication (MFA).',
        'Data Protection & Privacy': 'Reinforce database encryption schemas and enforce strict data retention schedules.',
        'Incident Response': 'Develop and test an Incident Response Plan (IRP) through regular tabletop exercises with staff.',
        'Third-Party Risk': 'Conduct strict security assessments for critical third-party vendors and enforce least-privilege principles.',
        'Security Operations': 'Enable centralized, continuous logging and SIEM tracking for mission-critical systems.',
        'Compliance & Audit': 'Prepare and engage a third party for an independent security compliance audit (e.g., SOC 2 Type II).',
        'AI Governance': 'Establish clear transparency bounds and bias mitigation steps for AI workloads.'
    };

    // Provide recommendations based on weakest domains
    for (let i = 0; i < Math.min(4, sortedDomains.length); i++) {
        const domain = sortedDomains[i].domain;
        if (recommendationMap[domain] && sortedDomains[i].percentage < 80) {
            recommendations.push(recommendationMap[domain]);
        }
    }

    if (weakerFrameworks.length > 0) {
        recommendations.push(`Focus on adopting targeted controls for your weakest compliance alignments: ${weakerFrameworks.join(', ')}.`);
    }

    if (recommendations.length === 0) {
        recommendations.push('Maintain continuous monitoring and annual audits to ensure your security posture stays strong.');
    }

    return recommendations;
}
