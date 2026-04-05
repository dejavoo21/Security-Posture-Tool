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

export type Domain = {
  id: string;
  name: string;
  weight: number;
};
