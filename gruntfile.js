module.exports = function(grunt) {
    
    grunt.initConfig({
        open: {
            test: {
                path: "test/SpecRunner.html",
                app: "google-chrome"
            }
        }
    });
    
    
    grunt.loadNpmTasks("grunt-open");
    
    
    grunt.registerTask("test", ["open:test"]);
    
}