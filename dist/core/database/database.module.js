"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const logger = new common_1.Logger('DatabaseModule');
                    logger.log('Conectando a base de datos PostgreSQL...');
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST') || '127.0.0.1',
                        port: parseInt(configService.get('DB_PORT') || '5432', 10),
                        username: configService.get('DB_USER') || 'ggames',
                        password: configService.get('DB_PASS') || 'GGames9573',
                        database: configService.get('DB_DATABASE') || 'kinesiology',
                        autoLoadEntities: true,
                        synchronize: true,
                        retryAttempts: 3,
                        retryDelay: 1000,
                    };
                },
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map