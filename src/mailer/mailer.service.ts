import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired, MailService } from '@sendgrid/mail';

@Injectable()
export class MailerService {
  private logger: Logger;
  private mailService: MailService;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger();
    this.mailService = new MailService();

    this.mailService.setApiKey(
      this.configService.get<string>('SENDGRID_API_KEY'),
    );
  }

  async sendEmail(recipient: string, html: string): Promise<boolean> {
    const mailContent: MailDataRequired = {
      to: recipient,
      from: 'luckycyber1129@gmail.com',
      html: html,
      subject: 'Verify your email',
    };

    return this.send(mailContent);
  }

  async send(mail: MailDataRequired): Promise<boolean> {
    try {
      await this.mailService.send(mail);
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
      return true;
    } catch (error) {
      //You can do more with the error
      this.logger.error('Error while sending email', error);
      return false;
    }
  }
}
