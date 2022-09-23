import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CutModule } from './modules/cut/cut.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://root:root@cluster0.vahx0yk.mongodb.net/${process.env.DB_NAME}`,
    ),
    MulterModule.register({
      dest: '../uploads',
    }),
    CutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
