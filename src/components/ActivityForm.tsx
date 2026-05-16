import React, { useState, useEffect } from 'react'
import { Activity } from '@/types'
import { validateFormula } from '@/utils/formula'

interface ActivityFormProps {
  activity?: Activity | null
  onSubmit: (data: { name: string; formula_c: string; formula_d: string }) => void
  onCancel: () => void
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const [name, setName] = useState('')
  const [formulaC, setFormulaC] = useState('')
  const [formulaD, setFormulaD] = useState('')
  const [errors, setErrors] = useState<{ name?: string; formula_c?: string; formula_d?: string }>({})

  useEffect(() => {
    if (activity) {
      setName(activity.name)
      setFormulaC(activity.formula_c)
      setFormulaD(activity.formula_d)
    }
  }, [activity])

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!name.trim()) {
      newErrors.name = '请输入活动名称'
    }

    if (!formulaC.trim()) {
      newErrors.formula_c = '请输入C计算公式'
    } else if (!validateFormula(formulaC)) {
      newErrors.formula_c = 'C计算公式格式无效'
    }

    if (!formulaD.trim()) {
      newErrors.formula_d = '请输入D计算公式'
    } else if (!validateFormula(formulaD)) {
      newErrors.formula_d = 'D计算公式格式无效'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ name: name.trim(), formula_c: formulaC.trim(), formula_d: formulaD.trim() })
    }
  }

  const handleFormulaChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const allowedChars = /^[AaBb0-9+\-*/().\s]*$/
    if (allowedChars.test(value)) {
      setter(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">活动名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
            errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-primary-400'
          } focus:outline-none focus:ring-2`}
          placeholder="请输入活动名称"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">C计算公式</label>
        <input
          type="text"
          value={formulaC}
          onChange={(e) => handleFormulaChange(setFormulaC, e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 font-mono ${
            errors.formula_c ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-primary-400'
          } focus:outline-none focus:ring-2`}
          placeholder="例如: Aa-B+48"
        />
        {errors.formula_c && <p className="mt-1 text-sm text-red-500">{errors.formula_c}</p>}
        <p className="mt-2 text-xs text-gray-400">支持变量: A, a, B, b | 运算符: + - * / | 支持括号</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">D计算公式</label>
        <input
          type="text"
          value={formulaD}
          onChange={(e) => handleFormulaChange(setFormulaD, e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 font-mono ${
            errors.formula_d ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-primary-400'
          } focus:outline-none focus:ring-2`}
          placeholder="例如: Bb-A-25"
        />
        {errors.formula_d && <p className="mt-1 text-sm text-red-500">{errors.formula_d}</p>}
        <p className="mt-2 text-xs text-gray-400">支持变量: A, a, B, b | 运算符: + - * / | 支持括号</p>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200"
        >
          {activity ? '保存修改' : '创建活动'}
        </button>
      </div>
    </form>
  )
}
