'use strict';

const gulp = require('gulp');
const dust = require('gulp-dust');

gulp.task('build', () => {
    return gulp.src('templates/*.html')
            .pipe(dust({
                config: {cjs: true}
            }))
            .pipe(gulp.dest('views'));
});

// Default task is to build the templates
gulp.task('default', ['build']);
