import React from 'react'

interface IntegerInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

export function IntegerInput({ label, value, onChange }: IntegerInputProps) {
  const handleDecrease = () => {
    onChange(Math.max(0, value - 1))
  }

  const handleIncrease = () => {
    onChange(value + 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0
    onChange(Math.max(0, newValue))
  }

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-semibold text-gray-600 mb-2">{label}</span>
      <div className="flex items-center bg-white rounded-2xl shadow-soft overflow-hidden">
        <button
          onClick={handleDecrease}
          className="w-12 h-14 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 text-xl font-bold text-gray-600"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          className="w-20 h-14 text-center text-xl font-bold text-gray-800 bg-white outline-none border-x border-gray-100"
        />
        <button
          onClick={handleIncrease}
          className="w-12 h-14 flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 text-xl font-bold text-gray-600"
        >
          +
        </button>
      </div>
    </div>
  )
}
