import {Component, Input, OnInit, ViewChild, Inject} from '@angular/core';
import {ReservationService} from '../../../../../services/reservation.service';
import {HolidayService} from '../../../../../services/holiday.service';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import * as moment from 'moment';

import {FormDataService} from '../../../../../services/formData.service';
declare var $: any;


@Component({
    selector: 'tbody',
    templateUrl: 'app/components/home/carReservations/reservations/table/table.reservations.component.html',
    providers: [ReservationService, HolidayService]
})

export class TableReservationComponent implements OnInit {
    @Input() data;
    @Input() times;
    @Input() reservationType;
    @Input() usersList;
    @Input() loggedUser;
    @Input() week;

    public tableData = [];
    public reservationsData;

    constructor(private formDataService: FormDataService, private router: Router, private reservationService: ReservationService, private holidayService: HolidayService) { }

    ngOnInit() {
        this.formDataService.saveData(undefined, undefined, 0);
        this.updateData();
        this.data.color = (this.data.color == null) ? '#337ab7' : this.data.color;
        var thisDocument = this;
        $(window).on("focus", function () {
            thisDocument.updateData();
        });
    }

    ngOnDestroy() {
        $(window).unbind("focus");
    }

    fillTable() {
        var table = '<tr><td colspan="6" class="officeName" style="background-color: ' + this.data.color + '"><h4>' + this.data.name + ' &nbsp &nbsp ' + this.data.plate + '</h4></td></tr>', fromRow, fromCol, length = 1, carId, isMouseDown = false, thisDocument = this, col, row, beforeRow = 0, bg, lastCell;
        for (var i = 0; i < this.times.length; i++) {
            table += '<tr>';
            table += '<td class="col-md-1 time">' + this.times[i].time + '</td>';
            for (var j = 0; j < this.tableData[this.times[i].time].length; j++) {
                let cell = this.tableData[this.times[i].time][j];
                let holiday: string = this.holidayService.isHoliday(moment().add(this.week, 'weeks').weekday(j + 1).format("DD/MM"), moment().add(this.week, 'weeks').format("YYYY"));
                if (cell.long == null) {
                    if (holiday) {
                        if (i == 0)
                            table += '<td class="col-md-2 holiday">' + holiday + '</td>';
                        else table += '<td class="col-md-2 holiday"></td>';
                    }
                    else table += '<td class="col-md-2 empty"></td>';
                } else {
                    if (cell.reservationState == 2)
                        bg = "bg-primary";
                    else bg = "bg-danger";
                    if (cell.reservationName == null) {
                        table += '<td reservationId="' + cell.reservationId + '" class="col-md-2 ' + bg + ' full"></td>';
                    } else {
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
                if (event.which != 1) return false; //does not work for other than left button
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
    }

    makeReservation(fromRow: number, fromCol: number, length: number, carId: number) {
        var date, hours = 7;
        for (var i = 0; i < fromRow; i++)
            hours++;
        date = moment().add(this.week, 'weeks').weekday(fromCol).hour(hours).minute(0).format("YYYY-MM-DDTHH:mm");
        this.formDataService.saveData(date, moment(date).add(length, 'hours').format("YYYY-MM-DDTHH:mm"), carId);
        this.router.navigate(['/home/reservations/cars/newreservation/']);
    }


    updateData(weeks = this.week) {
        this.reservationService.getReservations(this.reservationType, this.data.id, moment().add(weeks, 'weeks').weekday(1).format("DD.MM.YYYY"), moment().add(weeks, 'weeks').weekday(6).format("DD.MM.YYYY")).subscribe(
            data => {
                this.reservationsData = data.json();
            },
            error => console.log(error),
            () => {
                //setting default data to 0
                for (var i = 0; i < this.times.length; i++) {
                    var pTime: any = this.times[i].time;
                    this.tableData[pTime] = new Array();
                    for (var j = 0; j < 5; j++)
                        this.tableData[pTime][j] = 0;
                }
                //for each record, set table data
                for (var i = 0; i < this.reservationsData.length; i++) {
                    var record = this.reservationsData[i];
                    var startDay = moment(record.dateTimeStart, "YYYY-MM-DDTHH:mm:ss"), endDay = moment(record.dateTimeEnd, "YYYY-MM-DDTHH:mm:ss"), currentDay = moment(record.dateTimeStart, "YYYY-MM-DDTHH:mm:ss"), time = startDay.format("HH:mm"), endTime = endDay.format('HH:mm');
                    if (startDay.format("YYYY-MM-DD") == endDay.format("YYYY-MM-DD")) {
                        var day = startDay.weekday() - 1;
                        while (time < endTime && time <= '18:00') {
                            if (time >= '07:00') {
                                if (time == startDay.format("HH:mm") || time == '07:00')
                                    this.tableData[time][day] = JSON.parse('{"userName": "' + this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                else this.tableData[time][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
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
                                            this.tableData[time][day] = JSON.parse('{"userName": "' + this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                        else this.tableData[time][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                    }
                                    time = moment(time, 'HH:mm').add(1, 'hour').format('HH:mm');
                                }
                            }
                            else if (endDay.format("YYYY-MM-DD") == currentDay.format("YYYY-MM-DD")) {
                                var tempTime = moment('07:00', 'HH:mm').format("HH:mm");
                                while (tempTime <= endTime && tempTime <= '18:00') {
                                    if (tempTime == "07:00")
                                        this.tableData[tempTime][day] = JSON.parse('{"userName": "' + this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                    else this.tableData[tempTime][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                    tempTime = moment(tempTime, 'HH:mm').add(1, 'hour').format('HH:mm');
                                }
                            }
                            else {
                                var tempTime = moment('07:00', 'HH:mm').format("HH:mm");
                                while (tempTime <= '18:00') {
                                    if (tempTime == "07:00")
                                        this.tableData[tempTime][day] = JSON.parse('{"userName": "' + this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                    else this.tableData[tempTime][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "' + record.id + '", "reservationState": "' + record.reservationState + '"}');
                                    tempTime = moment(tempTime, 'HH:mm').add(1, 'hour').format('HH:mm');
                                }
                            }
                            currentDay.add(1, 'days');
                        }
                    }
                }
                this.fillTable();
            }
        );
    }

}
