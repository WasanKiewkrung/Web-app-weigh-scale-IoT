import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MeatData, MeatDataSchema } from '../esp/schemas/meat-data.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MeatData.name, schema: MeatDataSchema }])],
  controllers: [OrderController],
})
export class OrderModule { }
