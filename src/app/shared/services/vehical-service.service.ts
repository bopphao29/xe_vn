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
  urlTransport = environment.server + '/transport/'


  createVehicle(formData : FormData){
 
    return this.httpClient.post(this.url + 'api/vehicles', formData)

  }

  getVehicleDetail(id : any){
    return this.httpClient.get(this.url + 'api/vehicles/'+id)
  }

  getVehicleType(){
      return this.httpClient.get(this.url + 'api/vehicle-types')
  }

  getRoute(){
    return this.httpClient.get(this.urlTransport + 'api/routes')
  }

  searchVehicle(page: number,size:number, data: any){
    const params = 'page='+page.toString()+'&size='+size.toString()

    return this.httpClient.post(this.url + 'api/vehicles/search?'+params, data)
  }

  getVehicleModel(id: any){
    return this.httpClient.get(this.url + 'api/vehicle-models?vehicleTypeId=' + id)
  }

  getLegalOwners(){
    return this.httpClient.get(this.url + 'api/legal-owners')
  }

  searchDriver(data: any){
    return this.httpClient.post(this.urlUser + 'api/staff/get-drivers', data)
  }

  updateVehicle(formData: FormData){
    return this.httpClient.put(this.url + 'api/vehicles', formData)
  }

  getManufactureYears(){
    return this.httpClient.get(this.url + 'api/vehicles/get-manufacture-years')
  }

  getManufacturers(){
    return this.httpClient.get(this.url + 'api/vehicles/get-manufacturers')

  }

  saveMaintenanceRepair(data: any){
    return this.httpClient.get(this.url + 'api/maintenance-repair-schedules', data)
  }

  searchDocumentsNearingExpiration(){
    return this.httpClient.get(this.url + 'api/vehicles/documents-nearing-expiration')
  }

  approveVehical(data : any){
    return this.httpClient.post(this.url + 'api/vehicles/update-approval-status', data)
  }

  getForMaintenance(page: number,size:number, routerId: any){
    const params = 'page='+page.toString()+'&size='+size.toString() +'&routerId=' + routerId
    return this.httpClient.get(this.url + 'api/vehicles/get-for-maintenance?' + params)
  }

  printVehicleDetail(data : any){
    return this.httpClient.get(this.url + 'api/vehicles/print-vehicle-infos', data)
  }

  maintenanceRepairSchedules(data: any){
    return this.httpClient.post(this.url + 'api/maintenance-repair-schedules', data)
  }

  chageMaintenanceRepairSchedules(data: any){
    return this.httpClient.put(this.url + 'api/maintenance-repair-schedules', data)
  }

  getMaintenanceFacilities(){
    return this.httpClient.get(this.url + 'api/supplies/get-maintenance-places')
  }

  mRChedulessearch(page: any, size: any, data: any){
    const params = 'page='+page.toString()+'&size='+size.toString()
    return this.httpClient.post(this.url + 'api/maintenance-repair-schedules/search?' + params, data)
  }

  getDetailMR(id: any,type: number){
    const params = '?type=' + type
    return this.httpClient.get(this.url + 'api/maintenance-repair-schedules/'+ id+params)
  }

  maintenanceNote(data: any){
    return this.httpClient.post(this.url + 'api/maintenance-repair-schedules/maintenance-note', data)
  }

  approvalMR(data: any){
    return this.httpClient.post(this.url + 'api/maintenance-repair-schedules/approval', data)
  }

  deleteMR(id: number){
    return this.httpClient.delete(this.url + 'api/maintenance-repair-schedules/'+id)

  }

  summaryReport(page: any, size: any,data :any){
    const params = 'page='+page.toString()+'&size='+size.toString()

    return this.httpClient.post(this.url + 'api/maintenance-repair-schedules/summary?' +params, data)
  }

  summaryDetail(page: any, size: any, registerNo: any){
    const params = 'page='+page.toString()+'&size='+size.toString() +'&registerNo=' + registerNo
    return this.httpClient.get(this.url + 'api/maintenance-repair-schedules/summary-details?'+params)
  }

  summaryByRegisterNo(registerNo: any){
    return this.httpClient.get(this.url + 'api/maintenance-repair-schedules/summary-by-register-no?registerNo='+ registerNo)
  }

  vehicleStatuses(){
    return this.httpClient.get(this.url + 'api/vehicle-statuses')
  }

  testCategories(){
    return this.httpClient.get(this.url + 'api/test-categories')
  }

  workPerformeds(){
    return this.httpClient.get(this.url + 'api/work-performeds')
  }

  supplies(){
    return this.httpClient.get(this.url + 'api/supplies')
  }
}
