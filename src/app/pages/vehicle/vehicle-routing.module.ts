import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

export const VEHICLE_ROUTES: Routes = [
  {
    path: 'vehical',
    loadComponent: () =>
      import('./page-routing/page-routing.component').then(
        (c)=> c.PageRoutingComponent
      ),
      children: [
        {
          path: 'setup-vehical',
          loadComponent: () => 
            import('./page-routing/setup-profile-car/setup-profile-car.component').then(
              (c) => c.SetupProfileCarComponent
            )
        }
      ]
    
  }
]