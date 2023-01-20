// import { Controller } from "@nestjs/common";
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    @ApiOperation({ summary: 'sign up' })
    async signUp(@Body() dto: AuthDto): Promise<void> {
        return await this.authService.createUser(dto);
    }

    @Post('/signin')
    @ApiOperation({ summary: 'sign in' })
    async signIn(@Body() dto: AuthDto): Promise<{ accessToken: string }> {
        const accessToken = await this.authService.signIn(dto);
        return { accessToken };
    }
}
