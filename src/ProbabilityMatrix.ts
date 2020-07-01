import { Validate } from "@vapurrmaid/validate";

export type NumberMatrix = number[][];

export class ProbabilityMatrix {
  private readonly matrix: NumberMatrix;

  constructor(probabilities: NumberMatrix) {
    Validate.n(probabilities.length).isGreaterThan(0, "Probabilities array must contain entries");
    Validate.isTrue(
      ProbabilityMatrix.isSquare(probabilities),
      "Probabilities array must be square"
    );
    Validate.isTrue(
      ProbabilityMatrix.isProbabilistic(probabilities),
      "Each entry in probabilities array must equat to 1.0"
    );
    this.matrix = probabilities;
  }

  get value(): NumberMatrix {
    return Array.from(this.matrix);
  }

  getRowVector(aRow: number): number[] {
    Validate.n(aRow).inclusiveBetween(
      0,
      this.matrix.length - 1,
      `aRow "${aRow}" is out of bounds. Must be between [0, ${this.matrix.length}).`
    );
    return Array.from(this.matrix[aRow]);
  }

  selectFrom(aRow: number): number {
    Validate.n(aRow).inclusiveBetween(
      0,
      this.matrix.length - 1,
      `Row out of bounds. Must be between (0, ${this.matrix.length - 1}) but got ${aRow}`
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

  private static isProbabilistic(matrix: NumberMatrix): boolean {
    // Each row should sum to 1
    for (let i = 0; i < matrix.length; i++) {
      const sum = matrix[i].reduce((prev, current) => prev + current, 0);
      if (sum !== 1.0) {
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
      return 1;
    }
    return Math.random();
  }
}
