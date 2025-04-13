import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CsrfTokenInterceptor, GlobalExceptionsFilter, PayloadInterceptor, ResponseInterceptor, SystemException } from '../common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT");
  const swaggerUser = configService.get<string>("SWAGGER_USER");
  const swaggerPassword = configService.get<string>("SWAGGER_PASSWORD");
  const env = configService.get<string>("NODE_ENV");
  const logger = new Logger();
  
  app.enableCors({origin: configService.get<string>("FRONTEND_URL"), credentials: true});
  app.setGlobalPrefix('api');
  // Apply the global exception filter
  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new PayloadInterceptor());
  app.useGlobalInterceptors(new CsrfTokenInterceptor());
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      exceptionFactory: (errors) => {
        // Customize error messages
        return new SystemException(
          { errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          }))}
        );
      },
    }),
  );

  //Swagger configuration for development environment only
  if(env === 'dev' || env === 'dock'){
    const basicAuth = require('express-basic-auth');
    app.use(
      ['/apidoc'],
      basicAuth({
        challenge: true,
        users: {
          [swaggerUser]: swaggerPassword,
        },
      }),
    );
    const config = new DocumentBuilder()
      .setTitle('Co-Backend')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('apidoc', app, documentFactory);
  }
  
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
