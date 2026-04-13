const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  (import.meta.env.PROD
    ? "https://security-posture-tool-production.up.railway.app/api"
    : "http://localhost:4000/api");
const PUBLIC_BASE = `${API_BASE}/public`;
const ADMIN_BASE = `${API_BASE}/admin`;
const WORKSPACE_BASE = `${API_BASE}/workspace`;

const getAuthHeaders = (): Record<string, string> => {
  const token = window.localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiService = {
  // Assessment Flow
  startAssessment: async (companyData: any) => {
    const res = await fetch(`${PUBLIC_BASE}/assessments/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData)
    });
    return res.json();
  },

  getQuestions: async () => {
    const res = await fetch(`${PUBLIC_BASE}/assessments/questions`);
    return res.json();
  },

  submitAssessment: async (id: string, responses: any[]) => {
    const res = await fetch(`${PUBLIC_BASE}/assessments/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses })
    });
    return res.json();
  },

  getResults: async (id: string) => {
    const res = await fetch(`${PUBLIC_BASE}/assessments/${id}/results`);
    return res.json();
  },

  downloadPdfUrl: (id: string) => {
    return `${WORKSPACE_BASE}/reports/${id}/pdf`;
  },

  // Leaderboard
  getLeaderboard: async () => {
    const res = await fetch(`${PUBLIC_BASE}/leaderboard`);
    return res.json();
  },

  // Admin
  getAdminQuestions: async () => {
    const res = await fetch(`${ADMIN_BASE}/questions`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  createQuestion: async (question: any) => {
    const res = await fetch(`${ADMIN_BASE}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(question)
    });
    return res.json();
  },

  updateQuestion: async (id: string, question: any) => {
    const res = await fetch(`${ADMIN_BASE}/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(question)
    });
    return res.json();
  },

  deleteQuestion: async (id: string) => {
    const res = await fetch(`${ADMIN_BASE}/questions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
