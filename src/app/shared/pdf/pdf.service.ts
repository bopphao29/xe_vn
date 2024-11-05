import { Injectable } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
// import fs from 'fs'; 

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async generateEmployeePDF(employeeInfo: any, childrenList: any[], documentList: any[]) {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage([600, 800]);
    const font = await fetch('/assets/fonts/Roboto_Condensed/static/RobotoCondensed-Italic.ttf').then(res => res.arrayBuffer());
    const useFont = await pdfDoc.embedFont(font);

    const { width, height } = page.getSize();
    let yPos = height - 50;

    // Hàm hỗ trợ vẽ một cặp nhãn - giá trị trên cùng một hàng
    const drawRow = (label: string, value: string) => {
      page.drawText(label, { x: 50, y: yPos, size: 12, font: useFont });
      page.drawText(String(value || ''), { x: 200, y: yPos, size: 12, font: useFont });
      yPos -= 20;
    };

    // Hàm hỗ trợ vẽ dòng tiêu đề bảng
    const drawTableHeader = (headers: string[], xPositions: number[], cellHeight: number) => {
      headers.forEach((header, index) => {
        page.drawText(header, { x: xPositions[index], y: yPos, size: 12, color: rgb(0, 0, 0.8), font: useFont });
        page.drawRectangle({
          x: xPositions[index],
          y: yPos - cellHeight + 5,
          width: 100,
          height: cellHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1
        });
      });
      yPos -= cellHeight;
    };

    // Hàm hỗ trợ vẽ một dòng bảng
    const drawTableRow = (data: string[], xPositions: number[], cellHeight: number) => {
      data.forEach((text, index) => {
        page.drawText(String(text || ''), { x: xPositions[index], y: yPos, size: 10, font: useFont });
        page.drawRectangle({
          x: xPositions[index],
          y: yPos,
          width: 100,
          height: cellHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1
        });
      });
      yPos -= cellHeight;
    };

    // Phần tiêu đề
    const textHead = 'Thông tin nhân sự'
    const textWidth = useFont.widthOfTextAtSize(textHead, 18)
    const xCenter = (width - textWidth)/2
    page.drawText(textHead, { x: xCenter, y: yPos, size: 18, color: rgb(0, 0, 0), font: useFont });
    yPos -= 40;

    // Vẽ các trường thông tin nhân sự
    drawRow('Tên nhân viên', employeeInfo.name || '');
    drawRow('Năm sinh', employeeInfo.yearOfBirth || '');
    drawRow('Giới tính', employeeInfo.gender === '1' ? 'Nam' : 'Nữ');
    drawRow('Dân tộc', employeeInfo.ethnicGroup || '');
    drawRow('Tôn giáo', employeeInfo.religion || '');
    drawRow('Địa chỉ thường trú', employeeInfo.permanentAddress || '');
    drawRow('Địa chỉ tạm trú', employeeInfo.temporaryAddress || '');
    drawRow('Số điện thoại', employeeInfo.phoneNumber || '');
    drawRow('Zalo', employeeInfo.zalo || '');
    drawRow('Email', employeeInfo.email || '');
    drawRow('CCCD', employeeInfo.identifierId || '');

    yPos -= 20;

    // Bảng Danh sách giấy tờ
    page.drawText('Danh sách giấy tờ', { x: 50, y: yPos, size: 14, color: rgb(0, 0, 0), font: useFont });
    yPos -= 20;

    const cellHeight = 20; // Thiết lập chiều cao ô
    drawTableHeader(['STT', 'Tên giấy tờ', 'Số hiệu', 'Loại giấy tờ'], [100, 150, 300, 400], cellHeight);
    documentList.forEach((doc, index) => {
      drawTableRow(
        [(index + 1).toString(), doc.name || '', doc.code || '', doc.type || ''],
        [50, 100, 250, 350],
        cellHeight
      );
    });

    yPos -= 20;

    // Bảng Danh sách con cái
    if (childrenList.length > 0) {
      page.drawText('Danh sách con của nhân viên', { x: 50, y: yPos, size: 14, color: rgb(0.1, 0.1, 0.6), font: useFont });
      yPos -= 20;

      drawTableHeader(['STT', 'Tên', 'Năm sinh', 'Giới tính'], [50, 100, 250, 350], cellHeight);
      childrenList.forEach((child, index) => {
        drawTableRow(
          [(index + 1).toString(), child.name || '', child.yearOfBirth || '', child.gender === '1' ? 'Nam' : 'Nữ'],
          [50, 100, 250, 350],
          cellHeight
        );
      });
    }

    // Tạo và trả file PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }
}
