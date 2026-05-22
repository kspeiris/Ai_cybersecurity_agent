'use client'

import { useEffect, useState } from 'react'
import { Download, FilePlus2, Loader2, Trash2, X } from 'lucide-react'
import MarkdownContent from '@/components/MarkdownContent'
import ReportViewer from '@/components/ReportViewer'
import api from '@/services/api'
import { Report, ReportDetail } from '@/types'

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [topic, setTopic] = useState('latest API security vulnerabilities')
  const [loading, setLoading] = useState(false)
  const [viewing, setViewing] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletingAll, setDeletingAll] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function fetchReports() {
    try {
      const res = await api.get('/reports')
      setReports(res.data)
    } catch (err) {
      setReports([])
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    if (!selectedReport) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedReport(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedReport])

  const generateReport = async () => {
    const cleanTopic = topic.trim()
    if (!cleanTopic || loading) return

    setLoading(true)
    setMessage('')
    setError('')
    try {
      await api.post('/research', { topic: cleanTopic })
      setMessage('Report generated successfully.')
      await fetchReports()
    } catch (err) {
      setError('Report generation failed. Confirm the backend is running and your API keys are configured.')
    } finally {
      setLoading(false)
    }
  }

  const viewReport = async (report: Report) => {
    setViewing(true)
    setError('')
    try {
      const res = await api.get(`/reports/${report.id}`)
      setSelectedReport(res.data)
    } catch (err) {
      setError('Could not open the report in the site. Confirm the backend was restarted after the latest changes.')
    } finally {
      setViewing(false)
    }
  }

  const deleteReport = async (report: Report) => {
    const confirmed = window.confirm(`Delete "${report.topic}" from reports, files, and AI memory?`)
    if (!confirmed) return

    setDeletingId(report.id)
    setMessage('')
    setError('')
    try {
      await api.delete(`/reports/${report.id}`)
      if (selectedReport?.id === report.id) setSelectedReport(null)
      setMessage('Report deleted.')
      await fetchReports()
    } catch (err) {
      setError('Delete failed. Confirm the backend was restarted after the latest changes.')
    } finally {
      setDeletingId(null)
    }
  }

  const deleteAllReports = async () => {
    const confirmed = window.confirm('Delete all reports from the database, report files, and AI memory?')
    if (!confirmed) return

    setDeletingAll(true)
    setMessage('')
    setError('')
    try {
      await api.delete('/reports')
      setSelectedReport(null)
      setMessage('All reports deleted.')
      await fetchReports()
    } catch (err) {
      setError('Delete all failed. Confirm the backend was restarted after the latest changes.')
    } finally {
      setDeletingAll(false)
    }
  }

  return (
    <div className="space-y-6 pt-28 md:pt-0">
      <div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-accent">Research Output</p>
            <h1 className="mt-1 text-3xl font-bold">Research Reports</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Generate intelligence reports, read them in the app, and remove outdated report data from the system.
            </p>
          </div>
          <button
            type="button"
            onClick={deleteAllReports}
            disabled={deletingAll || reports.length === 0}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-critical/40 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-critical/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deletingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {deletingAll ? 'Deleting...' : 'Delete All'}
          </button>
        </div>
      </div>

      <div className="soc-card p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Report topic, e.g. latest cloud security vulnerabilities"
            className="min-h-11 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            onKeyDown={(event) => event.key === 'Enter' && generateReport()}
          />
          <button
            type="button"
            onClick={generateReport}
            disabled={loading || !topic.trim()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus2 className="h-4 w-4" />}
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-low">{message}</p>}
        {error && <p className="mt-3 text-sm text-high">{error}</p>}
      </div>

      <ReportViewer reports={reports} deletingId={deletingId} onDelete={deleteReport} onView={viewReport} />

      {viewing && (
        <div className="soc-card p-5 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Opening report...
          </span>
        </div>
      )}

      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedReport(null)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
            className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-slate-700 bg-card shadow-2xl shadow-black/50"
          >
            <div className="border-b border-slate-800 bg-slate-950/50 px-5 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.25em] text-accent">Full Report</p>
                  <h2 id="report-modal-title" className="mt-1 text-2xl font-semibold text-slate-100">
                    {selectedReport.topic}
                  </h2>
                  <p className="mt-1 break-words text-sm text-slate-500">
                    {new Date(selectedReport.created_at).toLocaleString()} - {selectedReport.filename}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/api/report-file/${encodeURIComponent(selectedReport.filename)}`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-accent transition hover:border-accent/70 hover:bg-slate-950/50"
                  >
                    <Download className="h-4 w-4" />
                    Download Markdown
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedReport(null)}
                    aria-label="Close report"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-950/50"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {selectedReport.content ? (
                <MarkdownContent
                  content={selectedReport.content}
                  className="prose-headings:scroll-mt-4 prose-h1:text-2xl prose-h2:border-t prose-h2:border-slate-800 prose-h2:pt-5 prose-p:text-slate-300"
                />
              ) : (
                <p className="rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-8 text-center text-sm text-slate-400">
                  The report record exists, but the Markdown file is missing from the reports folder.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
