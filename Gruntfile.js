module.exports = function(grunt) {
    "use strict";

    var banner = '/** \n' +
        '* VideoPlayer - v<%= pkg.version %>.\n' +
        '* <%= pkg.repository.url %>\n' +
        '* Copyright <%= grunt.template.today("yyyy") %>. Licensed MIT.\n' +
        '*/\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ['dist'],
        copy: {
            all: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/sinonjs',
                        dest: 'tests/libs/sinon',
                        src: ['sinon.js']
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/qunit/qunit',
                        dest: 'tests/libs/qunit',
                        src: ['qunit.js', 'qunit.css']
                    }
                ]
            }
        },
        uglify: {
            all: {
                files: {
                    'dist/video-player.min.js': ['dist/video-player.js']
                }
            }
        },
        connect: {
            test: {
                options: {
                    hostname: 'localhost',
                    port: 7000
                }
            },
            local: {
                options: {
                    keepalive: true,
                    options: { livereload: true }
                }
            }
        },
        qunit: {
            local: {
                options: {
                    urls: [
                        'http://localhost:7000/tests/index.html'
                    ]
                }
            }
        },
        release: {
            options: {
                additionalFiles: ['bower.json'],
                tagName: 'v<%= version %>',
                commitMessage: 'release <%= version %>',
                npm: false
            }
        },
        usebanner: {
            all: {
                options: {
                    banner: banner,
                    linebreak: false
                },
                files: {
                    src: [
                        'dist/**/*'
                    ]
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commit: false,
                createTag: false,
                push: false,
                updateConfigs: ['pkg']
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    'paths': {
                        'underscore': '../libs/underscore/underscore-min',
                        'element-kit': '../libs/element-kit/element-kit.min'
                    },
                    removeCombined: true,
                    //optimize: 'uglify2',
                    optimize: 'none',
                    preserveLicenseComments: false,
                    name: 'video-player',
                    out: 'dist/video-player.js',
                    insertRequire: ['video-player']
                }
            }
        },
        //browserify: {
        //    all: {
        //        files: {
        //            'dist/video-player.js': ['src/video-player.js'],
        //            'dist/video-player.youtube.js': ['src/video-player.youtube.js']
        //        }
        //    }
        //}
    });

    // Load grunt tasks from node modules
    require( "load-grunt-tasks" )( grunt , {
        loadGruntTasks: {
            pattern: 'grunt-*'
        }
    });

    grunt.task.registerTask('release', 'A custom release.', function(type) {
        type = type || 'patch';
        grunt.task.run([
            'bump:' + type,
            'build'
        ]);
    });

    // Default grunt
    grunt.registerTask( "build", [
        "clean",
        "copy:all",
        "requirejs",
        "usebanner:all",
        "test"
    ]);

    grunt.registerTask( "server", [
        "connect:local"
    ]);

    grunt.registerTask( "test", [
        "connect:test",
        "qunit"
    ]);

};