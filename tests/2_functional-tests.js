const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	suite('/api/solve test', () => {
		// #13
		test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.solution, '568913724342687519197254386685479231219538467734162895926345178473891652851726943');

					done();
				});
		});

		// #14
		test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
			chai.request(server)
				.post('/api/solve')
				.send({})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Required field missing');

					done();
				});
		});

		// #15
		test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.a.....4..8916..85.72...3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Invalid characters in puzzle');

					done();
				});
		});

		// #16
		test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72..3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');

					done();
				});
		});

		// #17
		test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: '5.591372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Puzzle cannot be solved');

					done();
				});
		});
	});

	suite('/api/check test', () => {
		// #18
		test('Check a puzzle placement with all fields: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
					coordinate: 'A1',
					value: '5'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.isTrue(res.body.valid);

					done();
				});
		});

		// 19
		test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
					coordinate: 'B2',
					value: '2'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.isFalse(res.body.valid);
					assert.isArray(res.body.conflict);
					assert.equal(res.body.conflict.length, 1);

					done();
				});
		});

		// #20
		test('Check a puzzle placement with multiple placement conflict: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
					coordinate: 'B2',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.isFalse(res.body.valid);
					assert.isArray(res.body.conflict);
					assert.isAbove(res.body.conflict.length, 1);

					done();
				});
		});

		// #21
		test('Check a puzzle placement with all placement conflict: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
					coordinate: 'B2',
					value: '5'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.isFalse(res.body.valid);
					assert.isArray(res.body.conflict);
					assert.equal(res.body.conflict.length, 3);

					done();
				});
		});

		// #22
		test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Required field(s) missing');

					done();
				});
		});

		// #23
		test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3.x.8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
					coordinate: 'B2',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Invalid characters in puzzle')

					done();
				});
		});

		// #24
		test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72..3',
					coordinate: 'B2',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')

					done();
				});
		});

		// #25
		test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
					coordinate: 'J2',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Invalid coordinate');

					done();
				});
		});

		// #26
		test('Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
					coordinate: 'B2',
					value: 'x'
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Invalid value');

					done();
				});
		});
	});
});

