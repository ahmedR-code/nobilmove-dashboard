import React, { useState } from 'react'

interface DataPoint {
  label: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  color?: string
}

export const LineChart: React.FC<LineChartProps> = ({ data, color = '#f97316' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Chart layout dimensions
  const width = 500
  const height = 220
  const paddingLeft = 50
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 40

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  // Find max value for Y scaling
  const maxVal = Math.max(...data.map((d) => d.value), 1000)
  const yMax = Math.ceil(maxVal / 10000) * 10000 // Round up to nearest 10k

  // Generate Y-axis grid labels (5 lines)
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax]

  // Calculate coordinates for points
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth
    const y = paddingTop + chartHeight - (d.value / yMax) * chartHeight
    return { x, y, ...d }
  })

  // Create path description for line
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, '')

  // Create filled gradient area path
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : ''

  return (
    <div className="relative w-full h-[260px] select-none" dir="ltr">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {yTicks.map((tick, i) => {
          const y = paddingTop + chartHeight - (tick / yMax) * chartHeight
          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-slate-400 font-sans"
              >
                {tick >= 1000 ? `${tick / 1000}K` : tick}
              </text>
            </g>
          )
        })}

        {/* Shaded Area Under Line */}
        {areaD && (
          <path
            d={areaD}
            fill="url(#chartGradient)"
          />
        )}

        {/* Active Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data Points (Dots) */}
        {points.map((p, index) => (
          <g key={index}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === index ? 6 : 4}
              className="cursor-pointer transition-all duration-150"
              fill={hoveredIndex === index ? '#ffffff' : color}
              stroke={color}
              strokeWidth={hoveredIndex === index ? 3 : 2}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* Transparent hover capture area */}
            <circle
              cx={p.x}
              cy={p.y}
              r={12}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </g>
        ))}

        {/* X-Axis Labels */}
        {points.map((p, index) => (
          <text
            key={index}
            x={p.x}
            y={height - 15}
            textAnchor="middle"
            className="text-xs fill-slate-400 font-sans"
          >
            {p.label}
          </text>
        ))}
      </svg>

      {/* HTML Tooltip overlay */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="absolute z-10 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full border border-slate-700 transition-all duration-150 font-sans"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 8}%`,
          }}
        >
          <div className="font-semibold text-center">{points[hoveredIndex].label}</div>
          <div className="text-xs text-orange-400 text-center font-bold mt-0.5">
            ر.س {points[hoveredIndex].value.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}

interface DonutSlice {
  label: string
  percentage: number
  color: string
}

interface DonutChartProps {
  slices: DonutSlice[]
  totalCount: number
}

export const DonutChart: React.FC<DonutChartProps> = ({ slices, totalCount }) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)

  const size = 180
  const radius = 65
  const strokeWidth = 24
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  // Calculate rotation angles beforehand to satisfy React hooks/immutability check
  const slicesWithAngles = slices.map((slice, index) => {
    const previousPercentageSum = slices.slice(0, index).reduce((sum, s) => sum + s.percentage, 0)
    const rotationAngle = -90 + (previousPercentageSum / 100) * 360
    return { ...slice, rotationAngle }
  })

  return (
    <div className="relative flex items-center justify-center h-[180px]">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform rotate-0">
        {slicesWithAngles.map((slice, index) => {
          const strokeLength = (slice.percentage / 100) * circumference
          const strokeOffset = circumference - strokeLength
          const isHovered = hoveredSlice === index

          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              transform={`rotate(${slice.rotationAngle} ${center} ${center})`}
              className="transition-all duration-300 cursor-pointer origin-center"
              onMouseEnter={() => setHoveredSlice(index)}
              onMouseLeave={() => setHoveredSlice(null)}
            />
          )
        })}

        {/* Center label */}
        <foreignObject
          x={center - radius + 15}
          y={center - radius + 15}
          width={(radius - 15) * 2}
          height={(radius - 15) * 2}
        >
          <div className="flex flex-col items-center justify-center w-full h-full select-none">
            {hoveredSlice !== null ? (
              <>
                <span className="text-xs text-slate-400 font-sans text-center truncate w-full px-1">
                  {slices[hoveredSlice].label}
                </span>
                <span className="text-base font-bold text-slate-700 font-sans mt-0.5">
                  {slices[hoveredSlice].percentage}%
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-400 font-sans text-center leading-none">
                  إجمالي الطلبات
                </span>
                <span className="text-base font-bold text-slate-700 font-sans mt-1">
                  {totalCount.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}
