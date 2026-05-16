interface ResultDisplayProps {
  cResult: number | null
  dResult: number | null
  error: string | null
}

export function ResultDisplay({ cResult, dResult, error }: ResultDisplayProps) {
  const formatNumber = (num: number | null): string => {
    if (num === null) return '--'
    return num.toFixed(2)
  }

  return (
    <div className="w-full">
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center animate-in fade-in duration-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-2xl p-6 space-y-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">子非鱼获胜 (C)</span>
                <span key={cResult} className="text-3xl font-bold text-primary-700 animate-in fade-in duration-200">{formatNumber(cResult)}</span>
              </div>
              <div className="h-px bg-gray-300" />
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">OP获胜 (D)</span>
                <span key={dResult} className="text-3xl font-bold text-warning-600 animate-in fade-in duration-200">{formatNumber(dResult)}</span>
              </div>
        </div>
      )}
    </div>
  )
}
