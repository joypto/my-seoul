import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Builder } from 'builder-pattern';
import { ONE_DAY, ONE_HOUR } from 'src/constants/consts';
import { EMAIL_AUTH_CODE, EMAIL_AUTH_STATUS } from 'src/redis/redis.key';
import { RedisService } from 'src/redis/redis.service';
import { SMTPService } from 'src/smtp/smtp.service';
import { RandomUtil } from 'src/util/random.util';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CredentialDto } from './dto/credential.dto';
import { EmailDto } from './dto/email.dto';
import { EmailAuthDto } from './dto/emailAuth.dto';
import { RefreshDto } from './dto/refresh.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UsernameDto } from './dto/username.dto';
import { Payload } from './types/payload.type';
import { Token } from './types/token.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly smtpService: SMTPService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly redisService: RedisService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    private async isValidHash(requestedData: string, ownedData: string): Promise<boolean> {
        return await bcrypt.compare(requestedData, ownedData);
    }

    private async isEmailAuthenticated(email: string): Promise<boolean> {
        const isEmailAuthed = await this.redisService.get(EMAIL_AUTH_STATUS(email));
        return isEmailAuthed === 'auth';
    }

    private async hash<T>(data: T): Promise<string> {
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

    async sendEmailAuthCode(dto: EmailDto): Promise<void> {
        const user = await this.userService.findOneByEmail(dto.email);
        if (user) throw new ConflictException('Email already exist');

        const authCode = await new RandomUtil().generateRandomString();
        await this.redisService.setex(EMAIL_AUTH_CODE(dto.email), 3 * ONE_DAY, authCode);
        await this.smtpService.sendEmailAuthenticateCode(dto.email, authCode);
    }

    async matchEmailAuthCode(dto: EmailAuthDto): Promise<boolean> {
        const authCode = await this.redisService.get(EMAIL_AUTH_CODE(dto.email));
        if (authCode && dto.authCode === authCode) {
            await this.redisService
                .multi()
                .setex(EMAIL_AUTH_STATUS(dto.email), ONE_HOUR, 'auth')
                .unlink(EMAIL_AUTH_CODE(dto.email))
                .exec();
            return true;
        }
        return false;
    }

    async signUp(dto: SignupDto): Promise<void> {
        if (!(await this.isEmailAuthenticated(dto.email))) {
            throw new BadRequestException('Email not authenticated');
        }

        const hashedPassword = await this.hash<string>(dto.password);
        await this.userService.create(
            Builder(User).username(dto.username).email(dto.email).password(hashedPassword).build()
        );

        await this.redisService.unlink(EMAIL_AUTH_STATUS(dto.email));
    }

    async signIn(dto: CredentialDto): Promise<Token> {
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

    async refresh(dto: RefreshDto): Promise<Token> {
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

        const newPassword = await new RandomUtil().generateRandomString();
        await this.smtpService.sendNewPassword(user.email, newPassword);

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
