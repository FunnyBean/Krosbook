import {Component} from '@angular/core';
import {CarOrderService} from '../../../../services/carReservation.service';
import {CarService} from '../../../../services/car.service';
import {CarReservation} from '../../../../models/carReservation.model';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
    templateUrl: 'app/components/home/carReservations/myReservations/myReservations.component.html',
    providers: [CarOrderService]
})

export class MyReservationsComponent
{
    private reservations:Array<CarReservation> = new Array<CarReservation>();
    private cars:Array<string> = new Array<string>();
    public states = ['V poardí', 'Schválená', 'Zaradená na vymazanie'];

    constructor(private carReservationService: CarOrderService, private carService:CarService, private router:Router){ 
        this.carService.getCars().subscribe(
            data => {
                var cars = data.json();
                for(var i = 0; i < cars.length; i++)
                    this.cars[cars[i].id] = cars[i].name + " : " + cars[i].plate; 
            },
            error => console.log(error),
            () => { this.updateReservationsData() }
        )
        
    }

    updateReservationsData()
    {
        this.carReservationService.getUserOrders().subscribe(
            data => {
                this.reservations = data.json();
            },
            error => console.log(error)
        )
    }

    editReservation(id)
    {
        this.router.navigate(['/home/reservations/cars/editreservation/', id]);
    }

    deleteReservation(id)
    {
        if(confirm("Naozaj chcete vymazať túto rezerváciu auta?")) {
            this.carReservationService.removeOrder(id).subscribe(
                data => { },
                error => { alert(error) },
                () => { this.updateReservationsData(); }
            )
        }
    }

    askForDeleteReservation(id)
    {
        if(confirm("Naozaj chcete požiadať o zrušenie tejto rezervácie auta?")) {
            this.carReservationService.safeRemoveOrder(id).subscribe(
                data => { },
                error => { alert(error) },
                () => { this.updateReservationsData(); }
            )
        }
    }

    formatDateTime(dateTime)
    {
        return moment(dateTime).format("DD.MM.YYYY HH:mm");
    }
}