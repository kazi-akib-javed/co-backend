import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { ConversionService, QueryService, RequestService } from "../../common";
import { RolesService } from "./roles.service";
import { RoleEntity } from "./entities/roles.entity";
import { CreateRolesDto } from "./dto/create-roles.dto";
import { DataSource, Repository } from "typeorm";
import { randomUUID } from 'crypto';
import { TypeOrmTestModule } from "../test-utils/typeorm-test.module";

describe("RolesService (Integration)", () => {
  let service: RolesService = {} as RolesService;
  let roleRepository: Repository<RoleEntity>;
  let dataSource: DataSource
  const mockQueryService = {
    createData: jest.fn((dto, repo) => repo.save(dto)),
    findAll: jest.fn((repo) => repo.find()),
    findOne: jest.fn((repo, condition) => repo.findOneBy(condition)),
    update: jest.fn(async (dto, repo, condition) => {
      await repo.update(condition, dto);
      return repo.findOneBy(condition);
    }),
    remove: jest.fn(async (repo, condition) => {
      const entity = await repo.findOneBy(condition);
      await repo.delete(condition);
      return entity;
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmTestModule,
        TypeOrmModule.forFeature([RoleEntity]),
      ],
      providers: [
        RolesService,
        {
          provide: QueryService,
          useValue: mockQueryService,
        },
        RequestService,
        ConversionService,
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    roleRepository = module.get<Repository<RoleEntity>>(
      getRepositoryToken(RoleEntity)
    );
    dataSource = module.get<DataSource>(DataSource); // Get the DataSource instance
  });

  afterEach(async () => {
    await roleRepository.delete({}); // Clear the database after each test
  });

  afterAll(async () => {
    await dataSource.destroy(); // Close the database connection
  });

  it("should create and return a role", async () => {
    const randomName = `${randomUUID()}`;
    const dto = { name: randomName } as CreateRolesDto;
    const result = await service.create(dto);

    expect(result).toBeDefined();
    expect(result.name).toBe(randomName);
  });

  it("should find all roles", async () => {
    await service.create({ name: "Admin" } as CreateRolesDto);
    await service.create({ name: "User" } as CreateRolesDto);

    const result = await service.findAll();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Admin");
    expect(result[1].name).toBe("User");
  });

  it("should find one role by id", async () => {
    const role = await service.create({ name: "Viewer" } as CreateRolesDto);
    const found = await service.findOne(role["id"]);

    expect(found).toBeDefined();
    expect(found.name).toBe("Viewer");
  });

  it("should update a role", async () => {
    const role = await service.create({ name: "Guest" } as CreateRolesDto);
    const updated = await service.update(role["id"], {
      name: "Super Guest",
    } as CreateRolesDto);

    expect(updated.name).toBe("Super Guest");
  });

  it("should remove a role", async () => {
    const role = await service.create({ name: "Temp" } as CreateRolesDto);
    await service.remove(role["id"]);

    const result = await service.findAll();
    expect(result).toHaveLength(0);
  });
});
