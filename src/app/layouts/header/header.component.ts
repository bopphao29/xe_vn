import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {
  BreadcrumService,
  IBreadcrumb,
} from '../../shared/services/breadcrum.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { clearStore } from '../../shared/utilities/system.utils';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    NzAvatarModule,
    NzDropDownModule,
    TranslateModule,
    NzLayoutModule,
    RouterModule,
    NzIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit{
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
  }

  cssRouterLink = localStorage.getItem('activeLink')

  ngOnInit(): void {
    const cssRouterLink = localStorage.getItem('activeLink');
    this.cssRouterLink = cssRouterLink; 
  }
  menuHeader = [
    {id: 2, value: 'report'},
    {id: 3, value: 'accountant'},
    {id: 4, value: 'chartsAndtatistics'},
    {id: 5, value: 'administration'},
    {id: 6, value: 'cmr'},
    {id: 7, value: 'other'}

  ]

  menuItemOfManage = [
    {id: 1, value: 'employeeManagement', link: 'employee/setup-profile-employee', activeLink: 'employeeManagement'},
    {id: 2, value: 'custommerManagement', link: 'customer/customer-management', activeLink: 'customerManagement'},
    {id: 3, value: 'vehicalManagement', link: 'vehical/setup-vehical', activeLink: 'setupVehical'},
    {id: 4, value: 'operatorManagement',link: 'oprerato/setup-operator', activeLink: 'operatorManagement'}
  ]
  isProductMenuOpen :boolean = false
  isHidenMenu:boolean = false
  isMenuitemOfHidden: boolean = false

  routerLink(link : any, activeLink: any){
    this.router.navigate([link])
    localStorage.setItem('activeLink', activeLink)
    this.cssRouterLink = activeLink;
    this.isHidenMenu = false

    this.cdr.detectChanges();
  }
  logout() {

    Swal.fire({
      text: "Bạn có chắc muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:'Hủy',
      confirmButtonText: "Đăng xuất"
    }).then((result) => {
      if (result.isConfirmed) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        clearStore();
        localStorage.clear()
        this.router.navigate(['/login']);
        this.isHidenMenu = false
        Toast.fire({
          icon: "success",
          title: "Đăng xuất thành công"
        });
      }
    });

  }
}
