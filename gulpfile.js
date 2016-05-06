var gulp = require('gulp');
var removeHtmlComments = require('gulp-remove-html-comments');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var minifycss = require('gulp-clean-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var browsersync = require('browser-sync').create();

var imagemin = require('gulp-imagemin');


gulp.task('html', function() {
    gulp.src('app/**/*.html')
        .pipe(removeHtmlComments())
        .pipe(gulp.dest('www'));
});

gulp.task('less', function() {
    gulp.src('app/less/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(rename({suffix: '.min' }))
        .pipe(concat('main.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('www/css'))
        .pipe(browsersync.stream());
});

gulp.task('javascript', function() {
   gulp.src("app/js/**/*.js")
       .pipe(jshint())
       .pipe(jshint.reporter(stylish))
       .pipe(sourcemaps.init())
       .pipe(concat('main.js'))
       .pipe(rename({ suffix: '.min' }))
       .pipe(uglify())
       .pipe(sourcemaps.write())
       .pipe(gulp.dest("www/js"))
});

gulp.task('browsersync', function() {
    browsersync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("app/*.html").on('change', browsersync.reload);
});


gulp.task('images', function() {
   gulp.src('app/images/**/*')
       .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
       .pipe(gulp.dest("www/images"));
});

gulp.task('watch', ['browsersync'], function() {
    livereload.listen();

    gulp.watch('app/**/*.html', ['html']);
    gulp.watch('app/less/*.less', ['less']);
    gulp.watch('app/js/*.js', ['javascript']);
    gulp.watch('app/images/*', ['images']);
});

gulp.task('default', function() {
    gulp.start('watch');
});
