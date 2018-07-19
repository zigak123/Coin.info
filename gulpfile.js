var gulp = require('gulp');
var del = require('del');
var csso = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var replace = require('gulp-string-replace');
var gulpUtil = require('gulp-util');
browserSync = require('browser-sync').create(),



gulp.task('onchangereload', function() {
	browserSync.init({
	    proxy: "localhost:3000",
	    ws: true,
	    browser: "chrome"
	});
  	var watcher = gulp.watch(['./public/scripts/*.js','./public/templates/*.html','./public/*.css'], browserSync.reload);
	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});


gulp.task('clean', function() {
  del(['./public/dist/**/*.*']);
});

gulp.task('styles', ['clean','copy'], function () {
  return gulp.src('./public/*.css')
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('./public/dist/'))
});

gulp.task('pages', ['clean','copy'],function() {
  return gulp.src(['./public/templates/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(replace(/public\//g, 'public/dist/'))
    .pipe(gulp.dest('./public/dist/templates'));
});


gulp.task('scripts', ['clean','copy'], function() {
  return gulp.src('./public/scripts/*.js')
    // Minify the file
    .pipe(uglify().on('error', gulpUtil.log))
    // Fix paths
    .pipe(replace(/public\//g, 'public/dist/'))
    .pipe(gulp.dest('./public/dist/scripts'))
});


gulp.task('replace', ['clean','copy'], function() {
  gulp.src(["./public/index.html"])
    .pipe(replace(/public\//g, 'public/dist/'))
    .pipe(gulp.dest('./public/dist'))
});

gulp.task('copy',['clean'],function(){
	gulp.src(["./public/scripts/third_party/*.js"])
	.pipe(gulp.dest('./public/dist/scripts/third_party'));

	gulp.src(["./public/images/**/*"])
	.pipe(gulp.dest('./public/dist/images/'));
})

gulp.task('default',['clean','copy','pages','styles','scripts'],function(){});