var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var es = require('event-stream');
var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var del = require('del');


var paths = {
  script: './app/js/**/*.js',
  styles: ['./app/css/**/*.css','./app/sass/**/*.scss'],
  index: './app/index.html',
  partials: ['./app/**/*.html', '!./app/index.html'],
  distDev: 'dist.dev/',
  distProd: 'dist.prod/'
}


var pipes = {};

pipes.builtScriptsDev = function() {
  console.log('2. BuiltScriptsDev');
  return gulp.src(paths.script)
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest(paths.distDev));
}

pipes.builtStylesDev = function() {

}

pipes.builtVendorScript = function() {

}

pipes.builtIndexDev = function() {
  console.log('3. BuiltIndexDev');
  var orderVendorScript = gulp.src(bowerFiles())
                              .pipe(gulp.dest(paths.distDev+'lib/'))

  var orderAppSripts = pipes.builtScriptsDev();

  var orderAppStyle = gulp.src('./app/css/**/*.css')
                             .pipe(gulp.dest(paths.distDev+'css/'));

  return gulp.src(paths.index)
    .pipe(gulp.dest(paths.distDev))
    .pipe(plugins.inject(orderVendorScript, {relative: true, name: 'bower'}))
    .pipe(plugins.inject(orderAppSripts, {relative: true}))
    .pipe(plugins.inject(orderAppStyle, {relative: true}))
    .pipe(gulp.dest(paths.distDev));
}

pipes.builtAppDev = function() {
  es.merge(pipes.builtScriptsDev(), pipes.builtIndexDev());
}

gulp.task('clean-dev', function() {
  console.log('1. Clean Dev');
  return del(paths.distDev);
})

gulp.task('built-scripts-dev', pipes.builtScriptsDev);

gulp.task('built-index-dev', pipes.builtIndexDev);

gulp.task('built-app-dev', pipes.builtAppDev);

gulp.task('default', ['clean-dev'], pipes.builtAppDev);


