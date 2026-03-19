import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from 'src/NOTES/notes.controller';
import { NotesService } from 'src/NOTES/notes.service';
import { CreateNoteDto, UpdateNoteDto } from 'src/NOTES/dto/note.dto';

describe('Notes Controller', () => {
  let notesController: NotesController;
  let notesService: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService],
    }).compile();

    notesController = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
  });

  describe('Create Instance', () => {
    it('should create the instance of notesController', async () => {
      expect(notesController).toBeDefined();
    });
  });

  describe('create endpoint', () => {
    it('valid scenario - with tags', async () => {
      const dto: CreateNoteDto = { title: 'Title', content: 'Content', tags: ['t1'] };
      const result = await notesController.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.tags).toEqual(['t1']);
    });

    it('valid scenario - without tags', async () => {
      const dto: CreateNoteDto = { title: 'Title', content: 'Content' };
      const result = await notesController.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.tags).toBeUndefined();
    });

    it('invalid scenario - duplicate id', async () => {
      const dto: CreateNoteDto = { id: 'dup-id', title: 'Title', content: 'Content' };
      await notesController.create(dto);
      try {
        await notesController.create(dto);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Note with ID dup-id already exists');
      }
    });
  });

  describe('findAll endpoint', () => {
    it('valid scenario', async () => {
      notesService.create({ title: 'Title', content: 'Content' });
      const result = await notesController.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });
  });

  describe('findOne endpoint', () => {
    it('invalid scenario - check for NotFoundException', async () => {
      jest.spyOn(notesService, 'findOne').mockImplementation(() => {
        throw new Error('Not Found');
      });
      try {
        await notesController.findOne('invalid-id');
      } catch (error) {
        expect(error.message).toBe('Not Found');
      }
    });
  });

  describe('update endpoint', () => {
    it('valid scenario - update with empty object', async () => {
      const created = notesService.create({ title: 'Title', content: 'Content' });
      const updateDto: UpdateNoteDto = {};
      const result = await notesController.update(created.id, updateDto);
      expect(result.title).toBe('Title');
    });

    it('valid scenario - update title', async () => {
      const created = notesService.create({ title: 'Title', content: 'Content' });
      const updateDto: UpdateNoteDto = { title: 'Updated' };
      const result = await notesController.update(created.id, updateDto);
      expect(result.title).toBe('Updated');
    });

    it('valid scenario - update tags', async () => {
      const created = notesService.create({ title: 'Title', content: 'Content' });
      const updateDto: UpdateNoteDto = { tags: ['new-tag'] };
      const result = await notesController.update(created.id, updateDto);
      expect(result.tags).toEqual(['new-tag']);
    });

    it('invalid scenario - check for NotFoundException', async () => {
      jest.spyOn(notesService, 'update').mockImplementation(() => {
        throw new Error('Not Found');
      });
      try {
        await notesController.update('invalid-id', { title: 'Updated' });
      } catch (error) {
        expect(error.message).toBe('Not Found');
      }
    });
  });

  describe('remove endpoint', () => {
    it('valid scenario', async () => {
      const created = notesService.create({ title: 'Title', content: 'Content' });
      await notesController.remove(created.id);
      expect(notesService.findAll().length).toBe(0);
    });

    it('invalid scenario - check for NotFoundException', async () => {
      jest.spyOn(notesService, 'remove').mockImplementation(() => {
        throw new Error('Not Found');
      });
      try {
        await notesController.remove('invalid-id');
      } catch (error) {
        expect(error.message).toBe('Not Found');
      }
    });
  });
});
