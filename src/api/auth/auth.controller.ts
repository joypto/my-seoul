import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/basic.dto';
import { AuthCredentialDto } from './dto/credential.dto';
import { AuthRefreshDto } from './dto/refresh.dto';
import { Token } from './types/token.type';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    @ApiOperation({ summary: 'sign up' })
    async signUp(@Body() dto: AuthCredentialDto): Promise<void> {
        return await this.authService.signUp(dto);
    }

    @Post('/signin')
    @ApiOperation({ summary: 'sign in' })
    async signIn(@Body() dto: AuthCredentialDto): Promise<Token> {
        return await this.authService.signIn(dto);
    }

    @Post('signout')
    @ApiOperation({ summary: 'sign out' })
    async signOut(@Body() dto: AuthDto): Promise<void> {
        await this.authService.signOut(dto);
    }

    @Post('/refresh')
    @ApiOperation({ summary: 'get tokens by refresh token' })
    async refresh(@Body() dto: AuthRefreshDto): Promise<Token> {
        const tokens = await this.authService.refresh(dto);
        return tokens;
    }
}
