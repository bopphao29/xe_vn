import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(
    private httpClient : HttpClient
  ) { }

  // url = 'http://103.92.25.158:8991/user-service/'
  urlRoute = 'http://103.92.25.158:8998/'

  login(data: any){
    return this.httpClient.post(this.urlRoute + 'auth/login', data)
    // return this.httpClient.post(this.url + 'auth/login', data)

  }
}
