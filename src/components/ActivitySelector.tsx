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
    <div className="w-full relative sticky top-4 z-40" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-sm w-full h-14 px-6 flex items-center justify-between text-gray-700 font-medium hover:shadow-hover active:scale-98 transition-all duration-200 shimmer-effect"
      >
        <span>{selectedActivity?.name || '选择活动'}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 glass overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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
                className={`w-full px-6 py-4 text-left hover:bg-gray-50/50 transition-colors duration-150 ${
                  selectedActivity?.id === activity.id ? 'bg-gray-50/50 text-primary-600' : 'text-gray-700'
                } ${index !== activities.length - 1 ? 'glass-border-b' : ''}`}
              >
                {activity.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
