import { Injectable } from '@angular/core';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class PdfServicesService {

  constructor(
    private userServices: UserServiceService
  ) { }

    // pdfExport(){
    //   this.userServices.exportPDFInToVioLet(this.inforEmployee).subscribe((response : any) => {
    //     const base64 = response.data
    //     console.log(base64)
    //     const blob = PDF.base64ToBlob(base64, 'application/pdf')
    //     // const blob = this.base64ToBlob(base64, 'application/pdf')
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `${this.nameOfPDF()}.pdf`
    //     a.click();
    //     // this.notification.success('Xuất file thành công!')
    //     // Dọn dẹp bộ nhớ
    //     window.URL.revokeObjectURL(url);
    //   })
    // }
}
