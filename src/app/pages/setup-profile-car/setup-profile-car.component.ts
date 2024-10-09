import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {  NzTabsModule } from 'ng-zorro-antd/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-setup-profile-car',
  standalone: true,
  templateUrl: './setup-profile-car.component.html',
  styleUrls: ['./setup-profile-car.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
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
    NzRadioModule
  ]
})
export class SetupProfileCarComponent implements OnInit {

  date = null;
  isEnglish = false;

  activeTab: number = 1;
  constructor(
    private translate: TranslateService
  ) { }

  onChange(result: any): void {
    console.log('onChange: ', result);
  }

  ngOnInit() { }

}
