import { Test, TestingModule } from "@nestjs/testing";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { RoleEntity } from "./entities/roles.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryService } from "../../common";

describe("RoleController", () => {
  let controller: RolesController;
  const mockRepository = {};

  const mockQueryService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRepository,
        },
        {
          provide: QueryService,
          useValue: mockQueryService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
