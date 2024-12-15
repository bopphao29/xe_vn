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
      case 'setupVehicle':
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
      case 'fuelAnagement':
        this.routerFuelAnagement()
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
    this.activeLink = 'setupVehicle'
    this.romoveSearchVehical()
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehicle/setup-vehicle'])
  }

  routerMaintenanceRepair(){
    this.activeLink = 'maintenanceRepair'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehicle/maintenance-repair'])
  }

  routerDeepInteriorCleaning(){
    this.activeLink = 'deepInteriorCleaning'
    this.romoveSearchVehical()
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehicle/deep-interior-cleaning'])
  }

  routerVehicleProfileManagement(){
    this.activeLink = 'vehicleProfileManagement'
    this.romoveSearchVehical()
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehicle/profile-vehicle-management'])
  }

  routerOperationalManagement(){
    this.activeLink = 'operationalManagement'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehicle/operational-management'])
  }

  routerOperaterTimeManagement(){
    this.activeLink = 'operaterTimeManagement'
    this.romoveSearchVehical()
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehicle/operater-time-management'])
  }
  routerFuelAnagement(){
    this.activeLink = 'fuelAnagement'
    this.romoveSearchVehical()

    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate(['vehicle/fuel-anagement'])
  }



}
