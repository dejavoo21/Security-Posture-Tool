import { Router } from "express";
import { getLeaderboard, getResult } from "../../controllers/workspace/result.controller.js";

const router = Router();

router.get("/leaderboard", getLeaderboard);
router.get("/:id", getResult);

export default router;
