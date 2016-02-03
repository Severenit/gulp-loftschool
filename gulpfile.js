// =========================
// VARIABLES
// =========================
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var es = require('event-stream');
var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var del = require('del');
//
// gulp-csso
// gulp-order
//
// =========================
// PATH
// =========================
var paths = {
  script: './app/js/**/*.js',
  styles: ['./app/css/**/*.css','./app/sass/**/*.scss'],
  index: './app/index.html',
  partials: ['./app/**/*.html', '!./app/index.html'],
  distDev: 'dist.dev',
  distProd: 'dist.prod'
}
//
// =========================
// PIPES
// =========================
var pipes = {};

pipes.builtScriptsDev = function() {
  console.log('1');
  return gulp.src(paths.script)
    .pipe(plugins.concat('app.js'))
    
}

pipes.builtVendorScript = function() {
  return pipes.builtScriptsDev()
    .pipe(plugins.uglify('app.min.js'))
    .pipe(gulp.dest(paths.distDev));
}

pipes.builtStyleDev = function() {
  console.log('2');
  return gulp.src('./app/css/**/*.css')
    .pipe(gulp.dest(paths.distDev+'/css'));
}

pipes.bowerFile = function() {
  console.log('3');
  return gulp.src(bowerFiles())
    .pipe(gulp.dest(paths.distDev+'/lib'))
}

pipes.builtIndexDev = function() {
  console.log('4');
  var orderVendorScript = pipes.bowerFile();

  var orderAppStyle = pipes.builtStyleDev();

  var orderAppSripts = pipes.builtVendorScript();

  return gulp.src(paths.index)
    .pipe(gulp.dest(paths.distDev))
    .pipe(plugins.inject(orderVendorScript, {relative: true, name: 'bower'}))
    .pipe(plugins.inject(orderAppSripts, {relative: true}))
    .pipe(plugins.inject(orderAppStyle, {relative: true}))
    .pipe(gulp.dest(paths.distDev));
}

pipes.builtAppDev = function() {
  es.merge(pipes.builtIndexDev());
}
//
// =========================
// TASK
// =========================
gulp.task('clean-dev', function() {
  console.log('1. Clean Dev');
  return del(paths.distDev);
})
gulp.task('built-scripts-dev', pipes.builtScriptsDev);

gulp.task('built-index-dev', pipes.builtIndexDev);

gulp.task('default', ['clean-dev'], pipes.builtAppDev);


