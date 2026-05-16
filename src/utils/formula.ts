import { CalculatorValues } from '@/types'

export function validateFormula(formula: string): boolean {
  if (!formula || formula.trim() === '') {
    return false
  }
  
  const sanitized = formula.trim()
  
  const validChars = /^[AaBb0-9+\-*/().\s]+$/
  if (!validChars.test(sanitized)) {
    return false
  }
  
  try {
    const testValues: CalculatorValues = { A: 1, a: 1, B: 1, b: 1 }
    evaluateFormula(sanitized, testValues)
    return true
  } catch {
    return false
  }
}

export function evaluateFormula(formula: string, values: CalculatorValues): number {
  let expression = formula.trim()
  
  expression = expression.replace(/\bA\b/g, values.A.toString())
  expression = expression.replace(/\ba\b/g, values.a.toString())
  expression = expression.replace(/\bB\b/g, values.B.toString())
  expression = expression.replace(/\bb\b/g, values.b.toString())
  
  const sanitized = expression.replace(/[^0-9+\-*/().]/g, '')
  
  const result = new Function(`return ${sanitized}`)()
  
  if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
    throw new Error('Invalid calculation')
  }
  
  return result
}

export function calculateResults(
  formulaC: string,
  formulaD: string,
  values: CalculatorValues
): { C: number | null; D: number | null; error: string | null } {
  try {
    const C = validateFormula(formulaC) ? evaluateFormula(formulaC, values) : null
    const D = validateFormula(formulaD) ? evaluateFormula(formulaD, values) : null
    
    return {
      C: typeof C === 'number' && isFinite(C) ? C : null,
      D: typeof D === 'number' && isFinite(D) ? D : null,
      error: null
    }
  } catch (error) {
    return {
      C: null,
      D: null,
      error: error instanceof Error ? error.message : '计算错误'
    }
  }
}
