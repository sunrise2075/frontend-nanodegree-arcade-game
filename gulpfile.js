var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint');
	rename = require('gulp-rename'),
	gulpPlumber = require('gulp-plumber'),
	connect = require('gulp-connect'),
	stylish = require('jshint-stylish'),
	csslint = require('gulp-csslint');

gulp.task('connect', function() {
  connect.server({
    root: '',
    livereload: true
  });
});

gulp.task('scripts',function(){
	gulp.src('js/app.js')
		.pipe(gulpPlumber()) 
		.pipe(uglify())
		//.pipe(rename('app.min.js'))
		.pipe(gulp.dest('js/'))
		.pipe(connect.reload());
});

gulp.task('jshint', function(){
	return gulp.src('js/app.js')
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
});

gulp.task('watch',function(){
	 gulp.watch('js/app.js',['scripts']);
});

gulp.task('default', ['connect','watch']);