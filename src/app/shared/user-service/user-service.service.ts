import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(
    private httpClient : HttpClient
  ) { }

  url = environment.server
  urlRoute = 'http://192.168.0.3:8991/'
  // urlRoute = 'https://vehicle-service.xevn.techasians.com/'

  getDetailEmployee(id: any){
    return this.httpClient.get(this.url + 'api/staff/'+ id)
  }

  saveEmployee(fomrData: FormData){
    return this.httpClient.post(this.url + 'api/staff', fomrData,{
      // headers: new HttpHeaders().set('Content-Type',"application/json"),
      // observe: 'response'
    })  
  }

  getBranch(){
    return this.httpClient.get(this.url + 'api/branches')
  }

  getPossition(){
    return this.httpClient.get(this.url + 'api/positions')
  }

  getOffice(){
    return this.httpClient.get(this.url + 'api/offices')
  }

  getDepartment(){
    return this.httpClient.get(this.url + 'api/departments')
  }

  getRoute(){
    return this.httpClient.get(this.urlRoute + 'vehicle-service/api/routes')
  }

  searchEmployee(page: number, size: number, data: any){
    // tạo param
    const params = 'page='+page.toString()+'&size='+size.toString()
    return this.httpClient.post('http://192.168.0.3:8998/api/staff/search?' + params, data,{
      // headers: new HttpHeaders({'Origin':'http://localhost:4200'}),
      // observe: 'response'
    })  
  }
}
