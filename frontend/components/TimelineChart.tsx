'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function TimelineChart({ data }: { data: { day: string; detections: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid stroke="#334155" strokeDasharray="4 4" />
        <XAxis dataKey="day" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
        <Line
          type="monotone"
          dataKey="detections"
          stroke="#06b6d4"
          strokeWidth={3}
          dot={{ fill: '#06b6d4', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
