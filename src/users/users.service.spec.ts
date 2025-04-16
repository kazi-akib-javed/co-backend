import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { BcryptService, QueryService, UsersEntity } from '../../common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    // mock repository methods if needed
  };
  const mockQueryService = {
    // mock methods used by UsersService (e.g., getQuery, run, etc.)
  };
  const mockBcryptService = {
    // mock methods used by UsersService (e.g., hash, compare, etc.)
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,{
        provide: getRepositoryToken(UsersEntity),
        useValue: mockRepository,
      },
      {
        provide: QueryService,
        useValue: mockQueryService,
      },
      {
        provide: BcryptService,
        useValue: mockBcryptService,
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
