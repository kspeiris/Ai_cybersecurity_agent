import { Report } from '@/types'

function reportUrl(path: string) {
  const filename = path.split(/[\\/]/).filter(Boolean).pop()
  return filename ? `http://localhost:8000/report-file/${encodeURIComponent(filename)}` : '#'
}

export default function ReportViewer({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return (
      <div className="soc-card p-5 text-sm text-slate-400">
        No reports yet. Generate research from the dashboard or API to populate this view.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {reports.map((report) => (
        <article key={report.id} className="soc-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{report.topic}</h2>
              <p className="text-sm text-slate-500">{new Date(report.created_at).toLocaleString()}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{report.summary}</p>
            </div>
            <a
              href={reportUrl(report.report_path)}
              target="_blank"
              className="shrink-0 text-sm font-medium text-accent hover:underline"
            >
              View
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}
