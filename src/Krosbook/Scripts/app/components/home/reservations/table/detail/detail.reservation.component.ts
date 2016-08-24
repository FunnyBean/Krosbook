import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ReservationService} from '../../../../../services/reservation.service';
import {UserService} from '../../../../../services/user.service';
import {Reservation} from '../../../../../models/reservation.model';
import {User} from '../../../../../models/user.admin.model';
import {TimeValidator, DateValidator} from '../../../../../validators/time.validator';
import {RepeatReservationComponent} from './repeat/repeat.reservation.component';
import {Repetition} from '../../../../../models/repetition.model';
import * as moment from 'moment';

@Component({
    selector: 'reservation-detail',
    templateUrl: 'app/components/home/reservations/table/detail/detail.reservation.component.html',
    styleUrls: ['app/components/home/reservations/table/detail/detail.reservation.component.css'],
    directives: [TimeValidator, DateValidator, RepeatReservationComponent],
    providers: [ReservationService]
})

export class DetailReservationComponent implements OnInit {
    @Input() reservationDetailId;
    @Input() reservationType;
    @Input() loggedUser;
    @Input() usersList;
    @Output() windowClose = new EventEmitter<boolean>();

    private saving: boolean = false;

    public data: Reservation = new Reservation();
    public dateTime;
    public endDateTime;
    public error: string;
    public canEdit: boolean = false;
    public maxTime: number;
    public emailInvitation: boolean = false;
    public reserveGoToMeeting: boolean = false;
    public repeating:boolean = false;
    public repetitionData:Repetition = new Repetition();

    constructor(private reservationService: ReservationService, private userService: UserService) { }

    ngOnInit() {
        this.reservationService.getReservation(this.reservationType, this.reservationDetailId[0]).subscribe(
            data => {
                this.data = data.json();
                if(this.data.reservationRepeaterId != null){
                    this.reservationService.getRepeatingReservation(this.reservationType, this.data.reservationRepeaterId).subscribe(
                        data => { this.repetitionData = data.json(); this.repeating = true; }
                    )
                }
                this.dateTime = moment(this.data.dateTime).format("DD.MM.YYYY HH:mm");
                this.data.length = this.data.length / 60;
                this.authorizeActions();
                this.updateMaxTime();
                this.updateEndTime();
            },
            error => console.log(error)
        );
    }

    updateMaxTime() {
        this.maxTime = ((18 - moment(this.data.dateTime).hour()) * 60 - moment(this.data.dateTime).minute()) / 60;
    }

    updateEndTime() {
        if (this.canEdit)
            this.endDateTime = moment(this.data.dateTime).add(this.data.length * 60, 'minutes').format("YYYY-MM-DDTHH:mm");
        else this.endDateTime = moment(this.data.dateTime).add(this.data.length * 60, 'minutes').format("DD.MM.YYYY HH:mm");
    }

    updateLength() {
        this.data.length = (moment(this.endDateTime).unix() - moment(this.data.dateTime).unix()) / 3600;
    }

    authorizeActions() {
        if (this.data.userId == this.loggedUser.id)
            this.canEdit = true;
        else {
            for (var i = 0; i < this.loggedUser.roles.length; i++) {
                if (this.loggedUser.roles[i].roleId == 1) {
                    this.canEdit = true;
                    break;
                } 
            } 
        }
    }

    editReservation(form) {
        if(form.pristine && !this.emailInvitation && !this.reserveGoToMeeting && !this.repeating){
            this.windowClose.emit(true);
            return false;
        }
        this.saving = true;
        var elementId = (this.reservationType == "rooms") ? this.data.roomId : this.data.carId, dayData;
        this.reservationService.getReservations(this.reservationType, elementId, moment(this.data.dateTime).format("DD.MM.YYYY"), moment(this.data.dateTime).add(1, 'days').format("DD.MM.YYYY")).subscribe(
            data => { dayData = data.json() },
            error => console.log(error),
            () => {
                for (var i = 0; i < dayData.length; i++) {
                    if (this.data.id == dayData[i].id)
                        continue;
                    var date = moment(dayData[i].dateTime), reservationTime = moment(this.data.dateTime).format("HH:mm"), reservationTimeEnd = moment(this.data.dateTime).add(this.data.length * 60, 'minutes').format("HH:mm"), time = date.format("HH:mm"), endTime = date.add(dayData[i].length, 'minutes').format("HH:mm");
                    if ((reservationTime >= time && reservationTime < endTime) || (time >= reservationTime && time < reservationTimeEnd)) {
                        this.error = "Zvolený čas zasahuje do rezervácie iného používateľa.";
                        this.saving = false;
                        return false;
                    }
                }
                this.reservationService.editReservation(this.reservationType, this.data.id, this.data.name, elementId, this.data.userId, this.data.dateTime, this.data.length * 60, this.emailInvitation, this.reserveGoToMeeting).subscribe(
                    data => { },
                    error => {
                        this.error = 'Na daný termín je v GoToMeeting naplánovaná už iná rezervácia.';
                        console.log("error " + error);
                        this.saving = false;
                    },
                    () => {
                        if(this.repeating)
                        {
                            if(this.data.reservationRepeaterId == null){
                                this.reservationService.addRepeatingReservation(this.reservationType, this.data.id, this.data.dateTime, this.repetitionData.repeating, this.repetitionData.interval, this.repetitionData.end, this.repetitionData.appearance, this.repetitionData.date).subscribe(
                                    data => {
                                        this.saving = false;
                                        this.windowClose.emit(true);
                                    },
                                    error => { this.saving = false }
                                )
                            } else {
                                this.reservationService.editRepeatingReservation(this.reservationType, this.data.reservationRepeaterId, this.data.id, this.data.dateTime, this.repetitionData.repeating, this.repetitionData.interval, this.repetitionData.end, this.repetitionData.appearance, this.repetitionData.date).subscribe(
                                    data => {
                                        this.saving = false;
                                        this.windowClose.emit(true);
                                    },
                                    error => { this.saving = false }
                                )
                            }
                        }
                        else if(!this.repeating && this.data.reservationRepeaterId != null){
                            this.reservationService.deleteRepeatingReservation(this.reservationType, this.data.reservationRepeaterId).subscribe(
                                data => {
                                    this.saving = false;
                                    this.windowClose.emit(true);
                                },   
                                error => { this.saving = false }
                            )
                        }
                        else {
                            this.saving = false;
                            this.windowClose.emit(true);
                        }
                    }
                );
            }
        );
    }

    deleteReservation() {
        this.reservationService.deleteReservation(this.reservationType, this.data.id).subscribe(
            () => { this.windowClose.emit(true) },
            error => console.log(error)
        );
    }

    closeWindow() {
        this.windowClose.emit(false);
    }
}
