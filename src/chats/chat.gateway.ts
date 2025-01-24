import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from './auth-socket.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthMiddleware } from 'src/auth/jwt-auth.middleware';
import { ChatsService } from './chats.service';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly chatsService: ChatsService,
    ) { }

    async afterInit() {
        this.server.use((socket: Socket, next) => {
            const authMiddleware = new JwtAuthMiddleware(this.jwtService, this.configService);
            authMiddleware.use(socket, next);
        });
    }

    async handleConnection(client: AuthenticatedSocket) {
        console.log('Authenticated user: ', client.user);
        const userChats = await this.chatsService.getPersonalChats(client.user.id);

        userChats.forEach((chat) => {
            client.join(chat.id.toString());
            console.log(`User ${client.user.email} joined chat ${chat.id}`);
        });
    }

    handleDisconnect(client: AuthenticatedSocket) {
        console.log('Client disconnected: ', client.id);
    }

    @SubscribeMessage('send_message')
    async handleMessage(client: AuthenticatedSocket, data: { chatId: string, text: string }) {
        const { chatId, text } = data;

        if (!client.rooms.has(chatId)) {
            return client.emit('error', 'You are not a member of this group');
        }

        try {
            const message = await this.chatsService.sendMessage({ chatId: +chatId, text: text, timestamp: new Date() }, client);
            this.server.to(chatId).emit('receive_message', {
                message: message
            });

            console.log(`Message sent to group ${chatId}: ${text} || by ${client.user.email}`);
        } catch (error) {
            client.emit('error', error.message);
        }
    }
}
