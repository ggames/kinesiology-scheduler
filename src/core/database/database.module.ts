import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Módulo de Base de Datos exclusivo para PostgreSQL (Neon / Supabase / AWS / Local).
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');

        let host = configService.get<string>('DB_HOST') || 'localhost';
        if (host.includes('-pooler.')) {
          host = host.replace('-pooler.', '.');
        }

        const user = configService.get<string>('DB_USER') || '';
        const pass = configService.get<string>('DB_PASS') || '';
        const port = configService.get<string>('DB_PORT') || '5432';
        const dbName = configService.get<string>('DB_DATABASE') || 'neondb';
        let optionsStr = configService.get<string>('DB_OPTIONS') || '';

        logger.log(`Conectando a base de datos PostgreSQL (${host})...`);

        const dbSsl = configService.get<string>('DB_SSL');
        const isSslDisabled = dbSsl === 'false';
        const sslOptions = isSslDisabled ? false : { rejectUnauthorized: false };

        let url = configService.get<string>('DB_URL');
        if (url && url.includes('-pooler.')) {
          url = url.replace('-pooler.', '.');
        }

        if (!url && host !== '127.0.0.1' && host !== 'localhost') {
          if (!optionsStr) {
            optionsStr = 'sslmode=require';
          }
          const cleanOptions = optionsStr.startsWith('?') ? optionsStr.slice(1) : optionsStr;
          const encodedUser = encodeURIComponent(user);
          const encodedPass = encodeURIComponent(pass);
          url = `postgres://${encodedUser}:${encodedPass}@${host}:${port}/${dbName}?${cleanOptions}`;
        }

        const options: any = {
          type: 'postgres',
          ssl: sslOptions,
          extra: {
            connectionTimeoutMillis: 15000, // 15s timeout para dar tiempo a que Neon despierte del suspension mode y resolver DNS
            idleTimeoutMillis: 30000,
            keepAlive: true,
            ...(isSslDisabled
              ? {}
              : {
                  ssl: {
                    rejectUnauthorized: false,
                  },
                }),
          },
          autoLoadEntities: true,
          synchronize: true,
          retryAttempts: 10,
          retryDelay: 3000,
        };

        if (url) {
          options.url = url;
        } else {
          options.host = host;
          options.port = parseInt(port, 10);
          options.username = user;
          options.password = pass;
          options.database = dbName;
        }

        return options;
      },
    }),
  ],
})
export class DatabaseModule {}
