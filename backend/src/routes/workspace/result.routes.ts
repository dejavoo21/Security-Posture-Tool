import { Router } from "express";
import { getLeaderboard, getResult } from "../../controllers/workspace/result.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/leaderboard", getLeaderboard);
router.get("/:id", getResult);

export default router;
