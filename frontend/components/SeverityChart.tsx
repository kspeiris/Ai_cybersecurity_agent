'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']

interface Props {
  data: { name: string; value: number }[]
}

export default function SeverityChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={82}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
