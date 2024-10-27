import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(
    private httpClient : HttpClient
  ) { }

  url = environment.server

  getDetailEmployee(id: any){
    return this.httpClient.get(this.url + 'user-service/api/staff/'+ id)
  }

  saveEmployee(fomrData: FormData){
    return this.httpClient.post(this.url + 'user-service/api/staff', fomrData,{
      // headers: new HttpHeaders().set('Content-Type',"application/json"),
      // observe: 'response'
    })  
  }
}
