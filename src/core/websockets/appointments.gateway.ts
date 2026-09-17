import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * WebSocket gateway for real-time appointment / slot capacity updates.
 */
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:4200')
  .split(',')
  .map((o) => o.trim());

@WebSocketGateway({
  cors: {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:');
      callback(null, isAllowed);
    },
    credentials: true,
  },
})
export class AppointmentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppointmentsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Permite que un cliente se suscriba a las actualizaciones de un slot específico.
   * Payload esperado: { slotId: string }
   */
  @SubscribeMessage('subscribeToSlot')
  handleSubscribeToSlot(
    @MessageBody() data: { slotId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `slots/${data.slotId}`;
    client.join(room);
    client.emit('subscribed', { room });
  }

  /**
   * Emite una actualización de capacidad a todos los clientes en la room del slot.
   */
  emitCapacityUpdate(payload: {
    slotId: string;
    remainingCapacity: number;
    status: string;
  }) {
    this.server.to(`slots/${payload.slotId}`).emit('slotCapacityUpdated', payload);
  }
}
