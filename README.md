# @vapurrmaid/markov-chain

A library for computations with markov chains and probability matrices.

## Usage

### Markov Chain

- Must supply a NxN decision matrix
- Must supply an array of values of size N

#### MarkovChain Constructor

```ts
const values = ["a", "b", "c"]
const m = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 0]
]
const matrix = new ProbabilityMatrix(m)
const mc = new MarkovChain(values, matrix)
```

#### Current Property

- returns `undefined` if `next()` has never been called
- otherwise returns the current value from the supplied values array

#### hasNext Property

- returns `true` if `next()` has never been called
- returns `true` if the current row is not terminal (meaning it won't re-select itself 100% of the time)
- returns `false` if the current row is terminal

#### next() Method

- computes the next value using the probability matrix

### Probability Matrix

- Must be NxN
- Each row must add to 1.0

#### ProbabilityMatrix Constructor

```ts
const m = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 0]
]
const matrix = new ProbabilityMatrix(m)
```

#### selectFrom(aRow) Method

Using the probabilities defined in the given row, selects the next row.

- `aRow` is a number from 0 to `m.length - 1`

Using the matrix defined above:

```ts
let nextRow = matrix.selectFrom(0)   // 1
nextRow = matrix.selectFrom(nextRow) // 2
nextRow = matrix.selectFrom(nextRow) // 0
```
