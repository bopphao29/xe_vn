import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { FormControl, FormGroup,FormBuilder, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { STORAGE_KEYS } from '../../../shared/constants/system.const';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    NzButtonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    CommonModule,
    NzFormModule,
    NzInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService : AuthServiceService,
    private notifiService: NotificationService,
    private route : Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    const getToken = localStorage.getItem('TOKEN')
    if(getToken){
      this.route.navigate(['/employee/setup-profile-employee']) //f5 không mất token
    }
  }

  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched()
    const data = {
      ...this.loginForm.value
    }
    if (this.loginForm.valid) {
      this.authService.login(data).subscribe((response : any) => {
        console.log(response.data)
        const token = response.data.accessToken
        const refreshToken = response.data.refreshToken

        if(token){
          localStorage.setItem(STORAGE_KEYS.TOKEN, token)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
          this.route.navigate(['employee/setup-profile-employee'])
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
          Toast.fire({
            icon: "success",
            title: "Đăng nhập thành công"
          });
          localStorage.setItem('activeLink', 'employeeManagement')
        }else{
            this.notifiService.error("Error token")
            // localStorage.clear()
        }
      })
    }
  }

}
