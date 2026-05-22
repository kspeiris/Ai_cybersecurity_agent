'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import api from '@/services/api'

interface Props {
  onResults: (results: any) => void
}

export default function SearchBar({ onResults }: Props) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await api.post(`/ask?query=${encodeURIComponent(query)}`)
      onResults(res.data)
    } catch (error) {
      onResults({ answer: 'Unable to contact the AI backend. Confirm FastAPI is running on port 8000.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about vulnerabilities, e.g. JWT attacks"
        className="min-h-11 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        type="button"
        onClick={handleSearch}
        disabled={loading || !query.trim()}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Search className="h-4 w-4" />
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  )
}
