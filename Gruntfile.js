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

        clean: {
            build: {
                src: [ 'public/t' ]
            }
        },

        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'public/js/app.js': [ 'source/**/*.js' ]
                }
            },
            vendor: {
                options: {
                    mangle: false
                },
                files: {
                    'public/js/vendor.js': [
                        'js_vendor/angular/angular.min.js',
                        'js_vendor/angular/angular-route.min.js',
                        'js_vendor/angular/angular-sanitize.min.js',
                        'js_vendor/angular/angular-resource.min.js',
                        'js_vendor/angular/angular-cookies.min.js',
                        'js_vendor/angular/angular-animate.min.js',
                        'js_vendor/ui-bs-0.10.min.js',
                        'js_vendor/loader.min.js',
                     //   'js_vendor/xtForm.js'
                    ]
                }
            }
        },

        watch: {
            scripts: {
                files: 'source/**/*.js',
                tasks: ['uglify:build']
            },
            templates: {
                files: 'source/**/*.html',
                tasks: ['copy']
            }
        }

    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask(
        'vendor',
        'Concat vendor JS',
        ['uglify:vendor']
    );

    grunt.registerTask(
        'full',
        'Concat vendor JS',
        ['clean', 'uglify', 'copy']
    );

    // define the tasks
    grunt.registerTask(
        'default',
        'Builds JS',
        ['watch']
    );
};