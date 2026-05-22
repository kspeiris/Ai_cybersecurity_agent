'use client'

import { useState } from 'react'
import MarkdownContent from '@/components/MarkdownContent'
import SearchBar from '@/components/SearchBar'

export default function ResearchPage() {
  const [searchResult, setSearchResult] = useState<any>(null)

  return (
    <div className="space-y-6 pt-28 md:pt-0">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-accent">RAG Interface</p>
        <h1 className="mt-1 text-3xl font-bold">Cybersecurity Research</h1>
      </div>
      <div className="soc-card p-5">
        <SearchBar onResults={setSearchResult} />
      </div>
      {searchResult && (
        <div className="soc-card p-5">
          <h2 className="mb-3 text-xl font-semibold">AI Answer</h2>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-5 py-4">
            <MarkdownContent content={searchResult.answer ?? JSON.stringify(searchResult, null, 2)} normalize />
          </div>
        </div>
      )}
    </div>
  )
}
