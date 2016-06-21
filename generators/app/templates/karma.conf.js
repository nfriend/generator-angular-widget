module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        basePath: './dev-build',

        files: [
            { pattern: './**/*.js', included: false, nocache: true, watched: false },
            { pattern: './**/*.css', included: false, nocache: true, watched: false },
            { pattern: './jspm_packages/system.js', included: true, nocache: true, watched: false },
            { pattern: '../test-helpers/set-systemjs-baseUrl.js', included: true, nocache: true, watched: false },            
            { pattern: './config.js', included: true, nocache: true, watched: false },
            { pattern: '../test-helpers/test-main.js', included: true, nocache: true, watched: false }
        ],

        browsers: ['Chrome'],
        reporters: ['spec'],
        specReporter: { maxLogLines: 5 },
        port: 9876,
        singleRun: true
    });
};