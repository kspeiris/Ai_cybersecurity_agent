'use client'

import { useEffect, useState } from 'react'
import ThreatTable from '@/components/ThreatTable'
import api from '@/services/api'
import { Cve } from '@/types'

export default function ThreatFeed() {
  const [cves, setCves] = useState<Cve[]>([])

  useEffect(() => {
    async function load() {
      const res = await api.get('/dashboard-data')
      setCves(res.data.feed)
    }
    load().catch(() => setCves([]))
  }, [])

  return (
    <div className="space-y-6 pt-28 md:pt-0">
      <h1 className="text-3xl font-bold">Threat Feed</h1>
      <div className="soc-card p-5">
        <ThreatTable cves={cves} />
      </div>
    </div>
  )
}
