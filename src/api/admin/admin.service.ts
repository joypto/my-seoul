import { ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ADMIN_USERNAMES } from 'src/redis/redis.key';
import { RedisService } from 'src/redis/redis.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Role } from './role/role.enum';

@Injectable()
export class AdminService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly redisService: RedisService
    ) {}

    private async isValidUsername(username: string): Promise<boolean> {
        const count = await this.userService.findRolesCount(Role.ADMIN);
        if (count === 0) return true;

        const exists = await this.redisService.lpos(ADMIN_USERNAMES, username);
        return exists >= 0;
    }

    private async isValidCode(code: string): Promise<boolean> {
        // TODO: code will be send to user directly by email
        const validCode = await this.configService.get('ADMIN_CODE');
        return code === validCode;
    }

    async giveRole(username: string): Promise<void> {
        await this.redisService.rpush(ADMIN_USERNAMES, [username]);
    }

    async takeRole(user: User, code: string): Promise<User> {
        if (!(await this.isValidUsername(user.username)))
            throw new ForbiddenException('Invalid username');
        if (!(await this.isValidCode(code))) throw new ForbiddenException('Invalid admin code');

        const deleted = await this.redisService.lrem(ADMIN_USERNAMES, 0, user.username);
        if (deleted === 0) throw new ServiceUnavailableException('Data not deleted');

        user.roles = [Role.ADMIN];
        return await this.userService.updateOne(user);
    }
}
