import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { AuthUser } from './authUser.decorator';
import { UsernameDto } from './dto/username.dto';
import { AuthCredentialDto } from './dto/credential.dto';
import { AuthRefreshDto } from './dto/refresh.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { Token } from './types/token.type';

@Controller('auth')
@UsePipes(ValidationPipe)
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    @ApiOperation({ summary: 'sign up' })
    async signUp(@Body() dto: AuthCredentialDto): Promise<void> {
        await this.authService.signUp(dto);
    }

    @Post('/signin')
    @ApiOperation({ summary: 'sign in' })
    async signIn(@Body() dto: AuthCredentialDto): Promise<Token> {
        return await this.authService.signIn(dto);
    }

    @Post('/signout')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'sign out' })
    @ApiBearerAuth('JWT')
    async signOut(@Body() dto: UsernameDto): Promise<void> {
        await this.authService.signOut(dto);
    }

    @Post('/refresh')
    @UseGuards(AuthGuard('jwt-refresh'))
    @ApiOperation({ summary: 'generate tokens by refresh token' })
    @ApiBearerAuth('JWT')
    async refresh(@Body() dto: AuthRefreshDto): Promise<Token> {
        return await this.authService.refresh(dto);
    }

    @Post('/password')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'reset password' })
    @ApiBearerAuth('JWT')
    async updatePassword(@AuthUser() user: User, @Body() dto: UpdatePasswordDto): Promise<void> {
        await this.authService.updatePassword(user, dto);
    }
}
