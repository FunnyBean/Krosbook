import * as moment from  'moment';

export class CarReservation{
  public id:number;
  public carId:number;
  public userId:number;
  public dateTimeStart:any = moment().minutes(0).format("YYYY-MM-DDTHH:mm");
  public dateTimeEnd:any = moment().add(1, 'hour').minutes(0).format("YYYY-MM-DDTHH:mm");
  public destination:string;
  public travelInsurance:string;
  public gpsSystem:boolean = false;
  public requirements:string;
  public privateUse:boolean = false;
  public reservationState:number = 1;
}

