import type { Request, Response } from "express";
import { domains } from "../../data/domains.js";
import { questions } from "../../data/questions.js";

export const getQuestions = (_req: Request, res: Response): void => {
  res.json({ domains, questions, totalQuestions: questions.length });
};
