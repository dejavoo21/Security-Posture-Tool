import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { mockAssessments } from '../../data/mockQuestions.js';
import type { Assessment, DomainScore } from '../../types/index.js';

export const generatePdfReport = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const assessment = mockAssessments.find((a: Assessment) => a.id === id);

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Security_Posture_Report_${assessment.companyData.name.replace(/[^a-z0-9]/gi, '_')}.pdf`
        );

        doc.pipe(res);

        // Title
        doc.fontSize(24).font('Helvetica-Bold').text('Security Posture Assessment Report', { align: 'center' });
        doc.moveDown(2);

        // Company Details
        doc.fontSize(16).font('Helvetica-Bold').text('Company Details');
        doc.fontSize(12).font('Helvetica').text(`Name: ${assessment.companyData.name}`);
        doc.text(`Industry: ${assessment.companyData.industry}`);
        doc.text(`Size: ${assessment.companyData.size}`);
        doc.text(`Contact: ${assessment.companyData.contactName} (${assessment.companyData.email})`);
        doc.text(`Date: ${new Date(assessment.date).toLocaleDateString()}`);
        doc.moveDown(2);

        // Results
        doc.fontSize(16).font('Helvetica-Bold').text('Assessment Results');
        doc.fontSize(14).fillColor('#0055FF').text(`Overall Score: ${assessment.overallScore} / 100`);
        doc.fontSize(12).fillColor('black').text(`Maturity Level: ${assessment.maturityLevel}`);
        doc.text(`Risk Level: ${assessment.riskLevel}`);
        doc.moveDown(2);

        // Domain Breakdown
        doc.fontSize(16).font('Helvetica-Bold').text('Domain Breakdown');
        assessment.domainScores.forEach((domain: DomainScore) => {
            doc.fontSize(12).font('Helvetica').text(`${domain.domain}: ${domain.percentage}% (${domain.score}/${domain.maxScore})`);
        });
        doc.moveDown(2);

        // Recommendations
        doc.fontSize(16).font('Helvetica-Bold').text('Top Recommendations');
        assessment.recommendations.forEach((rec: string, idx: number) => {
            doc.fontSize(12).font('Helvetica').text(`${idx + 1}. ${rec}`);
            doc.moveDown(0.5);
        });

        doc.end();
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error generating PDF' });
        }
    }
};
