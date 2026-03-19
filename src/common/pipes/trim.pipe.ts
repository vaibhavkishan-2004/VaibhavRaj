import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private isString(obj: any): boolean {
    return typeof obj === 'string' && obj !== null;
  }

  private trimMethod(objData) {
    for (const [key, value] of Object.entries(objData)) {
      if (this.isObject(objData[key])) {
        // handle all nested levels, using recursive function
        this.trimMethod(objData[key]);
      } else {
        // only if it is a string, trim it
        if (typeof value === 'string') {
          objData[key] = value.trim();
        }
      }
    }
    return objData;
  }

  // checks if it is object and if body data exists
  transform(objData: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (this.isObject(objData) && type === 'body') {
      return this.trimMethod(objData);
    }
    if (this.isString(objData)) {
      return objData.trim();
    }
    return objData; // Don't throw for other types, just return
  }
}
