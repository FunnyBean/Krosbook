import {Component, Input, OnInit, ViewChild, Inject} from '@angular/core';
import {ReservationService} from '../../../../../services/reservation.service';
import {CarService} from '../../../../../services/car.service';
import {HolidayService} from '../../../../../services/holiday.service';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import * as moment from 'moment';

import {FormDataService} from '../../../../../services/formData.service';
import {Car} from '../../../../../models/car.model';
declare var $: any;


@Component({
    selector: 'tbody',
    templateUrl: 'app/components/home/carReservations/reservations/table/table.reservations.component.html',
    providers: [ReservationService, HolidayService]
})

export class TableReservationComponent implements OnInit {
    @Input() week;

    public tableData = [];
    public reservationsData;
    public now = moment();
    public month: string;
    public days;
    public data: any;
    private carsData: Array<Car>;

    constructor(private formDataService: FormDataService, private carService: CarService, private router: Router, private reservationService: ReservationService, private holidayService: HolidayService) { }

    ngOnInit() {
        this.carService.getCars().subscribe(
            data => {
                this.carsData = data.json();
            },
            error => console.log(error),
            () => { this.fillTable() }
        )
        this.formDataService.saveData(undefined, undefined, 0);
        var thisDocument = this;
        $(window).on("focus", function () {
            thisDocument.updateData(thisDocument.week);
        });
    }

    ngOnDestroy() {
        $(window).unbind("focus");
    }

    fillTable() {
        var table = '<tr><td><button class="btn btn-default glyphicon table-arrow glyphicon-triangle-top" id="moveBack"></button><button class="btn btn-default glyphicon table-arrow glyphicon-triangle-bottom" id="moveFor"></button></td>', fromRow, fromCol, length = 1, carId, isMouseDown = false, thisDocument = this, col, row, beforeRow = 0, bg, lastCell;


        for (let car of this.carsData) {
            table += '  <td  class="officeName" style="background-color: ' + car.color + '">' + ' ' + car.plate + '</td>'
        };

        table += '</tr>';

        this.updateWeek();

        for (var i = 0; i < this.days.length; i++) {
            table += '<tr>';
            if (this.days[i] == this.now.format("dd DD.MM.YY")) {
                table += '<td class="col-md-1 time" id="currentDate">' + this.days[i] + '</td>';
            } else {
                table += '<td class="col-md-1 time">' + this.days[i] + '</td>';
            }

            for (var j = 0; j < this.carsData.length; j++) {

                let holiday: string = this.holidayService.isHoliday(moment().add(this.week, 'weeks').weekday(i + 1).format("DD/MM"), moment().add(this.week, 'weeks').format("YYYY"));

                if (holiday) {
                    if (j == 0) {
                        table += '<td class="col-md-2 holiday2">' + holiday + '</td>';
                    }
                    else {
                        table += '<td class="col-md-2 holiday2"></td>';
                    }
                }
                else { table += '<td class="col-md-2 empty"></td>'; }

            }
            table += '</tr>';

        }

        $("#moveBack").on("click", function (event) {
            thisDocument.updateData(thisDocument.week.add(1))
            console.log("moveBack")
        })
        $("#moveFor").on("click", function (event) {
            console.log("moveFor")
        })

        //replacing old data with new table data
        $(".allCars > tr").remove();
        $(".allCars").prepend(table);

        $(".allCars td.empty").on("mouseenter", function (event) {
            col = $(this).parent().children().index($(this));
            row = $(this).parent().parent().children().index($(this).parent()) - 1;
        });

        $(".allCars td.empty")
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

    updateWeek() {
        this.month = moment().add(this.week, 'month').format("MMMM").toUpperCase();
        this.days = JSON.parse('[]');
        var i = 1;
        while (this.month == moment().add(this.week, 'month').weekday(i).format("MMMM").toUpperCase()) {
            if (moment().add(this.week, 'month').weekday(i).format("dddd") == "Saturday" || moment().add(this.week, 'month').weekday(i).format("dddd") == "Sunday") {

            } else {
                var day = moment().add(this.week, 'month').weekday(i).format("dd DD.MM.YY");
                this.days.push(day);
            }
            i++;
        }
    }

    makeReservation(fromRow: number, fromCol: number, length: number, carId: number) {
        var date, days = 1;
        for (var i = 0; i < fromRow; i++)
            days++;
        date = moment().add(this.week, 'weeks').weekday(fromRow).hour(7).minute(0).format("YYYY-MM-DDTHH:mm");

        this.formDataService.saveData(date, moment(date).add(length, 'days').format("YYYY-MM-DDTHH:mm"), this.carsData[fromCol - 1].id);
        this.router.navigate(['/home/reservations/cars/newreservation/']);
    }


    updateData(weeks) {
        this.week = weeks
        this.ngOnInit()
    }

}
