export const validateMatrix = (matrix: number[][]): boolean => {
  // 1. Check square matrix
  const size = matrix.length;
  if (matrix.some(row => row.length !== size)) return false;

  // 2. Validate Saaty scale (1/9 to 9)
  const validValues = [1/9,1/8,1/7,1/6,1/5,1/4,1/3,1/2,1,2,3,4,5,6,7,8,9];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === j && matrix[i][j] !== 1) return false;
      if (!validValues.includes(matrix[i][j])) return false;
      if (Math.abs(matrix[i][j] * matrix[j][i] - 1) > 0.001) return false;
    }
  }

  // 3. Check consistency (quick approximation)
  const maxDiff = 0.2; // Allow 20% deviation
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let k = 0; k < size; k++) {
        const expected = matrix[i][k] / matrix[j][k];
        if (Math.abs(matrix[i][j] - expected) > maxDiff) return false;
      }
    }
  }

  return true;
};
