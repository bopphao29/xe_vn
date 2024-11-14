import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchEmployeeProfileService {

  constructor() { }

  private searchEmployeeProfile : any= {
    txtSearch: '',
    officeId: '',
    branchId: '',
    departmentId: '',
    positionId: ''
  }

  get search(): any{
    return this.searchEmployeeProfile
  }

  set search(searchItem: any){
    this.searchEmployeeProfile = searchItem
  }
}
