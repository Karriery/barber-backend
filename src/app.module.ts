import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CutModule } from './modules/cut/cut.module';
import { PaymentModule } from './modules/payment/payment.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://nahtah:BassemNahtah2022@cluster0.htiakxa.mongodb.net/${process.env.DB_NAME}`,
    ),
    MulterModule.register({
      dest: '../upload',
    }),
    CutModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
