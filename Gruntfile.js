'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            rebooted: {
                files: ['.rebooted'],
                //tasks: [''],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['public/scripts/**'],
                //tasks: ['jshint'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: ['public/styles/**/*.{scss,sass}'],
                options: {
                    livereload: true
                }
            },
            emberTemplates: {
                files: 'public/templates/**/*.hbs',
                tasks: ['emberTemplates'],
                options: {
                    livereload: true,
                },
            },
        },
        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    //args: [],
                    ignore: ['node_modules/**', 'public/**'],
                    ext: 'js,coffee,hbs',
                    debug: true,
                    delay: 1,
                    env: {
                        PORT: 3000 // TODO
                    },
                    cwd: __dirname,
                    //nodeArgs: '',
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // refreshes browser when server reboots
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted' + Date.now());
                            }, 500);
                        });
                    }

                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= nodemon.dev.options.env.PORT %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'public/dist',
                    ]
                }]
            },
            server: 'dist'
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'public',
                    dest: 'dist',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/*'
                    ]
                }]
            }
        },
        emberTemplates: {
            options: {
                templateCompilerPath: 'public/lib/ember/ember-template-compiler.js',
                handlebarsPath: 'public/lib/handlebars/handlebars.js',
                templateNamespace: 'HTMLBars',
                templateName: function(sourceFile) {
                    var templatePath = 'public/templates/';
                    return sourceFile.replace(templatePath, '');
                }
            },
            dist: {
                files: {
                    'public/dist/scripts/compiled-templates.js': 'public/templates/{,*/}*.hbs'
                }
            }
        },
        concurrent: {
            tasks: [
                'nodemon',
                'emberTemplates',
                'watch'
            ],
            options: {
                logConcurrentOutput: true
            }
        },
        neuter: {
            app: {
                options: {
                    filepathTransform: function(filepath) {
                        return 'public/' + filepath;
                    }
                },
                src: 'public/scripts/**/*.js',
                dest: 'public/dist/scripts/combined-scripts.js'
            }
        }
    });

    grunt.registerTask('server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open']);
        }

        grunt.option('force', true);

        grunt.task.run([
            'neuter:app',
            'clean:server',
            'concurrent',
            'open'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'neuter:app',
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'neuter:app',
        'emberTemplates',
        'copy',
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
