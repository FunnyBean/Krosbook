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
    return this.http.get('/api/cars');
  }

  public getCar(id:number) {
    return this.http.get('/api/cars/'+id);
  }

  public addCar(car:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/cars',car, {headers});
  }

  public editCar(id:string, car:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put("/api/cars/"+id, car, {headers});
  }

  public removeCar(id: string) {
    return this.http.delete('/api/cars/'+id);
  }

  public filterCars(date:string, length:number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/cars/filter', JSON.stringify({date, length}), { headers  } );
  }

}
