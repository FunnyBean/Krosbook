(function (global) {

    // map tells the System loader where to look for things
    var map = {
        'app': 'wwwroot/app', // this is where your transpiled files live
        'rxjs': 'wwwroot/lib/rxjs',
        'angular2-in-memory-web-api': 'wwwroot/lib/angular2-in-memory-web-api', // this is something new since angular2 rc.0, don't know what it does
        '@angular': 'wwwroot/lib/@angular',
        'ng2-cookies': 'wwwroot/lib/js/ng2-cookies',
        'moment': 'wwwroot/lib/js/moment/moment.js'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': { main: 'app/main.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'angular2-in-memory-web-api': { defaultExtension: 'js' }
    };

    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router', // I still use "router-deprecated", haven't yet modified my code to use the new router that came with rc.0
        '@angular/router-deprecated',
        '@angular/http',
        '@angular/testing',
        '@angular/upgrade',
        '@angular/forms',
        'ng2-cookies'
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function (pkgName) {
        packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
    });

    var config = {
        map: map,
        packages: packages
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { global.filterSystemConfig(config); }

    System.config(config);
})(this);