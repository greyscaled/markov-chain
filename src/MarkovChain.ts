import { Validate } from "@vapurrmaid/validate";
import { ProbabilityMatrix } from "./ProbabilityMatrix";

export class MarkovChain<T> {
  private readonly values: T[];
  private readonly matrix: ProbabilityMatrix;
  private state = -1;

  constructor(values: T[], matrix: ProbabilityMatrix) {
    Validate.n(values.length).isGreaterThan(0, "No values provided to MarkovChain");
    const lenM = matrix.value.length;
    Validate.n(values.length).is(
      lenM,
      `Number values should match provided matrix size of ${lenM}`
    );
    this.values = values;
    this.matrix = matrix;
  }

  get current(): T | undefined {
    if (this.notStarted()) {
      return undefined;
    }
    return this.values[this.state];
  }

  get hasNext(): boolean {
    if (this.notStarted()) {
      return true;
    }
    const current = this.matrix.value[this.state];
    return current[this.state] !== 1;
  }

  next(): T {
    const selectRow = this.state < 0 ? 0 : this.state;
    const idx = this.matrix.selectFrom(selectRow);
    this.state = idx;
    return this.values[idx];
  }

  private notStarted(): boolean {
    return this.state < 0;
  }
}
