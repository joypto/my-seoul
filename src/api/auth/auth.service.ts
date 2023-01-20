import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './auth.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    private async isValidPassword(userPassword: string, dbPassword: string): Promise<boolean> {
        return await bcrypt.compare(userPassword, dbPassword);
    }

    private async getUser(username: string): Promise<User> {
        return await this.userRepository.findOneBy({ username });
    }

    async createUser(dto: AuthDto): Promise<void> {
        if (await this.getUser(dto.username)) throw new ConflictException('Duplicate username');

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(dto.password, salt);
        await this.userRepository.insert({ ...dto, password: hashedPassword });
    }

    async signIn(dto: AuthDto): Promise<string> {
        const user = await this.getUser(dto.username);

        if (user && (await this.isValidPassword(dto.password, user.password))) {
            const payload = { username: dto.username };
            const accessToken = this.jwtService.sign(payload);
            return accessToken;
        }

        throw new UnauthorizedException('Login failed');
    }
}
