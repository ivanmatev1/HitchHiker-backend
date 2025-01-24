import { Socket as IOSocket } from 'socket.io';

export interface AuthenticatedSocket extends IOSocket {
  user?: any;e
}