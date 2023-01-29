import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SMTPModule } from 'src/smtp/smtp.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User]),
        SMTPModule,
        JwtModule.register({}),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        UserModule
    ],
    controllers: [AuthController],
    providers: [JwtStrategy, JwtRefreshStrategy, AuthService]
})
export class AuthModule {}
