import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-child-report',
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
  templateUrl: './child-report.component.html',
  styleUrl: './child-report.component.scss'
})
export class ChildReportComponent implements OnInit{

  inforMR: any
  constructor(
    @Inject(NZ_MODAL_DATA) public modalData: any
  ){
    this.inforMR = this.modalData
  }
  ngOnInit(): void {
    console.log(this.inforMR);
    
  }

  pdfExport(){}
  
}
