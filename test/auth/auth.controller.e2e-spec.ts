import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../src/app.module"; // Adjust the import to point to your main AppModule
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { RedisService } from "../../common";
import { TypeOrmModule } from "@nestjs/typeorm";

export const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  close: jest.fn(),
};

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  // Set up the NestJS application before the tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRootAsync({
        useFactory: () => ({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'javed',
          password: 'postgres',
          database: 'mydb', // should exist
          synchronize: false,
          entities: [],
        }),
      }),],
      providers: [{
        provide: RedisService,
        useValue: mockRedisService
      }] // The root module of your application
    }).compile();

    app = moduleFixture.createNestApplication(); // Create the app instance
    await app.init(); // Initialize the app
  });

  it("should successfully login and set cookies", async () => {
    const loginDto = {
      email: "mahadiatabassum161710@gmail.com",
      password: "aK@123456",
    };

    // Use Supertest to simulate an HTTP request to your API
    const response = await request(app.getHttpServer()) // Get the underlying HTTP server instance
      .post("/auth/login")
      .send(loginDto)
      .query({ authMethod: "general" }) // Replace with your actual auth method
      .expect(200); // Expecting status code 200 for successful login

    // Check that response contains loginPayload data
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token"); // If your response contains a token or similar

    // Check that cookies are set in the response
    const cookies = response.headers["set-cookie"];

    // Ensure cookies is an array
    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];

    // Check if cookies contain access_token and refresh_token
    expect(
      cookiesArray.some((cookie) => cookie.startsWith("access_token"))
    ).toBe(true);
    expect(
      cookiesArray.some((cookie) => cookie.startsWith("refresh_token"))
    ).toBe(true);
  });

  // Clean up after tests
  afterAll(async () => {
    if (app) await app?.close(); // properly shut down the NestJS app
    if (mockRedisService.close) await mockRedisService.close(); // clean up Redis
  });
});

const timer = setInterval(() => {
  // your logic
}, 1000);
timer.unref(); // prevents Node from keeping the process alive just for this
