import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.client = new OAuth2Client(this.configService.getOrThrow('WEB_CLIENT_ID'));
  }

  async verifyIdToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.configService.getOrThrow('WEB_CLIENT_ID'),
      });
      console.log('ticket: ', ticket);
    } catch (error) {
        console.log(error);
      throw new Error('Invalid Google ID Token');
    }
  }
}
