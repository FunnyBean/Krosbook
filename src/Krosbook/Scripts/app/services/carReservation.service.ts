import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class CarOrderService {
  constructor(private http: Http) {
    let _build = (<any>http)._backend._browserXHR.build;
    (<any>http)._backend._browserXHR.build = () => {
      let _xhr = _build();
      _xhr.withCredentials = true;
      return _xhr;
    };
  }

  public getOrders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://funnybean.cloudapp.net/api/reservations/cars/', { headers  } ); 
  }

  public getOrder(id:number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://funnybean.cloudapp.net/api/reservations/cars/'+id, { headers  } ); 
  }

  public getUserOrders(){
    return this.http.get('http://funnybean.cloudapp.net/api/reservations/cars/byLoggedInUser');
  }

  public addOrder(carId, dateStart, dateEnd, destination, GPSSystem, privateUse, requirements, travelInsurane, reservationState) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://funnybean.cloudapp.net/api/reservations/cars', JSON.stringify({carId, dateStart, dateEnd, destination, GPSSystem, privateUse, requirements, travelInsurane, reservationState}), {headers});
  }

  public editOrder(id:number, carId, dateStart, dateEnd, destination, GPSSystem, privateUse, requirements, travelInsurane, reservationState){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put("http://funnybean.cloudapp.net/api/reservations/cars/"+id, JSON.stringify({id, carId, dateStart, dateEnd, destination, GPSSystem, privateUse, requirements, travelInsurane, reservationState}), {headers});
  }

  public removeOrder(id: number) {
    return this.http.delete('http://funnybean.cloudapp.net/api/reservations/cars/'+id);
  }

  public safeRemoveOrder(id: number) {
    return this.http.delete('http://funnybean.cloudapp.net/api/reservations/cars/safe/'+id);
  }

   public approveOrder(id: number) {
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     return this.http.put('http://funnybean.cloudapp.net/api/reservations/cars/approve/'+id, {headers});
  }

  

}
