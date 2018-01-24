var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify");

// Скрипты проекта

gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('scripts', ['common-js'], function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/mmenu/js/jquery.mmenu.all.min.js',
		'app/libs/owl.carousel/owl.carousel.min.js',
		'app/libs/fotorama/fotorama.js',
		'app/libs/selectize/js/standalone/selectize.min.js',
		'app/libs/equalHeights/equalheights.js',
		'app/libs/bootstrap-4-full/dist/js/bootstrap.min.js',
		'app/js/common.min.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass().on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'scripts', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
	gulp.watch('app/*.html', browserSync.reload);
});

/*gulp.task('imagemin', function() {
	return gulp.src('app/img/**///*')
	/*.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});*/

gulp.task('html', function () {
    return gulp.src([
		'app/*.html',
		'app/.htaccess',
		])
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    return gulp.src('app/css/main.min.css')
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function () {
    return gulp.src(
		'app/js/scripts.min.js')
		.pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function () {
    return gulp.src(
		'app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', ['removedist', 'sass', 'scripts', 'html', 'css', 'js', 'fonts'], function() {
		return gulp.src('app/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
	});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hoster-toster.ru',
		user:      'flazesm',
		password:  'd7fBDMU6U',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/domains/hoster-toster.ru/public_html/'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
