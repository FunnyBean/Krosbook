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
var CarOrderService = (function () {
    function CarOrderService(http) {
        this.http = http;
        var _build = http._backend._browserXHR.build;
        http._backend._browserXHR.build = function () {
            var _xhr = _build();
            _xhr.withCredentials = true;
            return _xhr;
        };
    }
    CarOrderService.prototype.getOrders = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get('/api/orders', { headers: headers });
    };
    CarOrderService.prototype.getOrder = function (id) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get('/api/orders/' + id, { headers: headers });
    };
    CarOrderService.prototype.addOrder = function (order) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/orders', order, { headers: headers });
    };
    CarOrderService.prototype.editOrder = function (id, order) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put("/api/orders/" + id, order, { headers: headers });
    };
    CarOrderService.prototype.removeOrder = function (id) {
        return this.http.delete('/api/orders/' + id);
    };
    CarOrderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CarOrderService);
    return CarOrderService;
}());
exports.CarOrderService = CarOrderService;
