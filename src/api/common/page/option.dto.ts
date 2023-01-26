import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from 'src/constants/consts';

export class PageOption {
    @IsEnum(Order)
    @IsOptional()
    @ApiPropertyOptional({ enum: Order, default: Order.ASC })
    readonly order?: Order = Order.ASC;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Min(1)
    @ApiPropertyOptional({ default: 1 })
    readonly page?: number = 1;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Min(1)
    @Max(50)
    @ApiPropertyOptional({ default: 10 })
    readonly take?: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}
