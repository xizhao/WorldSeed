module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        webpack: {
            build: { 
                entry: './client/index',
                output: {
                    path: "./public/js/",
                    filename: "client.bundle.js"
                },
                module: {
                    loaders: [{
                        test: /\.js$/,
                        loader: "transform?brfs"
                    }]
                }
            }
        },
        watch: {
            client: {
                files:  ['client/**/*.js', 'world/**/*.js'], 
                tasks:  [ 'build' ],
                options: {
                    spawn: false 
                }
            }
        }
    });

    grunt.registerTask('default', ['build', 'watch:client']);
    grunt.registerTask('build', ['webpack:build']);
};