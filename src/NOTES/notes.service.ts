import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);
  private notes: Note[] = [];

  /**
   * Create a new note
   * @param createNoteDto 
   * @returns Created note
   */
  create(createNoteDto: CreateNoteDto): Note {
    this.logger.log(`[NotesService][create] init, title: ${createNoteDto.title}`);

    if (createNoteDto.id && this.notes.some((n) => n.id === createNoteDto.id)) {
      this.logger.error(
        `[NotesService][create] id already exist, id: ${createNoteDto.id}`,
      );
      throw new ConflictException(`Note with ID ${createNoteDto.id} already exists`);
    }

    const newNote: Note = {
      id: createNoteDto.id || uuidv4(),
      ...createNoteDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notes.push(newNote);
    this.logger.log(`[NotesService][create] successful, id: ${newNote.id}`);
    return newNote;
  }

  /**
   * Get all notes
   * @returns Array of notes
   */
  findAll(): Note[] {
    this.logger.log('[NotesService][findAll] init');
    return this.notes;
  }

  /**
   * Get a note by ID
   * @param id 
   * @returns Note
   */
  findOne(id: string): Note {
    this.logger.log(`[NotesService][findOne] init, id: ${id}`);
    const note = this.notes.find((n) => n.id === id);
    if (!note) {
      this.logger.error(`[NotesService][findOne] note not found, id: ${id}`);
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  /**
   * Update a note
   * @param id 
   * @param updateNoteDto 
   * @returns Updated note
   */
  update(id: string, updateNoteDto: UpdateNoteDto): Note {
    this.logger.log(`[NotesService][update] init, id: ${id}`);
    const noteIndex = this.notes.findIndex((n) => n.id === id);
    if (noteIndex === -1) {
      this.logger.error(`[NotesService][update] note not found, id: ${id}`);
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    const updatedNote = {
      ...this.notes[noteIndex],
      ...updateNoteDto,
      updatedAt: new Date(),
    };

    this.notes[noteIndex] = updatedNote;
    this.logger.log(`[NotesService][update] successful, id: ${id}`);
    return updatedNote;
  }

  /**
   * Delete a note
   * @param id
   */
  remove(id: string): { message: string } {
    this.logger.log(`[NotesService][remove] init, id: ${id}`);
    const noteIndex = this.notes.findIndex((n) => n.id === id);
    if (noteIndex === -1) {
      this.logger.error(`[NotesService][remove] note not found, id: ${id}`);
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    this.notes.splice(noteIndex, 1);
    this.logger.log(`[NotesService][remove] successful, id: ${id}`);
    return { message: `Note with ID ${id} deleted successfully` };
  }
}
