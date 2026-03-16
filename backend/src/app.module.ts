import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ✅ เพิ่ม import
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EspModule } from './esp/esp.module';
import { AuthModule } from './auth/auth.module';
import { BeefDefinitionModule } from './beef-definition/beef-definition.module';
import { ReceiptModule } from './receipt/receipt.module';
import { SummaryExcelModule } from './summary/summary-excel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ โหลด .env ทั่วแอป
    MongooseModule.forRootAsync({ // ✅ ใช้ Async สำหรับโหลดจาก Config
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    EspModule,
    AuthModule,
    BeefDefinitionModule,
    ReceiptModule,
    SummaryExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
