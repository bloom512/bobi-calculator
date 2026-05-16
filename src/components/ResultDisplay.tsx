import { useEffect, useState } from 'react'

interface ResultDisplayProps {
  cResult: number | null
  dResult: number | null
  error: string | null
}

function AnimatedNumber({ value, className }: { value: number | null; className: string }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (value === null) {
      setDisplayValue(null)
      return
    }

    const startValue = displayValue ?? value
    const endValue = value
    const duration = 300
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 使用缓动函数使动画更丝滑
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, displayValue])

  const formatNumber = (num: number | null): string => {
    if (num === null) return '--'
    return num.toFixed(2)
  }

  return (
    <span className={className}>
      {formatNumber(displayValue)}
    </span>
  )
}

export function ResultDisplay({ cResult, dResult, error }: ResultDisplayProps) {
  return (
    <div className="w-full">
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center animate-in fade-in duration-300">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : (
        <div className="glass p-6 space-y-4">
          <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">子非鱼获胜 <span className="text-gray-400">(C)</span></span>
              <AnimatedNumber value={cResult} className="text-3xl sm:text-4xl font-bold text-primary-600" />
            </div>
            <div className="glass-divider" />
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">OP获胜 <span className="text-gray-400">(D)</span></span>
              <AnimatedNumber value={dResult} className="text-3xl sm:text-4xl font-bold text-warning-500" />
            </div>
        </div>
      )}
    </div>
  )
}