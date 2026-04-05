import type { Request, Response } from "express";
import { assessments, results } from "../../services/assessmentStore.js";

export const getResult = (req: Request, res: Response): void => {
  const id = req.params.id as string;
  const assessment = assessments.get(id);
  const result = results.get(id);

  if (!assessment || !result) {
    res.status(404).json({ message: "Result not found." });
    return;
  }

  res.json({ assessment, result });
};

export const getLeaderboard = (_req: Request, res: Response): void => {
  const leaderboard = Array.from(results.values())
    .map((result) => {
      const assessment = assessments.get(result.assessmentId);
      return {
        assessmentId: result.assessmentId,
        companyName: assessment?.companyName ?? "Unknown",
        industry: assessment?.industry ?? "General",
        overallScore: result.overallScore,
        maturityLevel: result.maturityLevel
      };
    })
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 10);

  res.json({ leaderboard });
};
