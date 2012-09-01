module.exports = function (grunt) {
	grunt.initConfig({
		qunit: {
			SetA: {
				files: { src: ['first.html', 'second.html'] },
				options: { xmlReport: 'seta.xml' }
			},
			SetB: {
				files: { src: ['third.html'] },
				options: { xmlReport: 'setb.xml' }
			}
		}
	});

	grunt.loadTasks('../tasks');

	grunt.registerTask('default', 'qunit');
};

