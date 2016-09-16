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

    public getOrders(interval: string) {
        return this.http.get('/api/reservations/cars/interval/' + interval);
    }

    public getOrder(id: number) {
        return this.http.get('/api/reservations/cars/' + id);
    }

    public getUserOrders() {
        return this.http.get('/api/reservations/cars/byLoggedInUser');
    }

    public addOrder(carId, dateStart, dateEnd, destination, GPSSystem, privateUse, requirements, travelInsurance, reservationState) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/reservations/cars', JSON.stringify({ carId, dateStart, dateEnd, destination, GPSSystem, privateUse, requirements, travelInsurance, reservationState }), { headers });
    }

    public editOrder(id: number, carId, userId, dateStart, dateEnd, destination, GPSSystem, privateUse, requirements, travelInsurance, reservationState) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put("/api/reservations/cars/" + id, JSON.stringify({ id, carId, userId, dateStart, dateEnd, destination, GPSSystem, privateUse, requirements, travelInsurance, reservationState }), { headers });
    }

    public removeOrder(id: number) {
        return this.http.delete('/api/reservations/cars/' + id);
    }

    public safeRemoveOrder(id: number) {
        return this.http.delete('/api/reservations/cars/safe/' + id);
    }

    public approveOrder(id: number) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/reservations/cars/approve/' + id, { headers });
    }

    public getReservations(id: number, from: any, to: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/reservations/cars/byCar/' + id, JSON.stringify({ from, to }), { headers });
    }

}
