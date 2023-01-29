import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthUser } from './authUser.decorator';
import { AuthCredentialDto } from './dto/credential.dto';
import { AuthRefreshDto } from './dto/refresh.dto';
import { AuthSignupDto } from './dto/signup.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UsernameDto } from './dto/username.dto';
import { Token } from './types/token.type';

@Controller('auth')
@UsePipes(ValidationPipe)
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('/signup')
    @ApiOperation({ summary: 'sign up' })
    async signUp(@Body() dto: AuthSignupDto): Promise<void> {
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

    @Get('/forgot-username')
    @ApiOperation({ summary: 'forgot username' })
    @ApiQuery({ name: 'email', type: String })
    async forgetUsername(@Query('email') email: string): Promise<string | null> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) return null;
        return user.username;
    }

    @Post('/forgot-password')
    @ApiOperation({ summary: 'forgot password' })
    async forgotPassword(@Body() dto: UsernameDto): Promise<void> {
        await this.authService.sendNewPassword(dto.username);
    }

    // update password
    @Patch('/password')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'reset password' })
    @ApiBearerAuth('JWT')
    async updatePassword(@AuthUser() user: User, @Body() dto: UpdatePasswordDto): Promise<void> {
        await this.authService.updatePassword(user.username, dto);
    }
}
