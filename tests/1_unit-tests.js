const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

suite('UnitTests', () => {
	suite('Validate mathod test', () => {
		const validate = solver.validate;

		// #1
		test('Logic handles a valid puzzle string of 81 characters', () => {
			assert.isDefined(validate(puzzlesAndSolutions[0][0]).success);
			assert.isDefined(validate(puzzlesAndSolutions[0][1]).success);
		});

		// #2
		test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
			assert.deepEqual(
				validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.a7.'),
				{ error: 'Invalid characters in puzzle' }
			);
			assert.deepEqual(
				validate('13576298494638125772845961369451783281293674535782419647329856158167342926914537x'),
				{ error: 'Invalid characters in puzzle' }
			);
		});

		// #3
		test('Logic handles a puzzle string that is not 81 characters in length', () => {
			assert.deepEqual(validate('1244.222'),
				{ error: 'Expected puzzle to be 81 characters long' });
			assert.deepEqual(validate(`${puzzlesAndSolutions[0][0]}.`),
				{ error: 'Expected puzzle to be 81 characters long' });
		});
	});

	suite('checkRowPlacement mathod test', () => {
		const checkRowPlacement = solver.checkRowPlacement;

		// #4
		test('Logic handles valid row placement', () => {
			assert.isTrue(checkRowPlacement(puzzlesAndSolutions[0][0], 0, 1, 3));
			assert.isTrue(checkRowPlacement(puzzlesAndSolutions[0][0], 5, 5, 4));
			assert.isTrue(checkRowPlacement(puzzlesAndSolutions[0][0], 5, 5, 5));
		});

		// #5
		test('Logic handles an invalid row placement', () => {
			assert.isFalse(checkRowPlacement(puzzlesAndSolutions[0][0], 0, 1, 8));
			assert.isFalse(checkRowPlacement(puzzlesAndSolutions[0][0], 6, 8, 8));
			assert.isFalse(checkRowPlacement(puzzlesAndSolutions[0][0], 3, 8, 9));
		});
	});

	suite('checkColPlacement mathod test', () => {
		const checkColPlacement = solver.checkColPlacement;

		// #6
		test('Logic handles a valid column placement', () => {
			assert.isTrue(checkColPlacement(puzzlesAndSolutions[0][0], 3, 0, 5));
			assert.isTrue(checkColPlacement(puzzlesAndSolutions[0][0], 1, 8, 7));
			assert.isTrue(checkColPlacement(puzzlesAndSolutions[0][0], 5, 5, 5));
		})

		// #7
		test('Logic handles an invalid column placement', () => {
			assert.isFalse(checkColPlacement(puzzlesAndSolutions[0][0], 0, 0, 8));
			assert.isFalse(checkColPlacement(puzzlesAndSolutions[0][0], 4, 4, 4));
			assert.isFalse(checkColPlacement(puzzlesAndSolutions[0][0], 0, 8, 9));
		});
	});

	suite('checkRegionPlacement method test', () => {
		const checkRegionPlacement = solver.checkRegionPlacement;

		// #8
		test('Logic handles a valid region (3x3 grid) placement', () => {
			assert.isTrue(checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 1, 4));
			assert.isTrue(checkRegionPlacement(puzzlesAndSolutions[0][0], 4, 4, 5));
			assert.isTrue(checkRegionPlacement(puzzlesAndSolutions[0][0], 6, 8, 4));
		});

		// #9
		test('Logic handles an invalid region (3x3 grid) placement', () => {
			assert.isFalse(checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 1, 6));
			assert.isFalse(checkRegionPlacement(puzzlesAndSolutions[0][0], 5, 5, 2));
			assert.isFalse(checkRegionPlacement(puzzlesAndSolutions[0][0], 6, 5, 4));
		});
	});

	suite('solve method test', () => {
		// #10
		test('Valid puzzle strings pass the solver', () => {
			assert.isDefined(solver.solve(puzzlesAndSolutions[0][0]));
			assert.isDefined(solver.solve(puzzlesAndSolutions[0][1]));
		});

		// #11
		test('Invalid puzzle strings fail the solver', () => {
			assert.isFalse(solver.solve(
				'155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
			));
			assert.isFalse(solver.solve(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..166...926914.37.'
			));
		});

		// #12
		test('Solver returns the expected solution for an incomplete puzzle', () => {
			assert.equal(solver.solve(
				'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
			), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
			assert.equal(solver.solve(
				'5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
			), '568913724342687519197254386685479231219538467734162895926345178473891652851726943');
		});
	});
});
