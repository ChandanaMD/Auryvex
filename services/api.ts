const API_BASE = "/api";

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  getDashboardStats: () => fetchJson<any>("/dashboard/stats"),

  getMaterials: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as any).toString();
    return fetchJson<any[]>(`/materials${qs ? `?${qs}` : ""}`);
  },

  uploadMaterialFile: async (file: File, userName = "Admin") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_name", userName);
    const res = await fetch(`${API_BASE}/ingestion/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Upload failed");
    }
    return res.json();
  },

  getSampleDatasets: () => fetchJson<any[]>("/ingestion/samples"),

  downloadSampleUrl: (filename: string) => `${API_BASE}/ingestion/samples/${filename}`,

  runHarmonization: (userName = "Chief AI Analyst") =>
    fetchJson<any>(`/harmonization/run?user_name=${encodeURIComponent(userName)}`, { method: "POST" }),

  getMatches: (minConfidence = 0.7, status?: string) => {
    const qs = new URLSearchParams({ min_confidence: String(minConfidence) });
    if (status) qs.append("status", status);
    return fetchJson<any[]>(`/harmonization/matches?${qs.toString()}`);
  },

  getReviewQueue: (status = "PENDING_REVIEW") =>
    fetchJson<any[]>(`/review/queue?status=${encodeURIComponent(status)}`),

  submitReviewAction: (groupId: number, payload: any) =>
    fetchJson<any>(`/review/action/${groupId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getCatalogue: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJson<any[]>(`/catalogue${qs ? `?${qs}` : ""}`);
  },

  getCatalogueDetail: (id: number) => fetchJson<any>(`/catalogue/${id}`),

  getCatalogueGraph: (id: number) => fetchJson<any>(`/catalogue/${id}/graph`),

  queryCopilot: (query: string) =>
    fetchJson<any>("/copilot/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  getAnalyticsSummary: () => fetchJson<any>("/analytics/summary"),

  getDataQualitySummary: () => fetchJson<any>("/quality/summary"),

  remediateDataQuality: () => fetchJson<any>("/quality/remediate", { method: "POST" }),

  getAuditLogs: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchJson<any[]>(`/audit/logs${qs ? `?${qs}` : ""}`);
  },

  getAiWeights: () => fetchJson<any>("/harmonization/weights"),

  updateAiWeights: (weights: any) =>
    fetchJson<any>("/harmonization/weights", {
      method: "POST",
      body: JSON.stringify(weights),
    }),
};
