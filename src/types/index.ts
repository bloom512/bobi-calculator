export interface Activity {
  id: string
  name: string
  formula_c: string
  formula_d: string
  created_at: string
}

export interface CalculatorValues {
  A: number
  a: number
  B: number
  b: number
}

export interface CalculationResult {
  C: number | null
  D: number | null
  error: string | null
}
