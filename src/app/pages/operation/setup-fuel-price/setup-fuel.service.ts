import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({ providedIn: 'root' })
export class SetupFuelService {
  readonly url = '/transport/api/fuel-prices';

  constructor(private api: ApiService) {}

  getListFuelsPrice(body: any): Observable<any> {
    return this.api.post(this.url + '/search', body);
  }

  createFuelPrice(body: any): Observable<any> {
    return this.api.post(this.url, body);
  }

  updateFuelPrice(id: number | string, body: any): Observable<any> {
    return this.api.put(`${this.url}/${id}`, body);
  }

  deleteFuelPrice(id: number | string): Observable<any> {
    return this.api.delete(`${this.url}/${id}`);
  }

  viewFuelPrice(id: number | string): Observable<any> {
    return this.api.get(`${this.url}/${id}`);
  }
}
