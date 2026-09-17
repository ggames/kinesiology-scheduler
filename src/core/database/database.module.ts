import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Módulo de Base de Datos enfocado exclusivamente en PostgreSQL.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        logger.log('Conectando a base de datos PostgreSQL...');

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || '127.0.0.1',
          port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
          username: configService.get<string>('DB_USER') || 'ggames',
          password: configService.get<string>('DB_PASS') || 'GGames9573',
          database: configService.get<string>('DB_DATABASE') || 'kinesiology',
          autoLoadEntities: true,
          synchronize: true,
          retryAttempts: 3,
          retryDelay: 1000,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
