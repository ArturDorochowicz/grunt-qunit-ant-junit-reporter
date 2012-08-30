module.exports = function (grunt) {

	grunt.event.on('qunit.moduleStart', function (name) {
		console.log('qunit.moduleStart: ', name);
	});

	grunt.event.on('qunit.moduleDone', function (name, failed, passed, total) {
		console.log('qunit.moduleDone: ', name, failed, passed, total);
	});

	grunt.event.on('qunit.log', function (result, actual, expected, message, source) {
		console.log('qunit.log: ', result, actual, expected, message, source);
	});

	grunt.event.on('qunit.testStart', function (name) {
		console.log('qunit.testStart: ', name);
	});

	grunt.event.on('qunit.testDone', function (name, failed, passed, total) {
		console.log('qunit.testDone: ', name, failed, passed, total);
	});

	grunt.event.on('qunit.done', function (failed, passed, total, duration) {
		console.log('qunit.done: ', failed, passed, total, duration);
	});
};

