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
  });
});
