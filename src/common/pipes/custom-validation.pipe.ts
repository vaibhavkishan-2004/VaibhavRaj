import { ValidationPipe, BadRequestException, ValidationError } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // Automatically strips out unknown properties
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const extractErrors = (errors: ValidationError[]): any[] => {
          return errors.flatMap((error) => {
            // Collect constraints if available
            const constraints = error.constraints ? Object.values(error.constraints) : [];

            // Recursively collect messages from children if present
            if (error.children && error.children.length > 0) {
              return [
                ...constraints,
                ...extractErrors(error.children), // Recursively handle nested children errors
              ];
            }

            return constraints;
          });
        };

        const formattedErrors = extractErrors(validationErrors);

        return new BadRequestException({
          statusCode: 400,
          messages: formattedErrors.length > 0 ? formattedErrors : ['Invalid value'], // Collect all messages
          error: 'Bad Request',
        });
      },
    });
  }
}
