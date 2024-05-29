import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    example: 'john@example.com',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'User email address',
  })
  @IsEmail()
  email: string;
}
