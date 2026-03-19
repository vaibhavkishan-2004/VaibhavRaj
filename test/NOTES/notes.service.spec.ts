import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotesService, Note } from 'src/NOTES/notes.service';
import { CreateNoteDto, UpdateNoteDto } from 'src/NOTES/dto/note.dto';

describe('Notes Service', () => {
  let notesService: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService],
    }).compile();

    notesService = module.get<NotesService>(NotesService);
  });

  describe('Create Instance', () => {
    it('should create the instance of notesService', async () => {
      expect(notesService).toBeDefined();
    });
  });

  describe('create method', () => {
    it('valid scenario', async () => {
      const dto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
        tags: ['tag1'],
      };
      const result = notesService.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe(dto.title);
      expect(result.content).toBe(dto.content);
    });
  });

  describe('findAll method', () => {
    it('valid scenario', async () => {
      notesService.create({ title: 'Note 1', content: 'Content 1' });
      const result = notesService.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });
  });

  describe('findOne method', () => {
    it('valid scenario', async () => {
      const created = notesService.create({ title: 'Note 1', content: 'Content 1' });
      const result = notesService.findOne(created.id);
      expect(result.id).toBe(created.id);
    });

    it('invalid scenario - check for NotFoundException', async () => {
      try {
        notesService.findOne('invalid-id');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Note with ID invalid-id not found');
      }
    });
  });

  describe('update method', () => {
    it('valid scenario', async () => {
      const created = notesService.create({ title: 'Note 1', content: 'Content 1' });
      const updateDto: UpdateNoteDto = { title: 'Updated Title' };
      const result = notesService.update(created.id, updateDto);
      expect(result.title).toBe('Updated Title');
    });

    it('invalid scenario - check for NotFoundException', async () => {
      const updateDto: UpdateNoteDto = { title: 'Updated Title' };
      try {
        notesService.update('invalid-id', updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Note with ID invalid-id not found');
      }
    });
  });

  describe('remove method', () => {
    it('valid scenario', async () => {
      const created = notesService.create({ title: 'Note 1', content: 'Content 1' });
      notesService.remove(created.id);
      expect(notesService.findAll().length).toBe(0);
    });

    it('invalid scenario - check for NotFoundException', async () => {
      try {
        notesService.remove('invalid-id');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Note with ID invalid-id not found');
      }
    });
  });
});
