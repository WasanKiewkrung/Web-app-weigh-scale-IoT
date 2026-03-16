import { Controller, Post, Get, Body, Query, Delete } from '@nestjs/common';
import { EspDto } from './dto/esp.dto';
import { EspService } from './esp.service';
import { MeatData } from './schemas/meat-data.schema';

@Controller('esp')
export class EspController {
  constructor(private readonly espService: EspService) { }

  // ✅ POST: รับ array ข้อมูลจาก ESP32 และบันทึก + ใส่ orderId ให้
  @Post('data')
  async receiveData(
    @Body() body: EspDto[], // 👈 รับเป็น array
  ): Promise<{ message: string; data: MeatData[] }> {
    console.log('📦 [Controller] ได้รับข้อมูลจาก ESP32:', body);

    try {
      const createdData = await this.espService.saveData(body);
      return { message: '✅ Data saved', data: createdData };
    } catch (error) {
      console.error('❌ [Controller] บันทึกข้อมูลล้มเหลว:', error.message);
      throw error;
    }
  }

  // ✅ GET: ดึงข้อมูลทั้งหมด
  @Get('data')
  async getAllData(): Promise<MeatData[]> {
    return this.espService.getAllData();
  }

  // ✅ GET: ดึงข้อมูลตามวันที่ พร้อม meatName
  @Get('data-by-date')
  async getDataByDate(@Query('date') date: string): Promise<any[]> {
    return this.espService.findByDate(date);
  }

  // ✅ DELETE: ลบ meat log ทั้งกลุ่มตาม orderId
  @Delete('delete-order')
  async deleteOrder(@Query('orderId') orderId: string) {
    return this.espService.deleteOrderById(orderId);
  }
}
