import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { IData } from '../../models-employee/setup-profile-employee/index.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { UserServiceService } from '../../shared/user-service/user-service.service';

interface FileCompressed {
  contractFile: File[];
  healthCertificate: File[];
  file: File[];
}

@Component({
  selector: 'app-detail-profile-employee',
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
  templateUrl: './detail-profile-employee.component.html',
  styleUrl: './detail-profile-employee.component.scss'
})
export class DetailProfileEmployeeComponent implements OnInit {

  date = null;
  isEnglish = false;
  fileList: NzUploadFile[] = [];
  fileCompressed: FileCompressed = {
    contractFile: [],
    healthCertificate: [],
    file: []
  };
  form: FormGroup;

  data: IData = {
    name: null,
    yearOfBirth: null,
    gender: null,
    identifierId: null,
    phoneNumber: null,
    zalo: null,
    // contractDuration: null,
    email: null,
    hasChild: null,
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
    contractFile: null,
    branchId: 0,
    departmentId: null,
    positionId: null,
    routeId: null,
    businessCardNumber: null,
    bcStartDate: null,
    bcEndDate: null,
    officeId: null,
    hcEndDate: null,
    driverLicenseNumber: null,
    driverLicenseType: null,
    dlStartDate: null,
    dlEndDate: null,
    // archivedRecordFiles: [],
    lstChildren: [{
      name: null,
      yearOfBirth: null,
      gender: null
    }],
    lstArchivedRecords: [{
      name: null,
      code: null,
      type: null,
      file: null
    }],
    contract: {
      id: null,
      type: null,
      signDate: null,
    }
  }

  file = true
  isShowModalUploadfile = false
  isModalInforEmployee = false
  
  loading = false;
  avatarUrl?: string;
  inforEmployee: any = {}

  userId: number = 2
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private userSevice: UserServiceService,
    private notification: NotificationService,

  ) {
    this.form = this.fb.group(this.data)
  }

  ngOnInit(): void {
    //khởi tạo form ban đầu
    this.form = this.fb.group({
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
      contractFile: null,
      contactPersonPhone: null,
      // contractDuration: null,
      staffRelation: null,
      permanentAddress: null,
      temporaryAddress: null,
      contractType: null,
      fromDate: null,
      toDate: null,
      branchId: null,
      departmentId: null,
      officeId: null,
      routeId: null,
      positionId: null,
      businessCardNumber: null,
      bcStartDate: null,
      bcEndDate: null,
      hcEndDate: null,
      driverLicenseNumber: null,
      driverLicenseType: null,
      dlStartDate: null,
      dlEndDate: null,
      hasChild: null,
      bcImage: [],
      healthCertificate: [],
      dlImage: [],
      // archivedRecordFiles: [],
      lstChildren: this.fb.array(this.data.lstChildren.map(child => this.createlstChildren(child))),
      lstArchivedRecords: this.fb.array(this.data.lstArchivedRecords.map(record => this.createArchivedRecords(record))),
      contract: this.fb.group({
        id: '',
        type: 0,
        signDate: null
      })
    })
    this.checkDriver()
    this.checkChild()
    this.checkWork()
    // this.getUser(this.userId)
    this.getBranch()
    this.getDepartment()
    this.getOffice()
    this.getPossition()
    this.getRoute()


  }


  listBranch: any[] = []
  listPosstion: any[] = []
  listOffice: any[] = []
  listDepartment: any[] = []
  listRoute: any[] = []


  getBranch() {
    this.userSevice.getBranch().subscribe((response: any) => {
      this.listBranch = response.data
    })
  }

  getPossition() {
    this.userSevice.getPossition().subscribe((response: any) => {
      this.listPosstion = response.data
    })
  }

  getOffice() {
    this.userSevice.getOffice().subscribe((response: any) => {
      this.listOffice = response.data
    })
  }

  getDepartment() {
    this.userSevice.getDepartment().subscribe((response: any) => {
      this.listDepartment = response.data
    })
  }

  getRoute() {
    this.userSevice.getRoute().subscribe((response: any) => {
      this.listRoute = response.data
    })
  }

  //tạo form array
  get lstArchivedRecords(): FormArray {
    return this.form.get('lstArchivedRecords') as FormArray;
  }

  get lstChildren(): FormArray {
    return this.form.get('lstChildren') as FormArray;
  }

  createArchivedRecords(record: { name: string | null; code: string | null; type: string | null; file: string | null }): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      type: ['', Validators.required],
      file: ['']
    });
  }

  createContract(record: { id: string | null; type: string | null; signDate: string | null }): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
      type: ['', Validators.required],
      date: ['', Validators.required],
      file: ['']
    });
  }

  createlstChildren(child: { name: string | null; yearOfBirth: string | null; gender: string | null }): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      yearOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  addArchivedRecords() {
    this.lstArchivedRecords.push(this.createArchivedRecords({
      name: null,
      code: null,
      type: null,
      file: null
    }));

    // this.fileCompressed.file.push(null);
  }

  addlstChildren() {
    this.lstChildren.push(this.createlstChildren({
      name: null,
      yearOfBirth: null,
      gender: null
    }));
  }

  removeArchivedRecord(index: number) {
    this.lstArchivedRecords.removeAt(index)
  }

  removelstChildren(index: number) {
    this.lstChildren.removeAt(index)
  }

  //modal
  showModalInforEmployee() {
    // this.isModalInforEmployee = true
    this.inforEmployee = this.form.value
    // this.loading = true
    this.saveDataEmployee()
  }

  // lấy giá trị trong các trường
  getNameInput(name: string, type: 'driverLicense') {
    const driverLicenseTypeData: { [key: string]: string } = {
      '1': 'D',
      '2': 'E'
    };
    let data;
    switch (type) {
      case 'driverLicense':
        data = driverLicenseTypeData;
        break;
      default:
        data = {};
    }

    return data[name] || '';// trả về tên
  }

  handleCancel() {
    this.isModalInforEmployee = false
  }

  handleSubmit(): void {
    this.isModalInforEmployee = false;
  }

  //check driver => show input
  idDriver: number = -10
  hasDriver : boolean = false
  checkDriver() {
    this.form.get('departmentId')?.valueChanges.subscribe((value: any) => {
      
      this.idDriver = value // 1
      const isDriver= this.listDepartment.find(item => item.id ===  this.idDriver)
      console.log(isDriver)
      var nameDriver : any = isDriver.name
      if(isDriver && nameDriver == 'Lái xe'){
        this.hasDriver = true
      }
    })
  }

  hasChildren: number = -10

  checkChild() {
    this.form.get('hasChild')?.valueChanges.subscribe((value: any) => {
      this.hasChildren = value
      console.log(this.hasChildren)

    })
  }

  checkContractType: number = 0
  checkWork(){
    this.form.get('contractType')?.valueChanges.subscribe((value: any)=> {
      this.checkContractType = value
    })
  }

  


  // beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   const isLt2M = file.size! / 1024 / 1024 < 2;

  //   if (!isJpgOrPng) {
  //     this.msg.error('You can only upload JPG/PNG files!');
  //     return of(false); 
  //   }
  //   if (!isLt2M) {
  //     this.msg.error('Image must be smaller than 2MB!');
  //     return of(false); 
  //   }

  //   return of(true); 
  // };

  // private getBase64(img: File, callback: (img: string) => void): void {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result!.toString()));
  //   reader.readAsDataURL(img);
  // }
  previewUrl: string | ArrayBuffer | null = null; // Show url ảnh
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  bcImageName: string = ''; // Tên file hình ảnh GPLX
  dlImageName: string = ''; // Tên file hình ảnh giấy phép lái xe
  isBcImageVisible: boolean = true; // Hiện thị input Hình ảnh thẻ nghiệp vụ
  isDlImageVisible: boolean = false; // Hiện thị input Hình ảnh GPLX


  bcImgFile: File[] = []
  dlImage: File[] = []

  handleFileInput(event: Event, field: 'bcImage' | 'dlImage'): void {//tạo field có tên bcImage or dlImage
    const target = event.target as HTMLInputElement; // tạo biến, khi click sự kiện (HTMLInputElement: 1 kiểu trong html)
    if (target.files && target.files.length > 0) { // nếu là files và có file
      const file = target.files[0]; // tạo biến để lưu giá trị đầu tiên khi chọn

      if (field === 'bcImage') {//check name với formControllName
        this.bcImageName = file.name; // Tên file hình ảnh thẻ nghiệp vụ
        this.bcImgFile = [file]
      } else if (field === 'dlImage') {
        this.dlImageName = file.name; // Tên file hình ảnh GPLX
        this.dlImage = [file]

      }
      const reader = new FileReader();//tạo biến để đọc file dạng url
      reader.onload = (e) => { //reader.onload hàm call back sau khi đọc xong file
        if (typeof e.target?.result === 'string') { // Kiểm tra kiểu
          this.previewUrl = e.target.result; // Lưu URL của hình ảnh
        }
      };
      reader.readAsDataURL(file);//=> nhìn thấy được ảnh

    }

  }

  fieldName: string = '';
  openFileModal(field: string): void {// file này để lưu tên trường , để tật modal theo file tên gì
    this.fieldName = field; // Lưu tên trường
    this.isShowModalUploadfile = true;

    // Điều khiển hiển thị các input
    if (field === 'bcImage') {
      this.isBcImageVisible = true;
      this.isDlImageVisible = false;
      this.isShowModalUploadfile = true
    } else {
      this.isBcImageVisible = false;
      this.isDlImageVisible = true;
      this.isShowModalUploadfile = true
    }
    // vì cùng 1 modal nên nên khi bật nên phải khởi tạo khởi tạo lại các giá trị
    this.selectedFile = null;// 
    this.previewUrl = null;//
  }

  handleChangeFile(event: any, field: 'bcImage' | 'dlImage'): void {//
    const file = event.file.originFileObj;// tạo biến chứa file gốc đã chọn
    if (file) { // nếu có file
      const reader = new FileReader();// đọc file
      reader.onload = (e: any) => {// sau khi đọc xong
        this.imageUrl = e.target.result; // gán url vào imageUrl
      };
      reader.readAsDataURL(file);// dọc file => chuyển file sang chuỗi base 64

      this.form.get(field)?.setValue(file.name); // lấy formControl của field và set vào file.name

      // Cập nhật mảng file trong fileCompressed
      if (field === 'bcImage') { // nếu field =bcImage bcImage
        this.fileCompressed.contractFile = [file];//contractFile cập nhật
        this.bcImageName = file.name;
      } else if (field === 'dlImage') {
        this.fileCompressed.healthCertificate = [file];
        this.dlImageName = file.name;
      }

    }


    // const imageType = event.file.name.includes("") ? 'bcImage' : 'dlImage'; // Phân loại dựa trên tên file
    // this.imgList[imageType] = [file]; //
    // this.form.get(imageType)?.setValue(file.name);
  }

  beforeUpload = (file: NzUploadFile): boolean => {// sau khi file được tải lên
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'; //lọc file png 
    if (!isJpgOrPng) { // check điều kiện
      this.msg.error('Bạn chỉ có thể tải lên file JPG hoặc PNG!');
    }
    return isJpgOrPng; // Ngăn không cho tải lên file không hợp lệ
  };


  onFileSelected(event: any): Observable<File> {
    return new Observable((observer: Observer<File>) => {// tạo observable mới
      const file: File = event.target.files[0];// tạo biến nhận giá trị đầu tiên của file
      if (file) { // nếu có file thì tiếp tục
        observer.next(file)
        observer.complete()
      }
      else {
        observer.error('Error')
      }
    })
  }

  onChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;// sự kiến ckick trong html
    if (input.files && input.files.length > 0) {// nếu là file và có file
      const file = input.files[0]; // Lấy file đầu tiên

      if (field === 'contractFile') {// nếu tên field = contractFile
        this.fileCompressed.contractFile = [file]; // Chỉ lưu một file
        // Cập nhật giá trị cho FormControl contracfile = file[]
        this.form.patchValue({ contractFile: [file] });
      } else if (field === 'healthCertificate') { //nếu tên field = healthCertificate
        this.fileCompressed.healthCertificate = [file];
        // Cập nhật giá trị cho FormControl
        this.form.patchValue({ healthCertificate: [file] });
      }
    }
  }

  imgList: { [key: string]: File[] } = { bcImage: [], dlImage: [] };// biến để lưu chữ giá trị file
  imagePreviews: { [key: string]: string | null } = { bcImage: null, dlImage: null };// tương tự , đây là biến lưu url
  currentImageType: string = ''; // tạo biến luu ảnh tạm thòi

  onChangeImg(event: Event): void {//
    this.onFileSelected(event).subscribe({// trả về observable
      next: (file: File) => {
        this.selectedFile = file;

        // Tạo preview cho hình ảnh
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);
      },
      error: (error) => {
        console.error('Lỗi khi chọn file:', error);
      }
    });
  }


  onFileChange(event: any, fieldName: any, index: number): void {
    this.onFileSelected(event).subscribe({//
      next: (file: File) => {
        const fileList: FileList = event.target.files; // danh sách file được chọn 

        if (fileList.length > 0) {// nếu list > 0
          const file = fileList[0];// file đầu danh sách
          this.fileCompressed.file[index] = file;// lưu vào mảng tại vị trí index

          if (fieldName === 'file') {
            this.lstArchivedRecords.at(index).patchValue({ file: file });// cấp nhật giá trị nếu fieldName = file
          }
        }
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {

      }
    })
  }

  isoDate: string | null = null;

  // Hàm xử lý thay đổi ngày
  onDateChange(date: Date): void {
    if (date) {
      this.isoDate = date.toISOString(); // Chuyển đổi sang ISO 8601
      console.log(this.isoDate)
    } else {
      this.isoDate = null;
    }
  }

  getUser(id: any) {
    this.userId = id
    console.log(id)
    this.userSevice.getDetailEmployee(id).subscribe((response: any) => {
      console.log(response.data)
    })
  }

  officeEmployee : any
  officeName: any
  branchEmployee : any
  branchName: any
  positionEmloyee: any
  positionName: any
  deparmentEmployee:any
  deparmentName: any
  routeEmployee: any
  routeName: any

  saveDataEmployee() {
    const dataForm = {
      ...this.form.value,
      lstArchivedRecords: this.form.value.lstArchivedRecords.map((record: any) => ({// trong form Array
        name: record.name,
        code: record.code,
        type: record.type,
        file: record.file.name,
      })),
      lstChildren: this.form.value.lstChildren.map((child: any) => ({
        name: child.name,
        yearOfBirth: child.yearOfBirth,
        gender: child.gender,
      })),

    };
    delete dataForm.contractFile
    delete dataForm.bcImage
    delete dataForm.healthCertificate
    delete dataForm.dlImage
    //office => đã có id => timf tên theo id
    this.officeEmployee = dataForm.officeId
    const officeIndex = this.listOffice.find(item => item.id === this.officeEmployee)
    if(dataForm.officeId){
      this.officeName = officeIndex.name 
    }
    //deparment
    this.deparmentEmployee = dataForm.departmentId
    const deparmentIndex = this.listDepartment.find(item => item.id === this.deparmentEmployee)
    if(dataForm.departmentId){
      this.deparmentName = deparmentIndex.name 
    }
    //branch
    this.branchEmployee = dataForm.branchId
    const branchIndex = this.listBranch.find(item => item.id === this.branchEmployee)
    if(dataForm.branchId){
    this.branchName = branchIndex.name 
    }
    //position
    this.positionEmloyee = dataForm.positionId
    const positionIndex = this.listPosstion.find(item => item.id === this.positionEmloyee)
    if(dataForm.positionId){
      this.positionName = positionIndex.name
    }
    //route
    this.routeEmployee =dataForm.routeId
    const routeIndex = this.listRoute.find(item => item.id === this.routeEmployee)
    if(dataForm.routeId){
      this.routeName = routeIndex.name 
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataForm));
    if (this.fileCompressed.healthCertificate.length > 0) {
      formData.append('healthCertificate', this.fileCompressed.healthCertificate[0]);
    }

    if (this.fileCompressed.contractFile.length > 0) {
      formData.append('contractFile', this.fileCompressed.contractFile[0]);
    }
    var archivedRecordFile: any = this.fileCompressed.file

    archivedRecordFile.forEach((value: any) => {
      formData.append('archivedRecordFiles', value)
    })

    console.log(this.fileCompressed.file)
    //  formData.append('data', JSON.stringify(dataForm))

    if (this.dlImage[0]) {
      formData.append('dlImage', this.dlImage[0]);
    }
    if (this.bcImgFile[0]) {
      formData.append('bcImage', this.bcImgFile[0]);
    }
    //  formData.append('healthCertificate', this.fileCompressed.healthCertificate[0]);
    //  formData.append('contractFile', this.fileCompressed.contractFile[0] );
    //  formData.append('archivedRecordFiles', archivedRecordFile)    



    // console.log(formData)

    this.userSevice.saveEmployee(formData).subscribe({
      next: (response) => {
        console.log('File đã được gửi đi thành công', response);
        this.notification.success('Lưu hồ sơ nhân viên thành công!')
        this.isModalInforEmployee = true  
        this.form.reset()
      },
      error: (error) => {
        // if(error.status === 400){
        //   this.notification.error(error.message)
        // }

      }
    })
  }

}
