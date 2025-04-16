import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthHelperService } from "./helper/auth-helper.service";
import { ConfigService } from "@nestjs/config";
import { PermissionService, RedisService, TokenService, UsersEntity } from "../../common";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("AuthController", () => {
  let controller: AuthController;
  let mockAuthHelperService = {};
  let mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === "REFRESH_PUBLIC_KEY") {
        return "mocked_refresh_public_key";
      }
      return null;
    }),
  };
  let mockTokenService = {};
  let mockRedisService = {};
  let mockPermissionService = {};
  let mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthHelperService,
          useValue: mockAuthHelperService,
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
          provide: getRepositoryToken(UsersEntity),
          useValue: mockRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: PermissionService,
          useValue: mockPermissionService,
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
