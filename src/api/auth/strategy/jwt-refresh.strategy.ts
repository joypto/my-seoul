import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { Payload } from '../types/payload.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        // JWT configuration
        super({
            // Ways to extract jwt, other options are explained below links
            // https://github.com/mikenicholson/passport-jwt#extracting-the-jwt-from-the-request
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Access token secret
            secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
            // Check token expiration
            ignoreExpiration: false
        });
    }

    // Validate and return data after JWT decrypted
    async validate(payload: Payload): Promise<User> {
        const { username } = payload;
        const user: User = await this.userRepository.findOneBy({ username });
        if (!user || !user.refreshToken) throw new UnauthorizedException();
        return user;
    }
}
