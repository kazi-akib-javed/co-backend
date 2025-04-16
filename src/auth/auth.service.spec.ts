import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PermissionService, RedisService, TokenService, UsersEntity } from "../../common";
import { ConfigService } from "@nestjs/config";
import { AuthHelperService } from "./helper/auth-helper.service";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("AuthService", () => {
  let service: AuthService;
  let mockRedisService = {};
  let mockPermissionService = {};
  let mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === "REFRESH_PUBLIC_KEY") {
        return "mocked_refresh_public_key";
      }
      return null;
    }),
  };
  let mockTokenService = {};
  let mockAuthHelperService = {};
  let mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: PermissionService,
          useValue: mockPermissionService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: AuthHelperService,
          useValue: mockAuthHelperService,
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: mockRepository,
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
