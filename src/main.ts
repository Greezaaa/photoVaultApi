import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  // OpenSSL
  const httpsOptions = {
    key: readFileSync(process.env.SSL_KEY ?? '', 'utf8'),
    cert: readFileSync(process.env.SSL_CERTIFICATE ?? '', 'utf8'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
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
  // Set global API prefix from environment variable
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Start the app on a specific host and port
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 3000;
  await app.listen(port, host);
  console.log(`App running on: https://${host}:${port}/${apiPrefix}`);
}
bootstrap().catch((err) => {
  console.error('Error starting the app:', err);
  process.exit(1);
});
