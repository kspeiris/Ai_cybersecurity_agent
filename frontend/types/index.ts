export interface Cve {
  id: string
  severity: string
  description: string
  source?: string
  date?: string
  threat_type?: string
  score?: number
}

export interface NewsItem {
  title: string
  link: string
  summary: string
  published: string
}

export interface Report {
  id: number
  topic: string
  summary: string
  report_path: string
  created_at: string
}

export interface ReportDetail extends Report {
  filename: string
  content: string
}

export interface DashboardReport {
  id: number
  topic: string
  summary: string
  path: string
  created_at: string
}

export interface ThreatStats {
  total: number
  critical: number
  high: number
  medium: number
  low: number
}

export interface DashboardData {
  summary: {
    total_cves: number
    critical_threats: number
    high_severity: number
    reports_generated: number
    risk_score: number
  }
  severity: {
    Critical: number
    High: number
    Medium: number
    Low: number
  }
  timeline: { day: string; detections: number }[]
  feed: Cve[]
  ai: {
    summary: string
    recommendations: string[]
  }
  reports: DashboardReport[]
}
