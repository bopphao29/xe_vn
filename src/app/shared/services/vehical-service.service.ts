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
  urlUser = environment.server + '/users/'



  createVehicle(formData : FormData){
 
    return this.httpClient.post(this.url + 'api/vehicles', formData)

  }

  getVehicleDetail(id : any){
    return this.httpClient.get(this.url + 'api/vehicles/'+id)
  }

  getVehicleType(){
      return this.httpClient.get(this.url + 'api/vehicle-types')
  }

  getRoue(){
    return this.httpClient.get(this.url + 'api/routes')
  }

  searchVehicle(data: any){
    return this.httpClient.post(this.url + 'api/vehicles/search', data)
  }

  getVehicleModel(id: any){
    return this.httpClient.get(this.url + 'api/vehicle-models?vehicleTypeId=' + id)
  }

  getLegalOwners(){
    return this.httpClient.get(this.url + 'api/legal-owners')
  }

  searchDriver(data: any){
    return this.httpClient.post(this.urlUser + 'api/staff/get-drivers', {data})
  }

  updateVehicle(formData: FormData){
    return this.httpClient.post(this.url + 'api/vehicles', formData)
  }

}
