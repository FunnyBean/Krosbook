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
    return this.http.get('/api/orders', { headers  } ); 
  }

  public getOrder(id:number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('/api/orders/'+id, { headers  } ); 
  }

  public addOrder(order:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/orders',order, {headers});
  }

  public editOrder(id:string, order:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put("/api/orders/"+id, order, {headers});
  }

  public removeOrder(id: number) {
    return this.http.delete('/api/orders/'+id);
  }

  

}
