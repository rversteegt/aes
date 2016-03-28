module.exports = function (grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    "jshint": {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          console: true,
          module: true
        },
        esversion: 6,
        laxcomma : true
      }
    },

    "babel": {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [
          {
              expand: true,
              cwd: 'src/',
              src: ['*.js'],
              dest: 'dist/src/'
          },
          {
              expand: true,
              cwd: 'test/',
              src: ['*.js'],
              dest: 'dist/test'
          }
        ]
      }
    },

    "mochaTest": {
      test: {
        options: {
          reporter: 'spec',
          quiet: false,
          clearRequireCache: false
        },
        src: ['dist/test/**/*.js']
      }
    },

    "concat": {
      options: {
        separator: ';'
      },
      dist: {
        src: 'dist/babel/**/*.js',
        dest: 'dist/build/src/aes.js'
      }
    },

    "uglify": {
      build: {
        src: ['dist/build/src/*.js'],
        dest: 'dist/build/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'babel', 'mochaTest', 'uglify']);
};
