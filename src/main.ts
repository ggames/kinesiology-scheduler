import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ─── CORS ───────────────────────────────────────────────────────────────────
  // FRONTEND_URL soporta una lista separada por comas de orígenes permitidos.
  // Permite automáticamente cualquier origen localhost en desarrollo y requests sin cabecera Origin.
  const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:8081';
  const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Permitir solicitudes sin cabecera Origin (apps nativas Android/iOS, Postman, curl)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('http://10.0.2.2:') ||
        origin.startsWith('http://192.168.') ||
        origin.startsWith('http://172.') ||
        origin.startsWith('http://10.');

      if (isAllowed) {
        return callback(null, true);
      }

      // Retornar false para denegar el origen limpiamente sin generar stack traces
      callback(null, false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // ─── Global Validation Pipe ──────────────────────────────────────────────────
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ─── Swagger ─────────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Kinesiology Scheduler API')
    .setDescription('API for kinesiology clinic scheduling system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // ─── Listen ──────────────────────────────────────────────────────────────────
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Application running on: http://localhost:${port}`);
  logger.log(`Swagger docs at:        http://localhost:${port}/docs`);
  logger.log(`Allowed CORS origins:   ${allowedOrigins.join(', ')} (and any localhost port)`);
}
bootstrap();
