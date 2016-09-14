import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {ReservationService} from '../../../../../services/reservation.service';
import {UserService} from '../../../../../services/user.service';
import {Reservation} from '../../../../../models/reservation.model';
import {User} from '../../../../../models/user.admin.model';
import {TimeValidator, DateValidator} from '../../../../../validators/time.validator';
import {RepeatReservationComponent} from './repeat/repeat.reservation.component';
import {Repetition} from '../../../../../models/repetition.model';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';

declare var $: any;

@Component({
    selector: 'reservation-detail',
    templateUrl: 'app/components/home/roomReservations/table/detail/detail.reservation.component.html',
    styleUrls: ['app/components/home/roomReservations/table/detail/detail.reservation.component.css'],
    directives: [TimeValidator, DateValidator, RepeatReservationComponent],
    providers: [ReservationService]
})

export class DetailReservationComponent implements OnInit {
    @Input() reservationDetailId;
    @Input() reservationType;
    @Input() loggedUser;
    @Input() usersList;
    @Output() windowClose = new EventEmitter<boolean>();
    @Output() updateData = new EventEmitter<boolean>();

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
    public originDateTime:any;

    constructor(private reservationService: ReservationService, private userService: UserService) {   
     }

    ngOnInit()
    {
        var thisDocument = this;
        this.reservationService.getReservation(this.reservationType, this.reservationDetailId[0]).subscribe(
            data => {
                this.data = data.json();
                this.originDateTime = this.data.dateTime;
                this.reservationDetailId[4] = moment(this.reservationDetailId[4], "DD.MM.YYYY").hour(moment(this.data.dateTime, "YYYY-MM-DDTHH:mm").hours()).minute(moment(this.data.dateTime, "YYYY-MM-DDTHH:mm").minutes()).seconds(0).format("DD.MM.YYYY HH:mm:ss");
                if (this.data.roomReservationRepeaterId != null) {
                    this.reservationService.getRepeatingReservation(this.reservationType, this.data.roomReservationRepeaterId).subscribe(
                        data => {
                            this.repetitionData = data.json();
                            this.repetitionData.endDate = moment(this.repetitionData.endDate, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD");
                            this.repetitionData.end = (this.repetitionData.appearance == null) ? "date" : "appearance";
                            this.repeating = true;
                            if (this.reservationDetailId[4] != "Invalid date") {
                                this.data.dateTime = moment(this.reservationDetailId[4], "DD.MM.YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm");
                                this.updateEndTime();
                            }
                        }
                    )
                }   
                this.dateTime = moment(this.data.dateTime, "YYYY-MM-DDTHH:mm").format("DD.MM.YYYY HH:mm");
                this.data.length = this.data.length / 60;
                this.authorizeActions();
                this.updateMaxTime();
                this.updateEndTime();
            },
            error => console.log(error)
        );
        $(document).on("keyup", function (e) {
            if (e.which == 27) {
                if (thisDocument.reservationDetailId[3])
                    thisDocument.windowClose.emit(false);
                else thisDocument.deleteReservation();
            }
        });  
    }

    ngOnDestroy() {
        $(document).unbind("keyup");
    }

    updateMaxTime()
    {
        this.maxTime = ((18 - moment(this.data.dateTime, "YYYY-MM-DDTHH:mm").hour()) * 60 - moment(this.data.dateTime).minute()) / 60;
    }

    updateEndTime()
    {
        if (this.canEdit)
            this.endDateTime = moment(this.data.dateTime, "YYYY-MM-DDTHH:mm").add(this.data.length * 60, 'minutes').format("YYYY-MM-DDTHH:mm");
        else this.endDateTime = moment(this.data.dateTime, "YYYY-MM-DDTHH:mm").add(this.data.length * 60, 'minutes').format("DD.MM.YYYY HH:mm");
    }

    updateLength()
    {
        this.data.length = (moment(this.endDateTime, "YYYY-MM-DDTHH:mm").unix() - moment(this.data.dateTime).unix()) / 3600;
    }

    authorizeActions()
    {
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

    editReservation(form)
    {
        if(form.invalid || (form.pristine && !this.emailInvitation && !this.reserveGoToMeeting && !this.repeating && this.data.roomReservationRepeaterId == null)){
            this.windowClose.emit(true);
            return false;
        }
        this.saving = true;
        
        if(this.data.roomReservationRepeaterId)
            this.data.dateTime = moment(this.data.dateTime).date(moment(this.originDateTime).date()).month(moment(this.originDateTime).month()).year(moment(this.originDateTime).year()).format("YYYY-MM-DDTHH:mm");
        
        if (this.repeating) {
            this.checkRepetitionFree().subscribe(
                data => {
                    if (!data)
                        this.saveData(true);
                    else {
                        var errors = data.json();
                        this.error = "Na tieto dátumy nemožno vytvoriť rezerváciu: ";
                        for (var error of errors)
                            this.error += moment(error).format("DD.MM.YY HH:mm") + ", ";
                        this.saveData(false);
                    }
                }
            );
        } else this.saveData(true);    
    }

    saveData(closeWindow:boolean) {
        var elementId = this.data.roomId, dayData;
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

                var repeaterId: any;
                if (!this.repeating && this.data.roomReservationRepeaterId != null)
                    repeaterId = null;
                else repeaterId = this.data.roomReservationRepeaterId;

                this.reservationService.editReservation(this.reservationType, this.data.id, this.data.name, elementId, this.data.userId, this.data.dateTime, this.data.length * 60, repeaterId, this.emailInvitation, this.reserveGoToMeeting).subscribe(
                    data => { },
                    error => {
                        this.error = 'Na daný termín je v GoToMeeting naplánovaná už iná rezervácia.';
                        console.log("error " + error);
                        this.saving = false;
                    },
                    () => {
                        if (this.repeating) {
                            if (this.data.roomReservationRepeaterId == null) {
                                this.reservationService.addRepeatingReservation(this.reservationType, this.data.id, this.repetitionData.repetation, this.repetitionData.interval, this.repetitionData.end, this.repetitionData.appearance, this.repetitionData.endDate).subscribe(
                                    error => { this.saving = false }
                                )
                            } else {
                                this.reservationService.editRepeatingReservation(this.reservationType, this.data.roomReservationRepeaterId, this.data.id, this.repetitionData.repetation, this.repetitionData.interval, this.repetitionData.end, this.repetitionData.appearance, this.repetitionData.endDate).subscribe(
                                    error => { this.saving = false }
                                )
                            }
                        }
                        else if (!this.repeating && this.data.roomReservationRepeaterId != null) {
                            this.reservationService.deleteRepeatingReservation(this.reservationType, this.data.roomReservationRepeaterId).subscribe(
                                data => {
                                    this.data.roomReservationRepeaterId = null;
                                },
                                error => { this.saving = false }
                            )
                        }
                        if (closeWindow)
                            setTimeout(() => this.windowClose.emit(true), 1000);
                        else {
                            this.reservationDetailId[3] = 1;
                            setTimeout(() => this.updateData.emit(true), 1000);
                            setTimeout(() => this.ngOnInit(), 1000);
                        }
                        this.saving = false;
                    }
                );
            }
        );
    }

    addNewReservationFromRepeating()
    {
        this.reservationService.addReservation(this.reservationType, this.data.roomId, 1, 'Rezervácia', moment(this.data.dateTime).format("DD.MM.YYYY HH:mm"), this.data.length * 60).subscribe(
            data => {          
                this.reservationDetailId = [data.json().id, this.reservationDetailId[1],this.reservationDetailId[2], 0];  //okno na potvrdenie rezervacie      
            },
            error => { alert(error); },
            () => { 
                this.windowClose.emit(true)
            }
        );
    }

    editOneRepeatingReservation(form)
    {
        if(form.pristine && !this.emailInvitation && !this.reserveGoToMeeting && !this.repeating && this.data.roomReservationRepeaterId == null){
            this.windowClose.emit(true);
            return false;
        }
        this.saving = true;
        var elementId = this.data.roomId, dayData;
        this.reservationService.getReservations(this.reservationType, elementId, moment(this.data.dateTime).format("DD.MM.YYYY"), moment(this.data.dateTime).add(1, 'days').format("DD.MM.YYYY")).subscribe(
            data => { dayData = data.json() },
            error => console.log(error),
            () => {
                for (var i = 0; i < dayData.length; i++) {
                    if (this.data.id == dayData[i].id)
                        continue;
                    var date = moment(dayData[i].dateTime), reservationTime = moment(this.data.dateTime).format("HH:mm"), reservationTimeEnd = moment(this.data.dateTime).add(this.data.length * 60, 'minutes').format("HH:mm"), time = date.format("HH:mm"), endTime = date.add(dayData[i].length, 'minutes').format("HH:mm");
                    if ((reservationTime >= time && reservationTime < endTime) || (time >= reservationTime && time < reservationTimeEnd)){
                        this.error = "Zvolený čas zasahuje do rezervácie iného používateľa.";
                        this.saving = false;
                        return false;
                    }
                }
                this.reservationService.editOneRepeatingReservation(this.data.id, this.reservationDetailId[4]).subscribe(
                    () => {
                        this.addNewReservationFromRepeating();
                    }
                );
            }
        );
    }

    deleteOneRepatingReservaion()
    {
        this.saving = true;
        this.reservationService.editOneRepeatingReservation(this.data.id, this.reservationDetailId[4]).subscribe(
            () => { this.windowClose.emit(true) }
        );
    }

    deleteReservation() 
    {
        this.reservationService.deleteReservation(this.reservationType, this.data.id).subscribe(
            () => { this.windowClose.emit(true) },
            error => console.log(error)
        );
    }

    closeWindow()
    {
        this.windowClose.emit(false);
    }

    checkRepetitionFree()
    {
        return Observable.create(observer => {
            this.reservationService.checkDupliciteRepeatingReservations(this.data.id, this.repetitionData.repetation, this.repetitionData.interval, this.repetitionData.appearance, this.repetitionData.end, this.repetitionData.endDate).subscribe(
                data => {
                    observer.next();
                    observer.complete();
                },
                error => {
                    observer.next(error);
                    observer.complete();
                }
            );
        });
    }
}
