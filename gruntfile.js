module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({
		lint: {
			files: ['tasks/**/*.js'],
			options: {
				options: {
					node: true,
					bitwise: true,
					curly: true,
					eqeqeq: true,
					forin: true,
					immed: true,
					latedef: true,
					newcap: true,
					noarg: true,
					noempty: true,
					nonew: true,
					plusplus: true,
					regexp: true,
					undef: true,
					strict: true,
					trailing: true
				}
			}
		}
	});

	grunt.registerTask('default', 'lint');
};

