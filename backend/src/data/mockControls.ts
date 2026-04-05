import { Control } from '../types/index.js';

export const mockControls: Control[] = [
    {
        id: 'CTL-01',
        title: 'Formalized Security Policies',
        domain: 'Governance',
        frameworks: ['ISO 27701', 'SOC 2', 'HIPAA'],
        references: ['ISO 27701 5.2.1', 'SOC 2 CC1.1', 'HIPAA 164.308(a)(1)'],
        description: 'Ensure comprehensive cybersecurity policies exist, are approved by management, and are communicated to all employees.',
        expectedEvidence: ['Information Security Policy Document', 'Acceptable Use Policy', 'Management Approval Sign-offs'],
        remediationGuidance: 'Draft and formally approve core security policies. Ensure they are accessible via an intranet or employee portal.',
        priority: 'High'
    },
    {
        id: 'CTL-02',
        title: 'Annual Risk Assessments',
        domain: 'Risk Management',
        frameworks: ['ISO 27701', 'GDPR', 'SOC 2'],
        references: ['GDPR Art 35', 'SOC 2 CC3.1'],
        description: 'Perform organizational risk assessments annually or upon significant changes to the environment.',
        expectedEvidence: ['Risk Register', 'DPIA/PIA Reports', 'Risk Treatment Plan'],
        remediationGuidance: 'Establish an annual cadence for risk assessments. Track identified risks in a centralized register.',
        priority: 'High'
    },
    {
        id: 'CTL-03',
        title: 'Multi-Factor Authentication (MFA)',
        domain: 'Access Control',
        frameworks: ['SOC 2', 'HIPAA', 'HITRUST'],
        references: ['SOC 2 CC6.1', 'HITRUST 01.0'],
        description: 'Require MFA for all remote access and access to critical organizational systems.',
        expectedEvidence: ['Configuration screenshots from Identity Provider (IdP)', 'MFA enforcement policy', 'User status report showing MFA enabled'],
        remediationGuidance: 'Enforce MFA universally across the identity infrastructure (e.g., Okta, Entra ID) for all user accounts.',
        priority: 'High'
    },
    {
        id: 'CTL-04',
        title: 'Access Review and Offboarding',
        domain: 'Access Control',
        frameworks: ['ISO 27701', 'SOC 2', 'HIPAA'],
        references: ['SOC 2 CC6.3'],
        description: 'Quarterly access reviews and instant access revocation upon termination.',
        expectedEvidence: ['Access review sign-off sheets', 'Termination tickets/logs', 'HR offboarding checklist'],
        remediationGuidance: 'Automate offboarding through IdP lifecycle hooks. Institute mandatory quarterly manager reviews of team access.',
        priority: 'Medium'
    },
    {
        id: 'CTL-05',
        title: 'Data Retention and Sanitization',
        domain: 'Data Protection & Privacy',
        frameworks: ['GDPR', 'NDPA', 'EU AI Act'],
        references: ['GDPR Art 5', 'NDPA Sec 4'],
        description: 'Enforce strict retention schedules and securely wipe data when no longer needed.',
        expectedEvidence: ['Data Retention Policy', 'Automated deletion logs', 'Hardware destruction certificates'],
        remediationGuidance: 'Map organizational data assets and configure automated lifecycle deletion rules in primary data stores.',
        priority: 'High'
    },
    {
        id: 'CTL-06',
        title: 'Endpoint and Database Encryption',
        domain: 'Data Protection & Privacy',
        frameworks: ['HIPAA', 'SOC 2', 'ISO 27701'],
        references: ['HIPAA 164.312(a)(2)(iv)', 'SOC 2 CC6.1'],
        description: 'Utilize AES-256 or equivalent to encrypt laptops (BitLocker/FileVault) and databases at rest.',
        expectedEvidence: ['MDM configuration screenshots showing encryption required', 'Database infrastructure as code (IaC) snippets proving encryption at rest enabled'],
        remediationGuidance: 'Enforce MDM profiles locking disk encryption on user devices. Ensure cloud databases have default KMS keys assigned.',
        priority: 'High'
    },
    {
        id: 'CTL-07',
        title: 'Incident Response Planning',
        domain: 'Incident Response',
        frameworks: ['GDPR', 'HIPAA', 'SOC 2'],
        references: ['GDPR Art 33', 'SOC 2 CC7.3'],
        description: 'Maintain an IRP highlighting breach notification timelines and critical response steps.',
        expectedEvidence: ['Incident Response Plan', 'Contact matrix', 'Incident tracking ticket samples'],
        remediationGuidance: 'Draft an IRP detailing roles, containment steps, and specific sub-72-hour notification triggers for privacy breaches.',
        priority: 'High'
    },
    {
        id: 'CTL-08',
        title: 'Tabletop Exercises',
        domain: 'Incident Response',
        frameworks: ['ISO 27701', 'SOC 2'],
        references: ['SOC 2 CC7.4'],
        description: 'Test the IRP via simulation at least annually to prime the rapid response teams.',
        expectedEvidence: ['After Action Report (AAR)', 'Tabletop slide deck', 'Attendance sheet'],
        remediationGuidance: 'Schedule a cross-functional 2-hour drill simulating a ransomware or data breach event.',
        priority: 'Medium'
    },
    {
        id: 'CTL-09',
        title: 'Vendor Security Assessments',
        domain: 'Third-Party Risk',
        frameworks: ['SOC 2', 'ISO 27701'],
        references: ['SOC 2 CC9.2'],
        description: 'Evaluate vendor risk posture before onboarding and review critical vendors annually.',
        expectedEvidence: ['Completed security questionnaires (e.g., SIG, CAIQ)', 'Vendor assessment approval records', 'SOC 2 reports collected from vendors'],
        remediationGuidance: 'Create a standard vendor approval intake form requiring a SOC 2 Type II or completed security questionnaire.',
        priority: 'High'
    },
    {
        id: 'CTL-10',
        title: 'Logging and Monitoring (SIEM)',
        domain: 'Security Operations',
        frameworks: ['SOC 2', 'HITRUST'],
        references: ['SOC 2 CC7.2'],
        description: 'Centralize audit logs and monitor for suspicious behavior continuously.',
        expectedEvidence: ['SIEM dashboard screenshots', 'Log retention configurations', 'Example of an automatically generated alert'],
        remediationGuidance: 'Deploy a centralized logging solution (e.g., Splunk, Datadog) and forward critical application and infrastructure logs there.',
        priority: 'High'
    },
    {
        id: 'CTL-11',
        title: 'Independent Audits',
        domain: 'Compliance & Audit',
        frameworks: ['SOC 2', 'ISO 27701'],
        references: ['ISO 27701 9.2'],
        description: 'Engage a third-party audit firm (e.g., CPA or ISO auditor) to independently verify controls annually.',
        expectedEvidence: ['SOC 2 Type II Final Report', 'ISO Certificate', 'Audit Engagement Letter'],
        remediationGuidance: 'Select an accredited audit firm to perform a readiness assessment, followed by a formal observation period.',
        priority: 'Low'
    },
    {
        id: 'CTL-12',
        title: 'AI Transparency and Bias Mitigation',
        domain: 'AI Governance',
        frameworks: ['EU AI Act', 'ISO 42001'],
        references: ['EU AI Act Title III', 'ISO 42001 8.2'],
        description: 'Implement transparency disclosures for end-users and continuous bias auditing for high-risk AI.',
        expectedEvidence: ['AI Model Data Cards', 'Bias testing scripts/reports', 'User-facing AI transparency disclaimers'],
        remediationGuidance: 'Publish a public AI transparency statement and integrate a bias evaluation step into the MLOps pipeline before deployment.',
        priority: 'Medium'
    }
];
