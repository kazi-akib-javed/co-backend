import { Test, TestingModule } from "@nestjs/testing";
import { ProgramsController } from "./programs.controller";
import { ProgramsService } from "./programs.service";
import { ProgramsEntity } from "./entities/programs.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryService } from "../../common";

describe("ProgramsController", () => {
  let controller: ProgramsController;
  const mockQueryService = {};
  const mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramsController],
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

    controller = module.get<ProgramsController>(ProgramsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
