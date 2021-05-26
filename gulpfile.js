'use strict';

const { task, src, dest, series, parallel, watch } = require("gulp");
const server = require("browser-sync").create();
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const del = require('del');
const concat = require('gulp-concat');
const imgCompress = require('imagemin-jpeg-recompress');
const htmlmin = require("gulp-htmlmin");

task('clean', () => {
  return del('build');
});

task('html', () => {
  return src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(dest("build"));
});

task('copy', () => {
  return src(['source/fonts/**/*.{woff,woff2}', 'source/img/**', 'source//*.ico'], {
      base: 'source',
    })
    .pipe(dest('build'));
});

task('imgmin', () => {
  return src('source/img/**/*.{png,jpg,svg}')
    .pipe(
      imagemin([
        imgCompress({
          loops: 4,
          min: 70,
          max: 80,
          quality: 'high',
        }),
        imagemin.optipng({ optimizationLevel: 7 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.svgo(),
      ])
    )

    .pipe(dest('source/img'));
});

task('webp', () => {
  return src('source/img/**/*.{png,jpg}')
    .pipe(webp({ quality: 90 }))
    .pipe(dest('source/img'));
});

task('sprite', () => {
  return src('source/img/icon-*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite_auto.svg'))
    .pipe(dest('build/img'));
});

task('csscopy', () => {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(server.stream());
});

task('cssmin', () => {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(server.stream());
});

task('jsvendor', () => {
  return src([
    './node_modules/svg4everybody/dist/svg4everybody.js',
    './node_modules/picturefill/dist/picturefill.js',
    'source/js/vendors/*.js',
  ])
      .pipe(concat('vendor.js'))
      .pipe(dest('build/js'));
});

task('jsmain', () => {
  return src([
      'source/js/main/use-strict.js',
      'source/js/main/*.js'
    ])
    .pipe(concat('main.js'))
    .pipe(dest('build/js'));
});

task('server', () => {
  server.init({
    server: 'build/',
    reloadOnRestart: true,
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });
});

task('refresh', function (done) {
  server.reload();
  done();
});

task('watch', () => {
  watch('source/sass/**/*.{scss,sass}', series('csscopy', 'cssmin'));
  watch('source/*.html', series('html', 'refresh'));
  watch('source/js/main/*.js', series('jsmain', 'refresh'));
  watch('source/js/vendors/*.js', series('jsvendor', 'refresh'));
  watch('source/img/**/*.{jpg,svg,png}', series('imgmin'));
  watch('source/img/icon-*.svg', series('sprite', 'html', 'refresh'));
});

const buildTasks = [
  'clean',
  parallel([
    'html',
    'csscopy',
    'cssmin',
    'jsvendor',
    'jsmain',
    'copy',
    'sprite',
  ]),
];

task('build', series(buildTasks));
task('start', series('build', parallel('server', 'watch')));
