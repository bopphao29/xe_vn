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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


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

  menuItemOfManage: Array<{ svg: SafeHtml; id: number; value: string; link: string; activeLink: string }> = [];
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
  }

  cssRouterLink = localStorage.getItem('activeLink')

  ngOnInit(): void {
    const cssRouterLink = localStorage.getItem('activeLink');
    this.cssRouterLink = cssRouterLink; 

    this.menuItemOfManage = [
      {svg: this.sanitizer.bypassSecurityTrustHtml(`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="#274EA1"/>
        <path d="M10.8751 16.0001L10.6251 14.7501C10.4584 14.6806 10.3022 14.6077 10.1563 14.5313C10.0105 14.4549 9.86119 14.3612 9.70841 14.2501L8.50008 14.6251L7.66675 13.2084L8.62508 12.3751C8.5973 12.1945 8.58341 12.014 8.58341 11.8334C8.58341 11.6529 8.5973 11.4723 8.62508 11.2917L7.66675 10.4584L8.50008 9.04175L9.70841 9.41675C9.86119 9.30564 10.0105 9.21189 10.1563 9.1355C10.3022 9.05911 10.4584 8.98619 10.6251 8.91675L10.8751 7.66675H12.5417L12.7917 8.91675C12.9584 8.98619 13.1147 9.05911 13.2605 9.1355C13.4063 9.21189 13.5556 9.30564 13.7084 9.41675L14.9167 9.04175L15.7501 10.4584L14.7917 11.2917C14.8195 11.4723 14.8334 11.6529 14.8334 11.8334C14.8334 12.014 14.8195 12.1945 14.7917 12.3751L15.7501 13.2084L14.9167 14.6251L13.7084 14.2501C13.5556 14.3612 13.4063 14.4549 13.2605 14.5313C13.1147 14.6077 12.9584 14.6806 12.7917 14.7501L12.5417 16.0001H10.8751ZM11.7084 13.5001C12.1667 13.5001 12.5591 13.3369 12.8855 13.0105C13.2119 12.6841 13.3751 12.2917 13.3751 11.8334C13.3751 11.3751 13.2119 10.9827 12.8855 10.6563C12.5591 10.3299 12.1667 10.1667 11.7084 10.1667C11.2501 10.1667 10.8577 10.3299 10.5313 10.6563C10.2049 10.9827 10.0417 11.3751 10.0417 11.8334C10.0417 12.2917 10.2049 12.6841 10.5313 13.0105C10.8577 13.3369 11.2501 13.5001 11.7084 13.5001ZM18.3334 25.1667L17.9584 23.4167C17.7223 23.3334 17.5036 23.2327 17.3022 23.1147C17.1008 22.9966 16.9029 22.8612 16.7084 22.7084L15.0417 23.2501L13.8751 21.2501L15.2084 20.0834C15.1806 19.8334 15.1667 19.5834 15.1667 19.3334C15.1667 19.0834 15.1806 18.8334 15.2084 18.5834L13.8751 17.4167L15.0417 15.4167L16.7084 15.9584C16.9029 15.8056 17.1008 15.6702 17.3022 15.5522C17.5036 15.4341 17.7223 15.3334 17.9584 15.2501L18.3334 13.5001H20.6667L21.0417 15.2501C21.2779 15.3334 21.4966 15.4341 21.698 15.5522C21.8994 15.6702 22.0973 15.8056 22.2917 15.9584L23.9584 15.4167L25.1251 17.4167L23.7917 18.5834C23.8195 18.8334 23.8334 19.0834 23.8334 19.3334C23.8334 19.5834 23.8195 19.8334 23.7917 20.0834L25.1251 21.2501L23.9584 23.2501L22.2917 22.7084C22.0973 22.8612 21.8994 22.9966 21.698 23.1147C21.4966 23.2327 21.2779 23.3334 21.0417 23.4167L20.6667 25.1667H18.3334ZM19.5001 21.8334C20.1945 21.8334 20.7848 21.5904 21.2709 21.1042C21.757 20.6181 22.0001 20.0279 22.0001 19.3334C22.0001 18.639 21.757 18.0487 21.2709 17.5626C20.7848 17.0765 20.1945 16.8334 19.5001 16.8334C18.8056 16.8334 18.2154 17.0765 17.7292 17.5626C17.2431 18.0487 17.0001 18.639 17.0001 19.3334C17.0001 20.0279 17.2431 20.6181 17.7292 21.1042C18.2154 21.5904 18.8056 21.8334 19.5001 21.8334Z" fill="#F7F7F7"/></svg>`),
        id: 1, value: 'employeeManagement', link: 'employee/setup-profile-employee', activeLink: 'employeeManagement'},
      {svg: this.sanitizer.bypassSecurityTrustHtml(`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="16" fill="#274EA1"/>
              <g clip-path="url(#clip0_3577_7023)">
              <path d="M6.83325 22.6666V20.3333C6.83325 19.861 6.95478 19.427 7.19784 19.0312C7.44089 18.6353 7.76381 18.3333 8.16659 18.1249C9.0277 17.6944 9.9027 17.3714 10.7916 17.1562C11.6805 16.9409 12.5833 16.8333 13.4999 16.8333C14.4166 16.8333 15.3194 16.9409 16.2083 17.1562C17.0971 17.3714 17.9721 17.6944 18.8333 18.1249C19.236 18.3333 19.5589 18.6353 19.802 19.0312C20.0451 19.427 20.1666 19.861 20.1666 20.3333V22.6666H6.83325ZM21.8333 22.6666V20.1666C21.8333 19.5555 21.6631 18.9687 21.3228 18.4062C20.9826 17.8437 20.4999 17.361 19.8749 16.9583C20.5833 17.0416 21.2499 17.1839 21.8749 17.3853C22.4999 17.5867 23.0833 17.8333 23.6249 18.1249C24.1249 18.4027 24.5069 18.7117 24.7708 19.052C25.0346 19.3923 25.1666 19.7638 25.1666 20.1666V22.6666H21.8333ZM13.4999 15.9999C12.5833 15.9999 11.7985 15.6735 11.1458 15.0208C10.493 14.368 10.1666 13.5833 10.1666 12.6666C10.1666 11.7499 10.493 10.9652 11.1458 10.3124C11.7985 9.65964 12.5833 9.33325 13.4999 9.33325C14.4166 9.33325 15.2013 9.65964 15.8541 10.3124C16.5069 10.9652 16.8333 11.7499 16.8333 12.6666C16.8333 13.5833 16.5069 14.368 15.8541 15.0208C15.2013 15.6735 14.4166 15.9999 13.4999 15.9999ZM21.8333 12.6666C21.8333 13.5833 21.5069 14.368 20.8541 15.0208C20.2013 15.6735 19.4166 15.9999 18.4999 15.9999C18.3471 15.9999 18.1527 15.9826 17.9166 15.9478C17.6805 15.9131 17.486 15.8749 17.3333 15.8333C17.7083 15.3888 17.9964 14.8958 18.1978 14.3541C18.3992 13.8124 18.4999 13.2499 18.4999 12.6666C18.4999 12.0833 18.3992 11.5208 18.1978 10.9791C17.9964 10.4374 17.7083 9.94436 17.3333 9.49992C17.5277 9.43047 17.7221 9.38534 17.9166 9.3645C18.111 9.34367 18.3055 9.33325 18.4999 9.33325C19.4166 9.33325 20.2013 9.65964 20.8541 10.3124C21.5069 10.9652 21.8333 11.7499 21.8333 12.6666Z" fill="#F7F7F7"/>
              </g>
              <defs>
              <clipPath id="clip0_3577_7023">
              <rect width="20" height="20" fill="white" transform="translate(6 6)"/>
              </clipPath>
              </defs>
              </svg>`),
        id: 2, value: 'custommerManagement', link: 'customer/customer-management', activeLink: 'customerManagement'},
      {svg: this.sanitizer.bypassSecurityTrustHtml(`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="16" fill="#274EA1"/>
            <path d="M15.9999 15.9999C15.0833 15.9999 14.2985 15.6735 13.6458 15.0208C12.993 14.368 12.6666 13.5833 12.6666 12.6666C12.6666 11.7499 12.993 10.9652 13.6458 10.3124C14.2985 9.65964 15.0833 9.33325 15.9999 9.33325C16.9166 9.33325 17.7013 9.65964 18.3541 10.3124C19.0069 10.9652 19.3333 11.7499 19.3333 12.6666C19.3333 13.5833 19.0069 14.368 18.3541 15.0208C17.7013 15.6735 16.9166 15.9999 15.9999 15.9999ZM9.33325 22.6666V20.3333C9.33325 19.861 9.45478 19.427 9.69784 19.0312C9.94089 18.6353 10.2638 18.3333 10.6666 18.1249C11.5277 17.6944 12.4027 17.3714 13.2916 17.1562C14.1805 16.9409 15.0833 16.8333 15.9999 16.8333C16.9166 16.8333 17.8194 16.9409 18.7083 17.1562C19.5971 17.3714 20.4721 17.6944 21.3333 18.1249C21.736 18.3333 22.0589 18.6353 22.302 19.0312C22.5451 19.427 22.6666 19.861 22.6666 20.3333V22.6666H9.33325Z" fill="#F7F7F7"/>
            </svg>`),
        id: 3, value: 'vehicleManagement', link: 'vehicle/setup-vehicle', activeLink: 'setupVehicelKs'},
      {svg: this.sanitizer.bypassSecurityTrustHtml(`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="16" fill="#274EA1"/>
          <path d="M10.9999 22.6666C10.3055 22.6666 9.7152 22.4235 9.22909 21.9374C8.74297 21.4513 8.49992 20.861 8.49992 20.1666H6.83325V10.9999C6.83325 10.5416 6.99645 10.1492 7.32284 9.82284C7.64922 9.49645 8.04159 9.33325 8.49992 9.33325H20.1666V12.6666H22.6666L25.1666 15.9999V20.1666H23.4999C23.4999 20.861 23.2569 21.4513 22.7708 21.9374C22.2846 22.4235 21.6944 22.6666 20.9999 22.6666C20.3055 22.6666 19.7152 22.4235 19.2291 21.9374C18.743 21.4513 18.4999 20.861 18.4999 20.1666H13.4999C13.4999 20.861 13.2569 21.4513 12.7708 21.9374C12.2846 22.4235 11.6944 22.6666 10.9999 22.6666ZM10.9999 20.9999C11.236 20.9999 11.4339 20.9201 11.5937 20.7603C11.7534 20.6006 11.8333 20.4027 11.8333 20.1666C11.8333 19.9305 11.7534 19.7326 11.5937 19.5728C11.4339 19.4131 11.236 19.3333 10.9999 19.3333C10.7638 19.3333 10.5659 19.4131 10.4062 19.5728C10.2464 19.7326 10.1666 19.9305 10.1666 20.1666C10.1666 20.4027 10.2464 20.6006 10.4062 20.7603C10.5659 20.9201 10.7638 20.9999 10.9999 20.9999ZM20.9999 20.9999C21.236 20.9999 21.4339 20.9201 21.5937 20.7603C21.7534 20.6006 21.8333 20.4027 21.8333 20.1666C21.8333 19.9305 21.7534 19.7326 21.5937 19.5728C21.4339 19.4131 21.236 19.3333 20.9999 19.3333C20.7638 19.3333 20.5659 19.4131 20.4062 19.5728C20.2464 19.7326 20.1666 19.9305 20.1666 20.1666C20.1666 20.4027 20.2464 20.6006 20.4062 20.7603C20.5659 20.9201 20.7638 20.9999 20.9999 20.9999ZM20.1666 16.8333H23.7083L21.8333 14.3333H20.1666V16.8333Z" fill="#F7F7F7"/>
          </svg>`),
        id: 4, value: 'operatorManagement',link: 'oprerato/setup-operator', activeLink: 'operatorManagement'}
    ]
  }
  menuHeader = [
    {id: 2, value: 'report'},
    {id: 3, value: 'accountant'},
    {id: 4, value: 'chartsAndtatistics'},
    {id: 5, value: 'administration'},
    {id: 6, value: 'cmr'},
    {id: 7, value: 'other'}

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
