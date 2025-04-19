import { Repository, DataSource } from "typeorm";
import { ProgramsService } from "./programs.service";
import { ProgramsEntity } from "./entities/programs.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { QueryService, RequestService, ConversionService } from "../../common";
import { TypeOrmTestModule } from "../test-utils/database/typeorm-test.module";
import { CreateProgramDto } from "./dto/create-program.dto";
import { RolesTestData } from "../test-utils/modules/roles/test-data";

describe("ProgramsService (Integration)", () => {
  let service: ProgramsService = {} as ProgramsService;
  let programRepository: Repository<ProgramsEntity>;
  let dataSource: DataSource;
  const mockQueryService = {
    createData: jest.fn((dto, repo) => repo.save(dto)),
    findAll: jest.fn((repo) => repo.find()),
    findOne: jest.fn((repo, condition) => repo.findOneBy(condition)),
    update: jest.fn(async (dto, repo, condition) => {
      await repo.update(condition, dto);
      return repo.findOneBy(condition);
    }),
    pagination: jest.fn(async (repo, page, limit) => {
      const [result, total] = await repo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      return { result, total };
    }),
    remove: jest.fn(async (repo, condition) => {
      const entity = await repo.findOneBy(condition);
      await repo.delete(condition);
      return entity;
    }),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, TypeOrmModule.forFeature([ProgramsEntity])],
      providers: [
        ProgramsService,
        {
          provide: QueryService,
          useValue: mockQueryService,
        },
        RequestService,
        ConversionService,
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
    programRepository = module.get<Repository<ProgramsEntity>>(
      getRepositoryToken(ProgramsEntity)
    );
    dataSource = module.get<DataSource>(DataSource); // Get the DataSource instance
  });
  afterEach(async () => {
    await programRepository.delete({}); // Clear the database after each test
  });
  afterAll(async () => {
    await dataSource.destroy(); // Close the database connection
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  it("should create a program", async () => {
    const createProgramDto = new RolesTestData().programOneDto;

    const result = await service.create(createProgramDto);

    expect(result).toEqual(expect.objectContaining(createProgramDto));
  });
  it("should find all programs", async () => {
    const program1 = await service.create({
      ...new RolesTestData().programOneDto,
    } as CreateProgramDto);

    const program2 = await service.create({
      ...new RolesTestData().programTwoDto,
    } as CreateProgramDto);

    const result = await service.findAll();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining(program1));
    expect(result[1]).toEqual(expect.objectContaining(program2));
  });
  it("should find one program by id", async () => {
    const program = await service.create({
      ...new RolesTestData().programOneDto,
    } as CreateProgramDto);

    const found = await service.findOne(program["id"]);

    expect(found).toEqual(expect.objectContaining(program));
  });
  it("should update a program", async () => {
    const program = await service.create({
      ...new RolesTestData().programOneDto,
    } as CreateProgramDto);

    const updated = await service.update(program["id"], {
      university: "Updated University D",
    } as CreateProgramDto);

    expect(updated).toEqual(
      expect.objectContaining({ university: "Updated University D" })
    );
  });
  it("should remove a program", async () => {
    const program = await service.create({
      ...new RolesTestData().programOneDto,
    } as CreateProgramDto);

    const removed = await service.remove(program["id"]);

    expect(removed).toEqual(expect.objectContaining(program));
  });
  it("should paginate programs", async () => {
    const program1 = await service.create({
      ...new RolesTestData().programOneDto,
    } as CreateProgramDto);

    const program2 = await service.create({
      ...new RolesTestData().programTwoDto,
    } as CreateProgramDto);

    const result = await service.pagination(1, 2);
    
    expect(result['result']).toHaveLength(2);
    expect(result['result'][0]).toEqual(expect.objectContaining(program1));
    expect(result['result'][1]).toEqual(expect.objectContaining(program2));
  });
});
