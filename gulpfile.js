'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
'use strict';

gulp.task('default', ['lint']);