import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { UserModule } from '../user/user.module';
import { Recipe, RecipeSchema } from './entities/recipe.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Recipe.name, schema: RecipeSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [PaymentController],
  exports: [PaymentService],
  providers: [PaymentService],
})
export class PaymentModule {}
