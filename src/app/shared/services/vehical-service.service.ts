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
  // url = 'http://103.92.25.158:8998/'
  // url98 = 'http://103.92.25.158:8998/vehicle-service/api/'
    url = 'http://103.92.25.158:8991/vehicle-service/api/'
  urlRoute = 'http://103.92.25.158:8991/vehicle-service/api/'


  createVehical(formData : FormData){
 
    return this.httpClient.post(this.urlRoute + 'vehicles', formData)

  }

  getVehicalDetail(){
  }

  getVehicalType(){
      return this.httpClient.get(this.url + 'vehicle-types')
  }

  getRoue(){
    return this.httpClient.get(this.urlRoute + 'routes')
  }

  searchVehical(data: any){
    return this.httpClient.post(this.url + 'vehicles/search', {data})
  }
}
