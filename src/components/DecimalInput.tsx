import React from 'react'

interface DecimalInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

export function DecimalInput({ label, value, onChange }: DecimalInputProps) {
  const handleDecrease = () => {
    onChange(Math.max(0, Math.round((value - 0.01) * 100) / 100))
  }

  const handleIncrease = () => {
    onChange(Math.round((value + 0.01) * 100) / 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const regex = /^\d*\.?\d{0,2}$/
    
    if (regex.test(val)) {
      const newValue = parseFloat(val) || 0
      onChange(Math.max(0, Math.round(newValue * 100) / 100))
    }
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
          type="text"
          inputMode="decimal"
          value={value.toFixed(2)}
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
