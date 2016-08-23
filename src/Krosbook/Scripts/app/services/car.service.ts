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
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://funnybean.cloudapp.net/api/cars', { headers  } ); /*headers tu nemusi byt*/
  }

  public getCar(id:number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://funnybean.cloudapp.net/api/cars/'+id, { headers  } ); /*headers tu nemusi byt*/
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
