var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var typescript = require('gulp-typescript');
var merge2 = require('merge2');
var uglify = require('gulp-uglify');
var jspm = require('jspm');
var templateCache = require('gulp-angular-templateCache');
var sass = require('gulp-sass');
var karma = require('karma');
var path = require('path');
var tslint = require('gulp-tslint');
var _ = require('lodash');


/* Public tasks. These are the main tasks you will use while developing this widget. */

// Build the project locally.  Output is directed to the "dev-build" directory.
gulp.task('build-local', function (done) {
    return runSequence(
        ['clean-dev-build'],
        ['compile-ts', 'copy-html', 'copy-jspm-packages', 'copy-config', 'copy-assets', 'template-cache', 'compile-scss'],
        done
    );
});

// Build the project for distribution.  Output is directed to the "dist" directory.
gulp.task('build-deploy', ['build-local'], function (done) {
    return runSequence(
        ['clean-dist'],
        ['tslint'],
        ['test'],
        ['copy-to-dist'],
        done
    );
});

// Do a local build and run unit tests.
gulp.task('build-and-test', function (done) {
    return runSequence(
        ['build-local'],
        ['test'],
        done
    );
});

// Watches for changes to *.ts, *.scss, and *.html files within app/ and reruns the appropriate
// compilation setp.  Note that some changes (adding jspm dependencies, changing jspm configuration settings)
// will require a running a full "build-local".
gulp.task('watch-all', function (done) {
    return runSequence(
        ['build-local'],
        ['watch-html', 'watch-scss', 'watch-ts', 'watch-assets'],
        done
    );
});


/* Other tasks. */

gulp.task('clean-dev-build', function () {
    return del([
        'dev-build/**/*'
    ]);
});

gulp.task('clean-dist', function () {
    return del([
        'dist/**/*'
    ]);
});

var tsProject = typescript.createProject('tsconfig.json');
gulp.task('compile-ts', function () {
    var tsResult = gulp.src('./app/**/*.ts')
        .pipe(typescript(tsProject));

    return tsResult.js.pipe(gulp.dest('dev-build/app'));
});

gulp.task('copy-html', function () {
    return gulp.src('index.html').pipe(gulp.dest('dev-build'));
});

gulp.task('template-cache', function () {
    return gulp.src('./app/**/*.tmpl.html')
        .pipe(templateCache('<%= widgetName %>.templates.js', {
            module: '<%= widgetName %>-templates',
            standalone: true,
            transformUrl: function (url) {
                return 'app/' + url;
            }
        }))
        .pipe(gulp.dest('dev-build/app/<%= widgetName %>'));
});

gulp.task('copy-jspm-packages', function () {
    return gulp.src('jspm_packages/**/*', { base: '.' }).pipe(gulp.dest('dev-build'));
});

gulp.task('copy-config', function () {
    return gulp.src('config.js').pipe(gulp.dest('dev-build'));
});

gulp.task('copy-assets', function () {
    return gulp.src('app/assets/<%= widgetName %>/**/*').pipe(gulp.dest('dev-build/app/assets/<%= widgetName %>'));
});

gulp.task('compile-scss', function () {
    return gulp.src('app/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dev-build/app/'));
});

gulp.task('copy-to-dist', function () {
    return merge2(
        gulp.src('dev-build/app/<%= widgetName %>/**/*').pipe(gulp.dest('dist')),
        gulp.src('dev-build/app/assets/**/*').pipe(gulp.dest('dist/assets'))
    );
});

// note that this task only runs tests - it does not build any
// files before tests are run.  Either run a "build-local" before
// calling this task or run the "build-and-test" task instead.
gulp.task('test', function (done) {
    var server = new karma.Server({
        configFile: path.join(__dirname, './karma.conf.js')
    }, done);
    server.start();
});

gulp.task('tslint', function () {
    gulp.src(['app/**/*.ts', '!app/typings/**/*'])
        .pipe(tslint({
            rulesDirectory: [
                'node_modules/tslint-eslint-rules/dist/rules'
            ]
        }))
        .pipe(tslint.report('prose', {
            summarizeFailureOutput: true
        }));
});

gulp.task('watch-html', function () {
    gulp.watch('./app/**/*.tmpl.html', { interval: 1000, read: false }, _.debounce(function () {
        runSequence(['template-cache']);
    }, 200));
});

gulp.task('watch-ts', function () {
    gulp.watch('./app/**/*.ts', { interval: 1000, read: false }, _.debounce(function () {
        runSequence(['compile-ts']);
    }, 200));
});

gulp.task('watch-scss', function () {
    gulp.watch('./app/**/*.scss', { interval: 1000, read: false }, _.debounce(function () {
        runSequence(['compile-scss']);
    }, 200));
});

gulp.task('watch-assets', function () {
    gulp.watch('app/assets/<%= widgetName %>/**/*', { interval: 1000, read: false }, _.debounce(function () {
        runSequence(['copy-assets']);
    }, 200));
});

gulp.task('default', ['build-local']);