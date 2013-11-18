module.exports = function(grunt) {
	//All to stop caching...

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-replace');

	// Project configuration.
	grunt.initConfig({
		replace: {
		    build_replace: {
		        options: {
		          variables: {
		            // Generate a truly random number by concatenating the current date with a random number
		            // The variable name corresponds with the same in our HTML file
		            'hash': '<%= ((new Date()).valueOf().toString()) + (Math.floor((Math.random()*1000000)+1).toString()) %>',
		            'fizoo' : 'replack'
		          }
		        },
		        // Source and destination files
		        files: [
		          {
		            src: ['index_template.html'],
		            dest: 'index.html'
		          }
		        ]
		    }
	    },
		watch: {
			files: ['index_template.html', 'vidcontrols.js'],
			tasks: ['replace'],
	    },
	});

	grunt.registerTask('default', 'watch');

	grunt.registerTask('processindextemplate', 'Process index template.', function() {
		//var contents = grunt.file.read('index_template.html');
		//how would I process my replacement if I used a method like this?
		//grunt.file.write('index.html', contents);
	});

};