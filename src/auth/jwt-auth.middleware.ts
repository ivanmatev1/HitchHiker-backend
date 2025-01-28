import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AuthenticatedSocket } from 'src/chats/auth-socket.interface';

@Injectable()
export class JwtAuthMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async use(socket: Socket, next: (err?: Error) => void): Promise<void> {
        try {
            const token = socket.handshake.auth.token ? socket.handshake.auth.token : socket.handshake.headers.token; // auth for app, header for postman
            console.log('token: ', token);
            if (!token) {
                throw new UnauthorizedException('Token not provided');
            }
            console.log('token: ', token);
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow('JWT_SECRET'),
            });
            (socket as AuthenticatedSocket).user = payload;
            next();
        } catch (err) {
            console.log('err: ', err);
            next(new UnauthorizedException('Invalid or expired token'));
        }
    }
}
