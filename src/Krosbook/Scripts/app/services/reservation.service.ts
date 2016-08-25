import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Repetition} from '../models/repetition.model';
import * as moment from 'moment';

@Injectable()
export class ReservationService {
  constructor(private http: Http) {
    let _build = (<any>http)._backend._browserXHR.build;
    (<any>http)._backend._browserXHR.build = () => {
      let _xhr = _build();
      _xhr.withCredentials = true;
      return _xhr;
    };
  }

  public getReservation(type:string, id:number){
    return this.http.get('http://funnybean.cloudapp.net/api/reservations/'+type+'/'+id);
  }

  public getReservations(type:string, id:number, from:any, to:any){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var by = (type == "rooms") ? "byroom" : "bycar";
    return this.http.post('http://funnybean.cloudapp.net/api/reservations/'+type+'/'+by+'/'+id, JSON.stringify({from, to}), {headers});
  }

  public addReservation(type:string, elementId: number, userId:number, name:string, date:string, length:number){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(type == "rooms"){
      var roomId = elementId;
      return this.http.post('http://funnybean.cloudapp.net/api/reservations/'+type+'/', JSON.stringify({roomId, name, date, length}), {headers});
    } else {
      var carId = elementId;
      return this.http.post('http://funnybean.cloudapp.net/api/reservations/'+type+'/', JSON.stringify({carId, name, date, length}), {headers});
    }
  }

  public editReservation(type:string, id:number, name:string, elementId:number, userId:number, dateTime:any, length:number, roomReservationRepeaterId:number, emailInvitation:boolean, goToMeeting:boolean){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(type == "rooms"){
      var roomId = elementId;
      return this.http.put('http://funnybean.cloudapp.net/api/reservations/'+type+'/'+id, JSON.stringify({id, name, roomId, dateTime, userId, length, roomReservationRepeaterId, emailInvitation, goToMeeting}), {headers});
    } else {
      var carId = elementId;
      return this.http.put('http://funnybean.cloudapp.net/api/reservations/'+type+'/'+id, JSON.stringify({id, name, carId, dateTime, userId, length}), {headers});
    }
  }

  public deleteReservation(type:string, id:number){
    return this.http.delete('http://funnybean.cloudapp.net/api/reservations/'+type+'/'+id);
  }

  public getRepeatingReservation(type:string, repetitionId:number)
  {
    return this.http.get('http://funnybean.cloudapp.net/api/reservations/'+type+'/repetition/'+repetitionId);
  }

  public addRepeatingReservation(type:string, reservationId:number, repetation:string, interval:number, endType:string, appearance:number, endingDate:any){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    appearance = (endType == 'appearance') ? appearance : null;
    endingDate = (endType == 'date') ? moment(endingDate).format("DD.MM.YYYY HH:mm:ss") : null;
    return this.http.post('http://funnybean.cloudapp.net/api/reservations/'+type+'/repetition', JSON.stringify({reservationId, repetation, interval, appearance, endingDate}), { headers });
  }

  public editRepeatingReservation(type:string, id:number, reservationId:number, repetation:string, interval:number, endType:string, appearance:number, endingDate:any){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    appearance = (endType == 'appearance') ? appearance : null;
    endingDate = (endType == 'date') ? moment(endingDate).format("DD.MM.YYYY HH:mm:ss") : null;
    return this.http.put('http://funnybean.cloudapp.net/api/reservations/'+type+'/repetition/'+id, JSON.stringify({id, reservationId, repetation, interval, appearance, endingDate}), { headers });
  }

  public deleteRepeatingReservation(type:string, repetitionId:number)
  {
    return this.http.delete('http://funnybean.cloudapp.net/api/reservations/'+type+'/repetition/'+repetitionId);
  }
}
