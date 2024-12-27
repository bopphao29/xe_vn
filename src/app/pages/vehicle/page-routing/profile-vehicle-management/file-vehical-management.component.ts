import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import Swal from 'sweetalert2';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { VehicalServiceService } from '../../../../shared/services/vehical-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-vehical-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    TranslateModule,
    NzTabsModule,
    NzSelectModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    NzUploadModule,
    NzIconModule,
    NzRadioModule,
    NzModalModule,
    NzPaginationModule
  ],
  templateUrl: './file-vehical-management.component.html',
  styleUrl: './file-vehical-management.component.scss'
})
export class FileVehicalManagementComponent implements OnInit{

  constructor(
    private routes: Router,
    private fb: FormBuilder,
    private vehicalService: VehicalServiceService
  ){}

  form!: FormGroup
  ngOnInit(): void {
    const savedFormValue = localStorage.getItem('search');

    this.form = this.fb.group({
    routeId: [savedFormValue ? JSON.parse(savedFormValue).routeId : ''],
    registerNo: [savedFormValue ? JSON.parse(savedFormValue).registerNo : ''],
    driverName: [savedFormValue ? JSON.parse(savedFormValue).driverName : ''],
    phoneNumber: [savedFormValue ? JSON.parse(savedFormValue).phoneNumber : ''],
    indentedUse: [savedFormValue ? JSON.parse(savedFormValue).indentedUse : ''],
    manufacturer: [savedFormValue ? JSON.parse(savedFormValue).manufacturer : ''],
    manufactureYear: [savedFormValue ? JSON.parse(savedFormValue).manufactureYear : ''],
    documentCode : [savedFormValue ? JSON.parse(savedFormValue).documentCode : '']

  })

  this.search()
  this.getManufacture()
  this.getRoute()
  this.getManufactureYears()
  this.getDocumentsNearingExpiration()
  }

  listPrepareToExpire : any[]= []

  listManufactureYears : any[] =[]
  getManufactureYears(){
    this.vehicalService.getManufactureYears().subscribe((response: any)=>{
      this.listManufactureYears = response.data
    })
  }

  listManufacture : any[] =[]
  getManufacture(){
    this.vehicalService.getManufacturers().subscribe((response: any)=>{
      this.listManufacture = response.data
    })
  }

  listRoute : any[] =[]
  getRoute(){
    this.vehicalService.getRoute().subscribe((response : any)=> {
      this.listRoute = response.data

    })
  }


  getDocumentsNearingExpiration(){
    this.vehicalService.searchDocumentsNearingExpiration().subscribe((response: any)=>{
      this.listPrepareToExpire = response.data
      console.log(response)
    })
  }
  
  resetForm(){
    this.form.get('routeId')?.setValue('')
    this.form.get('registerNo')?.setValue('')
    this.form.get('driverName')?.setValue('')
    this.form.get('phoneNumber')?.setValue('')
    this.form.get('indentedUse')?.setValue('')
    this.form.get('manufacturer')?.setValue('')
    this.form.get('manufactureYear')?.setValue('')
    this.form.get('documentCode')?.setValue('')
    localStorage.removeItem('search')

    this.activeButtonIndex = null;
  this.documentCode = '';

  }

  pageIndex = 1
  pageSize = 9
  isActive = false

  pagedData : any[] = []

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.search()
  }

  dataVehicle: any[] = [] 
  total = 1

  detailVehical(id: any){
    this.routes.navigate(['/detail-vehicle/', id])
  }
  activeButtonIndex: number | null = null;


setActiveButton(index: number): void {
  this.activeButtonIndex = index;
}


  getlist(data: any){
    const page = this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ;
    const size = 9;
    this.vehicalService.searchVehicle( page,size ,data).subscribe((response : any)=> {
      this.dataVehicle = response.data.content
      this.total = response.data.totalElements
      if(response.data.totalElements == 0){
              Swal.fire({
                icon: "warning",
                // title: "......",
                text: "Không tìm thấy dữ liệu bạn muốn tìm kiếm!",
                // timer: 3000
              });
            }
    })
  }

  showEmpolyeeNoData(){
    const numberData = 9
    const data = {id: null, routeName: null, registerNo: null, manufacturer: null, manufactureYear: null, driverName: null, phoneNumber: null, intendedUses: null}
    
    const dataRrows = this.dataVehicle.slice();
    const currentData = dataRrows.length
    if(currentData < numberData){
      const isChangeData = numberData - currentData
      for(let i = 0; i < isChangeData; i++){
        dataRrows.push(data)
      }
    }
    return dataRrows;
  }

  setupValueIntoForm(){
    const formValue = localStorage.getItem('search');
    if(formValue){
      this.form.patchValue(JSON.parse(formValue))
    }
  }

  documentCode : any
  searchDocumentsNearingExpiration(code : any){
    const dataForm = {
      ...this.form.value,
      documentCode : code,
      
    }
    this.documentCode = code
    this.getlist(dataForm)
    const formValue = this.form.value;
    if(formValue){
      localStorage.setItem('search', JSON.stringify(formValue));
    }
    
    this.setupValueIntoForm()
  }

  listVehical : any[] = []
  search(){
    const dataForm = {
      ...this.form.value,
      page:this.pageIndex - 1 < 0 ? 0 : this.pageIndex - 1 ,
      size: 9,
      documentCode: this.documentCode ? this.documentCode : ''
    }
    this.getlist(dataForm)
    const formValue = this.form.value;
    if(formValue){
      localStorage.setItem('search', JSON.stringify(formValue));
    }
    
    this.setupValueIntoForm()
  }


}
