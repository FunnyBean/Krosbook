"use strict";
var moment = require('moment');
var Repetition = (function () {
    function Repetition() {
        this.repeating = "days";
        this.interval = 1;
        this.appearance = 1;
        this.date = moment().format("YYYY-MM-DD");
    }
    return Repetition;
}());
exports.Repetition = Repetition;