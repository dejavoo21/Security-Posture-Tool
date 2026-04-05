import { Request, Response } from 'express';
import { mockQuestions } from '../../data/mockQuestions.js';
import { Question } from '../../types/index.js';
import crypto from 'crypto';

export const getAllQuestions = (req: Request, res: Response) => {
    try {
        res.status(200).json(mockQuestions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions' });
    }
};

export const addQuestion = (req: Request, res: Response) => {
    try {
        const questionBody: Omit<Question, 'id'> = req.body;
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            ...questionBody
        };

        // Default options if none provided
        if (!newQuestion.options || newQuestion.options.length === 0) {
            newQuestion.options = [
                { text: 'Not Implemented', scoreValue: 0 },
                { text: 'Partially Implemented', scoreValue: 33 },
                { text: 'Mostly Implemented', scoreValue: 66 },
                { text: 'Fully Implemented', scoreValue: 100 },
            ];
        }

        mockQuestions.push(newQuestion);
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Error adding question' });
    }
};

export const updateQuestion = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const questionBody: Partial<Question> = req.body;

        const index = mockQuestions.findIndex(q => q.id === id);
        if (index === -1) {
            return res.status(404).json({ message: 'Question not found' });
        }

        mockQuestions[index] = { ...mockQuestions[index], ...questionBody };
        res.status(200).json(mockQuestions[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating question' });
    }
};

export const deleteQuestion = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const index = mockQuestions.findIndex(q => q.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Question not found' });
        }

        mockQuestions.splice(index, 1);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question' });
    }
};
