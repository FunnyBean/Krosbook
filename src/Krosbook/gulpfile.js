/// <binding AfterBuild="build" Clean="clean" />
"use strict";

var gulp = require("gulp"),
    rimraf = require("gulp-rimraf"),
    sass = require("gulp-sass"),
    typescript = require("gulp-typescript"),
    path = require('path'),
    Builder = require('systemjs-builder'),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
    webroot: "./wwwroot/",
    npm: "./node_modules/",
    lib: "./wwwroot/lib/",
    scripts: "./Scripts/",
    app: "./wwwroot/"
};

var libs = [
    paths.npm + "@angular2/**/*.js",
    paths.npm + "systemjs/**/*.js"
];

var tsProject = typescript.createProject('Scripts/tsconfig.json');

var appDev = 'Scripts';
var appProd = 'wwwroot';


gulp.task('ts', () => {
    return gulp.src(appDev + '/**/*.ts')
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(appProd));
});

gulp.task('bundle', function () {
    var builder = new Builder('', 'wwwroot/system.config.js');

    return builder
        .buildStatic(appProd + '/app/main.js', appProd + '/bundle.js', { minify: true, sourceMaps: true })
        .then(function () {
            console.log('Build complete');
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
        });
});

gulp.task('BundleALL', ['ts', 'bundle']);

gulp.task("All-JS-ToOneFile", function () {
    return gulp.src([
        paths.npm + 'core-js/client/shim.js',
        paths.npm + 'zone.js/dist/zone.js',
        paths.npm + 'reflect-metadata/Reflect.js',       
        paths.npm + 'systemjs/dist/system.src.js',
    ])
    .pipe(concat('allJS.js'))
    .pipe(gulp.dest(paths.lib));
});

gulp.task("rxjs", function () {
    return gulp.src(paths.npm + "rxjs/**/*.js")
    .pipe(gulp.dest(paths.lib + "rxjs/")
 
        );
});

gulp.task("anuglar", function () {
    return gulp.src(paths.npm + "@angular/**/*.js")
.pipe(gulp.dest(paths.lib + "@angular/")
        );
});

gulp.task("systemjs", function () {
    return gulp.src(paths.npm + "systemjs/**/*.js")
.pipe(gulp.dest(paths.lib + "systemjs/")
        );
});

gulp.task("core-js", function () {
    return gulp.src(paths.npm + "core-js/**/*.js")
.pipe(gulp.dest(paths.lib + "core-js/")
        );
});

gulp.task("reflect-metadata", function () {
    return gulp.src(paths.npm + "reflect-metadata/**/*.js")
.pipe(gulp.dest(paths.lib + "reflect-metadata/")
    );
});

gulp.task("zone.js", function () {
    return gulp.src(paths.npm + "zone.js/**/*.js")
.pipe(gulp.dest(paths.lib + "zone.js/")
    );
});

gulp.task("libs", ["rxjs", "anuglar", "systemjs", "core-js", "reflect-metadata", "zone.js"]);

gulp.task("clean", function () {
    return gulp.src(paths.app + "**/*.*", { read: false })
        .pipe(rimraf());
});

gulp.task("html", function () {
    return gulp.src(paths.scripts + "**/*.html")
        .pipe(gulp.dest(paths.app));
});

gulp.task("css", function () {
    return gulp.src([paths.scripts + "**/*.scss", paths.scripts + "**/*.css"])
        .pipe(sass())
        .pipe(gulp.dest(paths.app));
});

gulp.task("images", function () {
    return gulp.src(paths.scripts + "**/*.png")
       .pipe(gulp.dest(paths.app));
});
gulp.task("javaScript", function () {
    return gulp.src(paths.scripts + "**/*.js")
       .pipe(gulp.dest(paths.app));
});

gulp.task("bootstrap", function () {
    return gulp.src(paths.scripts + "**/bootstrap/*")
       .pipe(gulp.dest(paths.app));
});

gulp.task("build", ["html", "ts", "css", "images", "javaScript", "bootstrap"]);
