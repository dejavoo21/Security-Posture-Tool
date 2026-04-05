export type AssessmentStartPayload = {
  companyName: string;
  contactName: string;
  email: string;
  industry: string;
};

export type AssessmentResponsePayload = {
  answers: Array<{
    questionId: string;
    value: number;
  }>;
};
