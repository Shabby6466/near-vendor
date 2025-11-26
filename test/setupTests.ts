import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/modules/main/app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';


beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.use(cookieParser('secret@123'));
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  await app.close();
});

