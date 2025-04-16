import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsController } from "./permissions.controller";
import { PermissionsService } from "./permissions.service";
import { PermissionsEntity } from "./entities/permissions.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryService } from "../../common";

describe("PermissionsController", () => {
  let controller: PermissionsController;
  const mockRepository = {};
  const mockQueryService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(PermissionsEntity),
          useValue: mockRepository,
        },
        {
          provide: QueryService,
          useValue: mockQueryService,
        },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
