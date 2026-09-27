export interface Material {
  id: number;
  cpse: string;
  plant: string;
  material_code: string;
  description: string;
  category: string;
  manufacturer: string;
  model: string;
  specification: string;
  unit: string;
  quantity: number;
  unit_price: number;
  normalized_description?: string;
  normalized_unit?: string;
  status: "ACTIVE" | "HARMONIZED" | "REDUNDANT";
  standardized_group_id?: number;
  created_at?: string;
}

export interface MatchPair {
  id: number;
  group_id?: number;
  overall_confidence: number;
  description_score: number;
  spec_score: number;
  category_score: number;
  mfr_score: number;
  model_score: number;
  unit_score: number;
  rationale: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  source_material: Material;
  candidate_material: Material;
}

export interface HarmonizationGroup {
  id: number;
  standard_code: string;
  canonical_name: string;
  category: string;
  manufacturer: string;
  model: string;
  specifications: string;
  normalized_unit: string;
  confidence_score: number;
  status: "PENDING_REVIEW" | "APPROVED" | "MODIFIED" | "REJECTED" | "ESCALATED";
  source_count: number;
  source_cpses: string[];
  source_codes: string[];
  ai_explanation?: string[];
  materials?: Material[];
  reviewed_by?: string;
  reviewed_at?: string;
  review_comments?: string;
  created_at?: string;
}

export interface DashboardKPIs {
  total_materials: number;
  potential_duplicates: number;
  equivalent_materials: number;
  standardized_materials: number;
  potential_reduction_pct: number;
  standardization_coverage_pct: number;
  human_approval_rate_pct: number;
}

export interface CopilotResponse {
  query: string;
  answer: string;
  intent: string;
  highlights?: Array<{ label: string; value: string; color: string }>;
  quick_links?: Array<{ title: string; view: string }>;
}

export interface AuditLogItem {
  id: number;
  user_name: string;
  user_role: string;
  action: string;
  target_type: string;
  material_code?: string;
  previous_value?: string;
  new_value?: string;
  comments?: string;
  timestamp: string;
}

export interface DataQualityAnomaly {
  id: number;
  cpse: string;
  material_code: string;
  field_name: string;
  issue_type: string;
  original_value: string;
  suggested_value: string;
  status: "DETECTED" | "REMEDIATED";
}

export type UserRole = "Admin" | "Data Manager" | "AI Analyst" | "Reviewer" | "Viewer";
