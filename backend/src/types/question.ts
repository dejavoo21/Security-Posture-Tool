export type QuestionOption = {
  label: string;
  value: number;
};

export type Question = {
  id: string;
  domainId: string;
  text: string;
  weight: number;
  options: QuestionOption[];
};
