var gulp 		  = require('gulp'),
    clean 		  = require('gulp-clean'),
    cleanCSS 	  = require('gulp-clean-css'),
    replace       = require('gulp-replace'),
    sass          = require('gulp-sass'),
    watch         = require('gulp-watch'),
    browserSync   = require('browser-sync').create(),
    panini        = require('panini');

gulp.task('clean-css', function(){
  return gulp.src('dist/css/**/*.css', {read: false})
    .pipe(clean());
});

gulp.task('build-css', ['clean-css'], function(){
  return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({
      processImport: false,
      mediaMerging: true
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('clean-fonts', ['clean-fonts'], function(){
  return gulp.src('dist/fonts/**/*', {read: false})
    .pipe(clean());
});

gulp.task('move-fonts', function(){
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean-js', function(){
  return gulp.src('dist/js/**/*.js', {read: false})
    .pipe(clean());
});

gulp.task('move-js', ['clean-js'], function(){
  return gulp.src(['src/js/bootstrap.min.js','node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('dist/js'))
});

gulp.task('panini-refresh', function(done){
    panini.refresh();
    done();
});

gulp.task('clean-html', function(){
  return gulp.src('dist/**/*.html', {read: false})
    .pipe(clean());
});

gulp.task('build-html', ['clean-html','panini-refresh'], function(){
  return gulp.src('src/pages/**/*.html')
    .pipe(panini({
      root: 'src/pages',
      layouts: 'src/layouts',
      partials: 'src/partials'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('browser', function(){
  browserSync.init({
    browser: 'google chrome',
    files: [
      'dist/**/*.html',
      'dist/css/**/*.css',
    ],
    server: {
      baseDir: "dist"
    }
  });
});

gulp.task('watch', function(){
  gulp.watch(['src/{pages,layouts,partials}/**/*.html'], ['build-html']);
  gulp.watch(['src/scss/**/*.scss'], ['build-css']);
});

gulp.task('default', ['move-fonts','move-js','build-css','build-html','browser','watch']);
