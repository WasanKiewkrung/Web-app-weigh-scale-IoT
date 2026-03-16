import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SummaryExcelController } from './summary-excel.controller';
import { SummaryExcelService } from './summary-excel.service';
import { Receipt, ReceiptSchema } from '../receipt/schemas/receipt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Receipt.name, schema: ReceiptSchema },
    ]),
  ],
  controllers: [SummaryExcelController],
  providers: [SummaryExcelService],
})
export class SummaryExcelModule { }
