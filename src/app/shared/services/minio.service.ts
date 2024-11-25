// import { Injectable } from '@angular/core';
// import * as AWS from 'aws-sdk';

// @Injectable({
//   providedIn: 'root'
// })
// export class MinioService {
//   constructor(
//     private s3: AWS.S3
//   ) { }

//   getPreSignedUrl(bucketName: string, key: string): string {
//     const params = {
//       Bucket: bucketName,
//       Key: key,
//       Expires: 3600, // Thời gian hết hạn (3600 giây = 1 giờ)
//     };
  
//     return this.s3.getSignedUrl('getObject', params);
//   }
// }
// // 