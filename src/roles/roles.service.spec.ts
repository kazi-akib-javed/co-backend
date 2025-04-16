import { Test, TestingModule } from "@nestjs/testing";
import { RolesService } from "./roles.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/roles.entity";
import { isActive, QueryService } from "../../common";
import { CreateRolesDto } from "./dto/create-roles.dto";

//Mocked repository – only used for type compliance, not directly interacted with
const mockRepository = {};

//Mocked implementation of QueryService methods
const mockQueryService = {
  findAll: jest.fn(),
  createData: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe("RolesService", () => {
  let service: RolesService;

  //Set up the testing module before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(RoleEntity), // Injecting mocked repository
          useValue: mockRepository,
        },
        {
          provide: QueryService, // Injecting mocked QueryService
          useValue: mockQueryService,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);

    jest.clearAllMocks(); // Clear previous mock calls to ensure test isolation
  });

  //Basic instantiation test
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  //Test for retrieving all active roles
  it("should return all roles", async () => {
    const mockRoles = [
      { name: "Admin" },
      { name: "User" },
    ];
    mockQueryService.findAll.mockResolvedValue(mockRoles);

    const result = await service.findAll();

    expect(result).toEqual(mockRoles); // Validate returned result
    expect(mockQueryService.findAll).toHaveBeenCalledTimes(1); // Should be called once
    expect(mockQueryService.findAll).toHaveBeenCalledWith(mockRepository, expect.any(Object)); // Should be called with repo and isActive
  });

  //Test for creating a new role
  it("should create a new role", async () => {
    const dto = { name: "Admin" } as CreateRolesDto;
    const created = { name: "Admin" };

    mockQueryService.createData.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(result).toEqual(created);
    expect(mockQueryService.createData).toHaveBeenCalledTimes(1); // Should be called once
    expect(mockQueryService.createData).toHaveBeenCalledWith(dto, mockRepository); // Should be called with dto and repo
  });

  //Test for fetching a single role by ID
  it("should find a role by ID", async () => {
    const mockRole = { name: "Admin" };

    mockQueryService.findOne.mockResolvedValue(mockRole);

    const result = await service.findOne(1);

    expect(result).toEqual(mockRole);
    expect(mockQueryService.findOne).toHaveBeenCalledTimes(1); // Should be called once
    expect(mockQueryService.findOne).toHaveBeenCalledWith(mockRepository, {
      id: 1,
      ...isActive,
    }); // Should be called with repo and isActive
  });

  //Test for updating a role
  it("should update a role", async () => {
    const dto = { name: "Updated Role" } as CreateRolesDto;
    const updated = { name: "Updated Role" };

    mockQueryService.update.mockResolvedValue(updated);

    const result = await service.update(1, dto);

    expect(result).toEqual(updated);
    expect(mockQueryService.update).toHaveBeenCalledTimes(1); // Should be called once
    expect(mockQueryService.update).toHaveBeenCalledWith(dto, mockRepository, {
      id: 1,
      ...isActive,
    }); // Should be called with dto, repo, and isActive
  });

  //Test for removing (soft-deleting) a role
  it("should remove a role", async () => {
    mockQueryService.remove.mockResolvedValue(undefined);

    const result = await service.remove(1);

    expect(result).toBeUndefined();
    expect(mockQueryService.remove).toHaveBeenCalledTimes(1); // Should be called once
    expect(mockQueryService.remove).toHaveBeenCalledWith(mockRepository, {
      id: 1,
      ...isActive,
    }); // Should be called with repo and isActive
  });
});
