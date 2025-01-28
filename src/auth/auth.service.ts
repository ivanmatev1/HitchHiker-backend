import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from './verifyGoogleIdToken';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService, private readonly googleAuthService: GoogleAuthService) { }

    async validateUser({ email, provider, password }: AuthPayloadDto) {
        const user = await this.userService.findByEmail(email);
        if (user == null) {
            throw new Error("User not found");
        }

        if (provider === user.provider) {
            if (provider === 'local') {
                if (password === user.password) {
                    const { password, ...result } = user;
                    return this.jwtService.signAsync(result);
                }else{
                    console.log("Password incorrect", password, user.password,"sas")
                    throw new Error("Password incorrect");
                }
            }

            const googleId = password;
            if (provider === 'google') {
                try {
                    await this.googleAuthService.verifyIdToken(googleId);
                } catch (error) {
                    throw new Error(error.message);
                }
                const { password, ...result } = user;
                return this.jwtService.signAsync(result);
            }
        }
        
        throw new Error("Provider not matching");
        
    }
}
