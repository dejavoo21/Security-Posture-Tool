import type { Recommendation } from "../types/result.js";

export const recommendationLibrary: Record<string, Recommendation[]> = {
  governance: [
    {
      domainId: "governance",
      title: "Formalize policy framework",
      description: "Create, approve, and communicate a core information security policy set with ownership and review cycles."
    }
  ],
  "access-control": [
    {
      domainId: "access-control",
      title: "Strengthen identity controls",
      description: "Roll out MFA for high-risk systems and introduce regular user access reviews for privileged and business-critical accounts."
    }
  ],
  "endpoint-security": [
    {
      domainId: "endpoint-security",
      title: "Improve endpoint resilience",
      description: "Standardize patching timelines and deploy endpoint detection and response across managed devices."
    }
  ],
  "backup-recovery": [
    {
      domainId: "backup-recovery",
      title: "Validate recoverability",
      description: "Define backup scope, retention, and restoration test cycles for critical business services."
    }
  ],
  "incident-response": [
    {
      domainId: "incident-response",
      title: "Operationalize incident response",
      description: "Document response workflows, assign responsibilities, and run periodic tabletop exercises."
    }
  ],
  "vendor-risk": [
    {
      domainId: "vendor-risk",
      title: "Build supplier assurance",
      description: "Introduce vendor due diligence, security clauses, and periodic supplier review for critical providers."
    }
  ]
};
