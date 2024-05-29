import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseHelper } from 'src/common/helpers/api-response.helper';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-email')
  @ApiOperation({ description: `Send user email`, tags: ['Auth'] })
  @ApiResponse(ApiResponseHelper.success(String, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  async login(@Body() body: SendEmailDto): Promise<string> {
    return this.authService.sendEmail(body);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: `Send user email`, tags: ['Auth'] })
  @ApiResponse(ApiResponseHelper.success(String, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  async getProfile(@Request() req): Promise<string> {
    return req.user.email;
  }
}
