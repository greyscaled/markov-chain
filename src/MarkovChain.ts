import { Validate } from "@vapurrmaid/validate";
import { NumberMatrix, ProbabilityMatrix } from "./ProbabilityMatrix";

/**
 * StateTransitionFn returns a new ProbabilityMatrix. For advanced use
 * previous and next states are provided.
 */
type StateTransitionFn = (prevState: number, nextState: number) => NumberMatrix;

/**
 * Represents a finite, discrete-time MarkovChain.
 */
export class MarkovChain<T> {
  private readonly values: T[];

  private matrix: ProbabilityMatrix;
  private state = 0;
  private transitionFn: StateTransitionFn | undefined;

  /**
   * @param values Vector mapping each state to a value
   * @param probabilities A probabilistic NumberMatrix
   * @param initialState The initial state; defaults to `0`
   * @remark MarkovChains are NxN and the size of `values` and `probabilities` must be equal
   * @throws `RangeError` if NumberMatrix does not have any rows
   * @throws `Error` if NumberMatrix is not square
   * @throws `Error` if NumberMatrix is not probabilistic
   * @throws `RangeError` if `values` does not have any values
   * @throws `Error` if `values` and `probabilities` are not the same size
   * @throws `RangeError` if `initialState` is not within the bounds
   * @see NumberMatrix
   */
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

  /**
   * The current value associated to the current state
   */
  get current(): T {
    return this.values[this.state];
  }

  /**
   * `true` if a transition function exists; otherwise `false`
   * @see setTransitionFn
   */
  get hasTransitionFn(): boolean {
    return this.transitionFn !== undefined;
  }

  /**
   * `true` if in the terminal state; otherwise `false
   * @remark A terminal state implies all transitions lead back to this state
   */
  get isTerminal(): boolean {
    const current = this.matrix.value[this.state];
    return current[this.state] === 1;
  }

  /**
   * The size of this MarkovChain
   */
  get length(): number {
    return this.matrix.length;
  }

  /**
   * The raw, underlying probabilistic NumberMatrix used internally for computing
   * state transitions
   * @remark A copy is returned
   */
  get probabilityMatrix(): NumberMatrix {
    return Array.from(this.matrix.value);
  }

  /**
   * Transitions from the current state to the next state and returns the value
   * associated with the next state
   */
  next(): T {
    const prevState = this.state;
    const nextState = this.matrix.selectFrom(this.state);
    this.state = nextState;

    if (this.transitionFn !== undefined) {
      const newMatrix = this.transitionFn(prevState, nextState);
      Validate.n(newMatrix.length).is(
        this.matrix.length,
        `transition function must create NumberMatrix of length ${this.matrix.length}`
      );
      this.matrix = new ProbabilityMatrix(newMatrix);
    }

    return this.values[nextState];
  }

  /**
   * Add a custom transition function. The transition function is applied
   * each time `next` is called to recreate a new state transition probability
   * matrix.
   * @param fn A transition function
   * @remark If `fn` is `undefined`, the current transition function is removed
   * @see ProbabilityMatrix
   */
  setTransitionFn(fn: StateTransitionFn | undefined): void {
    this.transitionFn = fn;
  }
}
