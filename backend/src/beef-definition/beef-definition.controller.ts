// ✅ เพิ่ม path prefix '/api/' เพื่อให้ตรงกับ frontend
import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BeefDefinition, BeefDefinitionDocument } from '../esp/schemas/beef-definition.schema';
import { MatchPriceDto } from './dto/match-price.dto';

@Controller('beef-definition')
export class BeefDefinitionController {
  constructor(
    @InjectModel(BeefDefinition.name)
    private readonly beefModel: Model<BeefDefinitionDocument>,
  ) { }

  // ✅ GET: ดึงราคาทั้งหมด สำหรับแสดงใน frontend
  @Get('prices')
  async getAllPrices() {
    return this.beefModel.find({}, {
      key: 1,
      beefCode: 1,
      pricePerKg: 1,
      label: 1,
      unit: 1,
      _id: 0,
    });
  }

  // ✅ POST: รับ meatType และ weight → จับคู่ข้อมูล beef และคำนวณ total
  @Post('match-prices')
  async matchPrices(@Body() payload: MatchPriceDto[]) {
    const beefData = await this.beefModel.find({}).lean();

    const matched = payload.map((item) => {
      const matched = beefData.find(def => def.key === Number(item.meatType));
      return {
        meatType: item.meatType,
        weight: item.weight,
        label: matched?.label ?? '-',
        beefCode: matched?.beefCode ?? 'UNKNOWN',
        unit: matched?.unit ?? 'kg',
        pricePerKg: matched?.pricePerKg ?? 0,
        total: matched ? matched.pricePerKg * item.weight : 0,
      };
    });

    return matched;
  }
}
