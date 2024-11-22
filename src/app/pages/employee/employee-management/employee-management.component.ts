import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';

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
    this.activeLink = savedLink ? savedLink : ''

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

  romoveSearchEmployee(){
     const localValue = localStorage.getItem('activeLink')
     console.log(localValue)
    if(this.activeLink != localValue){
      localStorage.removeItem('searchEmployee')
    }
  }

  routerEmployeeManagement(){
    this.activeLink = 'employeeManagement'
    // this.romoveSearchEmployee();
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/employee-management'])
  }

  routerListEmployeeProfile(){
    this.activeLink = 'employeeProfile'
    localStorage.setItem('activeLink', this.activeLink);
    // this.romoveSearchEmployee();
    this.routes.navigate(['employee/list-employee-profile'])
  }

  routerListEmployeeProbation(){
    this.activeLink = 'employeeeProbation'
    localStorage.setItem('activeLink', this.activeLink);
    // this.romoveSearchEmployee();
    this.routes.navigate(['employee/list-employee-probation'])
  }

  routerListEmployeeViolatesDiscipline(){
    this.activeLink = 'employeeViolatesDiscipline'
    localStorage.setItem('activeLink', this.activeLink);
    // this.romoveSearchEmployee();
    this.routes.navigate(['employee/list-employee-violates-discipline'])
  }

  routerListEmployeeSalarySetup(){
    this.activeLink = 'employeeSalarySetup'
    localStorage.setItem('activeLink', this.activeLink);
    // this.romoveSearchEmployee();
    this.routes.navigate(['employee/employee-salary-setup'])
  }

  routerListEmployeeResign(){
    this.activeLink = 'employeeResign'
    localStorage.setItem('activeLink', this.activeLink);
    // this.romoveSearchEmployee();

    this.routes.navigate(['employee/list-employee-resign'])
  }


}
