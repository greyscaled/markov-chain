import { Validate } from "@vapurrmaid/validate";

/**
 * NumberMatrix represents a Mathematical matrix
 */
export type NumberMatrix = number[][];

/**
 * Represents a probability matrix (aka transition matrix, Markov matrix or
 * stochastic matrix). In typical mathematical representation, a probability
 * matrix is formed as: P = [pij], which represents the probability of
 * transitioning to the `i`th column from the `j`th column. In this
 * implementation each row vector entry represents transitioning from the `i`th
 * row to the `j`th row.
 * @example
 * ```js
 * [
 *   [0, 1, 0],     // row 0
 *   [0.5, 0, 0.5], // row 1
 *   [1, 0, 0],     // row 2
 * ];
 * ```
 *
 * In the above example, row 1 (`[0.5, 0, 0.5]`) reads:
 *
 * - P=0.5 to transition from row 1 to row 0
 * - P=0 to transition from row 1 to row 1
 * - P=0.5 to transition from row 1 to row 2
 */
export class ProbabilityMatrix {
  private readonly matrix: NumberMatrix;

  /**
   * @param probabilities A probabilistic NumberMatrix
   * @throws `RangeError` if NumberMatrix does not have any rows
   * @throws `Error` if NumberMatrix is not square
   * @throws `Error` if NumberMatrix is not probabilistic
   */
  constructor(probabilities: NumberMatrix) {
    Validate.n(probabilities.length).isGreaterThan(0, "Probabilities array must contain entries");
    Validate.isTrue(
      ProbabilityMatrix.isSquare(probabilities),
      "Probabilities array must be square"
    );
    Validate.isTrue(
      ProbabilityMatrix.isProbabilistic(probabilities),
      "Each probability vector must sum to 1 using values in [0, 1]"
    );

    // create a deep copy
    const matrix = [];
    for (const row of probabilities) {
      matrix.push(Array.from(row));
    }
    this.matrix = matrix;
  }

  /**
   * Size of this matrix
   * @remark ProbabilisticMatrices are NxN
   */
  get length(): number {
    return this.matrix.length;
  }

  /**
   * @returns The underlying raw NumberMatrix
   * @remark A copy is returned
   */
  get value(): NumberMatrix {
    return Array.from(this.matrix);
  }

  private static isProbabilistic(matrix: NumberMatrix): boolean {
    for (const m of matrix) {
      // each probability vector must sum to 1
      let sum = 0;

      // each probability entry must be in [0, 1]
      for (const p of m) {
        if (p < 0 || p > 1) {
          return false;
        }
        sum += p;
      }

      if (Math.abs(sum - 1.0) > 0.0001) {
        return false;
      }
    }

    return true;
  }

  private static isSquare(matrix: NumberMatrix): boolean {
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].length !== matrix.length) {
        return false;
      }
    }

    return true;
  }

  private static randNum(): number {
    // Guarantees [0, 1] inclusive
    if (Math.random() === 0) {
      /* istanbul ignore next */
      return 1;
    }
    /* istanbul ignore next */
    return Math.random();
  }

  /**
   * Obtains a row vector
   * @param aRow The row vector to obtain
   * @throws `RangeError` if `aRow` is outside the bounds of this matrix
   * @see length
   */
  getRowVector(aRow: number): number[] {
    Validate.n(aRow).inclusiveBetween(
      0,
      this.matrix.length - 1,
      `aRow "${aRow}" is out of bounds. Must be between [0, ${this.matrix.length}).`
    );
    return Array.from(this.matrix[aRow]);
  }

  /**
   * Returns an index from the provided row that's computed using that rows
   * probabilities.
   * @param aRow The row vector to select a value from
   * @throws `RangeError` if `aRow` is outside the bounds of this matrix
   * @see length
   */
  selectFrom(aRow: number): number {
    Validate.n(aRow).inclusiveBetween(
      0,
      this.matrix.length - 1,
      `aRow "${aRow}" is out of bounds. Must be between [0, ${this.matrix.length}).`
    );
    const row = this.matrix[aRow];
    const randNum = ProbabilityMatrix.randNum();

    let result = 0;
    let sum = 0;
    for (let i = 0; i < row.length; i++) {
      sum += row[i];
      if (randNum <= sum) {
        result = i;
        break;
      }
    }

    return result;
  }
}
