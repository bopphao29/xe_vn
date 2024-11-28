import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-vehical-management',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    NzTabsModule,
    NzRadioModule,
    CommonModule,
    
  ],
  templateUrl: './vehical-management.component.html',
  styleUrl: './vehical-management.component.scss'
})
export class VehicalManagementComponent {
  activeLink : string ='setupVehical'

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
      case 'setupVehical':
        this.routerSetupVehical();
        break;
      case 'maintenanceRepair':
        this.routerMaintenanceRepair();
        break;
      case 'deepInteriorCleaning':
        this.routerDeepInteriorCleaning();
        break;
      case 'vehicleProfileManagement':
        this.routerVehicleProfileManagement();
        break;
      case 'operationalManagement':
        this.routerOperationalManagement();
        break;
      case 'operaterTimeManagement':
        this.routerOperaterTimeManagement()
        break;
      case 'employeeSalarySetup':
        this.routerEmployeeSalarySetup()
    }
  }

  romoveSearchVehical(){
    const localValue = localStorage.getItem('activeLink')
    console.log(localValue)
   if(this.activeLink != localValue){
     localStorage.removeItem('search')
   }
 }

  routerSetupVehical(){
    this.activeLink = 'setupVehical'
    this.romoveSearchVehical()
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehical/setup-vehical'])
  }

  routerMaintenanceRepair(){
    this.activeLink = 'maintenanceRepair'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehical/maintenance-repair'])
  }

  routerDeepInteriorCleaning(){
    this.activeLink = 'employeeeProbation'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/list-employee-probation'])
  }

  routerVehicleProfileManagement(){
    this.activeLink = 'vehicleProfileManagement'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehical/file-vehical-management'])
  }

  routerOperationalManagement(){
    this.activeLink = 'employeeSalarySetup'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/employee-salary-setup'])
  }

  routerOperaterTimeManagement(){
    this.activeLink = 'employeeResign'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/list-employee-resign'])
  }
  routerEmployeeSalarySetup(){
    this.activeLink = 'employeeResign'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['employee/list-employee-resign'])
  }



}
