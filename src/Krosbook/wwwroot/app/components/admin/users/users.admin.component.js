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
var router_1 = require('@angular/router');
var user_service_1 = require('../../../services/user.service');
var detail_user_admin_component_1 = require('./detail/detail.user.admin.component');
var UsersAdminComponent = (function () {
    function UsersAdminComponent(router, userService) {
        this.router = router;
        this.userService = userService;
        this.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.slovakAlphabet = ['Á', 'Č', 'Ď', 'É', 'Í', 'Ĺ', 'Ľ', 'Ň', 'Ó', 'Š', 'Ť', 'Ú', 'Ž'];
        this.englishAlphabet = ['A', 'C', 'D', 'E', 'I', 'L', 'L', 'N', 'O', 'S', 'T', 'U', 'Z'];
        this.filterChar = '';
        this.showOfficeWindow = false;
        this.GetUsers();
    }
    UsersAdminComponent.prototype.ngOnInit = function () {
        this.GetUsers();
    };
    UsersAdminComponent.prototype.GetUsers = function () {
        var _this = this;
        this.userService.getUsers()
            .subscribe(function (data) {
            _this.allUsers = data.json();
            if (_this.filterChar == '')
                _this.users = _this.allUsers;
            else
                _this.filter();
        }, function (error) { return console.error(error); });
    };
    UsersAdminComponent.prototype.filter = function (char) {
        if (char === void 0) { char = this.filterChar; }
        this.filterChar = char;
        this.users = [];
        for (var i = 0; i < this.allUsers.length; i++) {
            if (this.allUsers[i].surname[0] == char) {
                this.users.push(this.allUsers[i]);
            }
        }
        var enAIndex = this.englishAlphabet.indexOf(char);
        if (enAIndex != -1 && this.slovakAlphabet[enAIndex]) {
            var newChar = this.slovakAlphabet[enAIndex];
            for (var i = 0; i < this.allUsers.length; i++) {
                if (this.allUsers[i].surname[0] == newChar) {
                    this.users.push(this.allUsers[i]);
                }
            }
        }
    };
    UsersAdminComponent.prototype.removeFilter = function () {
        this.filterChar = '';
        this.users = this.allUsers;
    };
    UsersAdminComponent.prototype.newUser = function () {
        this.userId = null;
        this.windowOpen();
    };
    UsersAdminComponent.prototype.editUser = function (id) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id == id) {
                this.userId = this.users[i].id;
                break;
            }
        }
        this.windowOpen();
        window.scrollTo(0, 0); /*scroll top*/
    };
    UsersAdminComponent.prototype.removeUser = function (id) {
        var _this = this;
        if (confirm("Naozaj chcete vymazať používateľa?")) {
            this.userService.removeUser(id).subscribe(function (data) {
            }, function (error) {
                alert(error);
            }, function () {
                _this.GetUsers();
            });
        }
    };
    UsersAdminComponent.prototype.sendInvitation = function (id) {
        var _this = this;
        this.userService.sendInvitation(id).subscribe(function (data) {
            _this.GetUsers();
        }, function (error) { console.log(error); });
    };
    //opens detail.office.admin.component window
    UsersAdminComponent.prototype.windowOpen = function () {
        this.showOfficeWindow = true;
    };
    //closes detail.office.admin.component window
    UsersAdminComponent.prototype.windowClose = function (action) {
        this.showOfficeWindow = action;
    };
    UsersAdminComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/admin/users/users.admin.component.html',
            directives: [detail_user_admin_component_1.DetailUserAdminComponent]
        }), 
        __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService])
    ], UsersAdminComponent);
    return UsersAdminComponent;
}());
exports.UsersAdminComponent = UsersAdminComponent;
