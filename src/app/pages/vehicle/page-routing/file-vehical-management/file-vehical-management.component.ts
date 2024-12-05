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
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { VehicalServiceService } from '../../../../shared/services/vehical-service.service';

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
    NzModalModule
  ],
  templateUrl: './file-vehical-management.component.html',
  styleUrl: './file-vehical-management.component.scss'
})
export class FileVehicalManagementComponent implements OnInit{

  constructor(
    private fb: FormBuilder,
    private vehicalService: VehicalServiceService
  ){}

  form!: FormGroup
  ngOnInit(): void {
    this.form = this.fb.group({
      routeId: null,
      registerNo: null,
      driverName: null,
      phoneNumber: null,
      identedUser: null,
      vehicleModel: null,
      yearOfManufacture : null
  })
  }

  listPrepareToExpire = [
    {value : 'Đăng Kiểm'},
    {value : 'Bảo hiểm TNDS'},
    {value : 'Bảo hiểm vật chất'},
    {value : 'Phù hiệu'},
    {value : 'Giấy đi đường'},
    {value : 'Phí bảo trì đường bộ'},
    {value : 'Thông tin tài chính xe '},
    {value : 'Xe chờ duyệt'},

  ]

  showEmpolyeeNoData(){

  }

  resetForm(){

  }

  listVehical : any[] = []
  search(){
    this.vehicalService.searchVehical().subscribe((response : any)=> {
      this.listVehical = response
      console.log(response)
    })
  }
}
