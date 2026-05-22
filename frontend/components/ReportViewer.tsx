import { Report } from '@/types'
import MarkdownContent from '@/components/MarkdownContent'
import { Eye, Trash2 } from 'lucide-react'

interface ReportViewerProps {
  reports: Report[]
  deletingId?: number | null
  onDelete: (report: Report) => void
  onView: (report: Report) => void
}

export default function ReportViewer({ reports, deletingId = null, onDelete, onView }: ReportViewerProps) {
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
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold">{report.topic}</h2>
              <p className="text-sm text-slate-500">{new Date(report.created_at).toLocaleString()}</p>
              <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3">
                <MarkdownContent content={report.summary} normalize />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onView(report)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/70 hover:bg-slate-950/50"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
              <button
                type="button"
                onClick={() => onDelete(report)}
                disabled={deletingId === report.id}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-critical/40 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-critical/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {deletingId === report.id ? 'Deleting' : 'Delete'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
