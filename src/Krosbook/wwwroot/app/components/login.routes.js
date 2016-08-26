"use strict";
/**
 * Created by Tibor Poštek on 14.07.2016.
 */
var user_service_1 = require('../services/user.service');
var AdminGuard_1 = require("./AdminGuard");
var AuthGuard_1 = require("./AuthGuard");
var OperatorGuard_1 = require("./OperatorGuard");
exports.authProviders = [AuthGuard_1.AuthGuard, AdminGuard_1.AdminGuard, OperatorGuard_1.OperatorGuard, user_service_1.UserService];
