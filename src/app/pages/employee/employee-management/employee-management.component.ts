import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
// import { ListProfileEmployeeComponent } from '../list-profile-employee/list-profile-employee.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
// import { ListEmployeeProbationComponent } from '../list-employee-probation/list-employee-probation.component';

// import { SetupProfileEmployeeComponent } from '../setup-profile-employee/setup-profile-employee.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [

    FormsModule,
    TranslateModule,
    NzTabsModule,
    NzRadioModule,
    CommonModule
    // SetupProfileEmployeeComponent,
    // ListProfileEmployeeComponent,
    // ListEmployeeProbationComponent,
  ],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit{

  activeLink : string ='employeeManagement'

  constructor (
    private routes: Router
  ){}
  ngOnInit(): void {
    const savedLink = localStorage.getItem('activeLink')
    this.activeLink = savedLink ? savedLink : 'employeeManagement'

    this.navigatePage()
  }


  navigatePage(){
    switch (this.activeLink){
      case 'employeeManagement':
        this.routerEmployeeManagement();
        break;
      case 'employeeProfile':
        this.routerListEmployeeProfile();
        break;
      case 'employeeeProbation':
        this.routerListEmployeeProbation();
        break;
      case 'employeeViolatesDiscipline':
        this.routerListEmployeeViolatesDiscipline();
        break;
      case 'employeeSalarySetup':
        this.routerListEmployeeSalarySetup();
        break;
      case 'employeeResign':
        this.routerListEmployeeResign()
    }
  }

  routerEmployeeManagement(){
    this.activeLink = 'employeeManagement'
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/employee-management'])
  }

  routerListEmployeeProfile(){
    this.activeLink = 'employeeProfile'
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/list-employee-profile'])
  }

  routerListEmployeeProbation(){
    this.activeLink = 'employeeeProbation'
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/list-employee-probation'])
  }

  routerListEmployeeViolatesDiscipline(){
    this.activeLink = 'employeeViolatesDiscipline'
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/list-employee-violates-discipline'])
  }

  routerListEmployeeSalarySetup(){
    this.activeLink = 'employeeSalarySetup'
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/employee-salary-setup'])
  }

  routerListEmployeeResign(){
    this.activeLink = 'employeeResign'
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/list-employee-resign'])
  }


}
