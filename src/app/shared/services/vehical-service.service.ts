import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicalServiceService {

  constructor(
    private httpClient : HttpClient

  ) { }

  // url = environment.server
  url = 'http://103.92.25.158:8998/'
  urlRoute = 'http://103.92.25.158:8991/'

  createVehical(formData : FormData){
 
    return this.httpClient.post(this.urlRoute + 'vehicle-service/api/vehicles', formData)

  }

  getVehicalDetail(){
  }

  getVehicalType(){
      return this.httpClient.get(this.url + 'vehicle-service/api/vehicle-types')
  }

  getRoue(){
    return this.httpClient.get(this.urlRoute + 'vehicle-service/api/routes')
  }
}
