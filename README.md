# markov-chain

A lightweight TS library for computations with markov chains and probability
matrices.

## Modules

### Markov Chain

Represents a finite, discrete-time
[Markov Chain](https://en.wikipedia.org/wiki/Markov_chain#Discrete-time_Markov_chain).

The capabilities of this module are:

- Probabilistic state transition [(see next)](#next-method)
  - A state [transition function](#settransitionfnprev-next-method) can be used
    to dynamically update probabilities
- Reporting if the current state is terminal
  [(see isTerminal)](#isterminal-property)
  - A terminal state will always transition back to itself

#### MarkovChain Import

```ts
import { MarkovChain } from '@vapurrmaid/markov-chain'
```

#### MarkovChain Constructor

- Must supply a N x N array of probabilities as `number[][]`
- Must supply an array of values as `T[]` of size N
- Optionally supply an initialState in `[0, N)`
  - If none is supplied, the default `initialState = 0`

Each row in the matrix corresponds to an index in the values array.

```ts
const values = ["a", "b", "c"]
const m = [
  [0, 1, 0], // always selects row 1 = index 1 = "b"
  [0, 0, 1], // always selects row 2 = index 2 = "c"
  [1, 0, 0]  // always selects row 0 = index 0 = "a"
]
const mc = new MarkovChain(values, m)
```

#### `current` Property

- Returns the value associated to the current state (row) as `T`

#### `hasTransitionFn` Property

- Returns `true` if a transition function is defined, otherwise `false`
- [see `setTransitionFn`](#settransitionfnprev-next-method)

#### `isTerminal` Property

- Returns `true` if the current row is terminal
- Returns `false` if the current row is not terminal

#### `length` Property

- Returns the size of the matrix, N as `number`

#### `probabilityMatrix` Property

- Returns the [probability matrix](#probability-matrix) as: `number[][]`

#### `next()` Method

- Computes and returns the next value as `T` using the probability matrix
- If a [transition function](#settransitionfnprev-next-method) is set, runs the
  transition function

#### `setTransitionFn(prev, next)` Method

- Sets a transition function that is used to alter the
  [probability matrix](#probabilitymatrix-property)
  - Prev is the index (row) of the state before [`next`](#next-method) is called
  - Next is the next index (row) computed after [`next`](#next-method) is called

### Probability Matrix

Represents a probability matrix (aka transition matrix, Markov matrix or
stochastic matrix). In typical mathematical representation, a probability matrix
is formed as:

<p>P = [p<sub>ij</sub>].</p>

Which represents the probability of transitioning to the `i`th column from the
`j`th column. However, column vectors are less intuitive in programming, as they
require methods that span multiple arrays.

Instead, in this implementation each row vector entry represents transitioning
from the `i`th row to the `j`th row. Therefore this representation is a
transpose of the mathematical definition: <span><code>ProbabilityMatrix</code> =
P<sup>T</sup></span>

> **Example**
>
> ```js
> [
>   [0, 1, 0], // row 0
>   [0.5, 0, 0.5], // row 1
>   [1, 0, 0], // row 2
> ];
> ```
>
> In the above example, row 1 (`[0.5, 0, 0.5]`) reads:
>
> - P=0.5 to transition from row 1 to row 0
> - P=0 to transition from row 1 to row 1
> - P=0.5 to transition from row 1 to row 2

#### ProbabilityMatrix Import

```ts
import { ProbabilityMatrix } from '@vapurrmaid/markov-chain'
```

#### ProbabilityMatrix Constructor

- Must be N x N
- Each row must add to `1.0`
  - Each value must be in the interval `[0, 1]`

```ts
const m = [
  [0, 1, 0], // P = 1.0 to transition to row 1
  [0, 0, 1], // P = 1.0 to transition to row 2
  [1, 0, 0]  // P = 1.0 to transition to row 0
]
const matrix = new ProbabilityMatrix(m)
```

#### Properties

- `value` - returns the supplied probabilities as `number[][]`
- `length` - returns the size of the matrix, N as `number`

#### `getRowVector(aRow)` Method

- Returns the probability vector for the specified row as `number[]`
- `aRow` must be a number in the interval `[0, N)`

#### `selectFrom(aRow)` Method

- Using the probabilities defined in the given row, selects the next row as
  `number`
- `aRow` must be a number in the interval `[0, N)`

From the matrix defined above:

```ts
let nextRow = matrix.selectFrom(0)   // 1
nextRow = matrix.selectFrom(nextRow) // 2
nextRow = matrix.selectFrom(nextRow) // 0
```
