import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsService } from "./permissions.service";
import { PermissionsEntity } from "./entities/permissions.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryService } from "../../common";

describe("PermissionsService", () => {
  let service: PermissionsService;
  const mockRepository = {};
  const mockQueryService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<PermissionsService>(PermissionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
