export type Domain = {
  id: string;
  name: string;
  weight: number;
};

export type AssessmentStartPayload = {
  companyName: string;
  contactName: string;
  email: string;
  industry: string;
};

export type AssessmentRecord = AssessmentStartPayload & {
  id: string;
  createdAt: string;
  completedAt?: string;
};

export type AssessmentAnswer = {
  questionId: string;
  value: number;
};
