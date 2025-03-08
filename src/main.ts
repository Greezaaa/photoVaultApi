import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // const httpsOptions = {
  //   key: readFileSync(resolve(__dirname, 'path/to/private.key')),
  //   cert: readFileSync(resolve(__dirname, 'path/to/certificate.crt')),
  // };
  const app = await NestFactory.create(
    AppModule,
    // { httpsOptions }
  );
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tsconfig-paths/register');
  }
  app.enableCors({
    origin: 'http://localhost:4200',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  console.log(process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error starting the app:', err);
  process.exit(1);
});
