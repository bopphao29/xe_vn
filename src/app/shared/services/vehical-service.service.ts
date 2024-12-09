import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class VehicalServiceService {

  constructor(
    private httpClient : HttpClient

  ) { }

  url = environment.server + '/vehicles/'



  createVehical(formData : FormData){
 
    return this.httpClient.post(this.url + 'api/vehicles', formData)

  }

  getVehicalDetail(){
  }

  getVehicalType(){
      return this.httpClient.get(this.url + 'api/vehicle-types')
  }

  getRoue(){
    return this.httpClient.get(this.url + 'api/routes')
  }

  searchVehical(data: any){
    return this.httpClient.post(this.url + 'api/vehicles/search', {data})
  }
}
