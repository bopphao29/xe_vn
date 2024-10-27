import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SetupProfileEmployeeComponent } from '../setup-profile-employee/setup-profile-employee.component';
import { ListProfileEmployeeComponent } from '../list-profile-employee/list-profile-employee.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';


@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    NzTabsModule,
    NzRadioModule,
    SetupProfileEmployeeComponent,
    ListProfileEmployeeComponent
  ],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent {

}
