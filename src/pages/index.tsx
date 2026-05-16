import { useState, useEffect, useCallback } from 'react'
import { Activity, CalculatorValues } from '@/types'
import { getActivities } from '@/data/activities'
import { calculateResults } from '@/utils/formula'
import { ActivitySelector } from '@/components/ActivitySelector'
import { ResultDisplay } from '@/components/ResultDisplay'
import Link from 'next/link'

export default function CalculatorPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [values, setValues] = useState<CalculatorValues>({ A: 0, a: 0, B: 0, b: 0 })
  const [result, setResult] = useState({ C: null as number | null, D: null as number | null, error: null as string | null })

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities()
      setActivities(data)
      if (data.length > 0) {
        setSelectedActivity(data[0])
      }
    }
    fetchActivities()
  }, [])

  const recalculate = useCallback(() => {
    if (selectedActivity) {
      const newResult = calculateResults(selectedActivity.formula_c, selectedActivity.formula_d, values)
      setResult(newResult)
    }
  }, [selectedActivity, values])

  useEffect(() => {
    recalculate()
  }, [recalculate])

  const handleValueChange = (key: keyof CalculatorValues, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleActivityChange = (activity: Activity) => {
    setSelectedActivity(activity)
    setValues({ A: 0, a: 0, B: 0, b: 0 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pb-safe">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">波比计算器</h1>
          <Link href="/admin">
            <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-6 space-y-6">
          <div className="relative">
            <ActivitySelector
              activities={activities}
              selectedActivity={selectedActivity}
              onSelect={handleActivityChange}
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-600 mb-2">子非鱼下单 <span className="text-gray-400">(A)</span></span>
                <div className="flex items-center gap-2 bg-white rounded-xl" style={{ width: '100%', maxWidth: '180px' }}>
                  <button
                    onClick={() => handleValueChange('A', Math.max(0, values.A - 1))}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-100 text-lg font-bold text-green-600 flex-shrink-0 rounded-full"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={values.A || ''}
                    onChange={(e) => handleValueChange('A', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 h-12 text-center text-xl font-bold text-gray-800 bg-white border border-gray-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-lg transition-all"
                  />
                  <button
                    onClick={() => handleValueChange('A', values.A + 1)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-150 text-lg font-bold text-primary-600 flex-shrink-0 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-600 mb-2">子非鱼比率 <span className="text-gray-400">(a)</span></span>
                <div className="flex items-center gap-2 bg-white rounded-xl" style={{ width: '100%', maxWidth: '180px' }}>
                  <button
                    onClick={() => handleValueChange('a', Math.max(0, Math.round((values.a - 0.01) * 100) / 100))}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-150 text-lg font-bold text-green-600 flex-shrink-0 rounded-full"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={values.a || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      handleValueChange('a', Math.max(0, Math.round(val * 100) / 100))
                    }}
                    className="w-20 h-12 text-center text-xl font-bold text-gray-800 bg-white border border-gray-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-lg transition-all"
                  />
                  <button
                    onClick={() => handleValueChange('a', Math.round((values.a + 0.01) * 100) / 100)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-100 text-lg font-bold text-primary-600 flex-shrink-0 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-600 mb-2">OP下单 <span className="text-gray-400">(B)</span></span>
                <div className="flex items-center gap-2 bg-white rounded-xl" style={{ width: '100%', maxWidth: '180px' }}>
                  <button
                    onClick={() => handleValueChange('B', Math.max(0, values.B - 1))}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-100 text-lg font-bold text-green-600 flex-shrink-0 rounded-full"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={values.B || ''}
                    onChange={(e) => handleValueChange('B', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 h-12 text-center text-xl font-bold text-gray-800 bg-white border border-gray-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-lg transition-all"
                  />
                  <button
                    onClick={() => handleValueChange('B', values.B + 1)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-100 text-lg font-bold text-primary-600 flex-shrink-0 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-600 mb-2">OP比率 <span className="text-gray-400">(b)</span></span>
                <div className="flex items-center gap-2 bg-white rounded-xl" style={{ width: '100%', maxWidth: '180px' }}>
                  <button
                    onClick={() => handleValueChange('b', Math.max(0, Math.round((values.b - 0.01) * 100) / 100))}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-100 text-lg font-bold text-green-600 flex-shrink-0 rounded-full"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={values.b || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      handleValueChange('b', Math.max(0, Math.round(val * 100) / 100))
                    }}
                    className="w-20 h-12 text-center text-xl font-bold text-gray-800 bg-white border border-gray-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 rounded-lg transition-all"
                  />
                  <button
                    onClick={() => handleValueChange('b', Math.round((values.b + 0.01) * 100) / 100)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-100 text-lg font-bold text-primary-600 flex-shrink-0 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ResultDisplay
            cResult={result.C}
            dResult={result.D}
            error={result.error}
          />
        </div>
      </div>
    </div>
  )
}
