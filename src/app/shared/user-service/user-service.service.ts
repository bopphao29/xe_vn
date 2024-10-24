import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(
    private httpClient : HttpClient
  ) { }

  url = environment.server

  getDetailUser(id: any){
    return this.httpClient.get(this.url + 'user-service/api/staff/'+ id)
  }


}
