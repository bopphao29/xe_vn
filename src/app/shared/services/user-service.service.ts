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

  // url = environment.server
  // url = 'http://103.92.25.158:8998/'
  url = 'http://103.92.25.158:8991/users/'
  minioUrl = 'http://103.92.25.158:9000'
  getDetailEmployee(id: any){
    return this.httpClient.get(this.url + 'api/staff/'+ id)
  }

  saveEmployee(fomrData: FormData){
    return this.httpClient.post(this.url + 'api/staff', fomrData,{
      // headers: new HttpHeaders().set('Content-Type',"application/json"),
      // observe: 'response'
    })  
  }

  updateEmployee(fomrData: FormData){
    return this.httpClient.put(this.url+ 'api/staff', fomrData)
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

  getDepartment(officeId :number){
    const params = '?officeId='+officeId.toString()
    return this.httpClient.get(this.url + 'api/departments'+params)
  }

  getRoute(){
    // return this.httpClient.get(this.url + 'vehicle-service/api/routes')
    return this.httpClient.get('http://103.92.25.158:8991/vehicles/api/routes')

  }

  getDriverLicense(){
    return this.httpClient.get(this.url + 'api/option-set-values/os-code?code=DRIVER_LICENSE_TYPE')
  }
  
  searchEmployee( data: any){
    // tạo param
    // const params = 'page='+page.toString()+'&size='+size.toString()
    return this.httpClient.post('http://103.92.25.158:8998/api/staff/search' , data,{
    // return this.httpClient.post('http://103.92.25.158:8991/user-service/api/staff/search' , data,{
      // headers: new HttpHeaders({'Origin':'http://localhost:4200'}),
      // observe: 'response'
    })  
  }
  
  updateStatusWork(data: any){
    // return this.httpClient.post('http://103.92.25.158:8998/api/staff/update-working-status' , data)
    return this.httpClient.post('http://103.92.25.158:8998/api/staff/update-working-status' , data)
    
  }

  getAchievementsStaffDetails(id: any, month: any, year: number){
    return this.httpClient.get(this.url + 'api/achievements/staff-details?staffId=' + id+'&month='+month+'&year='+year)
  }

  getDetailEmployeeViolate(id: any){
    return this.httpClient.get(this.url + 'api/punishments/'+id)
  }

  getPunishmentsContents(){
    return this.httpClient.get(this.url + 'api/punishments/contents')
  }

  //thành tích
  getachievementsInDetailsEmployee(page: any, size: any, staffId: any){
    const params = 'page=' +page+'&size='+ size+'&staffId=' + staffId
    return this.httpClient.get(this.url + 'api/achievements?'+ params)
  }

  changeDataOfTableachievements(data: any){
    return this.httpClient.post(this.url + 'api/achievements',data)
  }

  //kỉ luật
  getpunishmentsInDetailsEmployee(page: any, size: any, staffId: any){
    const params = 'page=' +page+'&size='+ size+'&staffId=' + staffId
    return this.httpClient.get(this.url + 'api/punishments?'+ params)
  }

  // khen thưởng
  getpraisesInDetailsEmployee(page: any, size: any, staffId: any){
    const params = 'page=' +page+'&size='+ size+'&staffId=' + staffId
    return this.httpClient.get(this.url + 'api/praises?'+ params)
  }

  getCode(){
    return this.httpClient.get(this.url + 'api/staff/latest-code')
  }

  exportPDF(data: any){
    return this.httpClient.post(this.url + 'api/staff/print-staff-infos', data)
  }

  exportPDFInToVioLet(data: any){
    return this.httpClient.post(this.url + 'api/staff/print-staff-punishment', data)
  }

  downloadFile(bucketName: string, fileName: string) {
    const url = `${this.minioUrl}/${bucketName}/${fileName}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }
}
