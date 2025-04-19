import { Test, TestingModule } from "@nestjs/testing";
import { ProgramsService } from "./programs.service";
import { QueryService } from "../../common";
import { ProgramsEntity } from "./entities/programs.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ProgramsService", () => {
  let service: ProgramsService;

  const mockQueryService = {};
  const mockRepository = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        {
          provide: getRepositoryToken(ProgramsEntity),
          useValue: mockRepository,
        },
        {
          provide: QueryService,
          useValue: mockQueryService,
        },
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
