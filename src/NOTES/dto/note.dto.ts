import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'The ID of the note (optional, one will be generated if not provided)',
    example: '60d0fe4f5311236168a109ca',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'The title of the note',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'Milk, Eggs, Bread',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Tags for the note',
    example: ['shopping', 'grocery'],
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
