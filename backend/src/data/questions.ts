import type { Question } from "../types/question.js";

export const questions: Question[] = [
  {
    id: "q1",
    domainId: "governance",
    text: "Do you maintain an approved information security policy?",
    weight: 5,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q2",
    domainId: "governance",
    text: "Are security roles and responsibilities formally assigned?",
    weight: 4,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q3",
    domainId: "access-control",
    text: "Is multi-factor authentication enabled for critical systems?",
    weight: 5,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q4",
    domainId: "access-control",
    text: "Are user access reviews performed on a regular basis?",
    weight: 4,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q5",
    domainId: "endpoint-security",
    text: "Are company endpoints protected with anti-malware and EDR controls?",
    weight: 5,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q6",
    domainId: "endpoint-security",
    text: "Are security patches applied within an agreed timeframe?",
    weight: 5,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q7",
    domainId: "backup-recovery",
    text: "Are critical systems and data backed up regularly?",
    weight: 5,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q8",
    domainId: "backup-recovery",
    text: "Are backup restores tested periodically?",
    weight: 4,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q9",
    domainId: "incident-response",
    text: "Do you have a documented incident response procedure?",
    weight: 5,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q10",
    domainId: "incident-response",
    text: "Are security incidents logged, investigated, and reviewed?",
    weight: 4,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q11",
    domainId: "vendor-risk",
    text: "Are third-party vendors assessed for security risk before onboarding?",
    weight: 4,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  },
  {
    id: "q12",
    domainId: "vendor-risk",
    text: "Do supplier agreements include security obligations where relevant?",
    weight: 3,
    options: [
      { label: "No", value: 0 },
      { label: "Partially", value: 1 },
      { label: "Mostly", value: 3 },
      { label: "Yes", value: 5 }
    ]
  }
];
