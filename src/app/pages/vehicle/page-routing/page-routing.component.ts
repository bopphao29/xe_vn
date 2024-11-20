import { Component } from '@angular/core';
import { SetupProfileCarComponent } from '../../setup-profile-car/setup-profile-car.component';
import { VehicalManagementComponent } from '../vehical-management/vehical-management.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-routing',
  standalone: true,
  imports: [
    SetupProfileCarComponent,
    RouterModule,
    VehicalManagementComponent
  ],
  templateUrl: './page-routing.component.html',
  styleUrl: './page-routing.component.scss'
})
export class PageRoutingComponent {

}
