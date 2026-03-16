import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EspDto } from './dto/esp.dto';
import { MeatData, MeatDataDocument } from './schemas/meat-data.schema';
import { BeefDefinition, BeefDefinitionDocument } from './schemas/beef-definition.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EspService {
  constructor(
    @InjectModel(MeatData.name)
    private meatModel: Model<MeatDataDocument>,

    @InjectModel(BeefDefinition.name)
    private meatPriceModel: Model<BeefDefinitionDocument>,
  ) { }

  // ✅ รับ 1 รายการแล้วบันทึก
  async saveSingleData(data: EspDto): Promise<MeatData> {
    console.log('📝 [saveSingleData] รับข้อมูล 1 ชิ้น:', data);

    try {
      const created = new this.meatModel(data);
      const saved = await created.save();
      console.log('✅ [saveSingleData] บันทึกสำเร็จ:', saved);

      return saved;
    } catch (error) {
      console.error('❌ [saveSingleData] ล้มเหลว:', error);
      throw error;
    }
  }

  // ✅ รับหลายรายการเป็นกลุ่ม (1 ออเดอร์)
  async saveData(data: EspDto[]): Promise<MeatData[]> {
    console.log('📝 [saveData] รับข้อมูล array:', data);

    const orderId = data[0]?.orderId || uuid();
    const enriched = data.map(item => ({
      ...item,
      orderId,
    }));

    try {
      const created = await this.meatModel.insertMany(enriched);
      console.log(`✅ [saveData] บันทึก ${created.length} รายการ`);
      return created;
    } catch (error) {
      console.error('❌ [saveData] insertMany ล้มเหลว:', error);
      throw error;
    }
  }

  // ✅ ดึงข้อมูลทั้งหมด
  async getAllData(): Promise<MeatData[]> {
    return this.meatModel.find().sort({ date: -1, time: -1 }).exec();
  }

  // ✅ ดึงข้อมูลตามวันที่ พร้อมชื่อ meatName
  async findByDate(date: string): Promise<any[]> {
    const meatDatas = await this.meatModel.find({ date }).sort({ time: 1 }).exec();
    const meatPrices = await this.meatPriceModel.find().exec();

    const meatTypeMap: { [key: number]: string } = {};
    meatPrices.forEach(mp => {
      meatTypeMap[mp.key] = mp.label;
    });

    return meatDatas.map(data => ({
      ...data.toObject(),
      meatName: meatTypeMap[data.meatType] || '',
    }));
  }

  async deleteOrderById(orderId: string) {
    return await this.meatModel.deleteMany({ orderId });
  }
}
