import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { Constants } from '../common/constants';
import {
  Error400Dto,
  Forbidden403Dto,
  NoteSuccess201Dto,
} from '../common/dto/response.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  private readonly logger = new Logger(NotesController.name);

  constructor(private readonly notesService: NotesService) {}

  /**
   * Create a new note
   * @param createNoteDto
   * @returns
   */
  @UsePipes(new TrimPipe())
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: Constants.SWAGGER_MSG.SO,
    type: NoteSuccess201Dto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: Constants.SWAGGER_MSG.II,
    type: Error400Dto,
  })
  @ApiForbiddenResponse({
    description: Constants.SWAGGER_MSG.IU,
    type: Forbidden403Dto,
  })
  @ApiOperation({ description: 'Create Note' })
  @UsePipes(new CustomValidationPipe())
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(new TrimPipe()) createNoteDto: CreateNoteDto) {
    this.logger.log(
      `[NotesController][create] init, title: ${createNoteDto.title}`,
    );
    return this.notesService.create(createNoteDto);
  }

  /**
   * Get all notes
   * @returns
   */
  @ApiOperation({ description: 'Get all notes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: Constants.SWAGGER_MSG.SO,
    type: [NoteSuccess201Dto],
  })
  @Get()
  findAll() {
    this.logger.log('[NotesController][findAll] init');
    return this.notesService.findAll();
  }

  /**
   * Get a note by ID
   * @param id
   * @returns
   */
  @ApiOperation({ description: 'Get a note by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: Constants.SWAGGER_MSG.SO,
    type: NoteSuccess201Dto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`[NotesController][findOne] init, id: ${id}`);
    return this.notesService.findOne(id);
  }

  /**
   * Update a note
   * @param id
   * @param updateNoteDto
   * @returns
   */
  @UsePipes(new TrimPipe())
  @ApiOperation({ description: 'Update a note' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: Constants.SWAGGER_MSG.SO,
    type: NoteSuccess201Dto,
  })
  @UsePipes(new CustomValidationPipe())
  @Patch(':id')
  update(@Param('id') id: string, @Body(new TrimPipe()) updateNoteDto: UpdateNoteDto) {
    this.logger.log(`[NotesController][update] init, id: ${id}`);
    return this.notesService.update(id, updateNoteDto);
  }

  /**
   * Delete a note
   * @param id
   * @returns
   */
  @ApiOperation({ description: 'Delete a note' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: Constants.SWAGGER_MSG.SO,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.logger.log(`[NotesController][remove] init, id: ${id}`);
    return this.notesService.remove(id);
  }
}
