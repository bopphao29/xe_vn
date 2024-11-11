import { Component } from '@angular/core';
import { ListEmployeeProbationComponent } from './list-employee-probation/list-employee-probation.component';
import { ListProfileEmployeeComponent } from './list-profile-employee/list-profile-employee.component';
import { SetupProfileEmployeeComponent } from './setup-profile-employee/setup-profile-employee.component';
import { EmployeeManagementComponent } from '../employee-management/employee-management.component';
import { RouterModule } from '@angular/router';
import { ListEmployeeViolatesDisciplineComponent } from './list-employee-violates-discipline/list-employee-violates-discipline.component';

@Component({
  selector: 'app-page-routing',
  standalone: true,
  imports: [
    ListEmployeeProbationComponent,
    ListProfileEmployeeComponent,
    SetupProfileEmployeeComponent,
    EmployeeManagementComponent,
    ListEmployeeViolatesDisciplineComponent,
    RouterModule
  ],
  templateUrl: './page-routing.component.html',
  styleUrl: './page-routing.component.scss'
})
export class PageRoutingComponent {

}
