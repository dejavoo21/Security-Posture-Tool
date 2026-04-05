import type { AssessmentAnswer, AssessmentRecord } from "../types/assessment.js";
import type { AssessmentResult } from "../types/result.js";

export const assessments = new Map<string, AssessmentRecord>();
export const responses = new Map<string, AssessmentAnswer[]>();
export const results = new Map<string, AssessmentResult>();
