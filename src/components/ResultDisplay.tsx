import { useEffect, useState, useRef } from 'react'

interface ResultDisplayProps {
  cResult: number | null
  dResult: number | null
  error: string | null
}

function AnimatedNumber({ value, className }: { value: number | null; className: string }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [scale, setScale] = useState(1)
  const prevValue = useRef(value)

  useEffect(() => {
    if (value === null) {
      setDisplayValue(null)
      return
    }

    if (prevValue.current !== value) {
      prevValue.current = value
      
      setDisplayValue(value)
      
      // 弹性缩放动画
      setScale(1.15)
      setTimeout(() => setScale(1), 80)
    }
  }, [value])

  const formatNumber = (num: number | null): string => {
    if (num === null) return '--'
    return num.toFixed(2)
  }

  return (
    <span 
      className={className}
      style={{ 
        display: 'inline-block',
        transform: `scale(${scale})`,
        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
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