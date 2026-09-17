import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class AppointmentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribeToSlot(data: {
        slotId: string;
    }, client: Socket): void;
    emitCapacityUpdate(payload: {
        slotId: string;
        remainingCapacity: number;
        status: string;
    }): void;
}
