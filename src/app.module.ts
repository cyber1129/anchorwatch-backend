import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { EnvHelper } from './common/helpers/env.helper';
import { AuthModule } from './auth/auth.module';
import { validate } from './common/validators/env.validator';
import { TransactionModule } from './transaction/transaction.module';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    MailerModule,
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      validate: validate,
    }),
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
