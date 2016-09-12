/// <binding AfterBuild="build" Clean="clean" />
"use strict";

var gulp = require("gulp"),
    rimraf = require("gulp-rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    typescript = require("gulp-typescript"),
    angular2 = require('gulp-angular2');

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

gulp.task("APP", function () {
    return gulp.src(paths.webroot + "main.js")
    .pipe(angular2())
    .pipe(gulp.dest(paths.app))
});



gulp.task("rxjs", function () {
    return gulp.src(paths.npm + "rxjs/**/*.js")
    .pipe(gulp.dest(paths.lib + "rxjs/")
 
        );
});

gulp.task("rxjsMap", function () {
    return gulp.src(paths.npm + "rxjs/**/*.js.map")
.pipe(gulp.dest(paths.lib + "rxjs/")
    );
});

gulp.task("anuglar", function () {
    return gulp.src(paths.npm + "@angular/**/*.js")
.pipe(gulp.dest(paths.lib + "@angular/")
        );
});
gulp.task("anuglarMap", function () {
    return gulp.src(paths.npm + "@angular/**/*.js.map")
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

gulp.task("reflect-metadataMap", function () {
    return gulp.src(paths.npm + "reflect-metadata/**/*.js.map")
.pipe(gulp.dest(paths.lib + "reflect-metadata/")
    );
});

gulp.task("zone.js", function () {
    return gulp.src(paths.npm + "zone.js/**/*.js")
.pipe(gulp.dest(paths.lib + "zone.js/")
    );
});

gulp.task("ng2-pagination", function () {
    return gulp.src(paths.npm + "ng2-pagination/**")
.pipe(gulp.dest(paths.lib + "ng2-pagination/")
    );
});

gulp.task("libs", ["rxjs", "rxjsMap", "anuglar", "anuglarMap", "systemjs", "core-js", "reflect-metadata", "reflect-metadataMap", "zone.js", "ng2-pagination"]);

gulp.task("clean", function () {
    return gulp.src(paths.app + "**/*.*", { read: false })
        .pipe(rimraf());
});

gulp.task("html", function () {
    return gulp.src(paths.scripts + "**/*.html")
        .pipe(gulp.dest(paths.app));
});

gulp.task("js", function () {
    return gulp.src(paths.scripts + "**/*.ts")
        .pipe(typescript({
            "noImplicitAny": false,
            "noEmitOnError": true,
            "removeComments": false,
            "sourceMap": false,
            "target": "es5",
            "module": "commonjs",
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true
        }))
        .pipe(gulp.dest(paths.app));
});

gulp.task("css", function () {
    return gulp.src(paths.scripts + "**/*.scss")
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
gulp.task("javaScriptMap", function () {
    return gulp.src(paths.scripts + "**/*.js.map")
       .pipe(gulp.dest(paths.app));
});
gulp.task("CSS2", function () {
    return gulp.src(paths.scripts + "**/*.css")
       .pipe(gulp.dest(paths.app));
});
gulp.task("bootstrap", function () {
    return gulp.src(paths.scripts + "**/bootstrap/*")
       .pipe(gulp.dest(paths.app));
});

gulp.task("build", ["html", "js", "css", "images", "javaScript", "javaScriptMap", "CSS2", "bootstrap"]);
