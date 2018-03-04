var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    htmlmin = require('gulp-htmlmin'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    mozjpeg = require('imagemin-mozjpeg'),
    argv = require('minimist')(process.argv.splice(2)),
    port = argv.p,
    mode = argv._[0] === 'dev',
    depends = mode ? [] : ['del'];
gulp.task('del', function () {
    return del('dist');
});

gulp.task('html', depends, function () {
    return gulp.src('src/html/**/*.html')
        .pipe(gulpif(!mode, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest('dist/html'))
        .pipe(gulpif(mode, browserSync.stream()));
});

gulp.task('css', depends, function () {
    return gulp.src('src/css/**/*.{scss,css}')
        .pipe(gulpif(mode, sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError), sass().on('error', sass.logError)))
        .pipe(autoprefixer({
            browsers: ['iOS >= 8', 'last 2 versions', 'Android >= 4', 'ie >= 9'],
            cascade: false
        }))
        .pipe(gulpif(!mode, cssnano()))
        .pipe(gulpif(!mode, rename({
            suffix: '.min'
        })))
        .pipe(gulp.dest('dist/css'))
        .pipe(gulpif(mode, browserSync.stream()));
});

gulp.task('js', depends, function () {
    gulp.src('src/js/**/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(babel({
            presets: ['es2015', 'env']
        }))
        .pipe(gulpif(!mode, uglify()))
        .pipe(gulpif(!mode, rename({
            suffix: '.min'
        })))
        .pipe(gulp.dest('dist/js'))
        .pipe(gulpif(mode, browserSync.stream()));

});

gulp.task('image', depends, function () {
    gulp.src(['src/images/**/*.{jpg,jpge,png,gif,ico}',
            '!src/images/sprite/**/*.{jpg,jpge,png,gif,ico}'
        ])
        .pipe(gulpif(!mode, imagemin({
            use: [pngquant(),
                mozjpeg({
                    quality: 80
                })
            ]
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(gulpif(mode, browserSync.stream()));
});

gulp.task('static', depends, function () {
    gulp.src('src/static/**/*')
        .pipe(gulp.dest('dist/static'))
        .pipe(gulpif(mode, browserSync.stream()));
});

gulp.task('html:watch', ['html'], function () {
    return gulp.watch('src/html/**/*.html', ['html']);
});

gulp.task('css:watch', ['css'], function () {
    return gulp.watch('src/css/**/*.{scss,css}', ['css']);
});

gulp.task('js:watch', ['js'], function () {
    return gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('image:watch', ['image'], function () {
    return gulp.watch(['src/images/**/*.{jpg,jpge,png,gif,ico}',
        '!src/images/sprite/**/*.{jpg,jpge,png,gif,ico}'
    ], ['image']);
});

gulp.task('static:watch', ['static'], function () {
    return gulp.watch('src/static/**/*', ['static']);
});


gulp.task('browser', ['css', 'html', 'js', 'static', 'image'], function () {
    browserSync.init({
        server: {
            baseDir: './dist',
            directory: true,
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        },
        port: typeof port === 'number' ? port : port === true ? Math.floor(Math.random() *
            9999) : 3000
    });
});

gulp.task('dev', ['html:watch', 'css:watch', 'js:watch', 'image:watch', 'static:watch', 'browser']);
gulp.task('build', ['html', 'css', 'js', 'image', 'static']);
