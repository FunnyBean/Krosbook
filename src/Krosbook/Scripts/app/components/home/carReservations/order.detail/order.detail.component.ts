import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TimeValidator, DateValidator} from '../../../../validators/time.validator';
import {CarOrder} from '../../../../models/car.order.model';
import {CarOrderService} from '../../../../services/car.order.service';


@Component({
  selector: 'order',
  templateUrl: 'app/components/home/carReservations/order.detail/order.detail.component.html',              
  styleUrls: ['lib/css/modalWindow.css'],  
  providers:[CarOrderService]
})

export class OrderDetailComponent {
  public error;
  public success;
  public orderData:CarOrder=new CarOrder();
  public formReset:boolean = true;  
  
  

  @Output() windowClose = new EventEmitter<boolean>();
  @Output() updateList = new EventEmitter<boolean>();
 
  constructor(private carOrderService:CarOrderService) { }


  closeWindow(){
    this.windowClose.emit(false);
  }

  newOrder(){
  	
    let beginOrder=this.orderData.beginOrder;
    let endOrder=this.orderData.endOrder;
    let destinationName=this.orderData.destinationName;
    let insurance=this.orderData.insurance;
    let gpsRequirement=this.orderData.gpsRequirement;
    let changeBussinesTrip=this.orderData.changeBussinesTrip;
    let otherRequirement=this.orderData.otherRequirement;
    let privateUse=this.orderData.privateUse;
    this.carOrderService.addOrder(JSON.stringify({beginOrder, endOrder, destinationName,insurance,gpsRequirement,changeBussinesTrip,otherRequirement,privateUse})).subscribe(
      data => {
      },
      error => {
        this.error = error;
      },
      () => {
        this.success = 'Objedávka úspešne vytvorená.';
        this.orderData = new CarOrder();
        this.formReset = false;
        setTimeout(() => this.formReset = true, 0);
        this.updateList.emit(true);
      }
    );
    
  }




}

