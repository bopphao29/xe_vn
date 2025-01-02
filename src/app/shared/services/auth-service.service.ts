import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private httpClient: HttpClient) {}

  url = environment.server + '/users/';

  // // url = 'http://103.92.25.158:8991/user-service/'
  // urlRoute = 'http://103.92.25.158:8998/'

  login(data: any) {
    return this.httpClient.post(this.url + 'auth/login', data);
    // return this.httpClient.post(this.url + 'auth/login', data)
  }

  retokenLogin(data: any) {
    const headers = new HttpHeaders({
      Authorization: '',
      'Content-Type': 'application/json',
    });

    return this.httpClient.post(this.url + 'auth/re-token', data, { headers });
  }
}
