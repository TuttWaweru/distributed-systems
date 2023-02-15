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
  
  async handleDisconnect(client: Socket) {
    try {
      console.log(`Client Disconnected: ${client.id}`);
      console.log(`--------------------------\n`);
      console.log(`initial connected clients`);
      console.table(this.connectedUsers);
      console.log(`connected clients length`);
      console.log(this.connectedUsers.length);
      console.log(`--------------------------\n`);
      let disconnectedClient = this.connectedUsers.find(val => val?.client === client.id)
      if (disconnectedClient !== undefined) {
        this.connectedUsers = this.connectedUsers.reduce(
          (res, { rank, client }, index, arr ) => {
            if ((disconnectedClient?.rank as number) === 0 && index !== 0) {
              console.log(`(disconnectedClient?.rank as number) === 0 && index !== 0\n`)
              return [
                ...res,
                {
                  client,
                  rank: rank - 1
                }
              ]
            }else if (rank < (disconnectedClient?.rank as number) && (disconnectedClient?.rank as number) !== 0) {
              console.log(`rank < (disconnectedClient?.rank as number) && (disconnectedClient?.rank as number) !== 0\n`)
              return [
                ...res,
                {
                  rank,
                  client
                }
              ]
            } else if (rank > (disconnectedClient?.rank as number) && (disconnectedClient?.rank as number) !== 0) {
              console.log(`rank > (disconnectedClient?.rank as number) && (disconnectedClient?.rank as number) !== 0\n`)
              return [
                ...res,
                {
                  client,
                  rank: rank - 1
                }
              ]
            } else {
              console.log(`default\n`)
              return res
            }
          },
          ([] as ConnectedUser[])
        );
      }
      console.log(`updated connected clients`);
      console.table(this.connectedUsers);
      console.log(`updated connected clients length`);
      console.log(this.connectedUsers.length);
      console.log(`--------------------------\n`);
    } catch (error) {
      throw new WsException(error?.message)
    }
  }
  
  @SubscribeMessage('send_command')
  async onCommandSent(client, data: any): Promise<any> {
    try {
      console.log(`Client sent command: ${client.id}`);
      console.log(`--------------------------\n`);
      console.log(`connected clients`);
      console.table(this.connectedUsers);
      console.log(`--------------------------\n`);
      let initiator = this.connectedUsers.find(val => val?.client === client.id)
      let executors = this.connectedUsers.reduce(
        (result, value) => {
          if ((initiator?.rank as number) < value?.rank) {
            return [
              ...result,
              value
            ]
          }
          return result
        },
        ([] as ConnectedUser[])
      )
      console.log(`executors`);
      console.table(executors);
      console.log(`--------------------------\n`);
      if (executors.length > 0) {
        this.server.to(executors.map(({ client }) => client)).emit('execute_command', data);;
      }
      return true
    } catch (error) {
      throw new WsException(error?.message)
    }
  }
    
}
