
// matrixValidator.ts – Frontend check for uploaded matrix structure

export function isValidMatrix(matrix: number[][]): boolean {
  if (!Array.isArray(matrix) || matrix.length === 0) return false
  const colCount = matrix[0].length
  return matrix.every(row => Array.isArray(row) && row.length === colCount)
}

export function hasValidRange(matrix: number[][]): boolean {
  return matrix.every(row => row.every(val => typeof val === 'number' && val >= 0))
}

export function validateUploadedMatrix(matrix: number[][]): { valid: boolean; error?: string } {
  if (!isValidMatrix(matrix)) return { valid: false, error: 'Matrix rows are inconsistent' }
  if (!hasValidRange(matrix)) return { valid: false, error: 'Matrix contains invalid numbers' }
  return { valid: true }
}
