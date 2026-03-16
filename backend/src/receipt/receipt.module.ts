import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Receipt, ReceiptSchema } from './schemas/receipt.schema';

import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Receipt.name, schema: ReceiptSchema }]),
  ],
  controllers: [
    ReceiptController
  ],
  providers: [
    ReceiptService
  ]
})
export class ReceiptModule { }
