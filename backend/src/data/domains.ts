import type { Domain } from "../types/assessment.js";

export const domains: Domain[] = [
  { id: "governance", name: "Governance", weight: 1 },
  { id: "access-control", name: "Access Control", weight: 1 },
  { id: "endpoint-security", name: "Endpoint Security", weight: 1 },
  { id: "backup-recovery", name: "Backup & Recovery", weight: 1 },
  { id: "incident-response", name: "Incident Response", weight: 1 },
  { id: "vendor-risk", name: "Vendor Risk", weight: 1 }
];
