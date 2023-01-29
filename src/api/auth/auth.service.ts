import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UsernameDto } from './dto/username.dto';
import { AuthCredentialDto } from './dto/credential.dto';
import { AuthRefreshDto } from './dto/refresh.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { Payload } from './types/payload.type';
import { Token } from './types/token.type';
import { AuthSignupDto } from './dto/signup.dto';
import { Builder } from 'builder-pattern';
import passwordGenerator from 'password-generator';
import { SMTPService } from 'src/smtp/smtp.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly smtpService: SMTPService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    private async isValidHash(requestedData: string, ownedData: string): Promise<boolean> {
        return await bcrypt.compare(requestedData, ownedData);
    }

    private async hash<T>(data: T): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(data, salt);
    }

    private async generatePassword(): Promise<string> {
        return passwordGenerator(8, false);
    }

    private async generateTokens(payload: Payload): Promise<Token> {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get('ACCESS_TOKEN_LIFE_TIME')
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('REFRESH_TOKEN_LIFE_TIME')
        });
        return { accessToken, refreshToken };
    }

    private async updateRefreshToken(username: string, refreshToken: string | null): Promise<void> {
        if (refreshToken) {
            refreshToken = await this.hash<string>(refreshToken);
        }
        await this.userRepository
            .createQueryBuilder()
            .update(User)
            .where('username = :username', { username })
            .set({ refreshToken })
            .execute();
    }

    async signUp(dto: AuthSignupDto): Promise<void> {
        const hashedPassword = await this.hash<string>(dto.password);
        await this.userService.create(
            Builder(User).username(dto.username).email(dto.email).password(hashedPassword).build()
        );
    }

    async signIn(dto: AuthCredentialDto): Promise<Token> {
        const user = await this.userService.findOneByUsername(dto.username);

        if (user && (await this.isValidHash(dto.password, user.password))) {
            const payload = { username: dto.username };
            const tokens = await this.generateTokens(payload);
            await this.updateRefreshToken(dto.username, tokens.refreshToken);
            return tokens;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async signOut(dto: UsernameDto): Promise<void> {
        const user = await this.userService.findOneByUsername(dto.username);
        if (user) await this.updateRefreshToken(dto.username, null);
    }

    async refresh(dto: AuthRefreshDto): Promise<Token> {
        const user = await this.userService.findOneByUsername(dto.username);
        if (
            user &&
            user.refreshToken &&
            (await this.isValidHash(dto.refreshToken, user.refreshToken))
        ) {
            const payload = { username: dto.username };
            const tokens = await this.generateTokens(payload);
            await this.updateRefreshToken(dto.username, tokens.refreshToken);
            return tokens;
        }
        throw new UnauthorizedException('Invalid refresh token');
    }

    async sendNewPassword(username: string): Promise<void> {
        const user = await this.userService.findOneByUsername(username);
        if (!user) throw new BadRequestException('Invalid User');

        const newPassword = await this.generatePassword();
        await this.smtpService.sendEmail(user.email, newPassword);

        const hashedPassword = await this.hash<string>(newPassword);
        user.password = hashedPassword;
        user.refreshToken = null;
        await this.userService.updateOne(user);
    }

    async updatePassword(username: string, dto: UpdatePasswordDto): Promise<void> {
        const user = await this.userService.findOneByUsername(username);
        if (!user) {
            throw new BadRequestException('Invalid User');
        }
        if (!(await this.isValidHash(dto.oldPassword, user.password))) {
            throw new BadRequestException('Invalid password');
        }

        const hashedPassword = await this.hash<string>(dto.newPassword);
        user.password = hashedPassword;
        user.refreshToken = null; // logout occurs with update password
        await this.userService.updateOne(user);
    }
}
