import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class CarService {
  constructor(private http: Http) {
    let _build = (<any>http)._backend._browserXHR.build;
    (<any>http)._backend._browserXHR.build = () => {
      let _xhr = _build();
      _xhr.withCredentials = true;
      return _xhr;
    };
  }

  public getCars() {
    return this.http.get('http://funnybean.cloudapp.net/api/cars');
  }

  public getCar(id:number) {
    return this.http.get('http://funnybean.cloudapp.net/api/cars/'+id);
  }

  public addCar(car:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://funnybean.cloudapp.net/api/cars',car, {headers});
  }

  public editCar(id:string, car:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put("http://funnybean.cloudapp.net/api/cars/"+id, car, {headers});
  }

  public removeCar(id: string) {
    return this.http.delete('http://funnybean.cloudapp.net/api/cars/'+id);
  }

  public filterCars(date:string, length:number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://funnybean.cloudapp.net/api/cars/filter', JSON.stringify({date, length}), { headers  } );
  }

}
