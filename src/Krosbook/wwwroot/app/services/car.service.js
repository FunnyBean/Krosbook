"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var CarService = (function () {
    function CarService(http) {
        this.http = http;
        var _build = http._backend._browserXHR.build;
        http._backend._browserXHR.build = function () {
            var _xhr = _build();
            _xhr.withCredentials = true;
            return _xhr;
        };
    }
    CarService.prototype.getCars = function () {
        return this.http.get('http://funnybean.cloudapp.net/api/cars');
    };
    CarService.prototype.getCar = function (id) {
        return this.http.get('http://funnybean.cloudapp.net/api/cars/' + id);
    };
    CarService.prototype.addCar = function (car) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://funnybean.cloudapp.net/api/cars', car, { headers: headers });
    };
    CarService.prototype.editCar = function (id, car) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put("http://funnybean.cloudapp.net/api/cars/" + id, car, { headers: headers });
    };
    CarService.prototype.removeCar = function (id) {
        return this.http.delete('http://funnybean.cloudapp.net/api/cars/' + id);
    };
    CarService.prototype.filterCars = function (date, length) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://funnybean.cloudapp.net/api/cars/filter', JSON.stringify({ date: date, length: length }), { headers: headers });
    };
    CarService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CarService);
    return CarService;
}());
exports.CarService = CarService;
