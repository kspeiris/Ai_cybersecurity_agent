'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import ThreatTable from '@/components/ThreatTable'
import api from '@/services/api'
import { Cve } from '@/types'

export default function ThreatFeed() {
  const [cves, setCves] = useState<Cve[]>([])
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/dashboard-data')
        setCves(res.data.feed)
        setUpdatedAt(new Date())
      } catch (err) {
        setCves([])
        setError('Unable to reach FastAPI on port 8000.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6 pt-28 md:pt-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Threat Intelligence</p>
          <h1 className="mt-1 text-3xl font-bold">Threat Feed</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Review correlated CVEs, generated research findings, sources, and detection dates.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-400">
          {loading ? 'Loading feed...' : updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : 'Not connected'}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-high/40 bg-high/10 px-4 py-3 text-sm text-orange-100">
          {error}
        </div>
      )}

      <div className="soc-card p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Correlated Findings</h2>
            <p className="mt-1 text-sm text-slate-400">{cves.length} item{cves.length === 1 ? '' : 's'} in the current feed</p>
          </div>
          {loading && (
            <div className="inline-flex items-center gap-2 text-sm text-slate-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Syncing
            </div>
          )}
        </div>
        <ThreatTable cves={cves} />
      </div>
    </div>
  )
}
