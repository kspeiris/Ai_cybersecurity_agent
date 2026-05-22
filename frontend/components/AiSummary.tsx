import { BrainCircuit, CheckCircle2 } from 'lucide-react'
import MarkdownContent from '@/components/MarkdownContent'

interface AiSummaryProps {
  summary: string
  recommendations?: string[]
}

export default function AiSummary({ summary, recommendations = [] }: AiSummaryProps) {
  return (
    <div className="soc-card p-5">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <BrainCircuit className="h-5 w-5 text-accent" />
        AI Security Summary
      </h3>
      <MarkdownContent content={summary} normalize />
      {recommendations.length > 0 && (
        <div className="mt-4 space-y-2">
          {recommendations.map((item) => (
            <div key={item} className="flex gap-2 text-sm text-slate-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-low" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
