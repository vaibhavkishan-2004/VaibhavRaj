import { ApiProperty } from '@nestjs/swagger';

export class Error400Dto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: ['Validation error message'] })
  messages: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class Forbidden403Dto {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Forbidden resource' })
  message: string;

  @ApiProperty({ example: 'Forbidden' })
  error: string;
}

export class NoteSuccess201Dto {
  @ApiProperty({ example: '60d0fe4f5311236168a109ca' })
  id: string;

  @ApiProperty({ example: 'Note Title' })
  title: string;

  @ApiProperty({ example: 'Note Content' })
  content: string;

  @ApiProperty({ example: ['tag1', 'tag2'], required: false })
  tags?: string[];

  @ApiProperty({ example: '2021-06-21T18:25:43.511Z' })
  createdAt: string;

  @ApiProperty({ example: '2021-06-21T18:25:43.511Z' })
  updatedAt: string;
}
