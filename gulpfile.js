var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	// livereload = require('gulp-livereload'),
	browserSync = require('browser-sync').create(),
	nodemon  = require('gulp-nodemon'),
	pug = require('gulp-pug'),
	job = require('gulp-pug-job'),
	del = require('del');

gulp.task('styles', function (){
	sass('public/stylesheets/src/*.scss')
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('public/stylesheets/dist'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('public/stylesheets/min'))
		.pipe(notify({message: 'Styles task complete'}));
});
gulp.task('scripts', function (){
	gulp.src('public/javascripts/src/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(gulp.dest('public/javascripts/dist'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('public/javascripts/min'))
		.pipe(notify({message: 'Scripts task complete'}));
});
gulp.task('templates', function (){
	gulp.src('public/templates/src/*.pug')
		.pipe(pug({
			client: true,
			compileDebug: false,
			externalRuntime: true
		}))
		.pipe(job({
			parent: 'window',
			namespace: 'JST',
			separator: '-'
		}))
		.pipe(gulp.dest('public/templates/dist'))
		.pipe(notify({message: 'Templates task complete'}));
});
gulp.task('images', function (){
	gulp.src('public/images/src/*')
		.pipe(imagemin(cache({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('public/images/dist'))
		.pipe(notify({message: 'Images task complete'}));
});
gulp.task('clean', function (cb){
	del(['public/stylesheets/dist', 'public/stylesheets/min', 'public/javascripts/dist', 'public/javascripts/min', 'public/templates/dist', 'public/images/dist'], cb);
});
gulp.task('watch', function (){
	gulp.watch('public/stylesheets/src/*.scss', ['styles']);
	gulp.watch('public/javascripts/src/*.js', ['scripts']);
	gulp.watch('public/templates/src/*.pug', ['templates']);
	gulp.watch('public/images/src/*', ['images']);
	// livereload.listen();
	// gulp.watch(['public/**/*', './*']).on('change', livereload.changed);
});
gulp.task("node", function() {
    nodemon({
        script: './bin/www',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    })
});
gulp.task('server', ["node"], function() {
    var files = [
        'views/**/*',
        'public/**/*',
        'routes/*'
    ];
 
    //gulp.run(["node"]);
    browserSync.init(files, {
        proxy: 'http://localhost:3000',
        browser: 'chrome',
        notify: false,
        port: 8181 //这个是browserSync对http://localhost:3000实现的代理端口
    });
 
    gulp.watch(files).on("change", browserSync.reload);
});


gulp.task('default', ['watch', 'server']);


