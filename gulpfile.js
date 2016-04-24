'use strict';

const gulp = require('gulp');
const dust = require('gulp-dust');

gulp.task('default', () => {
    return gulp.src('templates/*.html')
            .pipe(dust({
                config: {cjs: true}
            }))
            .pipe(gulp.dest('views'));
});
