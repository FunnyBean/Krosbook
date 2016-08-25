import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TimeValidator, DateValidator} from '../../../../validators/time.validator';
import {CarReservation} from '../../../../models/carReservation.model';
import {CarOrderService} from '../../../../services/carReservation.service';


@Component({
  selector: 'order',
  templateUrl: 'app/components/home/carReservations/order/order.detail.component.html',              
  styleUrls: ['lib/css/modalWindow.css'],  
  providers:[CarOrderService]
})

export class OrderDetailComponent {
  public error;
  public success;
  public reservationData:CarReservation = new CarReservation();
  public formReset:boolean = true;  
  
  

  @Output() windowClose = new EventEmitter<boolean>();
  @Output() updateList = new EventEmitter<boolean>();
 
  constructor(private carOrderService:CarOrderService) { }


  closeWindow(){
    this.windowClose.emit(false);
  }

  newOrder(){
    this.carOrderService.addOrder(this.reservationData.carId, this.reservationData.dateTimeStart, this.reservationData.dateTimeEnd, this.reservationData.destination, this.reservationData.GPSSystem, this.reservationData.privateUse, this.reservationData.requirements, this.reservationData.travelInsurance, 1).subscribe(
      data => {
      },
      error => {
        this.error = error;
      },
      () => {
        this.success = 'Objedávka úspešne vytvorená.';
        this.reservationData = new CarReservation();
        this.formReset = false;
        setTimeout(() => this.formReset = true, 0);
      }
    );
    
  }
}

