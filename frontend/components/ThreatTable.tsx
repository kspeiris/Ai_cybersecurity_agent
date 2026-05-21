import { Cve } from '@/types'

export default function ThreatTable({ cves }: { cves: Cve[] }) {
  const getSeverityColor = (severity: string) => {
    const value = severity.toUpperCase()
    if (value.includes('CRITICAL')) return 'text-critical'
    if (value.includes('HIGH')) return 'text-high'
    if (value.includes('MEDIUM')) return 'text-medium'
    return 'text-low'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="border-b border-slate-700">
          <tr className="text-left text-slate-400">
            <th className="pb-3">ID</th>
            <th className="pb-3">Severity</th>
            <th className="pb-3">Description</th>
            <th className="pb-3">Source</th>
            <th className="pb-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {cves.map((cve) => (
            <tr key={cve.id} className="border-b border-slate-800">
              <td className="py-3 font-mono text-accent">{cve.id}</td>
              <td className={`py-3 font-semibold ${getSeverityColor(cve.severity)}`}>{cve.severity}</td>
              <td className="max-w-md py-3 text-slate-300">{cve.description}</td>
              <td className="py-3 text-slate-400">{cve.source ?? 'AI correlation'}</td>
              <td className="py-3 text-slate-500">
                {cve.date ? new Date(cve.date).toLocaleDateString() : 'Live'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
