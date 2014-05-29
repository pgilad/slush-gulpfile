/*
 * slush-gulpfile
 * https://github.com/pgilad/slush-gulpfile
 *
 * Copyright (c) 2014, Gilad Peleg
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer');

gulp.task('default', function(done) {
    gutil.log('Build your gulpfile.js like a pro');
    inquirer.prompt([{
            type: 'checkbox',
            name: 'features',
            message: 'Which super-cool features do you want in your gulpfile.js?',
            choices: [{
                name: 'Imagemin - optimize your images',
                value: 'imagemin',
                checked: true
            }, {
                name: 'Rev - Add hash revisions on scripts/styles',
                value: 'useRev',
                checked: true
            }, {
                name: 'Jshint - Perform coding errors and style validation on scripts',
                value: 'jshint',
                checked: true
            }]
        }, {
            type: 'list',
            name: 'preProccessers',
            message: 'Choose your CSS flavor',
            choices: [{
                name: 'less',
                value: 'less',
                default: false
            }, {
                name: 'sass',
                value: 'sass',
                default: false
            }, {
                name: 'stylus',
                value: 'stylus',
                default: false
            }, {
                name: 'vanilla css',
                value: 'vanilla',
                default: true
            }]
        }, {
            type: 'confirm',
            name: 'moveon',
            message: 'Should we Gulp?'
        }],
        function(_answers) {
            if (!_answers.moveon) {
                return done();
            }
            var answers = {
                features: {},
                preProccessers: {}
            };
            _answers.features.forEach(function(item) {
                answers.features[item] = true;
            });
            answers.preProccessers[_answers.preProccessers] = true;

            gulp.src(__dirname + '/templates/**')
                .pipe(template(answers))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install());

            process.on('exit', function() {
                var skipInstall = process.argv.slice(2).indexOf('--skip-install') >= 0;
                return done();
            });
        });
});
