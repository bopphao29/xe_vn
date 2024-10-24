import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray,Validators  } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IData } from '../../models-employee/setup-profile-employee/index.model';
import { Observable, Observer } from 'rxjs';
import { UserServiceService } from '../../shared/user-service/user-service.service';

@Component({
  selector: 'app-setup-profile-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    TranslateModule,
    NzTabsModule,
    NzSelectModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzRadioModule,
    NzModalModule,
    NzDatePickerModule,
    NzTabsModule,
    NzUploadModule,
    

  ],
  templateUrl: './setup-profile-employee.component.html',
  styleUrl: './setup-profile-employee.component.scss'
})
export class SetupProfileEmployeeComponent implements OnInit {

  date = null;
  isEnglish = false;
  fileList: NzUploadFile[] = [];
  fileCompressed: File[] = []
  form: FormGroup;

  data: IData= {
    id: null,
    code: null,
    name: null,
    yearOfBirth: null,
    gender: null,
    identifierId: null,
    phoneNumber: null,
    zalo: null,
    email: null,
    ethnicGroup: null,
    religion: null,
    professionalLevel: null,
    maritalStatus: null,
    contactPerson: null,
    contactPersonPhone: null,
    staffRelation: null,
    permanentAddress: null,
    temporaryAddress: null,
    contractType: null,
    fromDate: null,
    toDate: null,
    contractDate: null,
    signDate: null,
    fileContract: null,
    isLimitedTime: null,
    branchId: null,
    departmentId: null,
    positionId: null,
    routeId: null,
    businessCardNumber: null,
    bcStartDate: null,
    bcEndDate: null,
    bcImage: null,
    healthCertificate: null,
    hcEndDate: null,
    driverLicenseNumber: null,
    driverLicenseType: null,
    dlStartDate: null,
    dlEndDate: null,
    dlImage: null,
    status: null,
    createdBy: null,
    createdDate: null,
    lastModifiedBy: null,
    lastModifiedDate: null
  }

  file = true
  isShowModalUploadfile = false
  isModalInforEmployee = false
  isDriver : boolean = false
  loading = false;
  avatarUrl?: string;

  userId : number = 2
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private userSevice: UserServiceService
  ){
    this.form = this.fb.group(this.data)
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: null,
    code: null,
    name: null,
    yearOfBirth: null,
    gender: null,
    identifierId: null,
    phoneNumber: null,
    zalo: null,
    email: null,
    ethnicGroup: null,
    religion: null,
    professionalLevel: null,
    maritalStatus: null,
    contactPerson: null,
    contactPersonPhone: null,
    staffRelation: null,
    permanentAddress: null,
    temporaryAddress: null,
    contractType: null,
    fromDate: null,
    toDate: null,
    contractDate: null,
    signDate: null,
    fileContract: null,
    isLimitedTime: null,
    branchId: null,
    departmentId: null,
    positionId: null,
    routeId: null,
    businessCardNumber: null,
    bcStartDate: null,
    bcEndDate: null,
    bcImage: null,
    healthCertificate: null,
    hcEndDate: null,
    driverLicenseNumber: null,
    driverLicenseType: null,
    dlStartDate: null,
    dlEndDate: null,
    dlImage: null,
    status: null,
    createdBy: null,
    createdDate: null,
    lastModifiedBy: null,
    lastModifiedDate: null,
    newFile: null,
    documents : this.fb.array([this.createArchivedRecords()]),
    childStatus: this.fb.array([this.createChildStatus()]),
    })    
    this.checkDriver()

    this.getUser(this.userId)
  }

  get documents(): FormArray{
    return this.form.get('documents') as FormArray;
  }

  get childStatus(): FormArray{
    return this.form.get('childStatus') as FormArray;
  }

  createArchivedRecords(): FormGroup {
    return this.fb.group({
      driverLicenseNumber: ['', Validators.required],
      driverLicenseType: ['', Validators.required],
      nameDocument: ['', Validators.required],
      newFile: ['']
    });
  }

  createChildStatus(): FormGroup {
    return this.fb.group({
      
    });
  }

  addArchivedRecords() {
    this.documents.push(this.createArchivedRecords());
  }

  addChildStatus() {
    this.childStatus.push(this.createChildStatus());
  }

  removeArchivedRecord(index: number){
    this.documents.removeAt(index)
  }

  removeChildStatus(index: number){
    this.childStatus.removeAt(index)
  }

  showModalInforEmployee(){
    this.isModalInforEmployee = true
  }
  
  handleCancel(){
    this.isModalInforEmployee = false
  }

  handleSubmit(): void {
    this.isModalInforEmployee = false;
  }

  //check driver => show input
  checkDriver(){
    this.form.get('departmentId')?.valueChanges.subscribe((value: any)=> {
      this.isDriver = value === '4';

    })
  } 

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

    private getBase64(img: File, callback: (img: string) => void): void {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result!.toString()));
      reader.readAsDataURL(img);
    }

    handleChangeFile(info: { file: NzUploadFile }): void {
      switch (info.file.status) {
        case 'uploading':
          this.loading = true;
          break;
        case 'done':
          // Get this url from response in real world.
          this.getBase64(info.file!.originFileObj!, (img: string) => {
            this.loading = false;
            this.avatarUrl = img;
          });
          break;
        case 'error':
          this.msg.error('Network error');
          this.loading = false;
          break;
      }
    }

    onFileSelected(event : any): Observable<File>{
      return new Observable((observer: Observer<File>)=> {
        const file : File = event.target.files[0];
        if(file){
          this.fileCompressed = [file]
          observer.next(file)
          observer.complete()
        }
        else{
          observer.error('Error')
        }
      })
    }

    onFileChange(event : any): void{
      this.onFileSelected(event).subscribe({
        next : (file: File) => {

        },
        error: (err) =>{
          console.log(err)
        },
        complete: ()=> {
          
        }
      })
    }

    getUser(id: any){
      this.userId =id
      console.log(id)
      this.userSevice.getDetailUser(id).subscribe((response: any)=> {
        console.log(response.data)
      })
    }
}
