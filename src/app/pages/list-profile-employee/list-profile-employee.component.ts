import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DetailProfileEmployeeComponent } from '../detail-profile-employee/detail-profile-employee.component';
import { Route, Router, Routes } from '@angular/router';

@Component({
  selector: 'app-list-profile-employee',
  standalone: true,
  templateUrl: './list-profile-employee.component.html',
  styleUrl: './list-profile-employee.component.scss',
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
    NzIconModule,
    NzRadioModule,
    NzModalModule,
    NzDatePickerModule,
    NzTabsModule,
    NzUploadModule,
    NzPaginationModule,
    DetailProfileEmployeeComponent
  ],
})
export class ListProfileEmployeeComponent implements OnInit {

  constructor(
    private routes: Router
  ){

  }

  ngOnInit(): void {
    // this.listData
    this.updatePagedData()
  }

  pageIndex = 1
  pageSize = 12

  listData = [
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Nam định',level: 'Lái xe', part: 'Lái xe tuyến'},
    {id : '2563654',name: 'Phạm Gia Linh',yearOfBirth: '2000',phoneNumber: '096535246',ofManagement: 'VTHK',address: 'CN Hà Nam',level: 'Lái xe', part: 'Lái xe tuyến'},
  ]

  total = this.listData.length
  pagedData : any[] = []

  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.updatePagedData();
  }

  updatePagedData(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = this.pageIndex * this.pageSize;
    this.pagedData = this.listData.slice(startIndex, endIndex);
  }
  
  routerDetailEmployee(){
    this.routes.navigate(['/employee-details/:id'])
  }
}
