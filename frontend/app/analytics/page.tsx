'use client'

import { useEffect, useState } from 'react'
import SeverityChart from '@/components/SeverityChart'
import TimelineChart from '@/components/TimelineChart'
import api from '@/services/api'
import { DashboardData } from '@/types'

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    api.get('/dashboard-data').then((res) => setData(res.data)).catch(() => setData(null))
  }, [])

  const chartData = data
    ? [
        { name: 'Critical', value: data.severity.Critical },
        { name: 'High', value: data.severity.High },
        { name: 'Medium', value: data.severity.Medium },
        { name: 'Low', value: data.severity.Low },
      ]
    : []

  return (
    <div className="space-y-6 pt-28 md:pt-0">
      <h1 className="text-3xl font-bold">Threat Analytics</h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="soc-card p-5">
          <h2 className="mb-4 text-xl font-semibold">Severity Mix</h2>
          <SeverityChart data={chartData} />
        </div>
        <div className="soc-card p-5">
          <h2 className="mb-4 text-xl font-semibold">Daily Detections</h2>
          <TimelineChart data={data?.timeline ?? []} />
        </div>
      </div>
      <div className="soc-card p-5">
        <h2 className="mb-4 text-xl font-semibold">OWASP / MITRE Preview</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {['API1 Broken Object Level Authorization', 'T1190 Exploit Public-Facing Application', 'A03 Injection'].map((item) => (
            <div key={item} className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
