import {Component, Input, EventEmitter} from '@angular/core';
import {Repetition} from '../../../../../../models/repetition.model';
@Component({
    selector: "repeater",
    templateUrl: 'app/components/home/reservations/table/detail/repeat/repeat.reservation.component.html',
    styles: ['.one-line{display: inline-flex; line-height: 34px;} .one-line input{margin-left: 5px; margin-right: 5px} input[type="radio"]{margin-top: 10px;} .radio{margin-top: 0px} .control-label{line-height: 34px;}']
})

export class RepeatReservationComponent
{
    @Input() repetitionData;

    public slovakIntervalSG = {days: "deň", weeks: "týždeň", months: "mesiac", years: "rok"};
    public slovakIntervalPLN = {days: "dni", weeks: "týždne", months: "mesiace", years: "roky"};
    public slovakIntervalPLG = {days: "dní", weeks: "týždňov", months: "mesiacov", years: "rokov"};
}