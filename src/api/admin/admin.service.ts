import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    ServiceUnavailableException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ONE_DAY, ONE_WEEK } from 'src/constants/consts';
import { ADMIN_CODE, ADMIN_USERNAMES } from 'src/redis/redis.key';
import { RedisService } from 'src/redis/redis.service';
import { SMTPService } from 'src/smtp/smtp.service';
import { RandomUtil } from 'src/util/random.util';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Role } from './role/role.enum';

@Injectable()
export class AdminService {
    constructor(
        private readonly configService: ConfigService,
        private readonly stmpService: SMTPService,
        private readonly userService: UserService,
        private readonly redisService: RedisService
    ) {}

    private async isValidUsername(username: string): Promise<boolean> {
        const exists = await this.redisService.lpos(ADMIN_USERNAMES, username);
        return exists >= 0;
    }

    private async isValidCode(username: string, code: string): Promise<boolean> {
        const validCode = await this.redisService.get(ADMIN_CODE(username));
        return code === validCode;
    }

    async giveRole(username: string): Promise<void> {
        const user = await this.userService.findOneByUsername(username);
        if (!user) throw new NotFoundException('User not found');
        await this.redisService.rpush(ADMIN_USERNAMES, [username]);

        const code = await new RandomUtil().generateRandomString();
        await this.stmpService.sendAdminCode(user.email, code);
        await this.redisService.setex(ADMIN_CODE(username), 3 * ONE_DAY, code);
    }

    async takeRole(user: User, code: string): Promise<User> {
        const count = await this.userService.findRolesCount(Role.ADMIN);
        if (count !== 0) {
            // first admin exist
            if (!(await this.isValidUsername(user.username))) {
                throw new ForbiddenException('Invalid username');
            }
            if (!(await this.isValidCode(user.username, code))) {
                throw new ForbiddenException('Invalid admin code');
            }
            await this.redisService
                .multi()
                .lrem(ADMIN_USERNAMES, 0, user.username)
                .unlink(ADMIN_CODE(user.username))
                .exec();
        } else {
            // first admin does not exist
            const validCode = await this.configService.get('ADMIN_CODE');
            if (code !== validCode) {
                throw new ForbiddenException('Invalid admin code');
            }
        }
        user.roles = [Role.ADMIN];
        return await this.userService.updateOne(user);
    }
}
