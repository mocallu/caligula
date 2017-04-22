module.exports = function(grunt) {
  
  /* Início - Carrega os módulos */
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  /* Fim  - Carrega os módulos */

  grunt.initConfig({
    
    /* Início - Lê o arquivo package e disponibiliza as configurações na variável pkg */
    pkg: grunt.file.readJSON('package.json'),
    /* Fim - Lê o arquivo package e disponibiliza as configurações na variável pkg */

    /* Início - Limpa diretórios */
    clean: {
      app: ['app']
    },
    /* Fim - Limpa diretórios */

    /* Início - Levanta a pasta app na porta 9000 */
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9000,
          keepalive: false,
          livereload: true,
          open: true,
          base: {
            path: 'app',
            options: {
              index: 'index.html'
            }
          },
          middleware: function (connect) {
            var connectStatic = require('serve-static');
            return [require('connect-modrewrite')(['!\\.html|\\.woff2|\\.js|\\.svg|\\.css|\\.png|\\.ico|\\.jpg$ /index.html [L]'])].concat(
              connectStatic('app')
            );
          }
        }
      }
    },
    /* Fim - Levanta a pasta app na porta 9000 */
    
    /* Início - Compila os arquivos .pug em .html */
    pug: {
      init: {
        options: {
          pretty: true,
          client: false,
          data: function(dest, src) {
            //require('./locals.json');
            return {
              pkg: grunt.file.readJSON('package.json'),
            }
          }
        },
        files: [
          {
            cwd: 'src',
            src: '*.pug',
            dest: 'app',
            expand: true,
            ext: '.html'
          }
        ]
      }
    },
    /* Fim - Compila os arquivos .pug em .html */
    
    /* Início - Compila stylus em css */
    stylus: {
      init: {
        expand: true,
        cwd: 'src/stylus',
        src: 'init.styl',
        dest: 'app/css',
        ext: '.css',
        options: {
          import: [__dirname + '/src/stylus/includes/*'],
        }
      }
    },
    /* Fim - Compila stylus em css */
    
    /* Início - Aplica autoprefixer pra garantir mais compatibilidade do css com browsers mais antigos */
    autoprefixer: {
      css: {
          options: {
            browsers: ['> 0.01%'],
            cascade: false
          },
          src: './app/**/*.css',
          expand: true
      }
    },
    /* Fim - Aplica autoprefixer pra garantir mais compatibilidade do css com browsers mais antigos */

    /* Início - Comprime imagens */
    imagemin: {
      init: {
        files: [{
          expand: true,
          cwd: 'src/images',
          src: ['**/*.{png,jpg,gif,ico}'],
          dest: 'app/images'
        }]
      }
    },
    /* Fim - Comprime imagens */


    /* Início - Concatena todos os arquivos js em um único arquivo  */
    concat: {
      dist: {
        src: ['src/libs/**/*.js', 'src/js/**/*.js'],
        dest: 'app/js/init.js'
        //dest: 'app/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    /* Fim - Concatena todos os arquivos js em um único arquivo  */

    /* Início - Uglify no arquivo js principal */
    uglify: {
      init: {
        options: {
          banner: '/*! <%= pkg.name %> - <%= pkg.version %> - Build: <%= grunt.template.today("dd/mm/yyyy H:M:ss") %>\n** Autor: <%= pkg.author %> \n*/'
        },
        files: [{
          // expand: true,
          // cwd: 'app',
          src: ['app/js/init.js'],
          dest: 'app/js/init.min.js'
        }]
      }
    },
    /* Fim - Uglify no arquivo js principal */

    /* Início - Escuta por mudanças nos arquivos, para todar o livereload */
    watch: {
      pug: {
        files: ['src/**/*.pug'],
        tasks: ['pug'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['src/**/*.js'],
        tasks: ['concat'],
        options: {
          livereload: true
        }
      },
      styl: {
        files: ['src/**/*.styl'],
        tasks: ['stylus'],
        options: {
          livereload: true
        }
      },
      img: {
        files: ['src/images/**/*'],
        tasks: ['imagemin'],
        options: {
          livereload: true
        }
      }
    }
    /* Fim - Escuta por mudanças nos arquivos, para todar o livereload */
  });

  /* Início - Captura os eventos do watch */
  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' foi ' + action);
  });
  /* Fim - Captura os eventos do watch */

  /* Início - Tarefas */
  grunt.registerTask('default', ['clean:app', 'pug', 'stylus', 'imagemin', 'concat', 'uglify', 'connect:server', 'watch']);
  /* Fim - Tarefas */
  
};
