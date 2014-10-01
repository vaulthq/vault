var gulp = require('gulp');
var concat = require('gulp-concat');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');

var del = require('del');

var paths = {
    vendor_styles: [
        'bower_components/bootstrap/dist/css/bootstrap.min.css'
    ],
    html_templates: [
        'source/**/*.html'
    ],
    vendor_scripts: [
        'js_vendor/angular/angular.min.js',
        'js_vendor/angular/angular-route.min.js',
        'js_vendor/angular/angular-sanitize.min.js',
        'js_vendor/angular/angular-resource.min.js',
        'js_vendor/angular/angular-cookies.min.js',
        'js_vendor/angular/angular-animate.min.js',
        'js_vendor/ui-bs-0.10.min.js',
        'js_vendor/loader.min.js',
        'js_vendor/moment.min.js',
        'js_vendor/angular-moment.min.js',
        'js_vendor/ZeroClipboard.min.js',
        'js_vendor/angular-ui-router.min.js'
    ],
    scripts: [
        'source/**/*.js'
    ],
    styles: [
        'styles/**/*.less'
    ],
    vendor_fonts: [
        'bower_components/bootstrap/dist/fonts/*'
    ],
    cleanup: [
        'public/t',
        'public/js',
        'public/fonts'
    ]
};

gulp.task('clean', function(cb) {
    del(pats.cleanup, cb);
});

gulp.task('vendor_scripts', [], function() {
    return gulp.src(paths.vendor_scripts)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('vendor_styles', [], function() {
    return gulp.src(paths.vendor_styles)
        .pipe(concat('vendor_styles.css'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('vendor_fonts', [], function() {
    return gulp.src(paths.vendor_fonts)
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('scripts', [], function() {
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('styles', [], function() {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('public/css'));
});


gulp.task('html_templates', [], function() {
    return gulp.src(paths.html_templates)
        .pipe(gulp.dest('public/t'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.html_templates, ['html_templates']);
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('default', ['vendor_fonts', 'vendor_styles', 'html_templates', 'vendor_scripts', 'scripts', 'styles', 'watch']);