import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { EmployeeManagementComponent } from '../employee-management/employee-management.component';

@Component({
  selector: 'app-employee-management-default',
  standalone: true,
  templateUrl: './employee-management-default.component.html',
  styleUrl: './employee-management-default.component.scss',
  imports: [
    NzButtonModule,
    TranslateModule,
    EmployeeManagementComponent
  ]
})
export class EmployeeManagementDefaultComponent {

}
