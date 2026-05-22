'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Activity, AlertTriangle, ArrowUpRight, FileText, Shield } from 'lucide-react'
import AiSummary from '@/components/AiSummary'
import SeverityChart from '@/components/SeverityChart'
import SourceChart from '@/components/SourceChart'
import ThreatCard from '@/components/ThreatCard'
import ThreatTable from '@/components/ThreatTable'
import TimelineChart from '@/components/TimelineChart'
import api from '@/services/api'
import { DashboardData } from '@/types'

const fallback: DashboardData = {
  summary: {
    total_cves: 0,
    critical_threats: 0,
    high_severity: 0,
    reports_generated: 0,
    risk_score: 0,
  },
  severity: { Critical: 0, High: 0, Medium: 0, Low: 0 },
  timeline: [],
  feed: [],
  ai: {
    summary: 'Loading AI security intelligence from FastAPI...',
    recommendations: [],
  },
  reports: [],
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(fallback)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/dashboard-data')
        setData(res.data)
        setUpdatedAt(new Date())
      } catch (error) {
        setData({
          ...fallback,
          ai: {
            summary: 'Unable to reach FastAPI. Start the backend on port 8000 to load live dashboard data.',
            recommendations: ['Run uvicorn main:app --reload --port 8000', 'Then refresh this Next.js dashboard.'],
          },
        })
      }
    }

    fetchData()
    const timer = window.setInterval(fetchData, 30000)
    return () => window.clearInterval(timer)
  }, [])

  const chartData = [
    { name: 'Critical', value: data.severity.Critical },
    { name: 'High', value: data.severity.High },
    { name: 'Medium', value: data.severity.Medium },
    { name: 'Low', value: data.severity.Low },
  ]

  const sourceData = (() => {
    const counts: Record<string, number> = {}
    data.feed.forEach(f => {
      const srcName = f.source || 'Unknown'
      counts[srcName] = (counts[srcName] || 0) + 1
    })
    const arr = Object.entries(counts).map(([name, value]) => ({ name: name.substring(0, 15), value }))
    return arr.length ? arr : [{ name: 'NVD', value: 0 }, { name: 'GitHub', value: 0 }, { name: 'News', value: 0 }]
  })()

  return (
    <div className="space-y-6 pt-28 md:pt-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">SOC Command</p>
          <h1 className="mt-1 text-3xl font-bold">Security Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Live CVE intelligence, generated research, and AI triage signals in one analyst view.
          </p>
        </div>
        <p className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-400">
          {updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : 'Connecting...'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ThreatCard title="Critical Threats" value={data.summary.critical_threats} color="text-critical" caption="Immediate triage" icon={<AlertTriangle className="h-5 w-5" />} />
        <ThreatCard title="High Severity" value={data.summary.high_severity} color="text-high" caption="Prioritize this sprint" icon={<Shield className="h-5 w-5" />} />
        <ThreatCard title="Reports Generated" value={data.summary.reports_generated} color="text-accent" caption="Stored research runs" icon={<FileText className="h-5 w-5" />} />
        <ThreatCard title="AI Risk Score" value={data.summary.risk_score} color="text-accent" caption="Composite score" icon={<Activity className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="soc-card p-5">
          <h2 className="mb-4 text-xl font-semibold">Severity Distribution</h2>
          <SeverityChart data={chartData} />
        </div>
        <div className="soc-card p-5">
          <h2 className="mb-4 text-xl font-semibold">Threat Timeline</h2>
          <TimelineChart data={data.timeline} />
        </div>
        <div className="soc-card p-5">
          <h2 className="mb-4 text-xl font-semibold">Source Feed</h2>
          <SourceChart data={sourceData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="soc-card p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Latest Threat Feed</h2>
              <p className="mt-1 text-sm text-slate-400">{data.feed.length} correlated finding{data.feed.length === 1 ? '' : 's'}</p>
            </div>
            <Link
              href="/threat-feed"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/70 hover:bg-slate-950/50"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <ThreatTable cves={data.feed} />
        </div>
        <AiSummary summary={data.ai.summary} recommendations={data.ai.recommendations} />
      </div>
    </div>
  )
}
