module.exports = function(grunt) {

    // configure the tasks
    grunt.initConfig({

        copy: {
            build: {
                cwd: 'source',
                src: [ '**/*.html' ],
                dest: 'public/t',
                expand: true
            }
        },
/*
        clean: {
            build: {
                src: [ 'build' ]
            }
        },*/

        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'public/js/app.js': [ 'source/**/*.js' ]
                }
            }
        },

        watch: {
            scripts: {
                files: 'source/**/*.js',
                tasks: ['uglify']
            },
            templates: {
                files: 'source/**/*.html',
                tasks: ['copy']
            }
        }

    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
   // grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // define the tasks
    grunt.registerTask(
        'default',
        'Builds JS',
        ['watch']
    );
};