"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data: {
    name: string
    revenue: number
    expenses: number
  }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground text-xs"
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor' }}
            className="text-muted-foreground text-xs"
            tickFormatter={(value) => `AED ${value}`}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--color-card-foreground)' }}
            itemStyle={{ color: 'var(--color-foreground)' }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            name="Revenue"
            stroke="#10b981" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#10b981', stroke: 'var(--color-background)', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            name="Expenses"
            stroke="#f43f5e" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#f43f5e', stroke: 'var(--color-background)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
