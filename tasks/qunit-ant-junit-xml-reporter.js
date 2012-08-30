module.exports = function (grunt) {

	var targets = {};

	function getTarget(targetName) {
		var target = targets[targetName];
		if (!target) {
			target = {
				testSuites: [{
					name: '',
					timestamp: new Date(),
					tests: []
				}],
				currentTestSuite: null,
				currentTest: null
			}
			targets[targetName] = target;
		}
		return target;
	}


	function beginXmlElement(elementName, attributes) {
	  var formattedAttributes = [],
		attribute;

	  for (attribute in attributes || {}) {
		if (Object.prototype.hasOwnProperty.call(attributes, attribute)) {
		  formattedAttributes.push(attribute + '="' + xmlAttributeEncode(attributes[attribute]) + '"');
		}
	  }

	  return '<' + elementName + ' ' + formattedAttributes.join(' ') + '>';
	}

	function endXmlElement(elementName) {
	  return '</' + elementName + '>';
	}

	function xmlEncode(text) {
	  return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;');
	}

	function xmlAttributeEncode(text) {
	  return String(text)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		.replace(/</g, '&lt;');
	}


	grunt.event.on('qunit.moduleStart', function (name) {
		var target = getTarget(grunt.task.current.target),
			testSuite = {
				name: name,
				timestamp: new Date(),
				tests: []
			};

		target.testSuites.push(testSuite);
		target.currentTestSuite = testSuite;

		grunt.verbose.writeln('qunit.moduleStart: ' + name);
	});

	grunt.event.on('qunit.moduleDone', function (name, failed, passed, total) {
		var target = getTarget(grunt.task.current.target);

		target.currentTestSuite = null;
		target.currentTest = null;

		grunt.verbose.writeln('qunit.moduleDone: ' + name + failed + passed + total);
	});

	grunt.event.on('qunit.testStart', function (name) {
		var target = getTarget(grunt.task.current.target),
			test = {
				name: name,
				startTimestamp: new Date(),
				assertions: []
			};

		if (target.currentTestSuite) {
			target.currentTestSuite.tests.push(test);
		} else {
			target.testSuites[0].tests.push(test);
		}

		target.currentTest = test;

		grunt.verbose.writeln('qunit.testStart: ', name);
	});

	grunt.event.on('qunit.testDone', function (name, failed, passed, total) {
		var target = getTarget(grunt.task.current.target),
			test = target.currentTest;

		test.endTimestamp = new Date();
		test.time = test.endTimestamp - test.startTimestamp;
		test.failed = failed;
		test.passed = passed;
		test.total = total;

		target.currentTest = null;

		grunt.verbose.writeln('qunit.testDone: ', name, failed, passed, total);
	});

	grunt.event.on('qunit.log', function (result, actual, expected, message, source) {
		var target = getTarget(grunt.task.current.target),
			test = target.currentTest;

		test.assertions.push({
			result: result,
			actual: actual,
			expected: expected,
			message: message,
			source: source
		});

		grunt.verbose.writeln('qunit.log: ', result, actual, expected, message, source);
	});

	grunt.event.on('qunit.done', function (failed, passed, total, duration) {
		var targetName = grunt.task.current.target,
			target = getTarget(targetName),
			x = '';

		x += beginXmlElement('testsuites', {});

		target.testSuites.forEach(function (testSuite, index) {
			if (index === 0 && !testSuite.tests.length) {
			  return;
			}

			x += beginXmlElement('testsuite', {
				name: testSuite.name,
				tests: testSuite.tests.length,
				timestamp: grunt.template.date(testSuite.timestamp, 'isoDateTime', true)
			});

			testSuite.tests.forEach(function (test) {
				x += beginXmlElement('testcase', {
					name: test.name,
					assertions: test.total,
					time: test.time / 1000
				  });

				test.assertions.forEach(function (assertion) {
					if (assertion.result) {
						return;
					}

					x += beginXmlElement('error', {
						type: 'assertionFailure',
						message: assertion.message
					});

					x += xmlCData(
						'Expected: ' + assertion.expected + '\n' +
						' Result: ' + assertion.actual + '\n' +
						' Source: ' + (assertion.source === null ? '' : assertion.source));

					x += endXmlElement('error');
				});

				x += endXmlElement('testcase');
			});

			x += endXmlElement('testsuite');
		});

		x += endXmlElement('testsuites');

		grunt.verbose.writeln('qunit.done: ' + x, failed, passed, total, duration);
	});
};

