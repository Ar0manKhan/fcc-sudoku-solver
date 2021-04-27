'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  // Middleware to validate chack and solve function
  const validateMiddleware = (req, res, next) => {
    let validateResult = solver.validate(req.body.puzzle);
    if (validateResult.error)
      res.json(validateResult);
    else
      next();
  }
  app.use('/api/check', validateMiddleware);
  app.use('/api/solve', validateMiddleware);

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;
      // Validating coordinate and value
      if (!puzzle || !coordinate || !value) {
        res.json({ error: 'Required field(s) missing' })
      } else if (!/^[1-9]$/.test(value)) {
        res.json({ error: 'Invalid value' })
      } else if (!/^[a-iA-I][1-9]$/.test(coordinate)) {
        res.json({ error: 'Invalid coordinate' })
      } else {
        // Extracting data
        let row = coordinate.toUpperCase().charCodeAt(0) - 65;
        let column = parseInt(coordinate[1]) - 1;
        value = parseInt(value);

        // Checking
        let conflict = [];
        if (!solver.checkRowPlacement(puzzle, row, column, value))
          conflict.push('row');
        if (!solver.checkColPlacement(puzzle, row, column, value))
          conflict.push('column');
        if (!solver.checkRegionPlacement(puzzle, row, column, value))
          conflict.push('region');

        if (conflict.length)
          res.json({ valid: false, conflict });
        else
          res.json({ valid: true });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body;
      if (!puzzle) {
        res.send({ error: 'Required field missing' });
      }
      else {
        let solution = solver.solve(puzzle);
        if (solution) res.json({ solution });
        else res.json({ error: 'Puzzle cannot be solved' });
      }
    });
};
