'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    lazy: false
});

//build client scripts
gulp.task('scripts', function() {
    //create scripts stream
    return gulp.src(['./src/js/**/*.js'])

    <% if (features.jshint) { %>
        .pipe($.jshint())
        .pipe($.reporter('default'))
    <% } %>

    .pipe($.uglify())
        .pipe($.concat('scripts.min.js'))
    <% if (features.useRev) { %>
        .pipe($.rev())
    <% } %>
        .pipe(gulp.dest('./build/js/'))
        .pipe($.size({
            showFiles: true
        }));
});

gulp.task('html', ['scripts', 'vendors', 'css'], function() {
    var indexFilter = $.filter('index.html');
    //process jade
    return gulp.src('./src/jade/*.jade')
        .pipe($.jade({
            pretty: true
        }))
        .pipe(indexFilter)
        .pipe($.inject(gulp.src(['./build/{js,css}/*.{js,css}'], {
            read: false
        }), {
            addRootSlash: false,
            ignorePath: 'build'
        }))
        .pipe(indexFilter.restore())
        .pipe($.htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./build/'));
});

//compile css
gulp.task('css', function() {
    gulp.src('./src/css/*')
    <% if (preProccessers.less) { %>
        .pipe($.less())
    <% } %>
    <% if (preProccessers.sass) { %>
        .pipe($.sass())
    <% } %>
    <% if (preProccessers.stylus) { %>
        .pipe($.styl())
    <% } %>
        .pipe($.autoprefixer())
        .pipe($.concat('styles.min.css'))
    <% if (features.useRev) { %>
        .pipe($.rev())
    <% } %>
        .pipe($.cssmin())
        .pipe(gulp.dest('build/css/'))
        .pipe($.size({
            showFiles: true
        }));
});

gulp.task('serve', ['build'], function() {
    return $.connect.server({
        root: 'build',
        port: 8080,
        livereload: true
    });
});

//clean build folder
gulp.task('clean', function() {
    return gulp.src('./build/', {
        read: false
    }).pipe($.clean());
});

//bump versions on package/bower/manifest
gulp.task('bump', function() {
    return gulp.src(['./{bower,package}.json'])
        .pipe($.bump())
        .pipe(gulp.dest('./'));
});

gulp.task('fonts', function() {
    return gulp.src(['./src/fonts/*'])
        .pipe(gulp.dest('build/fonts/'));
});

//handle assets
gulp.task('images', function() {
    return gulp.src('./src/img/**/*.{ico,jpeg,jpg,gif,bmp,png,webp,swf}')
    <% if (features.imagemin) { %>
        .pipe($.imagemin())
    <% } %>
        .pipe(gulp.dest('./build/img/'));
});

//all tasks are watch -> bump patch version -> reload extension (globally enabled)
gulp.task('watch', function() {
    return gulp.watch('./src/**/*', ['build']);
});

gulp.task('build', ['clean'], function() {
    return gulp.start('images', 'fonts', 'css', 'scripts', 'html');
});

//default task
gulp.task('default', function() {
    return gulp.start('build', 'serve', 'watch');
});
