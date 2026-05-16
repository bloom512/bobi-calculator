import React, { useState, useRef, useEffect } from 'react'
import { Activity } from '@/types'

interface ActivitySelectorProps {
  activities: Activity[]
  selectedActivity: Activity | null
  onSelect: (activity: Activity) => void
}

export function ActivitySelector({ activities, selectedActivity, onSelect }: ActivitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-6 bg-gradient-to-r from-primary-50 to-white rounded-2xl shadow-soft border border-primary-100 flex items-center justify-between text-gray-700 font-medium hover:shadow-hover hover:border-primary-200 active:scale-[0.98] transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-primary-100 text-primary-600 text-xs font-semibold rounded-full">
            {selectedActivity?.type === 'normal' ? '普通' : '奖励'}
          </span>
          <span className="truncate">{selectedActivity?.name || '选择活动'}</span>
        </div>
        <div className="relative">
          <svg
            className={`w-5 h-5 text-primary-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <div className={`absolute inset-0 bg-primary-50 rounded-full transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-hover border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {activities.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">暂无活动</div>
          ) : (
            activities.map((activity, index) => (
              <button
                key={activity.id}
                onClick={() => {
                  onSelect(activity)
                  setIsOpen(false)
                }}
                className={`w-full px-6 py-4 text-left hover:bg-primary-50 hover:text-primary-700 transition-all duration-150 flex items-center gap-3 ${
                  selectedActivity?.id === activity.id ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                } ${index !== activities.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  activity.type === 'normal' ? 'bg-gray-100 text-gray-600' : 'bg-primary-100 text-primary-600'
                }`}>
                  {activity.type === 'normal' ? '普通' : '奖励'}
                </span>
                <span className="truncate">{activity.name}</span>
                {selectedActivity?.id === activity.id && (
                  <svg className="w-4 h-4 ml-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
