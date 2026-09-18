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
                    const host = configService.get('DB_HOST') || 'localhost';
                    const user = configService.get('DB_USER') || '';
                    const pass = configService.get('DB_PASS') || '';
                    const port = configService.get('DB_PORT') || '5432';
                    const dbName = configService.get('DB_DATABASE') || 'neondb';
                    let optionsStr = configService.get('DB_OPTIONS') || '';
                    logger.log(`Conectando a base de datos PostgreSQL (${host})...`);
                    const dbSsl = configService.get('DB_SSL');
                    const isSslDisabled = dbSsl === 'false';
                    const sslOptions = isSslDisabled ? false : { rejectUnauthorized: false };
                    let url = configService.get('DB_URL');
                    if (!url && host !== '127.0.0.1' && host !== 'localhost') {
                        if (!optionsStr) {
                            optionsStr = 'sslmode=require';
                        }
                        const cleanOptions = optionsStr.startsWith('?') ? optionsStr.slice(1) : optionsStr;
                        const encodedUser = encodeURIComponent(user);
                        const encodedPass = encodeURIComponent(pass);
                        url = `postgres://${encodedUser}:${encodedPass}@${host}:${port}/${dbName}?${cleanOptions}`;
                    }
                    const options = {
                        type: 'postgres',
                        ssl: sslOptions,
                        extra: isSslDisabled
                            ? {}
                            : {
                                ssl: {
                                    rejectUnauthorized: false,
                                },
                            },
                        autoLoadEntities: true,
                        synchronize: true,
                        retryAttempts: 5,
                        retryDelay: 3000,
                    };
                    if (url) {
                        options.url = url;
                    }
                    else {
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
], DatabaseModule);
//# sourceMappingURL=database.module.js.map