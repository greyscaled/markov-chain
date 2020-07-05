import { ProbabilityMatrix } from "./ProbabilityMatrix";

describe(ProbabilityMatrix.name, () => {
  describe("constructor", () => {
    it("accepts a non-zero length, square input", () => {
      // GIVEN a square input (len of all rows, cols = 3)
      const m = [
        [0.33, 0.33, 0.34],
        [1, 0, 0],
        [0.5, 0.5, 0],
      ];

      // THEN no error is thrown
      expect(() => new ProbabilityMatrix(m)).not.toThrow();
    });

    it("The matrix is immutable", () => {
      // GIVEN a 1x1 matrix
      const m = [[1]];
      const matrix = new ProbabilityMatrix(m);

      // THEN the data is immutable
      expect(matrix.getRowVector(0)).toStrictEqual([1]);
      m[0][0] = 0;
      expect(matrix.getRowVector(0)).toStrictEqual([1]);
    });

    it("throws an Error for zero length input", () => {
      // GIVEN a zero-length input
      const m: number[][] = [];

      // THEN an error is thrown
      const error = "Probabilities array must contain entries";
      expect(() => new ProbabilityMatrix(m)).toThrowError(error);
    });

    it("throws an Error for non-square input", () => {
      // GIVEN a non-square input (len(m) = 1, len(m[1]) = 2)
      const m = [[1, 2]];

      // THEN an error is thrown
      const error = "Probabilities array must be square";
      expect(() => new ProbabilityMatrix(m)).toThrowError(error);
    });

    it("throws an Error for non-probabilistic input", () => {
      // GIVEN an input that doesn't add to 1.0
      const m1 = [[0.99]];

      // GIVEN an input that has values below 0
      const m2 = [
        [-1, 2],
        [1, 0],
      ];

      // GIVEN an input that has values above 1
      const m3 = [[1.1]];

      // THEN an error is thrown
      const error = "Each probability vector must sum to 1 using values in [0, 1]";
      expect(() => new ProbabilityMatrix(m1)).toThrowError(error);
      expect(() => new ProbabilityMatrix(m2)).toThrowError(error);
      expect(() => new ProbabilityMatrix(m3)).toThrowError(error);
    });
  });

  describe("value property", () => {
    it("returns the input matrix", () => {
      // GIVEN a square matrix, m
      const m = [
        [0.33, 0.33, 0.34],
        [1, 0, 0],
        [0.5, 0.5, 0],
      ];

      // WHEN a ProbabilityMatrix is constructed with m
      const matrix = new ProbabilityMatrix(m);

      // THEN value property returns m
      expect(matrix.value).toStrictEqual(m);
    });
  });

  describe("getRowVector(aRow)", () => {
    it("returns the appropriate vector", () => {
      // GIVEN a 3x3 matrix
      const m = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];

      // WHEN a ProbabilityMatrix is constructed from m
      const matrix = new ProbabilityMatrix(m);

      // THEN [0, 1, 0] is returned for (1)
      expect(matrix.getRowVector(1)).toStrictEqual([0, 1, 0]);
    });

    it("throws an Error when aRow is out of bounds", () => {
      // GIVEN a 1x1 matrix
      const m = [[1]];

      // WHEN a ProbabilityMatrix is constructed with m
      const matrix = new ProbabilityMatrix(m);

      // THEN an error is thrown for 2
      const error = `aRow "2" is out of bounds. Must be between [0, 1).`;
      expect(() => matrix.getRowVector(2)).toThrowError(error);
    });
  });

  describe("selectFrom(aRow)", () => {
    it("returns an appropriate index", () => {
      // GIVEN a matrix with one outcome
      const m = [
        [0, 1, 0],
        [0, 1, 0],
        [1, 0, 0],
      ];

      // WHEN a ProbabilityMatrix is constructed with m
      const matrix = new ProbabilityMatrix(m);

      // THEN index 1 (row 2) should always be selected
      const expected = 1;
      let selectedRow = 0;
      for (let i = 0; i < 50; i++) {
        selectedRow = matrix.selectFrom(selectedRow);
        expect(selectedRow).toBe(expected);
      }
    });

    it("throws an Error when aRow is out of bounds", () => {
      // GIVEN a 1x1 matrix
      const m = [[1]];

      // WHEN a ProbabilityMatrix is constructed from m
      const matrix = new ProbabilityMatrix(m);

      // THEN an error is thrown for 2
      const error = `aRow "2" is out of bounds. Must be between [0, 1).`;
      expect(() => matrix.selectFrom(2)).toThrowError(error);
    });
  });
});
