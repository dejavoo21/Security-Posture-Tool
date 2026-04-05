import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Questionnaire } from '../pages/public/Questionnaire';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { apiService } from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
    apiService: {
        getQuestions: vi.fn(),
        submitAssessment: vi.fn(),
    },
}));

const mockQuestions = [
    { id: '1', text: 'Do you have MFA?', domain: 'Access Control', options: [{ text: 'Yes', scoreValue: 10 }, { text: 'No', scoreValue: 0 }] },
    { id: '2', text: 'Do you have backups?', domain: 'Data Protection', options: [{ text: 'Yes', scoreValue: 10 }, { text: 'No', scoreValue: 0 }] },
];

describe('Questionnaire Component', () => {
    it('should load and display questions', async () => {
        (apiService.getQuestions as any).mockResolvedValue(mockQuestions);

        render(
            <MemoryRouter initialEntries={['/assessment/test-id']}>
                <Questionnaire />
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading questions.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Do you have MFA\?/i)).toBeInTheDocument();
        });
    });

    it('should navigate between questions', async () => {
        (apiService.getQuestions as any).mockResolvedValue(mockQuestions);

        render(
            <MemoryRouter initialEntries={['/assessment/test-id']}>
                <Questionnaire />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText(/Do you have MFA\?/i));

        // Select an answer
        fireEvent.click(screen.getByText('Yes'));

        // Click Next
        fireEvent.click(screen.getByText(/Next Question/i));

        // Should show second question
        await waitFor(() => {
            expect(screen.getByText(/Do you have backups\?/i)).toBeInTheDocument();
        });

        // Click Previous
        fireEvent.click(screen.getByText(/Previous/i));

        await waitFor(() => {
            expect(screen.getByText(/Do you have MFA\?/i)).toBeInTheDocument();
        });
    });

    it('should disable Next button if no answer selected', async () => {
        (apiService.getQuestions as any).mockResolvedValue(mockQuestions);

        render(
            <MemoryRouter initialEntries={['/assessment/test-id']}>
                <Questionnaire />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText(/Do you have MFA\?/i));

        const nextButton = screen.getByText(/Next Question/i);
        expect(nextButton).toBeDisabled();

        fireEvent.click(screen.getByText('Yes'));
        expect(nextButton).not.toBeDisabled();
    });
});
