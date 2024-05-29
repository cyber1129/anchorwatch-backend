import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MailerService } from 'src/mailer/mailer.service';

import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async sendEmail(body: SendEmailDto): Promise<string> {
    const token = await this.createAccessToken(body.email);
    const html = `<a href='http://localhost:3000?token=${token}'>Verify your email</a>`;

    const res = await this.mailerService.sendEmail(body.email, html);

    if (res) return 'Success';
    else throw new BadRequestException('Failed to send an email');
  }

  async createAccessToken(email: string): Promise<string> {
    return this.jwtService.signAsync({ email });
  }
}
