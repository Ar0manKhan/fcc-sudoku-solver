class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString)
      return {};
    else if (puzzleString.length != 81)
      return { error: 'Expected puzzle to be 81 characters long' };
    else if (/[^\d\.]/.test(puzzleString))
      return { error: 'Invalid characters in puzzle' };
    else
      return { success: 'Validation completed' };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // Creating substring of row
    const rowString = puzzleString.slice(row * 9, (row + 1) * 9);
    for (let i in rowString)
      if (rowString[i] == value && i != column)
        return false;
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++)
      if (puzzleString[9 * i + column] == value && i != row)
        return false;
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        // Creating index for tile of region
        let currentIndex = 9 * (3 * Math.floor(row / 3) + i) + (3 * Math.floor(column / 3) + j);
        if (puzzleString[currentIndex] == value && (row % 3 != i || column % 3 != j))
          return false;
      }
    return true;
  }

  solve(puzzleString) {
    // Setup to transform string into sudoku of array shaped
    let sudoku = [];
    let currentRow = [];
    let count = 0;
    for (let num of puzzleString) {
      if (num == '.')
        currentRow.push(0)
      else
        currentRow.push(parseInt(num))

      if (count == 8) {
        sudoku.push(currentRow);
        currentRow = [];
        count = 0;
      } else {
        count++;
      }
    }

    if (this.sudoku_solve(sudoku, 0, 0)) {
      let return_string = '';
      for (let x of sudoku)
        for (let y of x)
          return_string += y;
      return return_string
    } else {
      return false;
    }
  }

  available_nums(arr, x, y) {
    let number_to_avoid = [];
    let result = [];

    for (let i = 0; i < 9; i++) {
      number_to_avoid.push(arr[x][i]);
      number_to_avoid.push(arr[i][y]);
    }

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        number_to_avoid.push(arr[3 * Math.floor(x / 3) + i][3 * Math.floor(y / 3) + j]);

    for (let i = 1; i < 10; i++)
      if (number_to_avoid.indexOf(i) == -1)
        result.push(i);

    return result;
  }

  sudoku_solve(arr, start_x, start_y) {
    for (let x = start_x; x < 9; x++) {
      for (let y = start_y; y < 9; y++) {
        if (arr[x][y] == 0) {
          for (let k of this.available_nums(arr, x, y)) {
            arr[x][y] = k;

            if (this.sudoku_solve(arr, (y == 8) ? x + 1 : x, (y == 8) ? 0 : y + 1))
              return true;
          }
          arr[x][y] = 0
          return false;
        }
      }
      start_y = 0;
    }

    return true;
  }
}

module.exports = SudokuSolver;

