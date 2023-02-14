import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
interface ConnectedUser {
  rank: number;
  client: string;
}

// const socketPort = Number(process.env.BRIDGE_GUEST_SOCKET_PORT)
const socketPort = 8000
@WebSocketGateway(socketPort, { namespace: 'clients' })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  connectedUsers: ConnectedUser[] = [];

  constructor() {}

  afterInit(server: Server) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      console.warn(`Client connected`)
      console.warn(client?.id)
      } catch (error) {
        throw error;
      }
  }
  async handleDisconnect(client: Socket) {}
}
