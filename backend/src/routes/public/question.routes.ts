import { Router } from "express";
import { getQuestions } from "../../controllers/public/question.controller.js";

const router = Router();

router.get("/", getQuestions);

export default router;
