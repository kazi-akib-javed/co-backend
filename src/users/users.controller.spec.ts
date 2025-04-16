import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BcryptService, QueryService, UsersEntity } from '../../common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockRepository = {};
  const mockQueryService = {};
  const mockBcryptService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService,{
        provide: getRepositoryToken(UsersEntity),
        useValue: mockRepository,
      },{
        provide: QueryService,
        useValue: mockQueryService,
      },
      {
        provide: BcryptService,
        useValue: mockBcryptService,
      }],
    })
    .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
