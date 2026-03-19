import { Test, TestingModule } from '@nestjs/testing';
import { NotesModule } from '../../src/NOTES/notes.module';

describe('NotesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NotesModule],
    }).compile();
  });

  it('should be defined', () => {
    const notesModule = module.get<NotesModule>(NotesModule);
    expect(notesModule).toBeDefined();
  });
});
