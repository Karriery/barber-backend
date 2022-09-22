import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './entities/user.entity';
import { Admin, AdminSchema } from './entities/admin.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: AdminSchema },
      { name: Admin.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserController, AdminController],
  exports: [UserService, AdminService],
  providers: [UserService, AdminService],
})
export class UserModule {}
