"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:8081';
    const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const isAllowed = allowedOrigins.includes('*') ||
                allowedOrigins.includes(origin) ||
                origin.startsWith('http://localhost:') ||
                origin.startsWith('http://127.0.0.1:');
            if (isAllowed) {
                return callback(null, true);
            }
            callback(null, false);
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Requested-With'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Kinesiology Scheduler API')
        .setDescription('API for kinesiology clinic scheduling system')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    logger.log(`Application running on: http://localhost:${port}`);
    logger.log(`Swagger docs at:        http://localhost:${port}/docs`);
    logger.log(`Allowed CORS origins:   ${allowedOrigins.join(', ')} (and any localhost port)`);
}
bootstrap();
//# sourceMappingURL=main.js.map