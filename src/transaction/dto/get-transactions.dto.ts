import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { PageOptionsDto } from 'src/common/pagination/pagination.types';
import { TOrderBy } from '../transaction.service';

export class GetTransactionsDto extends PageOptionsDto {
  @ApiProperty({
    example: '1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'Bitcoin address',
  })
  @IsString()
  @MinLength(1)
  address: string;

  @ApiProperty({
    example: TOrderBy.DATE,
    required: false,
    maximum: 255,
    description: 'Order by',
  })
  @IsEnum(TOrderBy)
  @IsString()
  orderBy: TOrderBy = TOrderBy.DATE;
}
