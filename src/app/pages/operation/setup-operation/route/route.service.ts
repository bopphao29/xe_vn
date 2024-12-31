import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../shared/services/api.service';

@Injectable({ providedIn: 'root' })
export class RouteService {
  readonly url = '/transport/api/itineraries';

  constructor(private api: ApiService) {}

  getListRoute(): Observable<any> {
    return this.api.get('/transport/api/routes');
  }

  createItinerary(body: any): Observable<any> {
    return this.api.post(this.url, body);
  }

  updateItinerary(id: number | string, body: any): Observable<any> {
    return this.api.put(`${this.url}/${id}`, body);
  }

  deleteItinerary(id: number | string): Observable<any> {
    return this.api.delete(`${this.url}/${id}`);
  }

  getAllItinerary(): Observable<any> {
    return this.api.get(this.url);
  }

  viewItinerary(id: number | string): Observable<any> {
    return this.api.get(`${this.url}/${id}`);
  }
}
