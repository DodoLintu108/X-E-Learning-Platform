// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   BadRequestException,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import * as multer from 'multer';
// import { FilesService } from './file.service'; // Import FileService

// @Injectable()
// export class DynamicFileUploadInterceptor implements NestInterceptor {
//   constructor(private readonly fileService: FilesService) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();

//     const upload = multer({
//       storage: null // Dynamically get storage
//       limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB limit
//       },
//     }).single('file'); // Handle a single file upload

//     return new Observable((observer) => {
//       upload(request, undefined, (err) => {
//         if (err) {
//           observer.error(
//             new BadRequestException(err.message || 'File upload failed'),
//           );
//         } else {
//           observer.next();
//           observer.complete();
//         }
//       });
//     });
//   }
// }
