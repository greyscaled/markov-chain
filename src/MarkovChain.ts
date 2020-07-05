import { Validate } from "@vapurrmaid/validate";
import { NumberMatrix, ProbabilityMatrix } from "./ProbabilityMatrix";

export class MarkovChain<T> {
  private readonly matrix: ProbabilityMatrix;
  private readonly values: T[];
  private state = 0;

  constructor(values: T[], probabilities: NumberMatrix, initialState?: number) {
    this.matrix = new ProbabilityMatrix(probabilities);

    Validate.n(values.length).isGreaterThan(0, "No values provided to MarkovChain");
    const lenM = this.matrix.length;
    Validate.n(values.length).is(
      lenM,
      `Number values should match provided matrix size of ${lenM}`
    );
    this.values = values;

    if (initialState) {
      Validate.n(initialState).inclusiveBetween(
        0,
        lenM - 1,
        `initialState "${initialState}" is out of bounds. Must be between [0, ${lenM}).`
      );
      this.state = initialState;
    }
  }

  get current(): T {
    return this.values[this.state];
  }

  get isTerminal(): boolean {
    const current = this.matrix.value[this.state];
    return current[this.state] === 1;
  }

  get length(): number {
    return this.matrix.length;
  }

  get probabilityMatrix(): NumberMatrix {
    return Array.from(this.matrix.value);
  }

  next(): T {
    const idx = this.matrix.selectFrom(this.state);
    this.state = idx;
    return this.values[idx];
  }
}
