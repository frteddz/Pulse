import { useMemo, memo } from 'react'

interface TrendChartProps {
  data: number[]
  color?: string
  height?: number
  max?: number
  label?: string
}

export const TrendChart = memo(function TrendChart({
  data,
  color = '#22d3ee',
  height = 120,
  max = 100,
  label,
}: TrendChartProps) {
  const { dLine, dArea } = useMemo(() => {
    const points = data.length > 0 ? data : [0]

    const width = 500
    const padding = 5
    const chartHeight = height - padding * 2
    const chartWidth = width - padding * 2

    const stepX = points.length > 1 ? chartWidth / (points.length - 1) : chartWidth

    const coordinates = points.map((val, idx) => {
      const x = padding + idx * stepX
      const clampedVal = Math.max(0, Math.min(max, val))
      const y = padding + chartHeight - (clampedVal / max) * chartHeight
      return { x, y }
    })

    const dLine = coordinates.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`
    }, '')

    const dArea =
      coordinates.length > 0
        ? `${dLine} L ${coordinates[coordinates.length - 1].x} ${padding + chartHeight} L ${
            coordinates[0].x
          } ${padding + chartHeight} Z`
        : ''

    return { dLine, dArea }
  }, [data, height, max])

  const safeColorId = color.replace(/[^a-zA-Z0-9]/g, '')

  return (
    <div className="flex flex-col">
      {label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          {label}
        </p>
      )}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-surface-alt p-2 dark:border-border-dark dark:bg-surface-alt-dark">
        <svg
          viewBox={`0 0 500 ${height}`}
          className="w-full h-auto overflow-visible"
          style={{ height }}
        >
          <defs>
            <linearGradient id={`grad-${safeColorId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={dArea} fill={`url(#grad-${safeColorId})`} />

          <path
            d={dLine}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.length > 0 && (
            <circle
              cx={500 - 5}
              cy={(() => {
                const lastVal = data[data.length - 1] ?? 0
                const clamped = Math.max(0, Math.min(max, lastVal))
                return 5 + (height - 10) - (clamped / max) * (height - 10)
              })()}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="dark:stroke-surface-dark"
            />
          )}
        </svg>
      </div>
    </div>
  )
})
