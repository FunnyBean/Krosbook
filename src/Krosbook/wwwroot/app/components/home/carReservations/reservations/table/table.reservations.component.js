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
var reservation_service_1 = require('../../../../../services/reservation.service');
var holiday_service_1 = require('../../../../../services/holiday.service');
var router_1 = require('@angular/router');
var moment = require('moment');
var formData_service_1 = require('../../../../../services/formData.service');
var TableReservationComponent = (function () {
    function TableReservationComponent(formDataService, router, reservationService, holidayService) {
        this.formDataService = formDataService;
        this.router = router;
        this.reservationService = reservationService;
        this.holidayService = holidayService;
        this.tableData = [];
    }
    TableReservationComponent.prototype.ngOnInit = function () {
        this.formDataService.saveData(undefined, undefined, 0);
        this.updateData();
        this.data.color = (this.data.color == null) ? '#337ab7' : this.data.color;
        var thisDocument = this;
        $(window).on("focus", function () {
            thisDocument.updateData();
        });
    };
    TableReservationComponent.prototype.ngOnDestroy = function () {
        $(window).unbind("focus");
    };
    TableReservationComponent.prototype.fillTable = function () {
        var table = '<tr><td colspan="6" class="officeName" style="background-color: ' + this.data.color + '"><h4>' + this.data.name + ' &nbsp &nbsp ' + this.data.plate + '</h4></td></tr>', fromRow, fromCol, length = 1, carId, isMouseDown = false, thisDocument = this, col, row, beforeRow = 0, bg, lastCell;
        for (var i = 0; i < this.times.length; i++) {
            table += '<tr>';
            table += '<td class="col-md-1 time">' + this.times[i].time + '</td>';
            for (var j = 0; j < this.tableData[this.times[i].time].length; j++) {
                var cell = this.tableData[this.times[i].time][j];
                var holiday = this.holidayService.isHoliday(moment().add(this.week, 'weeks').weekday(j + 1).format("DD/MM"), moment().add(this.week, 'weeks').format("YYYY"));
                if (cell.long == null) {
                    if (holiday) {
                        if (i == 0)
                            table += '<td class="col-md-2 holiday">' + holiday + '</td>';
                        else
                            table += '<td class="col-md-2 holiday"></td>';
                    }
                    else
                        table += '<td class="col-md-2 empty"></td>';
                }
                else {
                    if (cell.reservationState == 2)
                        bg = "bg-primary";
                    else
                        bg = "bg-danger";
                    if (cell.reservationName == null) {
                        table += '<td reservationId="' + cell.reservationId + '" class="col-md-2 ' + bg + ' full"></td>';
                    }
                    else {
                        table += '<td reservationId="' + cell.reservationId + '" class="col-md-2 ' + bg + ' full text-center"><strong>' + cell.reservationName + '</strong> <small>' + cell.userName + '</small></td>';
                    }
                }
            }
            table += '</tr>';
        }
        //replacing old data with new table data
        $(".records" + this.data.id + " > tr").remove();
        $(".records" + this.data.id).prepend(table);
        $(".records" + this.data.id + " td.empty").on("mouseenter", function (event) {
            col = $(this).parent().children().index($(this));
            row = $(this).parent().parent().children().index($(this).parent()) - 1;
        });
        $(".records" + this.data.id + " td.empty")
            .on("mousedown", function (event) {
            if (event.which != 1)
                return false; //does not work for other than left button
            var element = $(this);
            isMouseDown = true;
            $(this).addClass("selected");
            $(this).siblings(".time").addClass("boldTime");
            fromRow = row;
            fromCol = col;
            carId = $(this).parent().parent().attr("id");
            beforeRow = row;
            var horizontalPosition = (element.index() !== 5) ? (element.position().left).toString() + 'px' : (element.position().left + element.width() - 294).toString() + 'px';
            return false;
        })
            .on("mouseover", function () {
            if (isMouseDown && col == fromCol && (row - 1) == beforeRow && !($(this).hasClass("selected"))) {
                lastCell = $(this);
                lastCell.addClass("selected").siblings(".time").addClass("boldTime");
                beforeRow = row;
                length++;
            }
            else if (isMouseDown && col == fromCol && row == (beforeRow - 1) && $(this).hasClass("selected")) {
                lastCell.removeClass("selected").siblings(".time").removeClass("boldTime");
                beforeRow = row;
                lastCell = $(this);
                length--;
            }
        });
        $(document).on("mouseup", function () {
            if (isMouseDown) {
                thisDocument.makeReservation(fromRow, fromCol, length, carId);
                isMouseDown = false;
                length = 1;
            }
        });
    };
    TableReservationComponent.prototype.makeReservation = function (fromRow, fromCol, length, carId) {
        var date, hours = 7;
        for (var i = 0; i < fromRow; i++)
            hours++;
        date = moment().add(this.week, 'weeks').weekday(fromCol).hour(hours).minute(0).format("YYYY-MM-DDTHH:mm");
        this.formDataService.saveData(date, moment(date).add(length, 'hours').format("YYYY-MM-DDTHH:mm"), carId);
        this.router.navigate(['/home/reservations/cars/newreservation/']);
    };
    TableReservationComponent.prototype.updateData = function (weeks) {
        var _this = this;
        if (weeks === void 0) { weeks = this.week; }
        this.reservationService.getReservations(this.reservationType, this.data.id, moment().add(weeks, 'weeks').weekday(1).format("DD.MM.YYYY"), moment().add(weeks, 'weeks').weekday(6).format("DD.MM.YYYY")).subscribe(function (data) {
            _this.reservationsData = data.json();
        }, function (error) { return console.log(error); }, function () {
            //setting default data to 0
            for (var i = 0; i < _this.times.length; i++) {
                var pTime = _this.times[i].time;
                _this.tableData[pTime] = new Array();
                for (var j = 0; j < 5; j++)
                    _this.tableData[pTime][j] = 0;
            }
            //for each record, set table data
            for (var i = 0; i < _this.reservationsData.length; i++) {
                var record = _this.reservationsData[i];
                var startDay = moment(record.dateTimeStart, "YYYY-MM-DDTHH:mm:ss"), endDay = moment(record.dateTimeEnd, "YYYY-MM-DDTHH:mm:ss"), currentDay = moment(record.dateTimeStart, "YYYY-MM-DDTHH:mm:ss"), time = startDay.format("HH:mm"), endTime = endDay.format('HH:mm');
                if (startDay.format("YYYY-MM-DD") == endDay.format("YYYY-MM-DD")) {
                    var day = startDay.weekday() - 1;
                    while (time < endTime && time <= '18:00') {
                        if (time >= '07:00') {
                            if (time == startDay.format("HH:mm") || time == '07:00')
                                _this.tableData[time][day] = JSON.parse('{"userName": "' + _this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                            else
                                _this.tableData[time][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                        }
                        time = moment(time, 'HH:mm').add(1, 'hour').format('HH:mm');
                    }
                }
                else {
                    while (currentDay.format("YYYY-MM-DD") <= endDay.format("YYYY-MM-DD")) {
                        var day = currentDay.weekday() - 1;
                        if (day == 5 || day == -1 || currentDay.format("YYYY-MM-DD") < moment().add(weeks, 'weeks').weekday(1).format("YYYY-MM-DD") || currentDay.format("YYYY-MM-DD") > moment().add(weeks, 'weeks').weekday(5).format("YYYY-MM-DD")) {
                            currentDay.add(1, 'days');
                            continue;
                        }
                        if (startDay.format("YYYY-MM-DD") == currentDay.format("YYYY-MM-DD")) {
                            while (time <= '18:00') {
                                if (time >= '07:00') {
                                    if (time == moment(record.dateTimeStart, "YYYY-MM-DD HH:mm:ss").format("HH:mm"))
                                        _this.tableData[time][day] = JSON.parse('{"userName": "' + _this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                    else
                                        _this.tableData[time][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                }
                                time = moment(time, 'HH:mm').add(1, 'hour').format('HH:mm');
                            }
                        }
                        else if (endDay.format("YYYY-MM-DD") == currentDay.format("YYYY-MM-DD")) {
                            var tempTime = moment('07:00', 'HH:mm').format("HH:mm");
                            while (tempTime <= endTime && tempTime <= '18:00') {
                                if (tempTime == "07:00")
                                    _this.tableData[tempTime][day] = JSON.parse('{"userName": "' + _this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                else
                                    _this.tableData[tempTime][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                tempTime = moment(tempTime, 'HH:mm').add(1, 'hour').format('HH:mm');
                            }
                        }
                        else {
                            var tempTime = moment('07:00', 'HH:mm').format("HH:mm");
                            while (tempTime <= '18:00') {
                                if (tempTime == "07:00")
                                    _this.tableData[tempTime][day] = JSON.parse('{"userName": "' + _this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                else
                                    _this.tableData[tempTime][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                tempTime = moment(tempTime, 'HH:mm').add(1, 'hour').format('HH:mm');
                            }
                        }
                        currentDay.add(1, 'days');
                    }
                }
            }
            _this.fillTable();
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TableReservationComponent.prototype, "data", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TableReservationComponent.prototype, "times", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TableReservationComponent.prototype, "reservationType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TableReservationComponent.prototype, "usersList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TableReservationComponent.prototype, "loggedUser", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TableReservationComponent.prototype, "week", void 0);
    TableReservationComponent = __decorate([
        core_1.Component({
            selector: 'tbody',
            templateUrl: 'app/components/home/carReservations/reservations/table/table.reservations.component.html',
            providers: [reservation_service_1.ReservationService, holiday_service_1.HolidayService]
        }), 
        __metadata('design:paramtypes', [formData_service_1.FormDataService, router_1.Router, reservation_service_1.ReservationService, holiday_service_1.HolidayService])
    ], TableReservationComponent);
    return TableReservationComponent;
}());
exports.TableReservationComponent = TableReservationComponent;
