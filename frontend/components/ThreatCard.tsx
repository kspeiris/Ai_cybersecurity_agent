interface ThreatCardProps {
  title: string
  value: number
  color: string
  icon?: React.ReactNode
  caption?: string
}

export default function ThreatCard({ title, value, color, icon, caption }: ThreatCardProps) {
  return (
    <div className="soc-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
          {caption && <p className="mt-2 text-xs text-slate-500">{caption}</p>}
        </div>
        {icon && <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-slate-400">{icon}</div>}
      </div>
    </div>
  )
}
