import * as moment from  'moment';

export class CarReservation{
  public id:number;
  public carId:number;
  public userId:number;
  public dateTimeStart:any = moment().format("YYYY-MM-DDTHH:mm:ss");
  public dateTimeEnd:any = moment().format("YYYY-MM-DDTHH:mm:ss");
  public destination:string;
  public travelInsurance:string;
  public GPSSystem:boolean = false;
  public requirements:string;
  public privateUse:boolean = false;
  public reservationState:number = 1;
}

