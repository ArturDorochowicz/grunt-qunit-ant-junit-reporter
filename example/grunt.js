module.exports = function (grunt) {
	grunt.initConfig({
		qunit: {
			First: ['first.html'],
			Second: []
		}
	});

	grunt.loadTasks('../tasks');

	grunt.registerTask('default', 'qunit');
};

