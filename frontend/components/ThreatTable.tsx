import { Cve } from '@/types'

export default function ThreatTable({ cves }: { cves: Cve[] }) {
  const getSeverityClass = (severity: string) => {
    const value = severity.toUpperCase()
    if (value.includes('CRITICAL')) return 'border-critical/40 bg-critical/10 text-red-200'
    if (value.includes('HIGH')) return 'border-high/40 bg-high/10 text-orange-200'
    if (value.includes('MEDIUM')) return 'border-medium/40 bg-medium/10 text-yellow-100'
    return 'border-low/40 bg-low/10 text-green-100'
  }

  const stripMarkdown = (value: string) =>
    value
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/^\s*[-*]\s+/gm, '')
      .replace(/\s+/g, ' ')
      .trim()

  const getTitle = (cve: Cve) => {
    const heading = cve.description
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.startsWith('#'))

    return stripMarkdown(heading || cve.description).slice(0, 110) || cve.id
  }

  const getPreview = (cve: Cve) => {
    const lines = cve.description
      .split('\n')
      .map((line) => stripMarkdown(line))
      .filter(Boolean)
      .filter((line) => !line.toLowerCase().startsWith('multi-agent research report'))
      .filter((line) => !['cves summary', 'executive summary'].includes(line.toLowerCase()))

    const preview = lines.slice(0, 3).join(' - ')
    if (preview.length > 20) return preview.length > 260 ? `${preview.slice(0, 260)}...` : preview

    return `Generated research finding from ${cve.source ?? 'AI correlation'}. Open the related report for the full analysis.`
  }

  if (cves.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-8 text-center text-sm text-slate-400">
        No threat feed entries available yet.
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {cves.map((cve) => (
        <article
          key={cve.id}
          className="rounded-lg border border-slate-800 bg-slate-950/35 p-4 transition hover:border-slate-700 hover:bg-slate-950/55"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-accent">{cve.id}</span>
                <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${getSeverityClass(cve.severity)}`}>
                  {cve.severity}
                </span>
              </div>
              <h3 className="text-base font-semibold leading-6 text-slate-100">{getTitle(cve)}</h3>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">{getPreview(cve)}</p>
            </div>
            <div className="grid shrink-0 gap-2 text-sm text-slate-400 sm:grid-cols-2 lg:w-56 lg:grid-cols-1">
              <div className="rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Source</p>
                <p className="mt-1 truncate text-slate-300">{cve.source ?? 'AI correlation'}</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Date</p>
                <p className="mt-1 text-slate-300">{cve.date ? new Date(cve.date).toLocaleDateString() : 'Live'}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
