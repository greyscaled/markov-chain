![npm](https://img.shields.io/npm/dw/@vapurrmaid/markov-chain?color=%23ea80fc&style=flat-square)
![npm (scoped with tag)](https://img.shields.io/npm/v/@vapurrmaid/markov-chain/latest?color=%23ea80fc&style=flat-square)
![Test](https://github.com/vapurrmaid/markov-chain/workflows/Test/badge.svg?branch=master&event=push)

# @vapurrmaid/markov-chain

A lightweight TS library for computations with markov chains and probability
matrices.

## Installation

```bash
# yarn
yarn add @vapurrmaid/markov-chain

# npm
npm install --save @vapurrmaid/markov-chain
```

## Modules

### Markov Chain

Represents a finite, discrete-time
[Markov Chain](https://en.wikipedia.org/wiki/Markov_chain#Discrete-time_Markov_chain).

The capabilities of this module are:

- probabilistic state transition [(see next)](#next-method)
- reporting if the current state is terminal [(see hasNext)](#hasnext-property)
  - a terminal state will always transition back to itself

#### MarkovChain Import

```ts
import { MarkovChain } from '@vapurrmaid/markov-chain'
```

#### MarkovChain Constructor

- Must supply a N x N [`ProbabilityMatrix`](#probability-matrix)
- Must supply an array of values of size N
- Optionally supply an initialState in `[0, N)`

Each row in the matrix corresponds to an index in the values array.

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

#### `current` Property

- returns `undefined` if `next()` has never been called
- otherwise returns the current value from the supplied values array

#### `hasNext` Property

- returns `true` if `next()` has never been called
- returns `true` if the current row is not terminal
- returns `false` if the current row is terminal

#### `next()` Method

- computes and returns the next value using the probability matrix

### Probability Matrix

Represents a decision or probability matrix. In typical mathematical
representation, a probability matrix is formed as:

<p>P = [p<sub>ij</sub>].</p>

Which represents the probability of transitioning to the `i`th column from the
`j`th column. However, column vectors are less intuitive in programming, as they
require methods that span multiple arrays.

Instead, each row vector entry represents transitioning from the `i`th row to
the `j`th row. Mathematically, that means this representation is a transpose:
<span><code>ProbabilityMatrix</code> = P<sup>T</sup></span>

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

```ts
const m = [
  [0, 1, 0], // P = 1.0 to transition to row 1
  [0, 0, 1], // P = 1.0 to transition to row 2
  [1, 0, 0]  // P = 1.0 to transition to row 0
]
const matrix = new ProbabilityMatrix(m)
```

#### `getRowVector(aRow)` Method

Returns the probability vector for the specified row.

- `aRow` is a number in `[0, N)`

#### `selectFrom(aRow)` Method

Using the probabilities defined in the given row, selects the next row.

- `aRow` is a number in `[0, N)`

Using the matrix defined above:

```ts
let nextRow = matrix.selectFrom(0)   // 1
nextRow = matrix.selectFrom(nextRow) // 2
nextRow = matrix.selectFrom(nextRow) // 0
```
