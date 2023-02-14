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
      console.log(`Client Connected: ${client.id}`);
      console.log(`--------------------------\n`);
      console.log(`initial connected clients`);
      console.table(this.connectedUsers);
      console.log(`connected clients length`);
      console.log(this.connectedUsers.length);
      console.log(`--------------------------\n`);
      this.connectedUsers = [...this.connectedUsers, { rank: this.connectedUsers.length, client: client.id }];
      console.log(`updated connected clients`);
      console.table(this.connectedUsers);
      console.log(`updated connected clients length`);
      console.log(this.connectedUsers.length);
      console.log(`--------------------------\n`);
    } catch (error) {
      throw new WsException(error?.message)
    }
  }
  async handleDisconnect(client: Socket) {}
    
}
