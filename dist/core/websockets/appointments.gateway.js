"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppointmentsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:4200')
    .split(',')
    .map((o) => o.trim());
let AppointmentsGateway = AppointmentsGateway_1 = class AppointmentsGateway {
    server;
    logger = new common_1.Logger(AppointmentsGateway_1.name);
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleSubscribeToSlot(data, client) {
        const room = `slots/${data.slotId}`;
        client.join(room);
        client.emit('subscribed', { room });
    }
    emitCapacityUpdate(payload) {
        this.server.to(`slots/${payload.slotId}`).emit('slotCapacityUpdated', payload);
    }
};
exports.AppointmentsGateway = AppointmentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppointmentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeToSlot'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AppointmentsGateway.prototype, "handleSubscribeToSlot", null);
exports.AppointmentsGateway = AppointmentsGateway = AppointmentsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: (origin, callback) => {
                if (!origin)
                    return callback(null, true);
                const isAllowed = allowedOrigins.includes('*') ||
                    allowedOrigins.includes(origin) ||
                    origin.startsWith('http://localhost:') ||
                    origin.startsWith('http://127.0.0.1:');
                callback(null, isAllowed);
            },
            credentials: true,
        },
    })
], AppointmentsGateway);
//# sourceMappingURL=appointments.gateway.js.map