import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TrendingDuration } from 'src/constants/consts';

export class TrendingDto {
    @IsOptional()
    @IsEnum(TrendingDuration)
    @ApiPropertyOptional({ enum: TrendingDuration, default: TrendingDuration.MONTH })
    duration?: TrendingDuration = TrendingDuration.MONTH;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ description: 'limit', type: Number })
    limit?: number = 100;
}
