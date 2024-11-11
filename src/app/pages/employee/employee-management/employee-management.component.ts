import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
// import { ListProfileEmployeeComponent } from '../list-profile-employee/list-profile-employee.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
// import { ListEmployeeProbationComponent } from '../list-employee-probation/list-employee-probation.component';

// import { SetupProfileEmployeeComponent } from '../setup-profile-employee/setup-profile-employee.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    NzTabsModule,
    NzRadioModule,
    // SetupProfileEmployeeComponent,
    // ListProfileEmployeeComponent,
    // ListEmployeeProbationComponent,
  ],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit{
  constructor (
    private routes: Router
  ){}
  ngOnInit(): void {
  }

  routerListEmployeeProfile(){
    this.routes.navigate(['/employee/list-employee-profile'])
  }

  routerListEmployeeProbation(){
    this.routes.navigate(['/employee/list-employee-probation'])
  }

  routerListEmployeeViolatesDiscipline(){
    this.routes.navigate(['/employee/list-employee-violates-discipline'])
  }
  routerEmployeeManagement(){
    this.routes.navigate(['employee/employee-management'])
  }
}
