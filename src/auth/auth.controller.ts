import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() authPayload: AuthPayloadDto) {
        try{
            const user = await this.authService.validateUser(authPayload);
            return user;
        }catch(error){
            throw new UnauthorizedException(error.message);
        }
    }

    @Get('test')
    @UseGuards(AuthGuard)
    async test(@Request() req) {
        return req.user;
    }
}
