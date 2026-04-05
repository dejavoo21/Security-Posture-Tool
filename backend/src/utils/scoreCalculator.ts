import { domains } from "../data/domains.js";
import { questions } from "../data/questions.js";
import { recommendationLibrary } from "../data/recommendations.js";
import type { AssessmentAnswer } from "../types/assessment.js";
import type { AssessmentResult, DomainScore, Recommendation } from "../types/result.js";

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const getMaturityLevel = (score: number): string => {
  if (score <= 20) return "Reactive";
  if (score <= 40) return "Basic";
  if (score <= 60) return "Managed";
  if (score <= 80) return "Secure";
  return "Resilient";
};

const getRiskLevel = (score: number): string => {
  if (score <= 20) return "Critical";
  if (score <= 40) return "High";
  if (score <= 60) return "Moderate";
  if (score <= 80) return "Low";
  return "Very Low";
};

export const calculateAssessmentResult = (
  assessmentId: string,
  answers: AssessmentAnswer[]
): AssessmentResult => {
  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.value]));

  const domainScores: DomainScore[] = domains.map((domain) => {
    const domainQuestions = questions.filter((question) => question.domainId === domain.id);

    const earned = domainQuestions.reduce((sum, question) => {
      const answerValue = clamp(answerMap.get(question.id) ?? 0, 0, 5);
      return sum + answerValue * question.weight;
    }, 0);

    const possible = domainQuestions.reduce((sum, question) => sum + 5 * question.weight, 0);
    const score = possible === 0 ? 0 : Math.round((earned / possible) * 100);

    return {
      domainId: domain.id,
      domainName: domain.name,
      score
    };
  });

  const weightedEarned = domainScores.reduce((sum, item) => {
    const domainWeight = domains.find((domain) => domain.id === item.domainId)?.weight ?? 1;
    return sum + item.score * domainWeight;
  }, 0);

  const totalWeight = domains.reduce((sum, domain) => sum + domain.weight, 0);
  const overallScore = totalWeight === 0 ? 0 : Math.round(weightedEarned / totalWeight);

  const recommendations: Recommendation[] = domainScores
    .filter((item) => item.score < 70)
    .sort((a, b) => a.score - b.score)
    .flatMap((item) => recommendationLibrary[item.domainId] ?? [])
    .slice(0, 5);

  return {
    assessmentId,
    overallScore,
    maturityLevel: getMaturityLevel(overallScore),
    riskLevel: getRiskLevel(overallScore),
    domainScores,
    recommendations,
    submittedAt: new Date().toISOString()
  };
};
