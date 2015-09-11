'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            jade: {
                files: ['app/views/**'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/scripts/**', 'test/**/*.js'],
                tasks: ['jshint'],
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
                files: ['public/css/**'],
                options: {
                    livereload: true
                }
            },
            emberTemplates: {
                files: 'public/templates/**/*.hbs',
                tasks: ['emberTemplates']
            },
            compass: {
                files: ['public/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'public/.tmp/scripts/*.js',
                    'public/*.html',
                    '{.tmp,public}/styles/{,*/}*.css',
                    'public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'gruntfile.js',
                'public/scripts/{,*/}*.js',
                '!public/lib/*',
                'test/spec/{,*/}*.js'
            ]
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['public/**'],
                    watchedExtensions: ['js'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
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
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'server.js'
            },
            src: ['test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        compass: {
            options: {
                sassDir: 'public/styles',
                cssDir: 'public/.tmp/styles',
                generatedImagesDir: 'public/.tmp/images/generated',
                imagesDir: 'public/images',
                javascriptsDir: 'public/scripts',
                fontsDir: 'public/styles/fonts',
                importPath: 'public/lib',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        'dist/scripts/{,*/}*.js',
                        'dist/styles/{,*/}*.css',
                        'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        'dist/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '.tmp/index.html',
            options: {
                dest: 'dist'
            }
        },
        usemin: {
            html: ['dist/{,*/}*.html'],
            css: ['dist/styles/{,*/}*.css'],
            options: {
                dirs: ['dist']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'public/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: 'dist/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'public/images',
                    src: '{,*/}*.svg',
                    dest: 'dist/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    'dist/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        'public/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: 'public',
                    src: '*.html',
                    dest: 'dist'
                }]
            }
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
                templateName: function(sourceFile) {
                    var templatePath = 'public/templates/';
                    return sourceFile.replace(templatePath, '');
                }
            },
            dist: {
                files: {
                    'public/.tmp/scripts/compiled-templates.js': 'public/templates/{,*/}*.hbs'
                }
            }
        },
        concurrent: {
            tasks: [
                'nodemon',
                'emberTemplates',
                'compass:server',
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
                src: 'public/scripts/app.js',
                dest: 'public/.tmp/scripts/combined-scripts.js'
            }
        }
    });

    grunt.registerTask('server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
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
        // 'replace:app',
        'concurrent:test',
        'connect:test',
        'neuter:app',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        // 'replace:dist',
        'useminPrepare',
        'concurrent:dist',
        'neuter:app',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
