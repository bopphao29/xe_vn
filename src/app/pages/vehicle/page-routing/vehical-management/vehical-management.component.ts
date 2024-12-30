import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Router } from '@angular/router';
import { RouterModule, NavigationEnd } from '@angular/router';
import { routerLink } from '../../../../shared/services/router-link.service';


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

  routerString : string =''
  constructor (
    private routes: Router,
    private routerVehicle: routerLink
  ){}
  
  ngOnInit(): void {
    this.routerVehicle.data.subscribe((response: any)=> {
      this.routerString = response
      const savedLink = localStorage.getItem('activeLink')
      this.activeLink = savedLink ? savedLink : this.routerString
    })
    this.navigatePage()

    this.updateActiveLink(this.routes.url);

    // Lắng nghe sự thay đổi của router
    this.routes.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveLink(event.urlAfterRedirects);
      }
    });

  }

  updateActiveLink(url: string): void {
    const currentLink = this.listActiveLink.find(item => url.includes(item.router));
    if (currentLink) {
      this.activeLink = currentLink.actLink;
      localStorage.setItem('activeLink', this.activeLink); // Đồng bộ với localStorage
    } else {
      console.warn('No matching active link found for URL:', url);
      this.activeLink = ''; // Giá trị mặc định nếu không tìm thấy
    }
  }

  navigatePage() {
    const currentLink = this.listActiveLink.find(item => item.actLink === this.activeLink);
    if (currentLink) {
      this.routes.navigate([currentLink.router]);
    } else {
      console.error('Invalid activeLink:', this.activeLink);
    }
  }

  removeSearchVehical(){
    const localValue = localStorage.getItem('activeLink')
    console.log(localValue)
   if(this.activeLink != localValue){
     localStorage.removeItem('search')
   }
 }

  listActiveLink= [
    {id : 1, actLink: 'setupVehicle', router: 'vehicle/setup-vehicle'},
    {id : 2, actLink: 'vehicleProfileManagement', router: 'vehicle/profile-vehicle-management'},
    {id : 3, actLink: 'maintenanceRepair', router: 'vehicle/maintenance-repair'},
        // {id : 3, actLink: 'setupRequestMR', router: 'vehicle/maintenance-repair/setup-request-mr'},
    // {id : 4, actLink: 'listRequestMR', router: 'vehicle/maintenance-repair/list-request-mr'},
    // {id : 5, actLink: 'reportRequestMR', router: 'vehicle/maintenance-repair/report-request-mr'},
    {id : 4, actLink: 'deepInteriorCleaning', router: 'vehicle/deep-interior-cleaning'},
    {id : 5, actLink: 'operationalManagement', router: 'vehicle/operational-management'},
    {id : 6, actLink: 'operaterTimeManagement', router: 'vehicle/operater-time-management'},
    {id : 7, actLink: 'fuelAnagement', router: 'vehicle/fuel-anagement'},

  ]

  routerLink(actLink: string, router: string){
    this.activeLink = actLink
    this.removeSearchVehical();
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate([router])
  }
}
