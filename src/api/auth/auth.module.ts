import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (cs: ConfigService) => ({
                secretOrPrivateKey: cs.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: cs.get('JWT_EXPIRY')
                }
            })
        }),
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    controllers: [AuthController],
    providers: [JwtStrategy, AuthService]
})
export class AuthModule {}
