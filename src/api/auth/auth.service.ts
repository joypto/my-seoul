import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/basic.dto';
import { AuthCredentialDto } from './dto/credential.dto';
import { AuthRefreshDto } from './dto/refresh.dto';
import { Payload } from './types/payload.type';
import { Token } from './types/token.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    private async isValidHash(requestedData: string, ownedData: string): Promise<boolean> {
        return await bcrypt.compare(requestedData, ownedData);
    }

    private async hash<T>(data: T): Promise<T> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(data, salt);
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

    private async updateRefreshToken(username: string, refreshToken: string): Promise<void> {
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

    async signUp(dto: AuthCredentialDto): Promise<void> {
        const hashedPassword = await this.hash<string>(dto.password);
        await this.userService.create(new User(dto.username, hashedPassword));
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

    async signOut(dto: AuthDto): Promise<void> {
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
}
